interface ConsentScreenProps {
  onAccept: () => void;
  onBack: () => void;
}

export function ConsentScreen({ onAccept, onBack }: ConsentScreenProps) {
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
        <h1 className="text-screen-title mb-3">Before we begin</h1>
        <p className="text-body-secondary mb-8">Here's what happens during verification:</p>

        {/* Steps */}
        <div className="space-y-4 mb-8 flex-1">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center flex-shrink-0">
              <span className="text-caption font-medium">1</span>
            </div>
            <div>
              <p className="text-body font-medium">Photo your ID</p>
              <p className="text-caption">Aadhaar, PAN, Passport, or Driver's License</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center flex-shrink-0">
              <span className="text-caption font-medium">2</span>
            </div>
            <div>
              <p className="text-body font-medium">Take a selfie</p>
              <p className="text-caption">We'll match your face to your ID photo</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center flex-shrink-0">
              <span className="text-caption font-medium">3</span>
            </div>
            <div>
              <p className="text-body font-medium">We verify</p>
              <p className="text-caption">Your ID is checked securely. We never store your document.</p>
            </div>
          </div>
        </div>

        {/* Privacy note */}
        <div className="card bg-[var(--color-success-light)] border-[var(--color-success)]/20 mb-6">
          <p className="text-caption text-[var(--color-success)]">
            🔒 Your ID document is processed securely and never stored on our servers. Only a verification reference is kept.
          </p>
        </div>

        {/* CTA */}
        <div className="pb-8 space-y-3">
          <button onClick={onAccept} className="btn btn-primary">
            I Agree — Start Verification
          </button>
          <button onClick={onBack} className="btn btn-ghost">
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
