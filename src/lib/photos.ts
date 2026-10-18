/**
 * Mock photo registry: maps a mock person (candidate id or user id) to the files in public/photos.
 * Replaced by photo URLs from the backend later. See public/photos/CREDITS.md for sources.
 */

const SETS: Record<string, string[]> = {
  priya: ['priya-1', 'priya-2'],
  arjun: ['arjun-1'],
  meera: ['meera-1', 'meera-2', 'meera-3'],
  rohan: ['rohan-1'],
  ananya: ['ananya-1'],
};

const OWNER: Record<string, string> = {
  'cand-001': 'priya', 'user-001': 'priya',
  'cand-002': 'arjun', 'user-002': 'arjun',
  'cand-003': 'meera', 'user-003': 'meera',
  'cand-004': 'rohan', 'user-004': 'rohan',
  'cand-005': 'ananya', 'user-005': 'ananya',
};

/** Small square photo for avatars, or null when we have none for this id. */
export function avatarPhoto(id: string): string | null {
  const owner = OWNER[id];
  return owner ? `/photos/${SETS[owner][0]}-sm.jpg` : null;
}

/** Full-size photos for a profile, or an empty list. */
export function profilePhotos(id: string): string[] {
  const owner = OWNER[id];
  return owner ? SETS[owner].map((f) => `/photos/${f}.jpg`) : [];
}
