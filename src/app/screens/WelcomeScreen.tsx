/**
 * Welcome Screen — Native App Style
 *
 * Compact, native mobile app feel. Not a website.
 */

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Hero Section — Compact */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        {/* Verified Badge */}
        <div className="mb-8">
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

        {/* Headline */}
        <h1 className="text-hero text-plum mb-4 font-display">
          Dating,
          <br />
          without the doubt.
        </h1>

        {/* Subheadline */}
        <p className="text-lead max-w-xs mb-8">
          Every person verifies their identity.
          <br />
          Real people. Real connections.
        </p>
      </div>

      {/* CTA Section */}
      <div className="px-4 pb-6">
        <button
          onClick={onGetStarted}
          className="btn btn-primary w-full mb-3"
        >
          Get Started
        </button>

        <p className="text-tiny text-stone text-center">
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
