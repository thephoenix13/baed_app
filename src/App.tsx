/**
 * Bae'd — Main App Component
 *
 * Entry point that wires together:
 * - Auth flow (splash → welcome → phone → OTP)
 * - PWA components (install prompt, offline banner)
 * - Toast notifications
 * - TanStack Query provider
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
import { PhoneScreen } from './app/screens/PhoneScreen';
import { OtpScreen } from './app/screens/OtpScreen';
import { AdminLoginScreen } from './app/screens/AdminLoginScreen';
import { useAuthStore } from './stores/auth-store';
import { useSendOtp } from './hooks/use-auth';
import type { AdminRole } from './core/auth/permissions';

// Create TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// App screens
type Screen = 'splash' | 'welcome' | 'phone' | 'otp' | 'home' | 'admin-login';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Setup PWA on mount
  useState(() => {
    setupInstallPrompt();
  });

  // Screen handlers
  const handleSplashComplete = useCallback(() => {
    if (isAuthenticated) {
      setScreen('home');
    } else {
      setScreen('welcome');
    }
  }, [isAuthenticated]);

  const handleGetStarted = useCallback(() => {
    setScreen('phone');
  }, []);

  const handleOtpSent = useCallback((phone: string, code: string) => {
    setPhoneNumber(phone);
    setCountryCode(code);
    setScreen('otp');
  }, []);

  const handleOtpSuccess = useCallback(() => {
    setScreen('home');
  }, []);

  const handleAdminLogin = useCallback((_adminId: string, _role: AdminRole) => {
    // In production, store admin session
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

        {screen === 'phone' && (
          <PhoneScreen
            onOtpSent={handleOtpSent}
            onBack={() => setScreen('welcome')}
          />
        )}

        {screen === 'otp' && (
          <OtpScreen
            phoneNumber={phoneNumber}
            countryCode={countryCode}
            onSuccess={handleOtpSuccess}
            onBack={() => setScreen('phone')}
            onResend={() => {
              // Resend OTP logic
            }}
          />
        )}

        {screen === 'admin-login' && (
          <AdminLoginScreen
            onLogin={handleAdminLogin}
            onBack={() => setScreen('welcome')}
          />
        )}

        {screen === 'home' && (
          <HomeScreen onAdminLogin={() => setScreen('admin-login')} />
        )}
      </div>
    </QueryClientProvider>
  );
}

// ═══════════════════════════════════════════════════════════════
// HOME SCREEN (Post-Auth)
// ═══════════════════════════════════════════════════════════════

function HomeScreen({ onAdminLogin }: { onAdminLogin: () => void }) {
  const user = useAuthStore((s) => s.user);
  const requiresOnboarding = useAuthStore((s) => s.requiresOnboarding);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <h2 className={typeScale.h3} style={fontSans.style}>
          {requiresOnboarding ? 'Welcome!' : `Hi${user?.firstName ? `, ${user.firstName}` : ''}`}
        </h2>
        <button
          onClick={onAdminLogin}
          className="btn btn-ghost !px-3 !py-2 text-sm"
        >
          Admin
        </button>
      </header>

      {/* Content */}
      <main className="px-6 py-8">
        {requiresOnboarding ? (
          <OnboardingPrompt />
        ) : (
          <DiscoverPrompt />
        )}
      </main>

      {/* Phase 1 Summary */}
      <section className="px-6 py-8">
        <p className="text-label text-muted mb-4">Phase 1 — Complete</p>
        <div className="flex flex-col gap-3">
          <ModuleCard
            title="Identity Module"
            status="complete"
            items={[
              'OTP generation & verification',
              'JWT + refresh tokens',
              'Session management',
              'Device registration',
              'Domain events',
              'Zod validation',
              'Rate limiting',
            ]}
          />
          <ModuleCard
            title="PWA Setup"
            status="complete"
            items={[
              'Service worker (vite-plugin-pwa)',
              'Web App Manifest',
              'Install prompt (Android + iOS)',
              'Offline detection',
              'Push notification utilities',
            ]}
          />
          <ModuleCard
            title="Core Infrastructure"
            status="complete"
            items={[
              'Database client (Prisma mock)',
              'Redis client (in-memory)',
              'Rate limiter (Redis-backed)',
              'Auth middleware',
              'Admin RBAC',
            ]}
          />
          <ModuleCard
            title="State Management"
            status="complete"
            items={[
              'Zustand auth store',
              'Zustand UI store',
              'TanStack Query hooks',
            ]}
          />
          <ModuleCard
            title="App Shell Screens"
            status="complete"
            items={[
              'Splash screen',
              'Welcome screen',
              'Phone input screen',
              'OTP verification screen',
              'Admin login screen',
            ]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 text-center bg-plum-deep text-dark-text mt-10">
        <p className="text-h3 mb-2" style={fontDisplay.style}>
          Bae'd
        </p>
        <p className="text-lead text-dark-muted">
          Dating, without the doubt.
        </p>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════

function OnboardingPrompt() {
  return (
    <div className="card text-center">
      <div className="w-16 h-16 bg-pink-pale rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">✨</span>
      </div>
      <h3 className="text-h3 text-ink mb-2" style={fontSans.style}>
        Let's set up your profile
      </h3>
      <p className="text-body text-muted mb-6">
        Complete your profile to start matching with verified people.
      </p>
      <button className="btn btn-primary w-full">
        Start Onboarding
      </button>
    </div>
  );
}

function DiscoverPrompt() {
  return (
    <div className="card text-center">
      <div className="w-16 h-16 bg-pink-pale rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">💜</span>
      </div>
      <h3 className="text-h3 text-ink mb-2" style={fontSans.style}>
        You're verified!
      </h3>
      <p className="text-body text-muted mb-6">
        Start discovering verified profiles near you.
      </p>
      <button className="btn btn-primary w-full">
        Start Discovering
      </button>
    </div>
  );
}

function ModuleCard({
  title,
  status,
  items,
}: {
  title: string;
  status: 'complete' | 'in-progress' | 'pending';
  items: string[];
}) {
  const statusColors = {
    complete: 'bg-verified-green',
    'in-progress': 'bg-amber',
    pending: 'bg-muted',
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${statusColors[status]}`}></span>
        <h4 className="text-h3 text-ink" style={fontSans.style}>
          {title}
        </h4>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-body text-muted text-sm">
            <span className="text-verified-green mt-0.5">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
