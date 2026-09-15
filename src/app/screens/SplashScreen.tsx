/**
 * Splash Screen
 *
 * Initial loading screen with brand mark.
 * Auto-redirects after 2 seconds.
 */

import { useEffect } from 'react';
import { fontDisplay } from '@/lib/fonts';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      {/* Brand Mark */}
      <div className="animate-fade-in">
        <h1
          className="text-hero text-plum text-center font-display"
        >
          Bae'd
        </h1>
        <p className="text-lead text-stone text-center mt-4">
          Dating, without the doubt.
        </p>
      </div>

      {/* Loading Indicator */}
      <div className="mt-12">
        <div className="spinner" style={{ borderTopColor: 'var(--color-rose)', borderColor: 'var(--color-rose-pale)' }}></div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-small text-stone">
          Mumbai · Pune · Bengaluru
        </p>
      </div>
    </div>
  );
}
