/**
 * Identity Module — API Route Handlers
 *
 * HTTP handlers for authentication endpoints.
 * In Next.js, these would be Route Handlers in /app/api/v1/auth/
 * For Vite, these are service functions that can be called from React components.
 */

import * as authService from '../services/auth.service';
import type { DeviceInfo } from '../types/user.types';
import {
  PhoneNumberSchema,
  VerifyOtpSchema,
  RefreshTokenSchema,
  RegisterDeviceSchema,
} from '../schemas/auth.schema';
import * as events from '../events/identity.events';

// ═══════════════════════════════════════════════════════════════
// SEND OTP
// ═══════════════════════════════════════════════════════════════

export interface SendOtpRequest {
  phoneNumber: string;
  countryCode?: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  expiresInSeconds: number;
  maskedPhone: string;
}

export async function handleSendOtp(request: SendOtpRequest): Promise<SendOtpResponse> {
  // Validate input
  const validated = PhoneNumberSchema.parse({
    phoneNumber: request.phoneNumber,
    countryCode: request.countryCode || '+91',
  });

  // Send OTP
  const result = await authService.sendOtp(validated.phoneNumber, validated.countryCode);

  return {
    success: result.success,
    message: result.success ? 'OTP sent successfully' : 'Failed to send OTP',
    expiresInSeconds: result.expiresInSeconds,
    maskedPhone: result.maskedPhone,
  };
}

// ═══════════════════════════════════════════════════════════════
// VERIFY OTP
// ═══════════════════════════════════════════════════════════════

export interface VerifyOtpRequest {
  phoneNumber: string;
  countryCode?: string;
  otp: string;
  deviceInfo?: DeviceInfo;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  isNewUser: boolean;
  requiresOnboarding: boolean;
}

export async function handleVerifyOtp(
  request: VerifyOtpRequest,
  ipAddress?: string,
  userAgent?: string
): Promise<VerifyOtpResponse> {
  // Validate input
  const validated = VerifyOtpSchema.parse({
    phoneNumber: request.phoneNumber,
    countryCode: request.countryCode || '+91',
    otp: request.otp,
  });

  // Verify OTP and login
  const result = await authService.verifyOtpAndLogin(
    validated.phoneNumber,
    validated.countryCode,
    validated.otp,
    request.deviceInfo,
    ipAddress,
    userAgent
  );

  // Emit login event
  events.emitUserLoggedIn(
    result.user.id,
    result.tokens.accessToken, // Using access token as session ID for simplicity
    request.deviceInfo?.deviceToken || null,
    ipAddress || null,
    userAgent || null,
    result.requiresOnboarding
  );

  return {
    accessToken: result.tokens.accessToken,
    refreshToken: result.tokens.refreshToken,
    userId: result.user.id,
    isNewUser: result.requiresOnboarding,
    requiresOnboarding: result.requiresOnboarding,
  };
}

// ═══════════════════════════════════════════════════════════════
// REFRESH TOKEN
// ═══════════════════════════════════════════════════════════════

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export async function handleRefreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  // Validate input
  const validated = RefreshTokenSchema.parse(request);

  // Refresh tokens
  const result = await authService.refreshTokens(validated.refreshToken);

  return {
    accessToken: result.tokens.accessToken,
    refreshToken: result.tokens.refreshToken,
  };
}

// ═══════════════════════════════════════════════════════════════
// LOGOUT
// ═══════════════════════════════════════════════════════════════

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
}

export async function handleLogout(request: LogoutRequest): Promise<LogoutResponse> {
  const success = authService.logout(request.refreshToken);

  if (success) {
    // Emit logout event (would need session ID from token)
    // events.emitUserLoggedOut(userId, sessionId);
  }

  return { success };
}

// ═══════════════════════════════════════════════════════════════
// REGISTER DEVICE
// ═══════════════════════════════════════════════════════════════

export interface RegisterDeviceRequest {
  userId: string;
  deviceType: 'iOS' | 'Android' | 'Web';
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  deviceToken?: string;
}

export interface RegisterDeviceResponse {
  deviceId: string;
  deviceType: string;
  pushEnabled: boolean;
}

export async function handleRegisterDevice(request: RegisterDeviceRequest): Promise<RegisterDeviceResponse> {
  // Validate input
  const validated = RegisterDeviceSchema.parse({
    deviceType: request.deviceType,
    deviceModel: request.deviceModel,
    osVersion: request.osVersion,
    appVersion: request.appVersion,
    deviceToken: request.deviceToken,
  });

  // Register device (would need to import deviceService)
  // const device = deviceService.registerDevice(request.userId, validated);

  // Emit device registered event
  // events.emit({
  //   type: 'DeviceRegistered',
  //   payload: {
  //     userId: request.userId,
  //     deviceId: device.id,
  //     deviceType: device.deviceType,
  //     pushEnabled: device.pushEnabled,
  //     timestamp: new Date(),
  //   },
  //   timestamp: new Date(),
  // });

  return {
    deviceId: `device-${crypto.randomUUID().slice(0, 8)}`,
    deviceType: validated.deviceType,
    pushEnabled: !!validated.deviceToken,
  };
}

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ValidationError extends AuthError {
  constructor(message: string, public details?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class RateLimitError extends AuthError {
  constructor(message: string = 'Too many requests') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
    this.name = 'RateLimitError';
  }
}
