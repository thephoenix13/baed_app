/**
 * Core — Rate Limiter (Redis-backed)
 *
 * Sliding window rate limiter using Redis.
 * Supports per-IP and per-user rate limiting.
 */

import { redis } from '../cache/redis';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests in window
  keyPrefix?: string; // Prefix for Redis keys
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp in ms
  retryAfter?: number; // Seconds until retry
}

/**
 * Check and increment rate limit counter.
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { windowMs, maxRequests, keyPrefix = 'ratelimit' } = config;
  const key = `${keyPrefix}:${identifier}`;
  const windowSeconds = Math.ceil(windowMs / 1000);
  const now = Date.now();

  // Get current count
  const current = await redis.get(key);
  const count = current ? parseInt(current, 10) : 0;

  if (count >= maxRequests) {
    // Rate limit exceeded
    const ttl = await redis.get(`${key}:ttl`);
    const resetAt = ttl ? parseInt(ttl, 10) : now + windowMs;
    const retryAfter = Math.ceil((resetAt - now) / 1000);

    return {
      allowed: false,
      remaining: 0,
      resetAt,
      retryAfter,
    };
  }

  // Increment counter
  const newCount = await redis.incr(key);

  // Set expiry on first request
  if (newCount === 1) {
    await redis.expire(key, windowSeconds);
    await redis.set(`${key}:ttl`, (now + windowMs).toString(), { ex: windowSeconds });
  }

  return {
    allowed: true,
    remaining: maxRequests - newCount,
    resetAt: now + windowMs,
  };
}

// ═══════════════════════════════════════════════════════════════
// PREDEFINED RATE LIMITS
// ═══════════════════════════════════════════════════════════════

export const rateLimits = {
  // Auth endpoints
  otpSend: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3,
    keyPrefix: 'rl:otp:send',
  } as RateLimitConfig,

  otpVerify: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 5,
    keyPrefix: 'rl:otp:verify',
  } as RateLimitConfig,

  // API endpoints (per user)
  apiDefault: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    keyPrefix: 'rl:api',
  } as RateLimitConfig,

  // Discovery (per user)
  discovery: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    keyPrefix: 'rl:discovery',
  } as RateLimitConfig,

  // Likes (per user)
  likes: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
    keyPrefix: 'rl:likes',
  } as RateLimitConfig,

  // Messages (per user)
  messages: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    keyPrefix: 'rl:messages',
  } as RateLimitConfig,

  // Admin (per admin)
  admin: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    keyPrefix: 'rl:admin',
  } as RateLimitConfig,
};
