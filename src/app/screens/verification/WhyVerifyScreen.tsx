interface WhyVerifyScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

export function WhyVerifyScreen({ onContinue, onBack }: WhyVerifyScreenProps) {
  return (
    <div className="page flex flex-col">
      {/* Header */}
      <div className="page-header flex items-center">
        <button onClick={onBack} className="btn-icon -ml-3" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="page-content flex-1 flex flex-col">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-[var(--color-success-light)] flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="1.5">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-screen-title mb-3">Why verify?</h1>
        <p className="text-body-secondary mb-8">
          We verify every person so you can date with confidence. No catfishing. No fake profiles.
        </p>

        {/* Benefits */}
        <div className="space-y-5 mb-8 flex-1">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-caption font-medium">1</span>
            </div>
            <div>
              <p className="text-body font-medium mb-0.5">You're safe</p>
              <p className="text-caption">Verified by government ID and selfie match</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-caption font-medium">2</span>
            </div>
            <div>
              <p className="text-body font-medium mb-0.5">Better matches</p>
              <p className="text-caption">Real people means real connections</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-caption font-medium">3</span>
            </div>
            <div>
              <p className="text-body font-medium mb-0.5">Your data is safe</p>
              <p className="text-caption">We never store your ID document</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pb-8">
          <button onClick={onContinue} className="btn btn-primary mb-3">
            Start Verification
          </button>
          <p className="text-small text-center">Takes about 2 minutes</p>
        </div>
      </div>
    </div>
  );
}
