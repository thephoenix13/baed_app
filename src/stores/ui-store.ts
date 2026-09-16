/**
 * UI Store — Zustand
 *
 * Global UI state: modals, toasts, loading states, theme.
 */

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  // Loading
  isGlobalLoading: boolean;

  // Modals
  activeModal: string | null;
  modalData: Record<string, unknown> | null;

  // Toasts
  toasts: Toast[];

  // Bottom nav
  activeTab: 'discover' | 'matches' | 'chat' | 'settings';

  // Actions
  setGlobalLoading: (loading: boolean) => void;
  openModal: (modal: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isGlobalLoading: false,
  activeModal: null,
  modalData: null,
  toasts: [],
  activeTab: 'discover',

  // Actions
  setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

  openModal: (modal, data = undefined) =>
    set({ activeModal: modal, modalData: data ?? null }),

  closeModal: () =>
    set({ activeModal: null, modalData: null }),

  addToast: (toast) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    // Auto-remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setActiveTab: (tab) => set({ activeTab: tab }),
}));
