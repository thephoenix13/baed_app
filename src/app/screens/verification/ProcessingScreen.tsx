import { useEffect, useState } from 'react';

interface ProcessingScreenProps {
  onComplete: (success: boolean) => void;
}

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    'Checking your ID…',
    'Matching your selfie…',
    'Almost done…',
    'Finalizing…',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          setTimeout(() => onComplete(true), 800);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    setStep(Math.min(Math.floor(progress / 25), steps.length - 1));
  }, [progress]);

  return (
    <div className="min-h-dvh bg-[var(--color-bg)] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        {/* Minimal animated verification indicator */}
        <div className="mb-12">
          {isComplete ? (
            <div className="animate-fade-in">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto">
                <circle cx="12" cy="12" r="10" stroke="var(--color-success)" strokeWidth="1.5" />
                <path d="M8 12l2.5 2.5L16 9" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : (
            <div className="animate-pulse-soft">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto">
                <circle cx="12" cy="12" r="10" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-section-title mb-3">
          {isComplete ? 'Verification complete' : 'Verifying your identity'}
        </h2>

        {/* Supporting text */}
        <p className="text-body-secondary mb-8">
          {isComplete ? 'You can now continue.' : steps[step]}
        </p>

        {/* Thin elegant progress indicator */}
        {!isComplete && (
          <div className="w-full bg-[var(--color-bg-chip)] rounded-full h-0.5 mb-4">
            <div
              className="bg-[var(--color-accent)] h-0.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Reassurance */}
        {!isComplete && (
          <p className="text-small text-[var(--color-text-tertiary)]">
            This usually takes less than a minute
          </p>
        )}
      </div>
    </div>
  );
}
