import { useState } from 'react';
import { fontDisplay } from '@/lib/fonts';

interface ProfilePhotosScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export function ProfilePhotosScreen({ onComplete, onBack }: ProfilePhotosScreenProps) {
  const [photos, setPhotos] = useState<string[]>([]);

  const addPhoto = () => {
    if (photos.length < 6) {
      setPhotos([...photos, `photo-${photos.length + 1}`]);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="px-6 pt-12 pb-4">
        <button onClick={onBack} className="btn btn-ghost !px-3 !py-2" aria-label="Go back">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-6">
        <h1 className="text-h2 text-plum mb-2" style={fontDisplay.style}>
          Add your photos
        </h1>
        <p className="text-lead mb-8">
          Add at least 1 photo. You can add up to 6.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {photos.map((photo, i) => (
            <div key={i} className="aspect-square bg-pink-pale rounded-xl flex items-center justify-center relative">
              <svg className="w-8 h-8 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {i === 0 && (
                <span className="absolute top-2 left-2 pill !text-xs !px-2 !py-0.5">Primary</span>
              )}
            </div>
          ))}

          {photos.length < 6 && (
            <button
              onClick={addPhoto}
              className="aspect-square bg-white border-2 border-dashed border-line rounded-xl flex flex-col items-center justify-center gap-1 hover:border-pink transition-colors"
            >
              <svg className="w-6 h-6 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-xs text-muted">Add</span>
            </button>
          )}
        </div>

        <div className="bg-pink-pale rounded-xl p-4 mb-6">
          <p className="text-body text-plum text-sm">
            📸 Photos are reviewed to ensure they meet our community guidelines.
          </p>
        </div>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={onComplete}
          disabled={photos.length === 0}
          className={`btn btn-primary w-full ${photos.length === 0 ? 'btn-disabled' : ''}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
