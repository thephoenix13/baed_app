import { useState } from 'react';
import { fontDisplay } from '@/lib/fonts';

interface SelfieScreenProps {
  onCapture: () => void;
  onBack: () => void;
}

export function SelfieScreen({ onCapture, onBack }: SelfieScreenProps) {
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
          Take a selfie
        </h1>
        <p className="text-lead mb-8">
          We'll match your face to your ID photo. Look directly at the camera.
        </p>

        <div className="flex-1 bg-plum/5 rounded-2xl border-2 border-dashed border-plum/20 flex items-center justify-center mb-6 min-h-[300px]">
          {captured ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-verified-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-verified-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <p className="text-body font-semibold text-ink">Selfie Captured!</p>
            </div>
          ) : (
            <div className="text-center px-6">
              <div className="w-24 h-24 border-4 border-pink/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className="text-body text-muted mb-4">
                Position your face in the circle
              </p>
              <button onClick={() => setCaptured(true)} className="btn btn-primary">
                Open Camera
              </button>
            </div>
          )}
        </div>

        <div className="bg-pink-pale rounded-xl p-4 mb-6">
          <ul className="text-body text-plum text-sm space-y-1">
            <li>• Look directly at the camera</li>
            <li>• Remove glasses, hats, or masks</li>
            <li>• Ensure good lighting on your face</li>
          </ul>
        </div>

        <div className="pb-8">
          <button
            onClick={onCapture}
            disabled={!captured}
            className={`btn btn-primary w-full ${!captured ? 'btn-disabled' : ''}`}
          >
            Submit for Verification
          </button>
        </div>
      </div>
    </div>
  );
}
