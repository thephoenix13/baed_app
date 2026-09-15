import { useState } from 'react';
import { fontDisplay } from '@/lib/fonts';

interface IdCaptureScreenProps {
  onCapture: () => void;
  onBack: () => void;
}

export function IdCaptureScreen({ onCapture, onBack }: IdCaptureScreenProps) {
  const [captured, setCaptured] = useState(false);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="px-6 pt-12 pb-4">
        <button onClick={onBack} className="btn btn-ghost !px-3 !py-2" aria-label="Go back">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-6 flex flex-col">
        <h1 className="text-h2 text-plum mb-3" style={fontDisplay.style}>
          Capture your ID
        </h1>
        <p className="text-lead mb-8">
          Take a clear photo of your government-issued ID.
        </p>

        {/* Camera Preview Area */}
        <div className="flex-1 bg-plum/5 rounded-2xl border-2 border-dashed border-plum/20 flex items-center justify-center mb-6 min-h-[300px]">
          {captured ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-verified-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-verified-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <p className="text-body font-semibold text-ink">ID Captured!</p>
              <p className="text-body text-muted text-sm mt-1">Looking good</p>
            </div>
          ) : (
            <div className="text-center px-6">
              <div className="w-16 h-16 bg-pink-pale rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p className="text-body text-muted mb-4">
                Position your ID within the frame
              </p>
              <button
                onClick={() => setCaptured(true)}
                className="btn btn-primary"
              >
                Open Camera
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-pink-pale rounded-xl p-4 mb-6">
          <p className="text-label text-plum mb-2">Tips for a good photo</p>
          <ul className="text-body text-plum text-sm space-y-1">
            <li>• Ensure all text is clearly readable</li>
            <li>• Avoid glare and shadows</li>
            <li>• Place on a flat, dark surface</li>
          </ul>
        </div>

        <div className="pb-8">
          <button
            onClick={onCapture}
            disabled={!captured}
            className={`btn btn-primary w-full ${!captured ? 'btn-disabled' : ''}`}
          >
            Continue to Selfie
          </button>
        </div>
      </div>
    </div>
  );
}
