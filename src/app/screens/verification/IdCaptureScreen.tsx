import { useState } from 'react';

interface IdCaptureScreenProps {
  onCapture: () => void;
  onBack: () => void;
}

export function IdCaptureScreen({ onCapture, onBack }: IdCaptureScreenProps) {
  const [captured, setCaptured] = useState(false);

  return (
    <div className="page flex flex-col">
      <div className="page-header flex items-center">
        <button onClick={onBack} className="btn-icon -ml-3" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="page-content flex-1 flex flex-col">
        <h1 className="text-screen-title mb-2">Capture your ID</h1>
        <p className="text-body-secondary mb-6">Take a clear photo of your government-issued ID.</p>

        {/* Capture area */}
        <div className="flex-1 bg-[var(--color-bg-chip)] rounded-[var(--radius-xl)] flex items-center justify-center mb-6 min-h-[240px]">
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
            <div className="text-center px-6">
              <div className="w-12 h-12 rounded-full bg-[var(--color-bg-card)] flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p className="text-body-secondary mb-4">Position your ID within the frame</p>
              <button onClick={() => setCaptured(true)} className="btn btn-secondary" style={{ width: 'auto', padding: '0 20px', height: 40 }}>
                Open Camera
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="card bg-[var(--color-bg-chip)] border-none mb-6">
          <p className="text-section-label mb-2">Tips</p>
          <ul className="text-caption space-y-1">
            <li>• Ensure all text is clearly readable</li>
            <li>• Avoid glare and shadows</li>
            <li>• Place on a flat, dark surface</li>
          </ul>
        </div>

        <div className="pb-8">
          <button
            onClick={onCapture}
            disabled={!captured}
            className={`btn btn-primary ${!captured ? 'btn-disabled' : ''}`}
          >
            Continue to Selfie
          </button>
        </div>
      </div>
    </div>
  );
}
