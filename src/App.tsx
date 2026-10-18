/**
 * Bae'd — App shell and routes.
 *
 * Screens live in src/screens and are built from the shared kit in src/ui.
 * Design reference: the Bae'd screen comps (Finous Daylight pattern, Bae'd colours, light mode).
 */

import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupInstallPrompt } from '@/lib/pwa';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { OfflineBanner } from '@/components/pwa/OfflineBanner';
import { ToastContainer } from '@/components/shared/ToastContainer';
import { FloatingNav } from '@/ui/kit';

import { SplashScreen } from '@/screens/SplashScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { WhyVerifyScreen } from '@/screens/verification/WhyVerifyScreen';
import { ConsentScreen } from '@/screens/verification/ConsentScreen';
import { IdCaptureScreen } from '@/screens/verification/IdCaptureScreen';
import { SelfieScreen } from '@/screens/verification/SelfieScreen';
import { ProcessingScreen } from '@/screens/verification/ProcessingScreen';
import { VerificationResultScreen } from '@/screens/VerificationResultScreen';
import { SignInScreen } from '@/screens/SignInScreen';
import { OtpScreen } from '@/screens/OtpScreen';
import { ManualReviewScreen } from '@/screens/verification/ManualReviewScreen';
import { PreferenceScreen, IntentScreen, LocationScreen } from '@/screens/profile/OnboardingScreens';
import { SafeDateScreen } from '@/screens/SafeDateScreen';
import { AdminDashboardScreen, AdminUsersScreen, AdminReportsScreen, AdminRiskScreen } from '@/screens/admin/AdminScreens';
import { ProfileCreateScreen } from '@/screens/profile/ProfileCreateScreen';
import { ProfilePhotosScreen } from '@/screens/profile/ProfilePhotosScreen';
import { ProfileBioScreen } from '@/screens/profile/ProfileBioScreen';
import { ProfileInterestsScreen } from '@/screens/profile/ProfileInterestsScreen';
import { ProfilePreviewScreen } from '@/screens/profile/ProfilePreviewScreen';
import { DiscoverScreen } from '@/screens/DiscoverScreen';
import { ProfileDetailScreen } from '@/screens/ProfileDetailScreen';
import { FiltersScreen } from '@/screens/FiltersScreen';
import { MatchesScreen } from '@/screens/MatchesScreen';
import { ChatsScreen } from '@/screens/ChatsScreen';
import { ChatScreen } from '@/screens/ChatScreen';
import { YouScreen } from '@/screens/YouScreen';
import { SettingsTopicScreen } from '@/screens/SettingsTopicScreen';
import { AdminModerationScreen, AdminVerificationScreen } from '@/screens/AdminQueueScreen';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } },
});

const NAV_ROUTES = ['/discover', '/matches', '/chats', '/you'];

/** Reset scroll on every route change so each screen starts at its hero. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Shell() {
  const { pathname, state } = useLocation() as ReturnType<typeof useLocation> & { state: { newMatchId?: string } | null };
  const showNav = NAV_ROUTES.includes(pathname) && !(pathname === '/matches' && state?.newMatchId);

  return (
    <div className="bd-app">
      <ScrollToTop />
      <OfflineBanner />
      <InstallPrompt />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/signin" element={<SignInScreen />} />
        <Route path="/signin/otp" element={<OtpScreen />} />

        {/* Verification */}
        <Route path="/verify/why" element={<WhyVerifyScreen />} />
        <Route path="/verify/consent" element={<ConsentScreen />} />
        <Route path="/verify/id" element={<IdCaptureScreen />} />
        <Route path="/verify/selfie" element={<SelfieScreen />} />
        <Route path="/verify/processing" element={<ProcessingScreen />} />
        <Route path="/verify/result" element={<VerificationResultScreen />} />
        <Route path="/verify/review" element={<ManualReviewScreen />} />

        {/* Profile creation */}
        <Route path="/profile/create" element={<ProfileCreateScreen />} />
        <Route path="/profile/preference" element={<PreferenceScreen />} />
        <Route path="/profile/intent" element={<IntentScreen />} />
        <Route path="/profile/location" element={<LocationScreen />} />
        <Route path="/profile/photos" element={<ProfilePhotosScreen />} />
        <Route path="/profile/bio" element={<ProfileBioScreen />} />
        <Route path="/profile/interests" element={<ProfileInterestsScreen />} />
        <Route path="/profile/preview" element={<ProfilePreviewScreen />} />

        {/* Main tabs */}
        <Route path="/discover" element={<DiscoverScreen />} />
        <Route path="/profile/:id" element={<ProfileDetailScreen />} />
        <Route path="/filters" element={<FiltersScreen />} />
        <Route path="/matches" element={<MatchesScreen />} />
        <Route path="/chats" element={<ChatsScreen />} />
        <Route path="/chat/:matchId" element={<ChatScreen />} />
        <Route path="/you" element={<YouScreen />} />
        <Route path="/settings/:topic" element={<SettingsTopicScreen />} />
        <Route path="/safe-date" element={<SafeDateScreen />} />

        {/* Team tools */}
        <Route path="/admin" element={<AdminDashboardScreen />} />
        <Route path="/admin/users" element={<AdminUsersScreen />} />
        <Route path="/admin/reports" element={<AdminReportsScreen />} />
        <Route path="/admin/risk" element={<AdminRiskScreen />} />
        <Route path="/admin/verification" element={<AdminVerificationScreen />} />
        <Route path="/admin/moderation" element={<AdminModerationScreen />} />

        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
      {showNav && <FloatingNav />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    setupInstallPrompt();
    document.body.classList.add('bd-body');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
