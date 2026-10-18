import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import type { DiscoveryFilters, Viewer } from '@/modules/discovery/types/discovery.types';

// Retrying is the person's choice ("Try again"), so a failed load shows its error straight away.
const once = { retry: false, refetchOnWindowFocus: false } as const;

export function useFeed(userId: string, filters: DiscoveryFilters, viewer: Viewer) {
  return useQuery({
    queryKey: ['feed', userId, filters, viewer],
    queryFn: () => api.feed(userId, filters, viewer),
    // The feed is walked through locally; refetching mid-session would reshuffle the card on screen.
    staleTime: Infinity,
    gcTime: 0,
    ...once,
  });
}

export function useCandidate(id: string) {
  return useQuery({ queryKey: ['candidate', id], queryFn: () => api.candidate(id), ...once });
}

export function useMatches(userId: string) {
  return useQuery({ queryKey: ['matches', userId], queryFn: () => api.matches(userId), staleTime: 0, ...once });
}

export function useMatch(id: string) {
  return useQuery({ queryKey: ['match', id], queryFn: () => api.match(id), ...once });
}
