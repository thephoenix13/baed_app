import { useState } from 'react';
import { fontDisplay } from '@/lib/fonts';

interface ProfileCreateScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export function ProfileCreateScreen({ onComplete, onBack }: ProfileCreateScreenProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');

  const isValid = name.length >= 2 && age && gender && city;

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
          Let's build your profile
        </h1>
        <p className="text-lead mb-8">
          Tell us a bit about yourself.
        </p>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="text-label text-muted mb-1 block">
              First Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your first name"
              className="input"
            />
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="text-label text-muted mb-1 block">
              Age
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              min="18"
              max="99"
              className="input"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-label text-muted mb-2 block">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {['Man', 'Woman', 'Non-binary', 'Other'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`btn ${gender === g ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="text-label text-muted mb-1 block">
              City
            </label>
            <div className="flex flex-wrap gap-2">
              {['Mumbai', 'Pune', 'Bengaluru', 'Delhi', 'Other'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`pill ${city === c ? 'pill-active' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={onComplete}
          disabled={!isValid}
          className={`btn btn-primary w-full ${!isValid ? 'btn-disabled' : ''}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
