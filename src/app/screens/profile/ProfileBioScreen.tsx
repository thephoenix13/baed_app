import { useState } from 'react';

interface ProfileBioScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export function ProfileBioScreen({ onComplete, onBack }: ProfileBioScreenProps) {
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [intent, setIntent] = useState('');

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
        <h1 className="text-screen-title mb-2">About you</h1>
        <p className="text-body-secondary mb-8">Help others get to know you.</p>

        <div className="space-y-6">
          {/* Bio */}
          <div className="field">
            <label className="field-label">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a few lines about yourself..."
              className="input"
              maxLength={500}
            />
            <p className="text-small text-right">{bio.length}/500</p>
          </div>

          {/* Occupation */}
          <div className="field">
            <label className="field-label">Occupation</label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="What do you do?"
              className="input"
            />
          </div>

          {/* Intent */}
          <div className="field">
            <label className="field-label">Looking for</label>
            <div className="flex flex-wrap gap-2">
              {['Long-term', 'Short-term', 'Marriage', 'Friendship', 'Unsure'].map((i) => (
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

      <div className="page-content pb-8 pt-6">
        <button onClick={onComplete} className="btn btn-primary">
          Continue
        </button>
      </div>
    </div>
  );
}
