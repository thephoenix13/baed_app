/**
 * Auth Hooks
 *
 * Simplified auth hooks — no SMS/OTP validation.
 * Direct entry to verification flow.
 */

import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';

/**
 * Hook to enter the app directly (no validation).
 */
export function useEnterApp() {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const addToast = useUIStore((s) => s.addToast);

  return () => {
    // Generate a mock user ID for demo
    const userId = `user-${Date.now()}`;
    setAuthenticated(userId);
    addToast({
      type: 'success',
      title: 'Welcome to Bae\'d!',
      message: 'Let\'s verify your identity',
    });
  };
}

/**
 * Hook to mark user as verified.
 */
export function useMarkVerified() {
  const setVerified = useAuthStore((s) => s.setVerified);
  const addToast = useUIStore((s) => s.addToast);

  return () => {
    setVerified();
    addToast({
      type: 'success',
      title: 'You\'re verified!',
      message: 'Now let\'s create your profile',
    });
  };
}

/**
 * Hook to logout.
 */
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const addToast = useUIStore((s) => s.addToast);

  return () => {
    logout();
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'See you soon!',
    });
  };
}
