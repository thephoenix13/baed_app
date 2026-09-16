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
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-icon -ml-3" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-body font-medium">Your photos</h2>
        </div>
        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
        </div>
      </div>

      <div className="page-content flex-1">
        {/* Title section */}
        <div className="mb-8">
          <h1 className="text-screen-title mb-2">Show a little more of you</h1>
          <p className="text-body-secondary">Add at least 2 photos. You can add up to 6.</p>
        </div>

        {/* Photo grid */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-3">
            {/* Main photo - large 2-column tile */}
            <div className="col-span-2 aspect-[2/1] bg-[var(--color-bg-chip)] rounded-[var(--radius-lg)] flex items-center justify-center relative overflow-hidden">
              {photos.length > 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              ) : (
                <button
                  onClick={addPhoto}
                  className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-[var(--color-bg)] transition-colors"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="text-caption">Add main photo</span>
                </button>
              )}
              {photos.length > 0 && (
                <div className="absolute top-3 left-3 badge badge-success" style={{ fontSize: 10, height: 20, padding: '0 6px' }}>
                  Main
                </div>
              )}
            </div>

            {/* Remaining 5 slots - smaller square tiles */}
            {[1, 2, 3, 4, 5].map((slot) => {
              const hasPhoto = photos.length >= slot + 1;
              const canAdd = photos.length < 6;
              
              return (
                <div
                  key={slot}
                  className="aspect-square bg-[var(--color-bg-chip)] rounded-[var(--radius-md)] flex items-center justify-center relative overflow-hidden"
                >
                  {hasPhoto ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  ) : canAdd ? (
                    <button
                      onClick={addPhoto}
                      className="w-full h-full flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  ) : (
                    <div className="w-full h-full bg-[var(--color-bg)] opacity-50"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Helper text */}
        <div className="mb-8">
          <p className="text-body-secondary mb-3">
            Your photos help people get a feel for you.
          </p>
          <p className="text-small text-[var(--color-text-tertiary)]">
            Photos are reviewed to ensure they meet our community guidelines.
          </p>
        </div>
      </div>

      <div className="page-content pb-8">
        <button
          onClick={onComplete}
          disabled={photos.length < 2}
          className={`btn btn-primary ${photos.length < 2 ? 'btn-disabled' : ''}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
