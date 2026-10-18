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
  photos: string[]; // object URLs for the photos chosen, main photo first
  bio: string;
  occupation: string;
  intent: string;
  interests: string[];
  set: (patch: Partial<Omit<ProfileDraft, 'set' | 'reset' | 'addPhotos' | 'removePhoto' | 'makeMainPhoto'>>) => void;
  addPhotos: (urls: string[]) => void;
  removePhoto: (index: number) => void;
  makeMainPhoto: (index: number) => void;
  reset: () => void;
}

const empty = {
  name: '',
  age: '',
  gender: '',
  showMe: [] as string[],
  city: '',
  nearby: false,
  photos: [] as string[],
  bio: '',
  occupation: '',
  intent: '',
  interests: [] as string[],
};

export const MAX_PHOTOS = 6;

export const useProfileDraft = create<ProfileDraft>((set, get) => ({
  ...empty,
  set: (patch) => set(patch),
  addPhotos: (urls) => {
    const room = MAX_PHOTOS - get().photos.length;
    urls.slice(room).forEach((u) => URL.revokeObjectURL(u)); // more than fit
    set((s) => ({ photos: [...s.photos, ...urls.slice(0, Math.max(room, 0))] }));
  },
  removePhoto: (index) => {
    const url = get().photos[index];
    if (url) URL.revokeObjectURL(url);
    set((s) => ({ photos: s.photos.filter((_, i) => i !== index) }));
  },
  makeMainPhoto: (index) =>
    set((s) => {
      const next = [...s.photos];
      const [picked] = next.splice(index, 1);
      return { photos: [picked, ...next] };
    }),
  reset: () => {
    get().photos.forEach((u) => URL.revokeObjectURL(u));
    set({ ...empty, photos: [] });
  },
}));
