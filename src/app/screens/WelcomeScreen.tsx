/**
 * Welcome Screen — Redesigned
 *
 * Premium editorial feel. Warm, confident, unhurried.
 * Mobile-first, breathable, trust-focused.
 */

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Hero Section — Editorial, Breathable */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Verified Badge — Credential, not decoration */}
        <div className="mb-12">
          <div className="verified-badge verified-badge-large">
            <svg
              className="verified-badge-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="verified-badge-text">Verified-First</span>
          </div>
        </div>

        {/* Headline — DM Serif Display, Editorial */}
        <h1 className="text-hero text-plum mb-6 font-display">
          Dating,
          <br />
          without the doubt.
        </h1>

        {/* Subheadline — Warm, Confident */}
        <p className="text-lead max-w-sm mb-12">
          Every person verifies their identity.
          <br />
          Real people. Real connections.
        </p>
      </div>

      {/* CTA Section — Sticky, Mobile-native */}
      <div className="px-6 pb-8">
        <button
          onClick={onGetStarted}
          className="btn btn-primary w-full mb-4"
        >
          Get Started
        </button>

        <p className="text-small text-stone text-center">
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
