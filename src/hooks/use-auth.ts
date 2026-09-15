/**
 * Auth Hooks — TanStack Query
 *
 * Server-state hooks for authentication operations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { handleSendOtp, handleVerifyOtp, handleRefreshToken, handleLogout } from '@/modules/identity/routes/auth-handlers';
import type { DeviceInfo } from '@/modules/identity/types/user.types';

// ═══════════════════════════════════════════════════════════════
// SEND OTP MUTATION
// ═══════════════════════════════════════════════════════════════

export function useSendOtp() {
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async ({ phoneNumber, countryCode }: { phoneNumber: string; countryCode?: string }) => {
      return handleSendOtp({ phoneNumber, countryCode });
    },
    onSuccess: (data) => {
      if (data.success) {
        addToast({
          type: 'success',
          title: 'OTP Sent',
          message: `Verification code sent to ${data.maskedPhone}`,
        });
      }
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        title: 'Failed to Send OTP',
        message: error.message,
      });
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// VERIFY OTP MUTATION
// ═══════════════════════════════════════════════════════════════

export function useVerifyOtp() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const setOnboarding = useAuthStore((s) => s.setOnboarding);
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async ({
      phoneNumber,
      countryCode,
      otp,
      deviceInfo,
    }: {
      phoneNumber: string;
      countryCode?: string;
      otp: string;
      deviceInfo?: DeviceInfo;
    }) => {
      return handleVerifyOtp({ phoneNumber, countryCode, otp, deviceInfo });
    },
    onSuccess: (data) => {
      // Store tokens
      setTokens(data.accessToken, data.refreshToken);
      setOnboarding(data.requiresOnboarding);

      addToast({
        type: 'success',
        title: data.isNewUser ? 'Welcome to Bae\'d!' : 'Welcome back!',
        message: data.requiresOnboarding
          ? 'Let\'s set up your profile'
          : 'You\'re all set',
      });
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        title: 'Verification Failed',
        message: error.message,
      });
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// REFRESH TOKEN MUTATION
// ═══════════════════════════════════════════════════════════════

export function useRefreshToken() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async (refreshToken: string) => {
      return handleRefreshToken({ refreshToken });
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
    },
    onError: () => {
      // If refresh fails, force logout
      logout();
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// LOGOUT MUTATION
// ═══════════════════════════════════════════════════════════════

export function useLogout() {
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await handleLogout({ refreshToken });
      }
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      addToast({
        type: 'info',
        title: 'Logged Out',
        message: 'See you soon!',
      });
    },
  });
}
