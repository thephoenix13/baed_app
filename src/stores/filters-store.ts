import { create } from 'zustand';
import { getDefaultFilters } from '@/modules/discovery/services/discovery.service';
import type { DiscoveryFilters } from '@/modules/discovery/types/discovery.types';

interface FiltersState {
  filters: DiscoveryFilters;
  setFilters: (filters: DiscoveryFilters) => void;
  reset: () => void;
}

export const useFilters = create<FiltersState>((set) => ({
  filters: getDefaultFilters(),
  setFilters: (filters) => set({ filters }),
  reset: () => set({ filters: getDefaultFilters() }),
}));
