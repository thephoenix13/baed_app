import { useState } from 'react';

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
    <div className="page flex flex-col">
      <div className="page-header flex items-center">
        <button onClick={onBack} className="btn-icon -ml-3" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="page-content flex-1">
        <h1 className="text-screen-title mb-2">Let's build your profile</h1>
        <p className="text-body-secondary mb-8">Tell us a bit about yourself.</p>

        <div className="space-y-6">
          {/* Name */}
          <div className="field">
            <label className="field-label">First Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your first name"
              className="input"
            />
          </div>

          {/* Age */}
          <div className="field">
            <label className="field-label">Age</label>
            <input
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
          <div className="field">
            <label className="field-label">Gender</label>
            <div className="flex flex-wrap gap-2">
              {['Man', 'Woman', 'Non-binary', 'Other'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`chip ${gender === g ? 'chip-selected' : ''}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div className="field">
            <label className="field-label">City</label>
            <div className="flex flex-wrap gap-2">
              {['Mumbai', 'Pune', 'Bengaluru', 'Delhi', 'Other'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`chip ${city === c ? 'chip-selected' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="page-content pb-8 pt-6">
        <button
          onClick={onComplete}
          disabled={!isValid}
          className={`btn btn-primary ${!isValid ? 'btn-disabled' : ''}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
