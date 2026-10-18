/**
 * Verification photos, in memory only.
 * The ID photo and selfie stay on the device until they are submitted for the check, are never
 * written to storage, and are discarded once the check finishes (see ProcessingScreen).
 */

import { create } from 'zustand';

interface Shot {
  blob: Blob;
  url: string; // object URL for showing it back to the person
}

interface VerificationState {
  id: Shot | null;
  selfie: Shot | null;
  setId: (shot: Shot | null) => void;
  setSelfie: (shot: Shot | null) => void;
  clear: () => void;
}

const release = (shot: Shot | null) => {
  if (shot) URL.revokeObjectURL(shot.url);
};

export const useVerificationStore = create<VerificationState>((set, get) => ({
  id: null,
  selfie: null,
  setId: (shot) => {
    release(get().id);
    set({ id: shot });
  },
  setSelfie: (shot) => {
    release(get().selfie);
    set({ selfie: shot });
  },
  clear: () => {
    release(get().id);
    release(get().selfie);
    set({ id: null, selfie: null });
  },
}));
