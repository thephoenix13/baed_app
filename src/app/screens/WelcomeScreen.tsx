/**
 * Welcome Screen
 *
 * Landing screen for new and returning users.
 * Shows brand promise and CTA to start authentication.
 */

import { fontDisplay, fontSans } from '@/lib/fonts';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Brand Mark */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-pink-pale">
            <svg
              className="w-4 h-4 text-verified-green"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-label text-plum">Verified-First</span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-h1 text-plum mb-4"
          style={fontDisplay.style}
        >
          Real people.
          <br />
          Real connections.
        </h1>

        {/* Subheadline */}
        <p className="text-lead max-w-sm mb-8">
          Every person on Bae'd verifies their identity.
          No catfishing. No games. Just genuine connections.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <span className="pill">ID Verified</span>
          <span className="pill">Selfie Match</span>
          <span className="pill">Safe Dating</span>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-8">
        <button
          onClick={onGetStarted}
          className="btn btn-primary w-full mb-3"
          style={fontSans.style}
        >
          Get Started
        </button>

        <p className="text-body text-muted text-center text-sm">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-plum underline">
            Terms
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-plum underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
