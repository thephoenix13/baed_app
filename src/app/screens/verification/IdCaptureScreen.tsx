import { useState } from 'react';

interface IdCaptureScreenProps {
  onCapture: () => void;
  onBack: () => void;
}

export function IdCaptureScreen({ onCapture, onBack }: IdCaptureScreenProps) {
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
          <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
        </div>
      </div>

      <div className="page-content flex-1 flex flex-col">
        {/* Title section */}
        <div className="mb-8">
          <h1 className="text-screen-title mb-2">Take a photo of your ID</h1>
          <p className="text-body-secondary">Make sure all four corners are visible.</p>
        </div>

        {/* Camera preview area with ID card outline */}
        <div className="flex-1 flex items-center justify-center mb-8 min-h-[320px]">
          {captured ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-success-light)] flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <p className="text-body font-medium">ID Captured</p>
            </div>
          ) : (
            <div className="relative w-full max-w-[320px] aspect-[1.6/1]">
              {/* Corner guides */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--color-text-tertiary)] rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--color-text-tertiary)] rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--color-text-tertiary)] rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--color-text-tertiary)] rounded-br-lg"></div>
              
              {/* Subtle center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-caption text-[var(--color-text-tertiary)]">Position ID here</p>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        {!captured && (
          <div className="mb-8">
            <button
              onClick={() => setCaptured(true)}
              className="btn btn-primary"
            >
              Open camera
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="mb-8">
          <p className="text-section-label mb-3">Tips</p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-caption text-[var(--color-text-tertiary)]">•</span>
              <p className="text-caption">Use good lighting</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-caption text-[var(--color-text-tertiary)]">•</span>
              <p className="text-caption">Avoid glare</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-caption text-[var(--color-text-tertiary)]">•</span>
              <p className="text-caption">Keep the ID flat</p>
            </div>
          </div>
        </div>

        {/* Continue button */}
        {captured && (
          <div className="pb-8">
            <button
              onClick={onCapture}
              className="btn btn-primary"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
