/**
 * Auth Store — Zustand
 *
 * Client-side auth state management.
 * No SMS/OTP validation — direct entry to verification flow.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  // Auth state
  isAuthenticated: boolean;
  isVerified: boolean;
  userId: string | null;

  // Onboarding state
  requiresOnboarding: boolean;
  onboardingStep: number;

  // Actions
  setAuthenticated: (userId: string) => void;
  setVerified: () => void;
  setOnboarding: (requires: boolean, step?: number) => void;
  updateOnboardingStep: (step: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      isVerified: false,
      userId: null,
      requiresOnboarding: true,
      onboardingStep: 0,

      // Actions
      setAuthenticated: (userId) =>
        set({
          userId,
          isAuthenticated: true,
        }),

      setVerified: () =>
        set({
          isVerified: true,
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
          isVerified: false,
          userId: null,
          requiresOnboarding: true,
          onboardingStep: 0,
        }),
    }),
    {
      name: 'baed-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isVerified: state.isVerified,
        userId: state.userId,
      }),
    }
  )
);

// Selectors
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsVerified = (state: AuthState) => state.isVerified;
export const selectUserId = (state: AuthState) => state.userId;
export const selectRequiresOnboarding = (state: AuthState) => state.requiresOnboarding;
