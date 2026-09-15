import { useState } from 'react';

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
    <div className="page flex flex-col">
      <div className="page-header flex items-center">
        <button onClick={onBack} className="btn-icon -ml-3" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="page-content flex-1">
        <h1 className="text-screen-title mb-2">Add your photos</h1>
        <p className="text-body-secondary mb-6">Add at least 1 photo. You can add up to 6.</p>

        {/* Photo grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {photos.map((photo, i) => (
            <div key={i} className="aspect-square bg-[var(--color-bg-chip)] rounded-[var(--radius-md)] flex items-center justify-center relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {i === 0 && (
                <span className="absolute top-2 left-2 badge badge-success" style={{ fontSize: 10, height: 20, padding: '0 6px' }}>
                  Primary
                </span>
              )}
            </div>
          ))}

          {photos.length < 6 && (
            <button
              onClick={addPhoto}
              className="aspect-square bg-[var(--color-bg-card)] border-2 border-dashed border-[var(--color-border-strong)] rounded-[var(--radius-md)] flex flex-col items-center justify-center gap-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-small">Add</span>
            </button>
          )}
        </div>

        {/* Info */}
        <div className="card bg-[var(--color-bg-chip)] border-none mb-6">
          <p className="text-caption">
            📸 Photos are reviewed to ensure they meet our community guidelines.
          </p>
        </div>
      </div>

      <div className="page-content pb-8">
        <button
          onClick={onComplete}
          disabled={photos.length === 0}
          className={`btn btn-primary ${photos.length === 0 ? 'btn-disabled' : ''}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
