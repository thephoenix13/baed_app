/**
 * Core — Auth Middleware
 *
 * Client-side auth middleware for protecting routes and API calls.
 * In Next.js, this would run on the server via middleware.ts.
 */

import { verifyAccessToken } from '@/modules/identity/services/session.service';
import type { JWTPayload } from '@/modules/identity/types/user.types';

// ═══════════════════════════════════════════════════════════════
// AUTH CONTEXT
// ═══════════════════════════════════════════════════════════════

export interface AuthContext {
  userId: string;
  sessionId: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
}

// ═══════════════════════════════════════════════════════════════
// AUTH MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

/**
 * Verify authentication token and extract context.
 */
export async function authenticateRequest(
  accessToken: string | null
): Promise<AuthContext | null> {
  if (!accessToken) return null;

  const payload = await verifyAccessToken(accessToken);
  if (!payload) return null;

  return {
    userId: payload.userId,
    sessionId: payload.sessionId,
    deviceId: payload.deviceId,
  };
}

/**
 * Require authentication — throws if not authenticated.
 */
export async function requireAuth(accessToken: string | null): Promise<AuthContext> {
  const context = await authenticateRequest(accessToken);
  if (!context) {
    throw new AuthMiddlewareError('Authentication required', 'UNAUTHORIZED', 401);
  }
  return context;
}

/**
 * Check if user is the owner of a resource.
 */
export function requireOwnership(context: AuthContext, resourceOwnerId: string): void {
  if (context.userId !== resourceOwnerId) {
    throw new AuthMiddlewareError('Forbidden', 'FORBIDDEN', 403);
  }
}

// ═══════════════════════════════════════════════════════════════
// PROTECTED ROUTE GUARD
// ═══════════════════════════════════════════════════════════════

/**
 * Check if user can access a protected route.
 */
export function canAccessRoute(
  isAuthenticated: boolean,
  requiresAuth: boolean,
  requiresVerification: boolean = false,
  isVerified: boolean = false
): { allowed: boolean; redirectTo?: string } {
  if (requiresAuth && !isAuthenticated) {
    return { allowed: false, redirectTo: '/welcome' };
  }

  if (requiresVerification && !isVerified) {
    return { allowed: false, redirectTo: '/verification/why-verify' };
  }

  return { allowed: true };
}

// ═══════════════════════════════════════════════════════════════
// ERROR CLASS
// ═══════════════════════════════════════════════════════════════

export class AuthMiddlewareError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'AuthMiddlewareError';
  }
}
