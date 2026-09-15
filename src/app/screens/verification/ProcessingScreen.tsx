import { useEffect, useState } from 'react';

interface ProcessingScreenProps {
  onComplete: (success: boolean) => void;
}

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const steps = ['Checking document...', 'Matching your face...', 'Running security checks...', 'Finalizing...'];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete(true);
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
        {/* Spinner */}
        <div className="w-16 h-16 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)] animate-spin mx-auto mb-8" />

        <h2 className="text-section-title mb-2">Verifying your identity</h2>
        <p className="text-body-secondary mb-6">{steps[step]}</p>

        {/* Progress bar */}
        <div className="w-full bg-[var(--color-bg-chip)] rounded-full h-1 mb-3">
          <div
            className="bg-[var(--color-accent)] h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-small">This usually takes less than a minute</p>
      </div>
    </div>
  );
}
