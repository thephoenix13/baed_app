/**
 * Chat store: messages and read state per match.
 * Held in memory only. Messages are personal, so they are never written to local storage;
 * the backend will own them later.
 */

import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  text: string;
  from: 'me' | 'them';
  at: number; // epoch ms
}

interface ChatState {
  threads: Record<string, ChatMessage[]>;
  lastRead: Record<string, number>;
  send: (matchId: string, text: string) => void;
  receive: (matchId: string, text: string) => void;
  markRead: (matchId: string) => void;
  seed: (matchId: string, messages: ChatMessage[], readUpTo: number) => void;
}

let counter = 0;
const nextId = () => `msg-${Date.now()}-${counter++}`;

export const useChatStore = create<ChatState>((set) => ({
  threads: {},
  lastRead: {},
  send: (matchId, text) =>
    set((s) => ({
      threads: { ...s.threads, [matchId]: [...(s.threads[matchId] ?? []), { id: nextId(), text, from: 'me', at: Date.now() }] },
      lastRead: { ...s.lastRead, [matchId]: Date.now() },
    })),
  receive: (matchId, text) =>
    set((s) => ({
      threads: { ...s.threads, [matchId]: [...(s.threads[matchId] ?? []), { id: nextId(), text, from: 'them', at: Date.now() }] },
    })),
  markRead: (matchId) => set((s) => ({ lastRead: { ...s.lastRead, [matchId]: Date.now() } })),
  seed: (matchId, messages, readUpTo) =>
    set((s) => ({
      threads: { ...s.threads, [matchId]: messages },
      lastRead: { ...s.lastRead, [matchId]: readUpTo },
    })),
}));

/** How many of their messages the person has not read yet. */
export function unreadFor(threads: ChatState['threads'], lastRead: ChatState['lastRead'], matchId: string): number {
  const readUpTo = lastRead[matchId] ?? 0;
  return (threads[matchId] ?? []).filter((m) => m.from === 'them' && m.at > readUpTo).length;
}

/** Short time for a chat row: "Now", "12m", "3:40 pm", "Yesterday", "Mon", "12 Oct". */
export function formatChatTime(at: number, now = Date.now()): string {
  const diff = now - at;
  if (diff < 60_000) return 'Now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  const d = new Date(at);
  const today = new Date(now);
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOfDay(today) - startOfDay(d)) / 86_400_000);
  if (days === 0) return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  if (days === 1) return 'Yesterday';
  if (days < 7) return d.toLocaleDateString('en-IN', { weekday: 'short' });
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
