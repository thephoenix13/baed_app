/**
 * Auth Store — Zustand
 *
 * Client-side auth state management.
 * Stores tokens, user info, and auth status.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/modules/identity/types/user.types';

interface AuthState {
  // Auth state
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  // Onboarding state
  requiresOnboarding: boolean;
  onboardingStep: number;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setOnboarding: (requires: boolean, step?: number) => void;
  logout: () => void;
  updateOnboardingStep: (step: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
      requiresOnboarding: false,
      onboardingStep: 0,

      // Actions
      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      setUser: (user) =>
        set({
          user,
          requiresOnboarding: !user.firstName,
        }),

      setOnboarding: (requires, step = 0) =>
        set({
          requiresOnboarding: requires,
          onboardingStep: step,
        }),

      updateOnboardingStep: (step) =>
        set({ onboardingStep: step }),

      logout: () =>
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          user: null,
          requiresOnboarding: false,
          onboardingStep: 0,
        }),
    }),
    {
      name: 'baed-auth',
      // Only persist tokens and user, not transient state
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectUser = (state: AuthState) => state.user;
export const selectAccessToken = (state: AuthState) => state.accessToken;
export const selectRefreshToken = (state: AuthState) => state.refreshToken;
export const selectRequiresOnboarding = (state: AuthState) => state.requiresOnboarding;
export const selectOnboardingStep = (state: AuthState) => state.onboardingStep;
