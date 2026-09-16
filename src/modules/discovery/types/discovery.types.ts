/**
 * Discovery Module — Types
 */

export interface CandidateProfile {
  id: string;
  userId: string;
  displayName: string;
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
