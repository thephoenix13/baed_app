/**
 * Profile draft — what the user has entered while creating their profile.
 * Held in memory until the profile service exists; it is never persisted.
 */

import { create } from 'zustand';

interface ProfileDraft {
  name: string;
  age: string;
  gender: string;
  showMe: string[];
  city: string;
  nearby: boolean;
  photos: number;
  bio: string;
  occupation: string;
  intent: string;
  interests: string[];
  set: (patch: Partial<Omit<ProfileDraft, 'set' | 'reset'>>) => void;
  reset: () => void;
}

const empty = {
  name: '',
  age: '',
  gender: '',
  showMe: [] as string[],
  city: '',
  nearby: false,
  photos: 0,
  bio: '',
  occupation: '',
  intent: '',
  interests: [] as string[],
};

export const useProfileDraft = create<ProfileDraft>((set) => ({
  ...empty,
  set: (patch) => set(patch),
  reset: () => set(empty),
}));
