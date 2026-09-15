import { useEffect } from 'react';
import { fontDisplay, fontSans, typeScale } from './lib/fonts';
import { setupInstallPrompt } from './lib/pwa';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { OfflineBanner } from './components/pwa/OfflineBanner';

export default function App() {
  useEffect(() => {
    // Setup PWA install prompt
    setupInstallPrompt();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      {/* PWA Components */}
      <OfflineBanner />
      <InstallPrompt />

      {/* ═══ HERO SECTION ═══ */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Brand Pill */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-pink-pale">
            <span className="text-label text-plum">Verified-First Dating</span>
          </div>
        </div>

        {/* Hero Headline */}
        <h1
          className={typeScale.hero + ' text-plum mb-4'}
          style={fontDisplay.style}
        >
          Bae'd
        </h1>

        <p className={typeScale.h2 + ' text-plum mb-6'}>
          Dating, without the doubt.
        </p>

        {/* Lead Text */}
        <p className={typeScale.lead + ' max-w-md mb-10'}>
          Every person on Bae'd is verified. Real identities. Real intentions.
          Real connections.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-ghost">Learn More</button>
        </div>

        {/* Verified Badge */}
        <div className="mt-12">
          <div className="verified-badge">
            <svg
              className="verified-badge-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="verified-badge-text">Identity Verified</span>
          </div>
        </div>
      </section>

      {/* ═══ IDENTITY MODULE SHOWCASE ═══ */}
      <section className="px-4 py-10 max-w-2xl mx-auto">
        <p className="text-label text-muted mb-6">Identity Module — Phase 1</p>

        <div className="space-5 flex flex-col gap-4">
          {/* Module Structure */}
          <div className="card">
            <h3 className="text-h3 text-ink mb-3" style={fontSans.style}>
              Module Structure
            </h3>
            <div className="text-body text-muted font-mono text-sm space-y-1">
              <p>src/modules/identity/</p>
              <p className="pl-4">├── types/</p>
              <p className="pl-8">├── user.types.ts</p>
              <p className="pl-8">└── otp.types.ts</p>
              <p className="pl-4">├── schemas/</p>
              <p className="pl-8">└── auth.schema.ts</p>
              <p className="pl-4">├── services/</p>
              <p className="pl-8">├── auth.service.ts</p>
              <p className="pl-8">├── otp.service.ts</p>
              <p className="pl-8">├── session.service.ts</p>
              <p className="pl-8">└── device.service.ts</p>
              <p className="pl-4">├── events/</p>
              <p className="pl-8">└── identity.events.ts</p>
              <p className="pl-4">├── routes/</p>
              <p className="pl-8">└── auth-handlers.ts</p>
              <p className="pl-4">└── index.ts</p>
            </div>
          </div>

          {/* Features */}
          <div className="card">
            <h3 className="text-h3 text-ink mb-3" style={fontSans.style}>
              Features Implemented
            </h3>
            <ul className="text-body text-muted space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>OTP generation & verification (SHA-256 hashed)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>JWT access tokens (15 min expiry)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>Refresh tokens (30 day expiry)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>Session management (create, refresh, revoke)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>Device registration & tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>Domain events (UserCreated, UserLoggedIn, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>Zod validation schemas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>Rate limiting (60s between OTP sends)</span>
              </li>
            </ul>
          </div>

          {/* PWA Features */}
          <div className="card">
            <h3 className="text-h3 text-ink mb-3" style={fontSans.style}>
              PWA Features
            </h3>
            <ul className="text-body text-muted space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>Service worker with vite-plugin-pwa</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>Web App Manifest (installable)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>Install prompt component (Android/Chrome)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>iOS "Add to Home Screen" instructions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>Offline detection banner</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>Push notification utilities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verified-green">✓</span>
                <span>Font caching (Google Fonts)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-4 py-10 text-center bg-plum-deep text-dark-text mt-10">
        <p className="text-h3 mb-2" style={fontDisplay.style}>
          Bae'd
        </p>
        <p className="text-lead text-dark-muted">
          Dating, without the doubt.
        </p>
        <p className="text-body text-dark-muted mt-4">
          Mumbai · Pune · Bengaluru
        </p>
      </footer>
    </div>
  );
}
