import { useState } from 'react';

interface SelfieScreenProps {
  onCapture: () => void;
  onBack: () => void;
}

export function SelfieScreen({ onCapture, onBack }: SelfieScreenProps) {
  const [captured, setCaptured] = useState(false);

  return (
    <div className="page flex flex-col">
      {/* Header with back button and progress */}
      <div className="page-header flex items-center justify-between">
        <button onClick={onBack} className="btn-icon -ml-3" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
        </div>
      </div>

      <div className="page-content flex-1 flex flex-col">
        {/* Title section */}
        <div className="mb-8">
          <h1 className="text-screen-title mb-2">Now, take a selfie</h1>
          <p className="text-body-secondary">We'll use it to verify that your ID belongs to you.</p>
        </div>

        {/* Camera preview area with face guide */}
        <div className="flex-1 flex items-center justify-center mb-6 min-h-[400px]">
          {captured ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-success-light)] flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <p className="text-body font-medium">Selfie Captured</p>
            </div>
          ) : (
            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
              {/* Large circular face guide */}
              <div className="absolute inset-0 rounded-full border-2 border-[var(--color-text-tertiary)] opacity-40"></div>
              
              {/* Subtle face outline */}
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="opacity-30">
                <ellipse cx="60" cy="50" rx="35" ry="40" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeDasharray="4 4"/>
                <circle cx="48" cy="45" r="3" fill="var(--color-text-tertiary)"/>
                <circle cx="72" cy="45" r="3" fill="var(--color-text-tertiary)"/>
                <path d="M 45 65 Q 60 72 75 65" stroke="var(--color-text-tertiary)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"/>
              </svg>
              
              {/* Minimal instruction */}
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-caption text-[var(--color-text-tertiary)]">Look directly at the camera</p>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        {!captured && (
          <div className="mb-6">
            <button
              onClick={() => setCaptured(true)}
              className="btn btn-primary"
            >
              Open camera
            </button>
          </div>
        )}

        {/* Reassurance */}
        <p className="text-small text-center mb-6">
          Your selfie is used only for verification.
        </p>

        {/* Continue button */}
        {captured && (
          <div className="pb-8">
            <button
              onClick={onCapture}
              className="btn btn-primary"
            >
              Submit for Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
