interface ConsentScreenProps {
  onAccept: () => void;
  onBack: () => void;
}

export function ConsentScreen({ onAccept, onBack }: ConsentScreenProps) {
  return (
    <div className="page flex flex-col">
      {/* Header with back button, title, and progress */}
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-icon -ml-3" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-body font-medium">Verification</h2>
        </div>
        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
        </div>
      </div>

      <div className="page-content flex-1 flex flex-col">
        {/* Title section */}
        <div className="mb-12">
          <h1 className="text-screen-title mb-2">Let's verify you</h1>
          <p className="text-body-secondary">It takes about a minute.</p>
        </div>

        {/* Vertical timeline steps */}
        <div className="mb-12 flex-1">
          {/* Step 1 */}
          <div className="flex gap-4 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center flex-shrink-0">
                <span className="text-body font-semibold text-[var(--color-text)]">01</span>
              </div>
              <div className="w-px h-full bg-[var(--color-border)] mt-2"></div>
            </div>
            <div className="pt-2">
              <p className="text-body font-medium mb-1">Government ID</p>
              <p className="text-caption">Passport, Aadhaar, driving licence or accepted ID.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center flex-shrink-0">
                <span className="text-body font-semibold text-[var(--color-text)]">02</span>
              </div>
              <div className="w-px h-full bg-[var(--color-border)] mt-2"></div>
            </div>
            <div className="pt-2">
              <p className="text-body font-medium mb-1">Selfie</p>
              <p className="text-caption">We'll match your face with your ID.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center flex-shrink-0">
                <span className="text-body font-semibold text-[var(--color-text)]">03</span>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-body font-medium mb-1">Verification</p>
              <p className="text-caption">We'll check both securely.</p>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="pb-8">
          <button onClick={onAccept} className="btn btn-primary mb-3">
            Start verification
          </button>
          <p className="text-small text-center">
            Your information is encrypted and handled securely.
          </p>
        </div>
      </div>
    </div>
  );
}
