import { useState, useEffect } from 'react';
import { getDiscoveryFeed, resetSeenProfiles } from '@/modules/discovery/services/discovery.service';
import { likeProfile, passProfile } from '@/modules/matching/services/matching.service';
import type { CandidateProfile } from '@/modules/discovery/types/discovery.types';
import type { Match } from '@/modules/matching/types/matching.types';

interface DiscoverFeedScreenProps {
  onViewProfile: (profileId: string) => void;
  onOpenFilters: () => void;
  onMatch: (match: Match) => void;
  userId: string;
}

export function DiscoverFeedScreen({
  onViewProfile,
  onOpenFilters,
  onMatch,
  userId,
}: DiscoverFeedScreenProps) {
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const feed = getDiscoveryFeed(userId);
    setProfiles(feed.profiles);
    setCurrentIndex(0);
  };

  const handleLike = () => {
    if (currentIndex >= profiles.length) return;
    const profile = profiles[currentIndex];
    setSwipeDirection('right');
    setTimeout(() => {
      const result = likeProfile(userId, profile.userId);
      if (result.isMatch && result.match) onMatch(result.match);
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 250);
  };

  const handlePass = () => {
    if (currentIndex >= profiles.length) return;
    const profile = profiles[currentIndex];
    setSwipeDirection('left');
    setTimeout(() => {
      passProfile(userId, profile.userId);
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 250);
  };

  const handleReset = () => {
    resetSeenProfiles();
    loadProfiles();
  };

  const currentProfile = profiles[currentIndex];
  const hasMore = currentIndex < profiles.length;

  return (
    <div className="page" style={{ paddingBottom: 88 }}>
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <h1 className="text-screen-title">Discover</h1>
        <button onClick={onOpenFilters} className="btn-icon" aria-label="Filters">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </button>
      </div>

      {/* Card */}
      <div className="px-6">
        {hasMore && currentProfile ? (
          <div
            className={`profile-card transition-all duration-250 ${
              swipeDirection === 'left'
                ? '-translate-x-[120%] -rotate-12 opacity-0'
                : swipeDirection === 'right'
                ? 'translate-x-[120%] rotate-12 opacity-0'
                : ''
            }`}
          >
            {/* Photo placeholder */}
            <div className="absolute inset-0 bg-[var(--color-bg-chip)] flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            {/* Info overlay */}
            <div className="profile-card-info">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[22px] font-semibold">{currentProfile.displayName}</span>
                <span className="text-[22px] font-light">{currentProfile.age}</span>
                {currentProfile.isVerified && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.9">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </div>
              <p className="text-[15px] text-white/80">{currentProfile.occupation}</p>
              <p className="text-[13px] text-white/60 mt-0.5">{currentProfile.city} · {currentProfile.distance} km</p>
            </div>
          </div>
        ) : (
          <div className="empty-state" style={{ minHeight: '60vh' }}>
            <div className="empty-state-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <p className="text-section-title mb-2">No more profiles</p>
            <p className="text-body-secondary mb-6">Check back later or adjust your filters</p>
            <button onClick={handleReset} className="btn btn-secondary" style={{ width: 'auto', padding: '0 24px' }}>
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      {hasMore && (
        <div className="flex items-center justify-center gap-5 mt-6">
          <button
            onClick={handlePass}
            className="w-14 h-14 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-card)] flex items-center justify-center"
            aria-label="Pass"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button
            onClick={handleLike}
            className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center"
            aria-label="Like"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
