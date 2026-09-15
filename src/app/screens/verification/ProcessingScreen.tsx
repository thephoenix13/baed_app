import { useEffect, useState } from 'react';
import { fontDisplay } from '@/lib/fonts';

interface ProcessingScreenProps {
  onComplete: (success: boolean) => void;
}

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  const steps = [
    'Checking document...',
    'Matching your face...',
    'Running security checks...',
    'Finalizing...',
  ];

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
    const stepIndex = Math.min(Math.floor(progress / 25), steps.length - 1);
    setStep(stepIndex);
  }, [progress]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-rose/20"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-rose border-t-transparent animate-spin"
            style={{ animationDuration: '1.5s' }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        </div>

        <h2 className="text-h3 text-plum mb-3 font-display">
          Verifying your identity
        </h2>

        <p className="text-body text-stone mb-8">
          {steps[step]}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-sand rounded-full h-2 mb-4">
          <div
            className="bg-rose h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-small text-stone">
          This usually takes less than a minute
        </p>
      </div>
    </div>
  );
}
