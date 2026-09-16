import { useState } from 'react';

interface ProfileBioScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export function ProfileBioScreen({ onComplete, onBack }: ProfileBioScreenProps) {
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [intent, setIntent] = useState('');

  const handleSkip = () => {
    onComplete();
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
          <h2 className="text-body font-medium">About you</h2>
        </div>
        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
        </div>
      </div>

      <div className="page-content flex-1">
        {/* Title section */}
        <div className="mb-12">
          <h1 className="text-screen-title mb-2">A little more about you</h1>
          <p className="text-body-secondary">Help people discover what makes you, you.</p>
        </div>

        {/* Form fields - clean sections */}
        <div className="space-y-8">
          {/* Bio */}
          <div>
            <label className="text-section-label mb-3 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Coffee, travel, bad jokes… tell us a little about yourself."
              className="input"
              maxLength={500}
              style={{ minHeight: '120px' }}
            />
            <p className="text-small text-right mt-2 text-[var(--color-text-tertiary)]">
              {bio.length}/500
            </p>
          </div>

          {/* Occupation */}
          <div>
            <label className="text-section-label mb-3 block">Occupation</label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="What do you do?"
              className="input"
            />
          </div>

          {/* Looking for */}
          <div>
            <label className="text-section-label mb-3 block">Looking for</label>
            <div className="flex flex-wrap gap-2">
              {['Long-term', 'Short-term', 'Marriage', 'Friendship', 'Not sure yet'].map((i) => (
                <button
                  key={i}
                  onClick={() => setIntent(i)}
                  className={`chip ${intent === i ? 'chip-selected' : ''}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="page-content pb-8 pt-6 space-y-3">
        <button onClick={onComplete} className="btn btn-primary">
          Continue
        </button>
        <button onClick={handleSkip} className="btn btn-ghost w-full">
          Skip for now
        </button>
      </div>
    </div>
  );
}
