/**
 * Identity Module — Auth Service
 *
 * Orchestrates authentication flow: OTP → User creation → Session → Device registration.
 */

import type { User, LoginResponse, RefreshResponse, DeviceInfo } from '../types/user.types';
import * as otpService from './otp.service';
import * as sessionService from './session.service';
import * as deviceService from './device.service';

// ═══════════════════════════════════════════════════════════════
// USER STORAGE (In-Memory for MVP — Use Database in Production)
// ═══════════════════════════════════════════════════════════════

const userStore = new Map<string, User>();

// ═══════════════════════════════════════════════════════════════
// AUTH SERVICE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Send OTP to phone number.
 */
export async function sendOtp(phoneNumber: string, countryCode: string) {
  return otpService.sendOtp(phoneNumber, countryCode);
}

/**
 * Verify OTP and create/login user.
 */
export async function verifyOtpAndLogin(
  phoneNumber: string,
  countryCode: string,
  otp: string,
  deviceInfo?: DeviceInfo,
  ipAddress?: string,
  userAgent?: string
): Promise<LoginResponse> {
  // Verify OTP
  const otpResult = await otpService.verifyOtp(phoneNumber, countryCode, otp);
  if (!otpResult.success) {
    throw new Error(otpResult.error || 'OTP verification failed');
  }

  let user: User;
  let requiresOnboarding: boolean;

  if (otpResult.isNewUser) {
    // Create new user
    user = await createUser(phoneNumber, countryCode);
    requiresOnboarding = true;
  } else {
    // Get existing user
    const existingUser = await getUser(otpResult.userId!);
    if (!existingUser) {
      throw new Error('User not found');
    }
    user = existingUser;
    requiresOnboarding = !user.firstName; // Simplified check
  }

  // Create session
  const deviceId = deviceInfo?.deviceToken 
    ? `device-${deviceInfo.deviceToken.slice(0, 8)}`
    : undefined;
  
  const tokens = await sessionService.createSession(
    user.id,
    deviceId || null,
    ipAddress || null,
    userAgent || null
  );

  // Register device if provided
  if (deviceInfo) {
    deviceService.registerDevice(user.id, deviceInfo);
  }

  // Update last login
  user.lastLoginAt = new Date();
  updateUser(user);

  return {
    user,
    tokens,
    requiresOnboarding,
  };
}

/**
 * Refresh session tokens.
 */
export async function refreshTokens(refreshToken: string): Promise<RefreshResponse> {
  const tokens = await sessionService.refreshSession(refreshToken);
  if (!tokens) {
    throw new Error('Invalid or expired refresh token');
  }
  return { tokens };
}

/**
 * Logout and revoke session.
 */
export function logout(refreshToken: string): boolean {
  return sessionService.revokeSession(refreshToken);
}

/**
 * Logout all sessions for a user.
 */
export function logoutAll(userId: string): number {
  return sessionService.revokeAllUserSessions(userId);
}

// ═══════════════════════════════════════════════════════════════
// USER MANAGEMENT (Mock — Use Database in Production)
// ═══════════════════════════════════════════════════════════════

/**
 * Create a new user.
 */
async function createUser(phoneNumber: string, countryCode: string): Promise<User> {
  const user: User = {
    id: crypto.randomUUID(),
    phoneNumber,
    countryCode,
    firstName: null,
    lastName: null,
    dateOfBirth: null,
    gender: null,
    orientation: null,
    status: 'ACTIVE',
    isVerified: false,
    location: null,
    city: null,
    state: null,
    country: 'India',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    lastLoginAt: new Date(),
  };

  userStore.set(user.id, user);
  return user;
}

/**
 * Get user by ID.
 */
async function getUser(userId: string): Promise<User | null> {
  return userStore.get(userId) || null;
}

/**
 * Update user.
 */
function updateUser(user: User): void {
  user.updatedAt = new Date();
  userStore.set(user.id, user);
}

/**
 * Get user by phone number.
 */
export async function getUserByPhone(phoneNumber: string, countryCode: string): Promise<User | null> {
  for (const user of userStore.values()) {
    if (user.phoneNumber === phoneNumber && user.countryCode === countryCode) {
      return user;
    }
  }
  return null;
}

/**
 * Update user profile.
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<User, 'firstName' | 'lastName' | 'dateOfBirth' | 'gender' | 'orientation' | 'city' | 'state'>>
): Promise<User | null> {
  const user = userStore.get(userId);
  if (!user) return null;

  Object.assign(user, updates);
  user.updatedAt = new Date();
  userStore.set(userId, user);

  return user;
}

/**
 * Update user location.
 */
export async function updateUserLocation(
  userId: string,
  latitude: number,
  longitude: number,
  city: string | null,
  state: string | null
): Promise<User | null> {
  const user = userStore.get(userId);
  if (!user) return null;

  user.location = { latitude, longitude };
  user.city = city;
  user.state = state;
  user.updatedAt = new Date();
  userStore.set(userId, user);

  return user;
}

/**
 * Mark user as verified.
 */
export async function markUserVerified(userId: string): Promise<User | null> {
  const user = userStore.get(userId);
  if (!user) return null;

  user.isVerified = true;
  user.updatedAt = new Date();
  userStore.set(userId, user);

  return user;
}

/**
 * Soft delete user.
 */
export async function softDeleteUser(userId: string): Promise<boolean> {
  const user = userStore.get(userId);
  if (!user) return false;

  user.status = 'DELETED';
  user.deletedAt = new Date();
  user.updatedAt = new Date();
  userStore.set(userId, user);

  // Revoke all sessions
  sessionService.revokeAllUserSessions(userId);

  // Delete all devices
  deviceService.deleteUserDevices(userId);

  return true;
}
