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
  const [dragOffset, setDragOffset] = useState(0);

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
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-14 pb-4">
        {/* Brand wordmark */}
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 9 9.5 11 12 11C14.5 11 16.5 9 16.5 6.5C16.5 4 14.5 2 12 2Z"
              fill="var(--color-accent)"
              opacity="0.2"
            />
            <path
              d="M12 20L12 11"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-body font-medium">Bae'd</span>
        </div>

        {/* Filter button */}
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

      {/* Main content area */}
      <div className="flex-1 flex flex-col px-4 pb-4">
        {hasMore && currentProfile ? (
          <>
            {/* Profile card - 80% of screen */}
            <div className="flex-1 flex items-center justify-center mb-4">
              <div
                className={`relative w-full aspect-[3/4] max-h-[calc(100vh-280px)] rounded-[24px] overflow-hidden shadow-[var(--shadow-lg)] transition-transform duration-300 ease-out ${
                  swipeDirection === 'left'
                    ? '-translate-x-[150%] -rotate-[20deg] opacity-0'
                    : swipeDirection === 'right'
                    ? 'translate-x-[150%] rotate-[20deg] opacity-0'
                    : ''
                }`}
                style={{
                  transform: swipeDirection ? undefined : `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
                }}
              >
                {/* Beautiful gradient placeholder (not grey person icon) */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B4B8] via-[#D4A5A5] to-[#C99A9D]"></div>
                
                {/* Subtle texture overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* LIKE/PASS feedback */}
                {dragOffset > 50 && (
                  <div className="absolute top-8 left-8 px-4 py-2 bg-[var(--color-success)] text-white rounded-lg font-semibold text-lg rotate-[-20deg] border-2 border-white">
                    LIKE
                  </div>
                )}
                {dragOffset < -50 && (
                  <div className="absolute top-8 right-8 px-4 py-2 bg-[var(--color-error)] text-white rounded-lg font-semibold text-lg rotate-[20deg] border-2 border-white">
                    PASS
                  </div>
                )}

                {/* Profile info overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  {/* Name, age, verified */}
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-[32px] font-semibold">{currentProfile.displayName}</h2>
                    <span className="text-[32px] font-light">{currentProfile.age}</span>
                    {currentProfile.isVerified && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M9 12l2 2 4-4" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Occupation and location */}
                  <div className="mb-3">
                    <p className="text-[15px] text-white/90 mb-1">{currentProfile.occupation}</p>
                    <p className="text-[13px] text-white/70">{currentProfile.city} · {currentProfile.distance} km away</p>
                  </div>

                  {/* Short bio */}
                  <p className="text-[14px] text-white/80 mb-3 line-clamp-2">
                    {currentProfile.bio || "Designing things by day. Looking for someone to explore the city with."}
                  </p>

                  {/* Interest tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {currentProfile.interests.slice(0, 3).map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons - floating */}
            <div className="flex items-center justify-center gap-6 py-4">
              {/* Pass button */}
              <button
                onClick={handlePass}
                className="w-16 h-16 rounded-full bg-white border-2 border-[var(--color-error)] flex items-center justify-center shadow-[var(--shadow-md)] hover:scale-110 transition-transform active:scale-95"
                aria-label="Pass"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Like button */}
              <button
                onClick={handleLike}
                className="w-20 h-20 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-[var(--shadow-lg)] hover:scale-110 transition-transform active:scale-95"
                aria-label="Like"
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <h2 className="text-section-title mb-2 text-center">No more profiles</h2>
            <p className="text-body-secondary mb-8 text-center">Check back later or adjust your filters</p>
            <button onClick={handleReset} className="btn btn-primary" style={{ width: 'auto', padding: '0 32px' }}>
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
