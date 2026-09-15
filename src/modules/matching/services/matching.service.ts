/**
 * Matching Module — Service
 *
 * Handles likes, passes, and match creation.
 */

import type { Match, Like, MatchResult, MatchProfile } from '../types/matching.types';
import { markProfileAsSeen } from '../../discovery/services/discovery.service';

// In-memory storage (would be database in production)
const likes = new Map<string, Like>();
const matches = new Map<string, Match>();
const passes = new Set<string>(); // `${fromUserId}-${toUserId}`

// Mock user profiles for matches
const MOCK_PROFILES: Record<string, MatchProfile> = {
  'user-001': {
    id: 'user-001',
    displayName: 'Priya',
    age: 26,
    primaryPhoto: '/mock-photo-1.jpg',
    city: 'Mumbai',
    isVerified: true,
  },
  'user-002': {
    id: 'user-002',
    displayName: 'Arjun',
    age: 28,
    primaryPhoto: '/mock-photo-3.jpg',
    city: 'Pune',
    isVerified: true,
  },
  'user-003': {
    id: 'user-003',
    displayName: 'Meera',
    age: 24,
    primaryPhoto: '/mock-photo-4.jpg',
    city: 'Bengaluru',
    isVerified: true,
  },
  'user-004': {
    id: 'user-004',
    displayName: 'Rohan',
    age: 30,
    primaryPhoto: '/mock-photo-7.jpg',
    city: 'Mumbai',
    isVerified: true,
  },
  'user-005': {
    id: 'user-005',
    displayName: 'Ananya',
    age: 27,
    primaryPhoto: '/mock-photo-8.jpg',
    city: 'Pune',
    isVerified: true,
  },
};

/**
 * Like a profile.
 * Returns match result if it creates a mutual match.
 */
export function likeProfile(
  fromUserId: string,
  toUserId: string,
  isSuperLike: boolean = false
): MatchResult {
  // Check if already liked
  const likeKey = `${fromUserId}-${toUserId}`;
  if (likes.has(likeKey)) {
    return { isMatch: false };
  }

  // Check if passed
  if (passes.has(likeKey)) {
    return { isMatch: false };
  }

  // Create like
  const like: Like = {
    id: `like-${Date.now()}`,
    fromUserId,
    toUserId,
    likedAt: new Date(),
    isSuperLike,
  };
  likes.set(likeKey, like);

  // Mark as seen in discovery
  markProfileAsSeen(toUserId);

  // Check for mutual like (match)
  const reverseKey = `${toUserId}-${fromUserId}`;
  const reverseLike = likes.get(reverseKey);

  if (reverseLike) {
    // It's a match!
    const match = createMatch(fromUserId, toUserId);
    return { isMatch: true, match };
  }

  return { isMatch: false };
}

/**
 * Pass on a profile.
 */
export function passProfile(fromUserId: string, toUserId: string): void {
  const passKey = `${fromUserId}-${toUserId}`;
  passes.add(passKey);
  markProfileAsSeen(toUserId);
}

/**
 * Create a match between two users.
 */
function createMatch(user1Id: string, user2Id: string): Match {
  const matchId = `match-${Date.now()}`;

  const match: Match = {
    id: matchId,
    user1Id,
    user2Id,
    matchedAt: new Date(),
    lastMessageAt: null,
    user1Profile: MOCK_PROFILES[user1Id] || {
      id: user1Id,
      displayName: 'You',
      age: 25,
      primaryPhoto: '/mock-photo-you.jpg',
      city: 'Mumbai',
      isVerified: true,
    },
    user2Profile: MOCK_PROFILES[user2Id] || {
      id: user2Id,
      displayName: 'Unknown',
      age: 25,
      primaryPhoto: '/mock-photo-unknown.jpg',
      city: 'Unknown',
      isVerified: false,
    },
  };

  matches.set(matchId, match);
  return match;
}

/**
 * Get all matches for a user.
 */
export function getUserMatches(userId: string): Match[] {
  const userMatches: Match[] = [];

  matches.forEach((match) => {
    if (match.user1Id === userId || match.user2Id === userId) {
      userMatches.push(match);
    }
  });

  // Sort by matchedAt (newest first)
  userMatches.sort((a, b) => b.matchedAt.getTime() - a.matchedAt.getTime());

  return userMatches;
}

/**
 * Get a specific match by ID.
 */
export function getMatch(matchId: string): Match | null {
  return matches.get(matchId) || null;
}

/**
 * Get the other user's profile from a match.
 */
export function getMatchPartner(match: Match, currentUserId: string): MatchProfile {
  if (match.user1Id === currentUserId) {
    return match.user2Profile;
  }
  return match.user1Profile;
}

/**
 * Check if two users have matched.
 */
export function hasMatched(user1Id: string, user2Id: string): boolean {
  for (const match of matches.values()) {
    if (
      (match.user1Id === user1Id && match.user2Id === user2Id) ||
      (match.user1Id === user2Id && match.user2Id === user1Id)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Get likes received by a user (for "Who likes you" feature).
 */
export function getLikesReceived(userId: string): Like[] {
  const received: Like[] = [];

  likes.forEach((like) => {
    if (like.toUserId === userId) {
      received.push(like);
    }
  });

  // Sort by likedAt (newest first)
  received.sort((a, b) => b.likedAt.getTime() - a.likedAt.getTime());

  return received;
}

/**
 * Get total match count for a user.
 */
export function getMatchCount(userId: string): number {
  return getUserMatches(userId).length;
}

/**
 * Reset all data (for demo purposes).
 */
export function resetMatchingData(): void {
  likes.clear();
  matches.clear();
  passes.clear();
}
