/**
 * Bae'd — Main App Component
 *
 * Entry point that wires together:
 * - Verification flow
 * - Profile creation
 * - Discovery feed
 * - Matches & Chat
 * - Settings
 * - PWA components
 */

import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupInstallPrompt } from '@/lib/pwa';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { OfflineBanner } from '@/components/pwa/OfflineBanner';
import { ToastContainer } from '@/components/shared/ToastContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { SplashScreen } from '@/app/screens/SplashScreen';
import { WelcomeScreen } from '@/app/screens/WelcomeScreen';
import { WhyVerifyScreen } from '@/app/screens/verification/WhyVerifyScreen';
import { ConsentScreen } from '@/app/screens/verification/ConsentScreen';
import { IdCaptureScreen } from '@/app/screens/verification/IdCaptureScreen';
import { SelfieScreen } from '@/app/screens/verification/SelfieScreen';
import { ProcessingScreen } from '@/app/screens/verification/ProcessingScreen';
import { VerificationResultScreen } from '@/app/screens/verification/VerificationResultScreen';
import { ProfileCreateScreen } from '@/app/screens/profile/ProfileCreateScreen';
import { ProfilePhotosScreen } from '@/app/screens/profile/ProfilePhotosScreen';
import { ProfileBioScreen } from '@/app/screens/profile/ProfileBioScreen';
import { ProfileInterestsScreen } from '@/app/screens/profile/ProfileInterestsScreen';
import { ProfilePreviewScreen } from '@/app/screens/profile/ProfilePreviewScreen';
import { DiscoverFeedScreen } from '@/app/screens/discovery/DiscoverFeedScreen';
import { ProfileDetailScreen } from '@/app/screens/discovery/ProfileDetailScreen';
import { FiltersScreen } from '@/app/screens/discovery/FiltersScreen';
import { MatchesScreen } from '@/app/screens/matches/MatchesScreen';
import { ChatScreen } from '@/app/screens/chat/ChatScreen';
import { SettingsScreen } from '@/app/screens/settings/SettingsScreen';
import { useAuthStore } from '@/stores/auth-store';
import type { Match } from '@/modules/matching/types/matching.types';

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
  | 'discover'
  | 'profile-detail'
  | 'filters'
  | 'matches'
  | 'chat'
  | 'settings';

type Tab = 'discover' | 'matches' | 'chat' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('discover');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [newMatch, setNewMatch] = useState<Match | null>(null);

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
    setScreen('why-verify');
  }, []);

  const handleVerificationComplete = useCallback(() => {
    setScreen('profile-create');
  }, []);

  const handleProfileComplete = useCallback(() => {
    setScreen('discover');
    setActiveTab('discover');
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setScreen(tab);
  }, []);

  const handleViewProfile = useCallback((profileId: string) => {
    setSelectedProfileId(profileId);
    setScreen('profile-detail');
  }, []);

  const handleOpenChat = useCallback((matchId: string) => {
    setSelectedMatchId(matchId);
    setScreen('chat');
  }, []);

  const handleMatch = useCallback((match: Match) => {
    setNewMatch(match);
    setActiveTab('matches');
    setScreen('matches');
  }, []);

  // Mock user ID for demo
  const userId = 'demo-user-001';

  // Show bottom nav for main app screens
  const showBottomNav = ['discover', 'matches', 'chat', 'settings'].includes(screen);

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

        {/* Main App Screens */}
        {screen === 'discover' && (
          <DiscoverFeedScreen
            userId={userId}
            onViewProfile={handleViewProfile}
            onOpenFilters={() => setScreen('filters')}
            onMatch={handleMatch}
          />
        )}

        {screen === 'profile-detail' && selectedProfileId && (
          <ProfileDetailScreen
            profileId={selectedProfileId}
            onBack={() => setScreen('discover')}
            onLike={() => {
              // Handle like
              setScreen('discover');
            }}
            onPass={() => {
              // Handle pass
              setScreen('discover');
            }}
          />
        )}

        {screen === 'filters' && (
          <FiltersScreen
            onApply={() => setScreen('discover')}
            onBack={() => setScreen('discover')}
          />
        )}

        {screen === 'matches' && (
          <MatchesScreen
            userId={userId}
            onOpenChat={handleOpenChat}
            newMatch={newMatch}
            onDismissMatch={() => setNewMatch(null)}
          />
        )}

        {screen === 'chat' && selectedMatchId && (
          <ChatScreen
            matchId={selectedMatchId}
            userId={userId}
            onBack={() => {
              setScreen('matches');
              setActiveTab('matches');
            }}
          />
        )}

        {screen === 'settings' && (
          <SettingsScreen
            onLogout={() => {
              useAuthStore.getState().logout();
              setScreen('welcome');
            }}
          />
        )}

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        )}
      </div>
    </QueryClientProvider>
  );
}
