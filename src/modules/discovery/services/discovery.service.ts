/**
 * Discovery Module — Service
 *
 * Filters candidates, ranks them by how well they fit the viewer, and explains why.
 * Everything here runs on the mock data until the backend exists.
 */

import type {
  CandidateProfile,
  Compatibility,
  DiscoveryFeed,
  DiscoveryFilters,
  MatchReason,
  Viewer,
} from '../types/discovery.types';
import { MOCK_CANDIDATES } from '../data/candidates';

// Track which profiles have been seen
const seenProfiles = new Set<string>();

/**
 * Explain why two people may connect, using only things we actually know:
 * the intent and interests the viewer entered, the candidate's profile, and distance.
 * Returns the score used for ranking and the reasons shown on the profile.
 */
export function getCompatibility(candidate: CandidateProfile, viewer?: Viewer): Compatibility & { score: number } {
  const reasons: MatchReason[] = [];
  let score = 0;

  if (viewer?.intent) {
    if (viewer.intent === candidate.intent) {
      score += 40;
      reasons.push({ title: `You both want ${candidate.intent.toLowerCase()}`, detail: 'Your intent matches' });
    } else {
      reasons.push({
        title: `${candidate.displayName} is looking for ${candidate.intent.toLowerCase()}`,
        detail: `You chose ${viewer.intent.toLowerCase()}`,
      });
    }
  }

  const shared = viewer ? candidate.interests.filter((i) => viewer.interests.includes(i)) : [];
  if (shared.length > 0) {
    score += Math.min(shared.length, 4) * 10;
    reasons.push({
      title: `You both like ${joinList(shared.slice(0, 3))}`,
      detail: `${shared.length} ${shared.length === 1 ? 'interest' : 'interests'} in common`,
    });
  }

  if (viewer?.city && viewer.city === candidate.city) {
    score += 10;
    reasons.push({ title: `You're both in ${candidate.city}` });
  }
  if (candidate.distance <= 10) {
    score += Math.round(((10 - candidate.distance) / 10) * 10);
    reasons.push({ title: `${candidate.distance} km apart`, detail: 'Close enough for a coffee' });
  }

  const band = score >= 70 ? 'strong' : score >= 40 ? 'good' : 'early';
  return { band, reasons, score };
}

function joinList(items: string[]) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/**
 * Get discovery feed for a user.
 */
export function getDiscoveryFeed(
  _userId: string,
  filters?: DiscoveryFilters,
  viewer?: Viewer,
  limit: number = 10,
): DiscoveryFeed {
  let candidates = MOCK_CANDIDATES.filter((c) => !seenProfiles.has(c.id) && !seenProfiles.has(c.userId));

  if (filters) {
    candidates = candidates.filter((c) => {
      if (c.age < filters.minAge || c.age > filters.maxAge) return false;
      if (c.distance > filters.maxDistance) return false;
      const wanted =
        (c.gender === 'Woman' && filters.interestedInWomen) ||
        (c.gender === 'Man' && filters.interestedInMen) ||
        (c.gender === 'Non-binary' && filters.interestedInNonBinary);
      if (!wanted) return false;
      if (filters.interests.length > 0 && !c.interests.some((i) => filters.interests.includes(i))) return false;
      return true;
    });
  }

  const ranked = candidates
    .map((c) => ({ c, score: getCompatibility(c, viewer).score }))
    .sort((a, b) => b.score - a.score || a.c.distance - b.c.distance)
    .map(({ c, score }) => ({ ...c, compatibilityScore: score }));

  return {
    profiles: ranked.slice(0, limit),
    totalAvailable: ranked.length,
    hasMore: ranked.length > limit,
  };
}

/** Mark a profile as seen (liked or passed). */
export function markProfileAsSeen(profileId: string): void {
  seenProfiles.add(profileId);
}

/** Reset seen profiles (for demo purposes). */
export function resetSeenProfiles(): void {
  seenProfiles.clear();
}

/** Get a single candidate profile by ID. */
export function getCandidateProfile(profileId: string): CandidateProfile | null {
  return MOCK_CANDIDATES.find((c) => c.id === profileId) || null;
}

/** Get default filters. */
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
