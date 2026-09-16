import { useState } from 'react';

interface ProfileInterestsScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const INTERESTS = [
  'Coffee', 'Travel', 'Music', 'Fitness', 'Reading', 'Cooking',
  'Movies', 'Art', 'Photography', 'Dancing', 'Yoga', 'Gaming',
  'Hiking', 'Foodie', 'Dogs', 'Cats', 'Beach', 'Mountains',
  'Nightlife', 'Concerts', 'Theatre', 'Sports', 'Meditation', 'Wine',
];

export function ProfileInterestsScreen({ onComplete, onBack }: ProfileInterestsScreenProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
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
        <h1 className="text-screen-title mb-2">Your interests</h1>
        <p className="text-body-secondary mb-2">Pick at least 3. We'll use these to find your matches.</p>
        <p className="text-caption mb-6">{selected.length} selected</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              onClick={() => toggle(interest)}
              className={`chip ${selected.includes(interest) ? 'chip-selected' : ''}`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div className="page-content pb-8">
        <button
          onClick={onComplete}
          disabled={selected.length < 3}
          className={`btn btn-primary ${selected.length < 3 ? 'btn-disabled' : ''}`}
        >
          {selected.length < 3 ? `Pick ${3 - selected.length} more` : 'Preview Profile'}
        </button>
      </div>
    </div>
  );
}
