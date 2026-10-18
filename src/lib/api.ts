/**
 * Data access for screens. Today it wraps the in-memory mock services; when the backend exists
 * these functions become fetch calls and nothing in the screens has to change.
 *
 * Demo tools (development, or VITE_DEMO_TOOLS=true): add ?slow to any URL to see loading states,
 * or ?fail=feed | profile | matches | chat | otp | all to see error states.
 */

import { getCandidateProfile, getDiscoveryFeed } from '@/modules/discovery/services/discovery.service';
import { getMatch, getUserMatches } from '@/modules/matching/services/matching.service';
import type { CandidateProfile, DiscoveryFeed, DiscoveryFilters, Viewer } from '@/modules/discovery/types/discovery.types';
import type { Match } from '@/modules/matching/types/matching.types';

export type ApiErrorCode = 'network' | 'not_found' | 'server';

export class ApiError extends Error {
  code: ApiErrorCode;
  constructor(message: string, code: ApiErrorCode) {
    super(message);
    this.code = code;
  }
}

export const demoTools = import.meta.env.DEV || import.meta.env.VITE_DEMO_TOOLS === 'true';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function call<T>(name: string, run: () => T): Promise<T> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new ApiError("You're offline", 'network');
  }
  if (demoTools) {
    const params = new URLSearchParams(window.location.search);
    await sleep(params.has('slow') ? 2500 : import.meta.env.DEV ? 250 : 0);
    const fail = params.get('fail');
    if (fail === name || fail === 'all') throw new ApiError('We could not reach the server', 'network');
  }
  return run();
}

export const api = {
  feed: (userId: string, filters: DiscoveryFilters, viewer: Viewer): Promise<DiscoveryFeed> =>
    call('feed', () => getDiscoveryFeed(userId, filters, viewer)),

  candidate: (id: string): Promise<CandidateProfile> =>
    call('profile', () => {
      const profile = getCandidateProfile(id);
      if (!profile) throw new ApiError('Profile not found', 'not_found');
      return profile;
    }),

  matches: (userId: string): Promise<Match[]> => call('matches', () => getUserMatches(userId)),

  match: (id: string): Promise<Match> =>
    call('chat', () => {
      const match = getMatch(id);
      if (!match) throw new ApiError('Conversation not found', 'not_found');
      return match;
    }),

  /** Demo check until the SMS provider exists: any 6-digit code works except 000000. */
  sendOtp: (_phone: string): Promise<void> => call('otp', () => undefined),
  verifyOtp: (_phone: string, code: string): Promise<boolean> => call('otp', () => code !== '000000'),
};
