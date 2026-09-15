/**
 * Install Prompt Component
 *
 * Shows a prompt to install the PWA when available.
 * Handles both native install prompt (Android/Chrome) and iOS instructions.
 */

import { useState, useEffect } from 'react';
import { canInstall, showInstallPrompt, isInstalled, isIOSSafari } from '@/lib/pwa';

export function InstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isInstalled()) return;

    // Check if install is available (Android/Chrome)
    if (canInstall()) {
      setIsVisible(true);
      return;
    }

    // Show iOS instructions after a delay
    if (isIOSSafari()) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setShowIOSInstructions(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = async () => {
    if (showIOSInstructions) {
      // iOS doesn't support native install prompt
      // Instructions are already shown
      return;
    }

    const installed = await showInstallPrompt();
    if (installed) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in localStorage to not show again for 7 days
    localStorage.setItem('install-prompt-dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <div className="card-elevated bg-white">
        {showIOSInstructions ? (
          // iOS Instructions
          <div>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-pink-pale rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-pink"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-h3 text-ink mb-1">Add to Home Screen</h3>
                <p className="text-body text-muted">
                  Install Bae'd for the best experience
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-plum text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <p className="text-body text-ink pt-0.5">
                  Tap the <strong>Share</strong> button{' '}
                  <span className="inline-block w-5 h-5 bg-muted rounded" aria-label="Share icon" />
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-plum text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <p className="text-body text-ink pt-0.5">
                  Scroll down and tap <strong>"Add to Home Screen"</strong>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-plum text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <p className="text-body text-ink pt-0.5">
                  Tap <strong>"Add"</strong> to confirm
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="btn btn-ghost w-full"
            >
              Maybe Later
            </button>
          </div>
        ) : (
          // Native Install Prompt (Android/Chrome)
          <div>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-pink-pale rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-pink"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-h3 text-ink mb-1">Install Bae'd</h3>
                <p className="text-body text-muted">
                  Add to your home screen for quick access
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="btn btn-ghost flex-1"
              >
                Not Now
              </button>
              <button
                onClick={handleInstall}
                className="btn btn-primary flex-1"
              >
                Install
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
