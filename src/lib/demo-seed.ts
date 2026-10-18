/**
 * Demo data so Matches and Chats have something to show on first load.
 * Two existing conversations and one new match. Removed when the backend exists.
 */

import { seedMatch } from '@/modules/matching/services/matching.service';
import { useChatStore } from '@/stores/chat-store';
import type { ChatMessage } from '@/stores/chat-store';
import { DEMO_USER_ID } from './session';

let seeded = false;

export function seedDemoData() {
  if (seeded) return;
  seeded = true;

  const now = Date.now();
  const min = 60_000;
  const hour = 60 * min;
  const msg = (n: number, from: 'me' | 'them', text: string, ago: number): ChatMessage => ({ id: `seed-${n}`, from, text, at: now - ago });

  // Arjun: he wrote last, one unread message
  const arjun = seedMatch(DEMO_USER_ID, 'user-002', new Date(now - 30 * hour));
  useChatStore.getState().seed(
    arjun.id,
    [
      msg(1, 'them', 'Hi! I saw we both like cooking.', 29 * hour),
      msg(2, 'me', "Hey Arjun! What's your signature dish?", 28 * hour),
      msg(3, 'them', 'Butter chicken, and a very average dal. You?', 8 * min),
    ],
    now - 28 * hour,
  );

  // Ananya: the person wrote last, everything read
  const ananya = seedMatch(DEMO_USER_ID, 'user-005', new Date(now - 52 * hour));
  useChatStore.getState().seed(
    ananya.id,
    [
      msg(4, 'me', 'Loved your market photo. Where was it?', 50 * hour),
      msg(5, 'them', "Thanks! That's Mapusa market in Goa.", 49 * hour),
      msg(6, 'me', 'Goa is on my list. Any food tips?', 26 * hour),
    ],
    now - 26 * hour,
  );

  // Rohan: a new match with no messages yet
  seedMatch(DEMO_USER_ID, 'user-004', new Date(now - 2 * hour));
}
