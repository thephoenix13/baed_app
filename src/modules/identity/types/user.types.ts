/**
 * Identity Module — Types
 *
 * Core type definitions for user accounts, sessions, and devices.
 */

// ═══════════════════════════════════════════════════════════════
// USER TYPES
// ═══════════════════════════════════════════════════════════════

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED' | 'DELETED';

export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER';

export type Orientation = 'STRAIGHT' | 'GAY' | 'LESBIAN' | 'BISEXUAL' | 'ASEXUAL' | 'PANSEXUAL' | 'OTHER';

export interface User {
  id: string;
  phoneNumber: string;
  countryCode: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  gender: Gender | null;
  orientation: Orientation | null;
  status: AccountStatus;
  isVerified: boolean;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  city: string | null;
  state: string | null;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  lastLoginAt: Date | null;
}

export interface UserPublic {
  id: string;
  firstName: string | null;
  gender: Gender | null;
  city: string | null;
  isVerified: boolean;
}

// ═══════════════════════════════════════════════════════════════
// SESSION TYPES
// ═══════════════════════════════════════════════════════════════

export interface UserSession {
  id: string;
  userId: string;
  refreshToken: string;
  deviceId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface JWTPayload {
  userId: string;
  sessionId: string;
  deviceId?: string;
  iat: number;
  exp: number;
}

// ═══════════════════════════════════════════════════════════════
// DEVICE TYPES
// ═══════════════════════════════════════════════════════════════

export type DeviceType = 'iOS' | 'Android' | 'Web';

export interface UserDevice {
  id: string;
  userId: string;
  deviceToken: string | null;
  deviceType: DeviceType;
  deviceModel: string | null;
  osVersion: string | null;
  appVersion: string | null;
  pushEnabled: boolean;
  lastActiveAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceInfo {
  deviceType: DeviceType;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  deviceToken?: string;
}

// ═══════════════════════════════════════════════════════════════
// AUTH TYPES
// ═══════════════════════════════════════════════════════════════

export interface AuthenticatedRequest {
  userId: string;
  sessionId: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginResponse {
  user: User;
  tokens: SessionTokens;
  requiresOnboarding: boolean;
}

export interface RefreshResponse {
  tokens: SessionTokens;
}
