interface VerificationResultScreenProps {
  onContinue: () => void;
  onRetry: () => void;
}

export function VerificationResultScreen({ onContinue, onRetry }: VerificationResultScreenProps) {
  return (
    <div className="min-h-dvh bg-[var(--color-bg)] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-[var(--color-success-light)] flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>

        <h1 className="text-screen-title mb-3">You're verified</h1>
        <p className="text-body-secondary mb-8">
          Your identity has been confirmed. You can now create your profile and start matching.
        </p>

        {/* Verified badge */}
        <div className="badge badge-success mx-auto mb-8" style={{ height: 32, padding: '0 12px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span style={{ fontSize: 14 }}>Identity Verified</span>
        </div>

        <button onClick={onContinue} className="btn btn-primary mb-3">
          Create Your Profile
        </button>
        <button onClick={onRetry} className="btn btn-ghost">
          Retake Verification
        </button>
      </div>
    </div>
  );
}
