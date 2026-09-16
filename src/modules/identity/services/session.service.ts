/**
 * Identity Module — Session Service
 *
 * Handles JWT token generation, validation, refresh, and session management.
 * In production, refresh tokens are stored in httpOnly cookies.
 */

import type { SessionTokens, JWTPayload, UserSession } from '../types/user.types';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days

// In production, use environment variables
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'baed-jwt-secret-dev-only';

// ═══════════════════════════════════════════════════════════════
// JWT UTILITIES (Using Web Crypto API — Production: use jose library)
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a JWT access token.
 * In production, use the `jose` library for proper JWT handling.
 */
export async function generateAccessToken(
  userId: string,
  sessionId: string,
  deviceId?: string
): Promise<string> {
  const payload: JWTPayload = {
    userId,
    sessionId,
    deviceId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRY,
  };

  // Mock JWT — in production, use jose library
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`${header}.${body}.${JWT_SECRET}`);

  return `${header}.${body}.${signature}`;
}

/**
 * Generate a refresh token (opaque string).
 */
export function generateRefreshToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify and decode JWT access token.
 */
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1])) as JWTPayload;

    // Check expiry
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// SESSION STORAGE (In-Memory for MVP — Use Redis in Production)
// ═══════════════════════════════════════════════════════════════

const sessionStore = new Map<string, UserSession>();
const revokedTokens = new Set<string>();

/**
 * Create a new session.
 */
export async function createSession(
  userId: string,
  deviceId: string | null,
  ipAddress: string | null,
  userAgent: string | null
): Promise<SessionTokens> {
  const sessionId = crypto.randomUUID();
  const refreshToken = generateRefreshToken();
  const accessToken = await generateAccessToken(userId, sessionId, deviceId || undefined);

  const session: UserSession = {
    id: sessionId,
    userId,
    refreshToken,
    deviceId,
    ipAddress,
    userAgent,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000),
    revokedAt: null,
    createdAt: new Date(),
  };

  sessionStore.set(sessionId, session);

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY,
  };
}

/**
 * Refresh session tokens.
 */
export async function refreshSession(refreshToken: string): Promise<SessionTokens | null> {
  // Find session by refresh token
  const session = Array.from(sessionStore.values()).find(
    s => s.refreshToken === refreshToken && !s.revokedAt
  );

  if (!session) return null;

  // Check expiry
  if (new Date() > session.expiresAt) {
    session.revokedAt = new Date();
    sessionStore.set(session.id, session);
    return null;
  }

  // Generate new tokens
  const newAccessToken = await generateAccessToken(
    session.userId,
    session.id,
    session.deviceId || undefined
  );
  const newRefreshToken = generateRefreshToken();

  // Update session
  session.refreshToken = newRefreshToken;
  sessionStore.set(session.id, session);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY,
  };
}

/**
 * Revoke a session (logout).
 */
export function revokeSession(refreshToken: string): boolean {
  const session = Array.from(sessionStore.values()).find(
    s => s.refreshToken === refreshToken
  );

  if (!session) return false;

  session.revokedAt = new Date();
  sessionStore.set(session.id, session);

  // Add to revoked tokens set for access token blacklist
  revokedTokens.add(refreshToken);

  return true;
}

/**
 * Revoke all sessions for a user.
 */
export function revokeAllUserSessions(userId: string): number {
  let count = 0;
  for (const session of sessionStore.values()) {
    if (session.userId === userId && !session.revokedAt) {
      session.revokedAt = new Date();
      sessionStore.set(session.id, session);
      count++;
    }
  }
  return count;
}

/**
 * Get session by ID.
 */
export function getSession(sessionId: string): UserSession | null {
  return sessionStore.get(sessionId) || null;
}

/**
 * Get all active sessions for a user.
 */
export function getUserSessions(userId: string): UserSession[] {
  return Array.from(sessionStore.values()).filter(
    s => s.userId === userId && !s.revokedAt
  );
}

/**
 * Check if access token is revoked.
 */
export function isTokenRevoked(token: string): boolean {
  return revokedTokens.has(token);
}
