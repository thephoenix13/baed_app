/**
 * Identity Module — Auth Schemas (Zod)
 *
 * Request/response validation schemas for authentication endpoints.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// PHONE NUMBER VALIDATION
// ═══════════════════════════════════════════════════════════════

export const PhoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  countryCode: z
    .string()
    .regex(/^\+\d{1,3}$/, 'Country code must be in format +91')
    .default('+91'),
});

export type PhoneNumberInput = z.infer<typeof PhoneNumberSchema>;

// ═══════════════════════════════════════════════════════════════
// OTP VERIFICATION
// ═══════════════════════════════════════════════════════════════

export const VerifyOtpSchema = z.object({
  phoneNumber: z.string().regex(/^\d{10}$/),
  countryCode: z.string().regex(/^\+\d{1,3}$/).default('+91'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
  deviceId: z.string().optional(),
});

export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;

// ═══════════════════════════════════════════════════════════════
// TOKEN REFRESH
// ═══════════════════════════════════════════════════════════════

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

// ═══════════════════════════════════════════════════════════════
// DEVICE REGISTRATION
// ═══════════════════════════════════════════════════════════════

export const RegisterDeviceSchema = z.object({
  deviceType: z.enum(['iOS', 'Android', 'Web']),
  deviceModel: z.string().optional(),
  osVersion: z.string().optional(),
  appVersion: z.string().optional(),
  deviceToken: z.string().optional(), // Push notification token
});

export type RegisterDeviceInput = z.infer<typeof RegisterDeviceSchema>;

// ═══════════════════════════════════════════════════════════════
// RESPONSE SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const SendOtpResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  expiresInSeconds: z.number(),
  maskedPhone: z.string(),
});

export const VerifyOtpResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  userId: z.string(),
  isNewUser: z.boolean(),
  requiresOnboarding: z.boolean(),
});

export const RefreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const LogoutResponseSchema = z.object({
  success: z.boolean(),
});
