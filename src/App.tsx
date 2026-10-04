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
import { BottomNavigation } from '@/components/layout/BottomNavigation';
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
import { MessagesScreen } from '@/app/screens/chat/MessagesScreen';
import { ChatScreen } from '@/app/screens/chat/ChatScreen';
import { ProfileScreen } from '@/app/screens/profile/ProfileScreen';
import { HomeScreen } from '@/app/screens/HomeScreen';
import { WaitlistScreen } from '@/app/screens/WaitlistScreen';
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
  | 'waitlist'
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
  | 'discover'
  | 'profile-detail'
  | 'filters'
  | 'matches'
  | 'messages'
  | 'chat'
  | 'settings'
  | 'admin-verification'
  | 'admin-moderation';

type Tab = 'discover' | 'matches' | 'chat' | 'profile';

export default function App() {
  // Check if user wants to access the full app (internal use)
  const isAppMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('app') === 'true';
  
  // Start on waitlist page for public sharing
  // Change to 'splash' when app is ready for full launch
  const [screen, setScreen] = useState<Screen>(isAppMode ? 'splash' : 'waitlist');
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
    setScreen('home');
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    // Navigate to appropriate screen based on tab
    if (tab === 'chat') {
      setScreen('messages');
    } else if (tab === 'profile') {
      setScreen('settings');
    } else {
      setScreen(tab);
    }
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

  // Show bottom nav for main app screens (except discover which has its own)
  const showBottomNav = ['home', 'matches', 'messages', 'chat', 'settings', 'discover'].includes(screen);

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
          <WelcomeScreen 
            onGetStarted={handleGetStarted}
            onViewWaitlist={() => setScreen('waitlist')}
          />
        )}

        {screen === 'waitlist' && (
          <WaitlistScreen />
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

        {/* Home Screen */}
        {screen === 'home' && (
          <HomeScreen
            onAdminVerification={() => setScreen('admin-verification')}
            onAdminModeration={() => setScreen('admin-moderation')}
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

        {screen === 'messages' && (
          <MessagesScreen
            userId={userId}
            onOpenConversation={(matchId) => {
              setSelectedMatchId(matchId);
              setScreen('chat');
            }}
          />
        )}

        {screen === 'chat' && selectedMatchId && (
          <ChatScreen
            matchId={selectedMatchId}
            userId={userId}
            onBack={() => {
              setScreen('messages');
              setActiveTab('chat');
            }}
          />
        )}

        {screen === 'settings' && (
          <ProfileScreen
            onLogout={() => {
              useAuthStore.getState().logout();
              setScreen('welcome');
            }}
          />
        )}

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        )}
      </div>
    </QueryClientProvider>
  );
}
