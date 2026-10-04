interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="page flex flex-col" style={{ paddingBottom: 0 }}>
      {/* Spacer to center content */}
      <div className="flex-1" />

      {/* Content */}
      <div className="page-content text-center">
        {/* Logo mark */}
        <div className="flex items-center justify-center mb-8">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 35s-12-6.5-12-15.5C8 12.5 13.5 7 20 7s12 5.5 12 12.5C32 28.5 20 35 20 35z"
              fill="var(--color-accent)"
              opacity="0.15"
            />
            <path
              d="M20 33s-10-5.5-10-13.5C10 13 14.5 9 20 9s10 4 10 10.5C30 27.5 20 33 20 33z"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-screen-title mb-3" style={{ letterSpacing: '-0.03em' }}>
          Bae'd
        </h1>

        {/* Tagline */}
        <p className="text-body-secondary mb-12">
          Dating, without the doubt.
        </p>

        {/* Value props — minimal */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-[var(--color-success-light)] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <p className="text-body">Every profile is identity-verified</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-[var(--color-success-light)] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className="text-body">Your data stays private, always</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-[var(--color-success-light)] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="text-body">Real people, real connections</p>
          </div>
        </div>
      </div>

      {/* CTA — sticky bottom */}
      <div className="page-content pb-8">
        <button onClick={onGetStarted} className="btn btn-primary">
          Get Started
        </button>
        <p className="text-small text-center mt-4">
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
