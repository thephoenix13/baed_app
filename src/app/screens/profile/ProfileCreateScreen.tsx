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
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const cities = ['Mumbai', 'Pune', 'Bengaluru', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata', 'Other'];
  const filteredCities = cities.filter(c => 
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const isValid = name.length >= 2 && age && gender && city;

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
          <h2 className="text-body font-medium">Your profile</h2>
        </div>
        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
        </div>
      </div>

      <div className="page-content flex-1">
        {/* Title section */}
        <div className="mb-12">
          <h1 className="text-screen-title mb-2">Let's get to know you</h1>
          <p className="text-body-secondary">Just the basics to start.</p>
        </div>

        {/* Form fields as clean sections */}
        <div className="space-y-8">
          {/* First Name */}
          <div>
            <label className="text-section-label mb-3 block">First Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name"
              className="input"
            />
          </div>

          {/* Age */}
          <div>
            <label className="text-section-label mb-3 block">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age"
              min="18"
              max="99"
              className="input"
              style={{ 
                MozAppearance: 'textfield',
                WebkitAppearance: 'none'
              }}
            />
            <style>{`
              input[type="number"]::-webkit-inner-spin-button,
              input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }
            `}</style>
          </div>

          {/* Gender */}
          <div>
            <label className="text-section-label mb-3 block">Gender</label>
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

          {/* City - Searchable */}
          <div>
            <label className="text-section-label mb-3 block">City</label>
            <div className="relative">
              <input
                type="text"
                value={city || citySearch}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  setCity('');
                  setShowCityDropdown(true);
                }}
                onFocus={() => setShowCityDropdown(true)}
                placeholder="Search your city"
                className="input"
              />
              {showCityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] max-h-48 overflow-y-auto z-10">
                  {filteredCities.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCity(c);
                        setCitySearch('');
                        setShowCityDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[var(--color-bg-chip)] transition-colors text-body"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
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
