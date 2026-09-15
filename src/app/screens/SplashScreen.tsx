import { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-dvh bg-[var(--color-bg)] flex flex-col items-center justify-center">
      {/* Logo mark */}
      <div className="mb-6">
        <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
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

      {/* Brand name */}
      <h1 className="text-screen-title mb-2" style={{ letterSpacing: '-0.03em' }}>
        Bae'd
      </h1>

      {/* Tagline */}
      <p className="text-body-secondary">Dating, without the doubt.</p>

      {/* Loading indicator */}
      <div className="mt-12">
        <div className="spinner" />
      </div>
    </div>
  );
}
