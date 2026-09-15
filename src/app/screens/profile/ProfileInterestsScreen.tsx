import { useState } from 'react';
import { fontDisplay } from '@/lib/fonts';

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
          Your interests
        </h1>
        <p className="text-lead mb-6">
          Pick at least 3. We'll use these to find your matches.
        </p>

        <p className="text-body text-muted text-sm mb-4">
          {selected.length} selected
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              onClick={() => toggle(interest)}
              className={`pill ${selected.includes(interest) ? 'pill-active' : ''}`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={onComplete}
          disabled={selected.length < 3}
          className={`btn btn-primary w-full ${selected.length < 3 ? 'btn-disabled' : ''}`}
        >
          {selected.length < 3 ? `Pick ${3 - selected.length} more` : 'Preview Profile'}
        </button>
      </div>
    </div>
  );
}
