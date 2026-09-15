import { useEffect, useState } from 'react';

interface VerificationResultScreenProps {
  onContinue: () => void;
  onRetry: () => void;
}

export function VerificationResultScreen({ onContinue, onRetry }: VerificationResultScreenProps) {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowCheck(true), 100);
  }, []);

  return (
    <div className="min-h-dvh bg-[var(--color-bg)] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        {/* Minimal success check icon with animation */}
        <div
          className={`mb-8 transition-all duration-500 ease-out ${
            showCheck ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="mx-auto">
            <circle cx="12" cy="12" r="10" stroke="var(--color-success)" strokeWidth="1.5" />
            <path
              d="M8 12l2.5 2.5L16 9"
              stroke="var(--color-success)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-all duration-700 delay-300 ${
                showCheck ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </svg>
        </div>

        <h1 className="text-screen-title mb-3">You're verified</h1>
        <p className="text-body-secondary mb-12">
          You're ready to create your profile and start meeting people.
        </p>

        {/* Small verified badge preview */}
        <div className="inline-flex items-center gap-2 mb-12">
          <div className="badge badge-success">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span style={{ fontSize: 12 }}>Verified</span>
          </div>
        </div>

        <button onClick={onContinue} className="btn btn-primary mb-3">
          Create my profile
        </button>
        <button onClick={onRetry} className="btn btn-ghost">
          Verify again
        </button>
      </div>
    </div>
  );
}
