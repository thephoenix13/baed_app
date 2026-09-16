/**
 * Filters Screen
 *
 * Premium, effortless filtering experience.
 */

import { useState } from 'react';
import { getDefaultFilters } from '@/modules/discovery/services/discovery.service';
import type { DiscoveryFilters } from '@/modules/discovery/types/discovery.types';

interface FiltersScreenProps {
  onApply: (filters: DiscoveryFilters) => void;
  onBack: () => void;
}

export function FiltersScreen({ onApply, onBack }: FiltersScreenProps) {
  const [filters, setFilters] = useState<DiscoveryFilters>(getDefaultFilters());
  const [showOptional, setShowOptional] = useState(false);

  const handleAgeChange = (field: 'minAge' | 'maxAge', value: number) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDistanceChange = (value: number) => {
    setFilters((prev) => ({ ...prev, maxDistance: value }));
  };

  const handleGenderToggle = (field: 'interestedInMen' | 'interestedInWomen' | 'interestedInNonBinary') => {
    setFilters((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleReset = () => {
    setFilters(getDefaultFilters());
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-icon" aria-label="Go back">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-h2 text-plum">Filters</h1>
        </div>
        <button onClick={handleReset} className="btn btn-ghost !px-4 !py-2 text-sm">
          Reset
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-32 overflow-y-auto">
        {/* Age Range */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-label text-muted">AGE</h3>
            <span className="text-body text-ink font-medium">
              {filters.minAge} — {filters.maxAge}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-small text-muted mb-2 block">Min age</label>
              <input
                type="range"
                value={filters.minAge}
                onChange={(e) => handleAgeChange('minAge', parseInt(e.target.value))}
                min={18}
                max={filters.maxAge}
                className="w-full h-1 bg-cream rounded-full appearance-none cursor-pointer accent-pink"
              />
            </div>
            <div>
              <label className="text-small text-muted mb-2 block">Max age</label>
              <input
                type="range"
                value={filters.maxAge}
                onChange={(e) => handleAgeChange('maxAge', parseInt(e.target.value))}
                min={filters.minAge}
                max={99}
                className="w-full h-1 bg-cream rounded-full appearance-none cursor-pointer accent-pink"
              />
            </div>
          </div>
        </div>

        {/* Distance */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-label text-muted">DISTANCE</h3>
            <span className="text-body text-ink font-medium">
              Within {filters.maxDistance} km
            </span>
          </div>
          <input
            type="range"
            value={filters.maxDistance}
            onChange={(e) => handleDistanceChange(parseInt(e.target.value))}
            min={1}
            max={100}
            className="w-full h-1 bg-cream rounded-full appearance-none cursor-pointer accent-pink"
          />
        </div>

        {/* Show Me */}
        <div className="mb-8">
          <h3 className="text-label text-muted mb-4">SHOW ME</h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleGenderToggle('interestedInMen')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                filters.interestedInMen
                  ? 'bg-pink-pale border-pink text-plum'
                  : 'bg-white border-cream text-muted'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {filters.interestedInMen && (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                <span className="text-body font-medium">Men</span>
              </div>
            </button>
            <button
              onClick={() => handleGenderToggle('interestedInWomen')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                filters.interestedInWomen
                  ? 'bg-pink-pale border-pink text-plum'
                  : 'bg-white border-cream text-muted'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {filters.interestedInWomen && (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                <span className="text-body font-medium">Women</span>
              </div>
            </button>
            <button
              onClick={() => handleGenderToggle('interestedInNonBinary')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                filters.interestedInNonBinary
                  ? 'bg-pink-pale border-pink text-plum'
                  : 'bg-white border-cream text-muted'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {filters.interestedInNonBinary && (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                <span className="text-body font-medium">Non-binary</span>
              </div>
            </button>
          </div>
        </div>

        {/* Optional Filters */}
        <div className="mb-8">
          <button
            onClick={() => setShowOptional(!showOptional)}
            className="w-full flex items-center justify-between py-3"
          >
            <h3 className="text-label text-muted">OPTIONAL FILTERS</h3>
            <svg
              className={`w-5 h-5 text-muted transition-transform ${showOptional ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showOptional && (
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between py-3 border-b border-cream">
                <span className="text-body text-ink">Interests</span>
                <div className="flex items-center gap-2">
                  <span className="text-small text-muted">Any</span>
                  <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-cream">
                <span className="text-body text-ink">Relationship goals</span>
                <div className="flex items-center gap-2">
                  <span className="text-small text-muted">Any</span>
                  <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-cream">
                <span className="text-body text-ink">Occupation</span>
                <div className="flex items-center gap-2">
                  <span className="text-small text-muted">Any</span>
                  <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-body text-ink">City</span>
                <div className="flex items-center gap-2">
                  <span className="text-small text-muted">Any</span>
                  <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream px-6 py-4 pb-6">
        <button onClick={handleApply} className="btn btn-primary w-full">
          Show 24 people
        </button>
      </div>
    </div>
  );
}
