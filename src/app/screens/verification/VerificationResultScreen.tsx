import { fontDisplay } from '@/lib/fonts';

interface VerificationResultScreenProps {
  onContinue: () => void;
  onRetry: () => void;
}

export function VerificationResultScreen({ onContinue, onRetry }: VerificationResultScreenProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-verified-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-verified-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>

        <h1 className="text-h2 text-plum mb-3" style={fontDisplay.style}>
          You're verified!
        </h1>

        <p className="text-lead mb-8">
          Your identity has been confirmed. You can now create your profile and start matching.
        </p>

        {/* Verified Badge */}
        <div className="verified-badge mx-auto mb-8">
          <svg className="verified-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="verified-badge-text">Identity Verified</span>
        </div>

        <button onClick={onContinue} className="btn btn-primary w-full mb-3">
          Create Your Profile
        </button>

        <button onClick={onRetry} className="btn btn-ghost w-full text-sm">
          Retake Verification
        </button>
      </div>
    </div>
  );
}
