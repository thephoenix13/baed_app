/**
 * Filters Screen
 *
 * Discovery preferences and filters.
 */

import { useState } from 'react';
import { fontDisplay } from '@/lib/fonts';
import { getDefaultFilters } from '@/modules/discovery/services/discovery.service';
import type { DiscoveryFilters } from '@/modules/discovery/types/discovery.types';

interface FiltersScreenProps {
  onApply: (filters: DiscoveryFilters) => void;
  onBack: () => void;
}

export function FiltersScreen({ onApply, onBack }: FiltersScreenProps) {
  const [filters, setFilters] = useState<DiscoveryFilters>(getDefaultFilters());

  const handleAgeChange = (field: 'minAge' | 'maxAge', value: number) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDistanceChange = (value: number) => {
    setFilters((prev) => ({ ...prev, maxDistance: value }));
  };

  const handleGenderToggle = (field: 'interestedInMen' | 'interestedInWomen' | 'interestedInNonBinary') => {
    setFilters((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="btn btn-ghost !px-3 !py-2" aria-label="Go back">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-h3 text-plum" style={fontDisplay.style}>
          Filters
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8">
        {/* Age Range */}
        <div className="card mb-4">
          <h3 className="text-label text-muted mb-3">Age Range</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-body text-muted text-sm mb-1 block">Min</label>
              <input
                type="number"
                value={filters.minAge}
                onChange={(e) => handleAgeChange('minAge', parseInt(e.target.value))}
                min={18}
                max={filters.maxAge}
                className="input"
              />
            </div>
            <span className="text-body text-muted mt-6">to</span>
            <div className="flex-1">
              <label className="text-body text-muted text-sm mb-1 block">Max</label>
              <input
                type="number"
                value={filters.maxAge}
                onChange={(e) => handleAgeChange('maxAge', parseInt(e.target.value))}
                min={filters.minAge}
                max={99}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Distance */}
        <div className="card mb-4">
          <h3 className="text-label text-muted mb-3">Maximum Distance</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              value={filters.maxDistance}
              onChange={(e) => handleDistanceChange(parseInt(e.target.value))}
              min={1}
              max={100}
              className="flex-1"
            />
            <span className="text-body text-ink font-semibold min-w-[60px] text-right">
              {filters.maxDistance} km
            </span>
          </div>
        </div>

        {/* Gender Preferences */}
        <div className="card mb-4">
          <h3 className="text-label text-muted mb-3">Show Me</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleGenderToggle('interestedInMen')}
              className={`btn w-full ${filters.interestedInMen ? 'btn-primary' : 'btn-ghost'}`}
            >
              Men
            </button>
            <button
              onClick={() => handleGenderToggle('interestedInWomen')}
              className={`btn w-full ${filters.interestedInWomen ? 'btn-primary' : 'btn-ghost'}`}
            >
              Women
            </button>
            <button
              onClick={() => handleGenderToggle('interestedInNonBinary')}
              className={`btn w-full ${filters.interestedInNonBinary ? 'btn-primary' : 'btn-ghost'}`}
            >
              Non-binary
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-pink-pale rounded-xl p-4">
          <p className="text-body text-plum text-sm">
            💡 Filters help us show you the most relevant profiles. You can change them anytime.
          </p>
        </div>
      </div>

      {/* Apply Button */}
      <div className="px-6 pb-8">
        <button onClick={handleApply} className="btn btn-primary w-full">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
