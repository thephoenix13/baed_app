/**
 * Matching Module — Types
 */

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  matchedAt: Date;
  lastMessageAt: Date | null;
  user1Profile: MatchProfile;
  user2Profile: MatchProfile;
}

export interface MatchProfile {
  id: string;
  displayName: string;
  age: number;
  primaryPhoto: string;
  city: string;
  isVerified: boolean;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  likedAt: Date;
  isSuperLike: boolean;
}

export interface MatchResult {
  isMatch: boolean;
  match?: Match;
}
