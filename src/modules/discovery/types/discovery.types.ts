/**
 * Discovery Module — Types
 */

export interface CandidateProfile {
  id: string;
  userId: string;
  displayName: string;
  gender: 'Woman' | 'Man' | 'Non-binary';
  age: number;
  bio: string | null;
  occupation: string | null;
  city: string | null;
  distance: number; // km
  intent: string;
  isVerified: boolean;
  photos: CandidatePhoto[];
  interests: string[];
  lifestyle: {
    drinking?: string;
    smoking?: string;
    diet?: string;
    exercise?: string;
  };
  compatibilityScore?: number;
  languages: string[];
  education: string | null;
  hometown: string | null;
  verifiedAt: string; // ISO date the ID check passed
  lastActive: string; // human text for now, e.g. "Active today"
  prompts: ProfilePrompt[];
}

export interface ProfilePrompt {
  question: string;
  answer: string;
}

/** What we know about the person looking, used to explain why two people may connect. */
export interface Viewer {
  intent: string;
  interests: string[];
  city: string;
}

export interface MatchReason {
  title: string;
  detail?: string;
}

export interface Compatibility {
  band: 'strong' | 'good' | 'early';
  reasons: MatchReason[];
}

export interface CandidatePhoto {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface DiscoveryFeed {
  profiles: CandidateProfile[];
  totalAvailable: number;
  hasMore: boolean;
}

export interface DiscoveryFilters {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  interestedInMen: boolean;
  interestedInWomen: boolean;
  interestedInNonBinary: boolean;
  interests: string[];
}

export interface DiscoveryPreferences {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  interestedInMen: boolean;
  interestedInWomen: boolean;
  interestedInNonBinary: boolean;
}
