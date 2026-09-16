/**
 * Identity Module — Public API
 *
 * Exports all public types, services, and handlers for the identity module.
 */

// Types
export type {
  User,
  UserPublic,
  UserSession,
  SessionTokens,
  JWTPayload,
  UserDevice,
  DeviceInfo,
  DeviceType,
  AuthenticatedRequest,
  LoginResponse,
  RefreshResponse,
  AccountStatus,
  Gender,
  Orientation,
} from './types/user.types';

export type {
  OtpRecord,
  OtpSendResult,
  OtpVerifyResult,
  OtpStatus,
} from './types/otp.types';

// Schemas
export {
  PhoneNumberSchema,
  VerifyOtpSchema,
  RefreshTokenSchema,
  RegisterDeviceSchema,
  SendOtpResponseSchema,
  VerifyOtpResponseSchema,
  RefreshTokenResponseSchema,
  LogoutResponseSchema,
} from './schemas/auth.schema';

export type {
  PhoneNumberInput,
  VerifyOtpInput,
  RefreshTokenInput,
  RegisterDeviceInput,
} from './schemas/auth.schema';

// Services
export * as authService from './services/auth.service';
export * as otpService from './services/otp.service';
export * as sessionService from './services/session.service';
export * as deviceService from './services/device.service';

// Events
export * as identityEvents from './events/identity.events';
export type { IdentityEvent } from './events/identity.events';

// Route Handlers
export {
  handleSendOtp,
  handleVerifyOtp,
  handleRefreshToken,
  handleLogout,
  handleRegisterDevice,
  AuthError,
  ValidationError,
  UnauthorizedError,
  RateLimitError,
} from './routes/auth-handlers';

export type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  RegisterDeviceRequest,
  RegisterDeviceResponse,
} from './routes/auth-handlers';
