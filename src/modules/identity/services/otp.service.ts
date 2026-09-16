/**
 * Identity Module — OTP Service
 *
 * Handles OTP generation, storage, verification, and SMS delivery.
 * In production, this integrates with MSG91 or Twilio.
 */

import type { OtpRecord, OtpSendResult, OtpVerifyResult, OtpStatus } from '../types/otp.types';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 300; // 5 minutes
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_SECONDS = 60; // 1 minute between sends

// ═══════════════════════════════════════════════════════════════
// OTP GENERATION
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a cryptographically secure 6-digit OTP.
 */
export function generateOtp(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const otp = (array[0] % 1000000).toString().padStart(OTP_LENGTH, '0');
  return otp;
}

/**
 * Hash OTP for storage (never store plain text).
 * In production, use bcrypt or argon2.
 */
export async function hashOtp(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp + (import.meta.env.VITE_OTP_SECRET || 'baed-otp-secret'));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify OTP against stored hash.
 */
export async function verifyOtpHash(otp: string, hash: string): Promise<boolean> {
  const computedHash = await hashOtp(otp);
  return computedHash === hash;
}

// ═══════════════════════════════════════════════════════════════
// OTP STORAGE (In-Memory for MVP — Use Redis in Production)
// ═══════════════════════════════════════════════════════════════

const otpStore = new Map<string, OtpRecord>();

/**
 * Store OTP record.
 */
export function storeOtp(record: OtpRecord): void {
  const key = `${record.countryCode}${record.phoneNumber}`;
  otpStore.set(key, record);
}

/**
 * Retrieve OTP record.
 */
export function getOtp(phoneNumber: string, countryCode: string): OtpRecord | null {
  const key = `${countryCode}${phoneNumber}`;
  return otpStore.get(key) || null;
}

/**
 * Delete OTP record.
 */
export function deleteOtp(phoneNumber: string, countryCode: string): void {
  const key = `${countryCode}${phoneNumber}`;
  otpStore.delete(key);
}

/**
 * Update OTP record.
 */
export function updateOtp(record: OtpRecord): void {
  const key = `${record.countryCode}${record.phoneNumber}`;
  otpStore.set(key, record);
}

// ═══════════════════════════════════════════════════════════════
// SMS DELIVERY (Mock for MVP — Integrate MSG91/Twilio in Production)
// ═══════════════════════════════════════════════════════════════

/**
 * Send OTP via SMS.
 * In production, integrate with MSG91 or Twilio.
 */
export async function sendSms(phoneNumber: string, countryCode: string, otp: string): Promise<boolean> {
  // Mock implementation — log to console in development
  if (import.meta.env.DEV) {
    console.log(`[OTP] Sending OTP ${otp} to ${countryCode}${phoneNumber}`);
    return true;
  }

  // Production implementation would call MSG91/Twilio API
  // const response = await fetch('https://api.msg91.com/api/v5/flow/', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'authkey': import.meta.env.VITE_MSG91_AUTH_KEY,
  //   },
  //   body: JSON.stringify({
  //     mobile: `${countryCode}${phoneNumber}`,
  //     otp: otp,
  //   }),
  // });
  // return response.ok;

  return true; // Mock success
}

// ═══════════════════════════════════════════════════════════════
// OTP SERVICE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Send OTP to phone number.
 */
export async function sendOtp(phoneNumber: string, countryCode: string): Promise<OtpSendResult> {
  // Check rate limiting
  const existing = getOtp(phoneNumber, countryCode);
  if (existing) {
    const now = new Date();
    const timeSinceCreation = (now.getTime() - existing.createdAt.getTime()) / 1000;
    if (timeSinceCreation < RATE_LIMIT_SECONDS) {
      return {
        success: false,
        expiresInSeconds: Math.ceil(OTP_EXPIRY_SECONDS - timeSinceCreation),
        maskedPhone: maskPhoneNumber(phoneNumber),
      };
    }
  }

  // Generate and store OTP
  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000);

  const record: OtpRecord = {
    id: crypto.randomUUID(),
    phoneNumber,
    countryCode,
    otp: hashedOtp,
    status: 'PENDING',
    attempts: 0,
    expiresAt,
    createdAt: new Date(),
    verifiedAt: null,
  };

  storeOtp(record);

  // Send SMS
  const sent = await sendSms(phoneNumber, countryCode, otp);
  if (!sent) {
    deleteOtp(phoneNumber, countryCode);
    throw new Error('Failed to send OTP');
  }

  return {
    success: true,
    expiresInSeconds: OTP_EXPIRY_SECONDS,
    maskedPhone: maskPhoneNumber(phoneNumber),
  };
}

/**
 * Verify OTP.
 */
export async function verifyOtp(
  phoneNumber: string,
  countryCode: string,
  otp: string
): Promise<OtpVerifyResult> {
  const record = getOtp(phoneNumber, countryCode);
  if (!record) {
    return { success: false, isNewUser: false, error: 'OTP not found' };
  }

  // Check expiry
  if (new Date() > record.expiresAt) {
    record.status = 'EXPIRED';
    updateOtp(record);
    return { success: false, isNewUser: false, error: 'OTP expired' };
  }

  // Check max attempts
  if (record.attempts >= MAX_ATTEMPTS) {
    record.status = 'MAX_ATTEMPTS';
    updateOtp(record);
    return { success: false, isNewUser: false, error: 'Maximum attempts exceeded' };
  }

  // Verify OTP
  const isValid = await verifyOtpHash(otp, record.otp);
  if (!isValid) {
    record.attempts += 1;
    updateOtp(record);
    return { success: false, isNewUser: false, error: 'Invalid OTP' };
  }

  // Mark as verified
  record.status = 'VERIFIED';
  record.verifiedAt = new Date();
  updateOtp(record);

  // Check if user exists (mock — in production, query database)
  const userId = await findUserByPhone(phoneNumber, countryCode);
  const isNewUser = !userId;

  return {
    success: true,
    userId: userId || undefined,
    isNewUser,
  };
}

/**
 * Mask phone number for display (e.g., +91 98***43210).
 */
export function maskPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.length < 4) return phoneNumber;
  const visible = phoneNumber.slice(-4);
  const masked = phoneNumber.slice(0, -4).replace(/\d/g, '*');
  return masked + visible;
}

/**
 * Find user by phone number (mock — in production, query database).
 */
async function findUserByPhone(phoneNumber: string, countryCode: string): Promise<string | null> {
  // Mock implementation — in production, query Prisma
  // const user = await prisma.user.findUnique({
  //   where: { phoneNumber, countryCode },
  //   select: { id: true },
  // });
  // return user?.id || null;

  return null; // Mock — always new user
}
