/**
 * Bae'd — Main App Component
 *
 * Entry point that wires together:
 * - Direct entry (no SMS/OTP validation)
 * - Verification flow
 * - Profile creation
 * - PWA components
 * - Toast notifications
 */

import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fontDisplay, fontSans, typeScale } from './lib/fonts';
import { setupInstallPrompt } from './lib/pwa';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { OfflineBanner } from './components/pwa/OfflineBanner';
import { ToastContainer } from './components/shared/ToastContainer';
import { SplashScreen } from './app/screens/SplashScreen';
import { WelcomeScreen } from './app/screens/WelcomeScreen';
import { WhyVerifyScreen } from './app/screens/verification/WhyVerifyScreen';
import { ConsentScreen } from './app/screens/verification/ConsentScreen';
import { IdCaptureScreen } from './app/screens/verification/IdCaptureScreen';
import { SelfieScreen } from './app/screens/verification/SelfieScreen';
import { ProcessingScreen } from './app/screens/verification/ProcessingScreen';
import { VerificationResultScreen } from './app/screens/verification/VerificationResultScreen';
import { ProfileCreateScreen } from './app/screens/profile/ProfileCreateScreen';
import { ProfilePhotosScreen } from './app/screens/profile/ProfilePhotosScreen';
import { ProfileBioScreen } from './app/screens/profile/ProfileBioScreen';
import { ProfileInterestsScreen } from './app/screens/profile/ProfileInterestsScreen';
import { ProfilePreviewScreen } from './app/screens/profile/ProfilePreviewScreen';
import { HomeScreen } from './app/screens/HomeScreen';
import { AdminVerificationScreen } from './app/screens/admin/AdminVerificationScreen';
import { AdminModerationScreen } from './app/screens/admin/AdminModerationScreen';
import { useAuthStore } from './stores/auth-store';

// Create TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// App screens
type Screen =
  | 'splash'
  | 'welcome'
  | 'why-verify'
  | 'consent'
  | 'id-capture'
  | 'selfie'
  | 'processing'
  | 'verification-result'
  | 'profile-create'
  | 'profile-photos'
  | 'profile-bio'
  | 'profile-interests'
  | 'profile-preview'
  | 'home'
  | 'admin-verification'
  | 'admin-moderation';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Setup PWA on mount
  useState(() => {
    setupInstallPrompt();
  });

  // Screen handlers
  const handleSplashComplete = useCallback(() => {
    setScreen('welcome');
  }, []);

  const handleGetStarted = useCallback(() => {
    // Skip validation — go directly to verification explanation
    setScreen('why-verify');
  }, []);

  const handleVerificationComplete = useCallback((success: boolean) => {
    if (success) {
      setScreen('profile-create');
    } else {
      setScreen('welcome');
    }
  }, []);

  const handleProfileComplete = useCallback(() => {
    setScreen('home');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-cream">
        {/* PWA Components */}
        <OfflineBanner />
        <InstallPrompt />
        <ToastContainer />

        {/* Screen Router */}
        {screen === 'splash' && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}

        {screen === 'welcome' && (
          <WelcomeScreen onGetStarted={handleGetStarted} />
        )}

        {/* Verification Flow */}
        {screen === 'why-verify' && (
          <WhyVerifyScreen
            onContinue={() => setScreen('consent')}
            onBack={() => setScreen('welcome')}
          />
        )}

        {screen === 'consent' && (
          <ConsentScreen
            onAccept={() => setScreen('id-capture')}
            onBack={() => setScreen('why-verify')}
          />
        )}

        {screen === 'id-capture' && (
          <IdCaptureScreen
            onCapture={() => setScreen('selfie')}
            onBack={() => setScreen('consent')}
          />
        )}

        {screen === 'selfie' && (
          <SelfieScreen
            onCapture={() => setScreen('processing')}
            onBack={() => setScreen('id-capture')}
          />
        )}

        {screen === 'processing' && (
          <ProcessingScreen
            onComplete={(success: boolean) => {
              if (success) {
                setScreen('verification-result');
              }
            }}
          />
        )}

        {screen === 'verification-result' && (
          <VerificationResultScreen
            onContinue={() => setScreen('profile-create')}
            onRetry={() => setScreen('why-verify')}
          />
        )}

        {/* Profile Creation Flow */}
        {screen === 'profile-create' && (
          <ProfileCreateScreen
            onComplete={() => setScreen('profile-photos')}
            onBack={() => setScreen('verification-result')}
          />
        )}

        {screen === 'profile-photos' && (
          <ProfilePhotosScreen
            onComplete={() => setScreen('profile-bio')}
            onBack={() => setScreen('profile-create')}
          />
        )}

        {screen === 'profile-bio' && (
          <ProfileBioScreen
            onComplete={() => setScreen('profile-interests')}
            onBack={() => setScreen('profile-photos')}
          />
        )}

        {screen === 'profile-interests' && (
          <ProfileInterestsScreen
            onComplete={() => setScreen('profile-preview')}
            onBack={() => setScreen('profile-bio')}
          />
        )}

        {screen === 'profile-preview' && (
          <ProfilePreviewScreen
            onSubmit={handleProfileComplete}
            onBack={() => setScreen('profile-interests')}
          />
        )}

        {/* Home */}
        {screen === 'home' && (
          <HomeScreen
            onAdminVerification={() => setScreen('admin-verification')}
            onAdminModeration={() => setScreen('admin-moderation')}
          />
        )}

        {/* Admin Screens */}
        {screen === 'admin-verification' && (
          <AdminVerificationScreen onBack={() => setScreen('home')} />
        )}

        {screen === 'admin-moderation' && (
          <AdminModerationScreen onBack={() => setScreen('home')} />
        )}
      </div>
    </QueryClientProvider>
  );
}
