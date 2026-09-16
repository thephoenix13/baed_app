/**
 * Discovery Module — Service
 *
 * Generates candidate profiles and handles filtering.
 */

import type { CandidateProfile, DiscoveryFeed, DiscoveryFilters, DiscoveryPreferences } from '../types/discovery.types';

// Mock candidate data
const MOCK_CANDIDATES: CandidateProfile[] = [
  {
    id: 'cand-001',
    userId: 'user-001',
    displayName: 'Priya',
    age: 26,
    bio: 'Coffee enthusiast and weekend hiker. Looking for someone to explore the city with.',
    occupation: 'Product Designer',
    city: 'Mumbai',
    distance: 3.2,
    intent: 'Long-term',
    isVerified: true,
    photos: [
      { id: 'p1', url: '/mock-photo-1.jpg', isPrimary: true },
      { id: 'p2', url: '/mock-photo-2.jpg', isPrimary: false },
    ],
    interests: ['Coffee', 'Travel', 'Music', 'Fitness', 'Reading'],
    lifestyle: {
      drinking: 'Occasionally',
      smoking: 'Never',
      diet: 'Vegetarian',
      exercise: 'Regularly',
    },
  },
  {
    id: 'cand-002',
    userId: 'user-002',
    displayName: 'Arjun',
    age: 28,
    bio: 'Software engineer by day, musician by night. Love cooking and trying new restaurants.',
    occupation: 'Software Engineer',
    city: 'Pune',
    distance: 5.8,
    intent: 'Long-term',
    isVerified: true,
    photos: [
      { id: 'p3', url: '/mock-photo-3.jpg', isPrimary: true },
    ],
    interests: ['Music', 'Cooking', 'Gaming', 'Travel'],
    lifestyle: {
      drinking: 'Socially',
      smoking: 'Never',
      diet: 'Non-Vegetarian',
      exercise: 'Occasionally',
    },
  },
  {
    id: 'cand-003',
    userId: 'user-003',
    displayName: 'Meera',
    age: 24,
    bio: 'Yoga instructor and plant mom. Looking for genuine connections.',
    occupation: 'Yoga Instructor',
    city: 'Bengaluru',
    distance: 8.1,
    intent: 'Long-term',
    isVerified: true,
    photos: [
      { id: 'p4', url: '/mock-photo-4.jpg', isPrimary: true },
      { id: 'p5', url: '/mock-photo-5.jpg', isPrimary: false },
      { id: 'p6', url: '/mock-photo-6.jpg', isPrimary: false },
    ],
    interests: ['Yoga', 'Meditation', 'Reading', 'Cooking', 'Dogs'],
    lifestyle: {
      drinking: 'Never',
      smoking: 'Never',
      diet: 'Vegan',
      exercise: 'Daily',
    },
  },
  {
    id: 'cand-004',
    userId: 'user-004',
    displayName: 'Rohan',
    age: 30,
    bio: 'Entrepreneur and fitness enthusiast. Love traveling and meeting new people.',
    occupation: 'Founder',
    city: 'Mumbai',
    distance: 2.5,
    intent: 'Short-term',
    isVerified: true,
    photos: [
      { id: 'p7', url: '/mock-photo-7.jpg', isPrimary: true },
    ],
    interests: ['Fitness', 'Travel', 'Nightlife', 'Sports'],
    lifestyle: {
      drinking: 'Socially',
      smoking: 'Never',
      diet: 'Non-Vegetarian',
      exercise: 'Daily',
    },
  },
  {
    id: 'cand-005',
    userId: 'user-005',
    displayName: 'Ananya',
    age: 27,
    bio: 'Artist and dreamer. Looking for someone who appreciates the little things in life.',
    occupation: 'Graphic Designer',
    city: 'Pune',
    distance: 6.3,
    intent: 'Long-term',
    isVerified: true,
    photos: [
      { id: 'p8', url: '/mock-photo-8.jpg', isPrimary: true },
      { id: 'p9', url: '/mock-photo-9.jpg', isPrimary: false },
    ],
    interests: ['Art', 'Photography', 'Music', 'Coffee', 'Travel'],
    lifestyle: {
      drinking: 'Occasionally',
      smoking: 'Never',
      diet: 'Vegetarian',
      exercise: 'Regularly',
    },
  },
];

// Track which profiles have been seen
const seenProfiles = new Set<string>();

/**
 * Get discovery feed for a user.
 */
export function getDiscoveryFeed(
  userId: string,
  filters?: DiscoveryFilters,
  limit: number = 10
): DiscoveryFeed {
  // Filter out seen profiles
  let candidates = MOCK_CANDIDATES.filter((c) => !seenProfiles.has(c.id));

  // Apply filters if provided
  if (filters) {
    candidates = candidates.filter((c) => {
      // Age filter
      if (c.age < filters.minAge || c.age > filters.maxAge) return false;

      // Distance filter
      if (c.distance > filters.maxDistance) return false;

      // Interest filter (if specified)
      if (filters.interests.length > 0) {
        const hasMatchingInterest = c.interests.some((i) =>
          filters.interests.includes(i)
        );
        if (!hasMatchingInterest) return false;
      }

      return true;
    });
  }

  // Calculate compatibility scores (mock)
  candidates = candidates.map((c) => ({
    ...c,
    compatibilityScore: calculateCompatibility(c),
  }));

  // Sort by compatibility score (highest first)
  candidates.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));

  // Limit results
  const limited = candidates.slice(0, limit);

  return {
    profiles: limited,
    totalAvailable: candidates.length,
    hasMore: candidates.length > limit,
  };
}

/**
 * Mark a profile as seen (liked or passed).
 */
export function markProfileAsSeen(profileId: string): void {
  seenProfiles.add(profileId);
}

/**
 * Reset seen profiles (for demo purposes).
 */
export function resetSeenProfiles(): void {
  seenProfiles.clear();
}

/**
 * Get a single candidate profile by ID.
 */
export function getCandidateProfile(profileId: string): CandidateProfile | null {
  return MOCK_CANDIDATES.find((c) => c.id === profileId) || null;
}

/**
 * Calculate compatibility score (mock implementation).
 */
function calculateCompatibility(candidate: CandidateProfile): number {
  // Simple mock: random score between 60-95
  return 60 + Math.random() * 35;
}

/**
 * Get default filters.
 */
export function getDefaultFilters(): DiscoveryFilters {
  return {
    minAge: 18,
    maxAge: 50,
    maxDistance: 50,
    interestedInMen: true,
    interestedInWomen: true,
    interestedInNonBinary: true,
    interests: [],
  };
}
