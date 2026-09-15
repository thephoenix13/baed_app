import { useState } from 'react';
import { fontDisplay } from '@/lib/fonts';

interface ProfileBioScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export function ProfileBioScreen({ onComplete, onBack }: ProfileBioScreenProps) {
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [intent, setIntent] = useState('');

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
          About you
        </h1>
        <p className="text-lead mb-8">
          Help others get to know you.
        </p>

        <div className="space-y-5">
          <div>
            <label htmlFor="bio" className="text-label text-muted mb-1 block">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a few lines about yourself..."
              className="input min-h-[120px] resize-none"
              maxLength={500}
            />
            <p className="text-body text-muted text-xs mt-1 text-right">{bio.length}/500</p>
          </div>

          <div>
            <label htmlFor="occupation" className="text-label text-muted mb-1 block">
              Occupation
            </label>
            <input
              id="occupation"
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="What do you do?"
              className="input"
            />
          </div>

          <div>
            <label className="text-label text-muted mb-2 block">Looking for</label>
            <div className="flex flex-wrap gap-2">
              {['Long-term', 'Short-term', 'Marriage', 'Friendship', 'Unsure'].map((i) => (
                <button
                  key={i}
                  onClick={() => setIntent(i)}
                  className={`pill ${intent === i ? 'pill-active' : ''}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button onClick={onComplete} className="btn btn-primary w-full">
          Continue
        </button>
      </div>
    </div>
  );
}
