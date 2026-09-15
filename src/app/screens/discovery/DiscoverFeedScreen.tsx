/**
 * Discover Feed Screen
 *
 * Swipeable card interface for browsing profiles.
 */

import { useState, useEffect } from 'react';
import { fontDisplay } from '@/lib/fonts';
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
      if (result.isMatch && result.match) {
        onMatch(result.match);
      }
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const handlePass = () => {
    if (currentIndex >= profiles.length) return;

    const profile = profiles[currentIndex];
    setSwipeDirection('left');

    setTimeout(() => {
      passProfile(userId, profile.userId);
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const handleReset = () => {
    resetSeenProfiles();
    loadProfiles();
  };

  const currentProfile = profiles[currentIndex];
  const hasMore = currentIndex < profiles.length;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-h3 text-plum" style={fontDisplay.style}>
          Discover
        </h1>
        <button
          onClick={onOpenFilters}
          className="btn btn-ghost !px-3 !py-2"
          aria-label="Open filters"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      </header>

      {/* Card Stack */}
      <div className="flex-1 px-6 py-4 flex items-center justify-center">
        {hasMore && currentProfile ? (
          <div
            className={`card-elevated w-full max-w-sm aspect-[3/4] relative overflow-hidden transition-transform duration-300 ${
              swipeDirection === 'left'
                ? '-translate-x-full -rotate-12 opacity-0'
                : swipeDirection === 'right'
                ? 'translate-x-full rotate-12 opacity-0'
                : ''
            }`}
          >
            {/* Photo */}
            <div className="absolute inset-0 bg-gradient-to-b from-pink-pale to-peach flex items-center justify-center">
              <svg className="w-24 h-24 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-h2" style={fontDisplay.style}>
                  {currentProfile.displayName}, {currentProfile.age}
                </h2>
                {currentProfile.isVerified && (
                  <div className="verified-badge !px-2 !py-1 !bg-white/20 !border-white">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span className="text-xs">Verified</span>
                  </div>
                )}
              </div>

              <p className="text-body text-white/90 mb-2">
                {currentProfile.occupation} · {currentProfile.city}
              </p>

              <p className="text-body text-white/80 text-sm mb-3 line-clamp-2">
                {currentProfile.bio}
              </p>

              {/* Interests */}
              <div className="flex flex-wrap gap-1.5">
                {currentProfile.interests.slice(0, 4).map((interest) => (
                  <span key={interest} className="pill !text-xs !px-2 !py-0.5 !bg-white/20 !text-white">
                    {interest}
                  </span>
                ))}
              </div>

              {/* Compatibility Score */}
              {currentProfile.compatibilityScore && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div
                      className="bg-pink h-2 rounded-full"
                      style={{ width: `${currentProfile.compatibilityScore}%` }}
                    />
                  </div>
                  <span className="text-label text-white">
                    {Math.round(currentProfile.compatibilityScore)}% match
                  </span>
                </div>
              )}
            </div>

            {/* View Profile Button */}
            <button
              onClick={() => onViewProfile(currentProfile.id)}
              className="absolute top-4 right-4 btn btn-ghost !bg-white/20 !border-white !text-white !px-3 !py-2 !text-sm"
            >
              View Profile
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-pink-pale rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <h2 className="text-h3 text-ink mb-2" style={fontDisplay.style}>
              No more profiles
            </h2>
            <p className="text-body text-muted mb-6">
              Check back later or adjust your filters
            </p>
            <button onClick={handleReset} className="btn btn-primary">
              Reset & Start Over
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {hasMore && (
        <div className="px-6 pb-8 flex items-center justify-center gap-6">
          <button
            onClick={handlePass}
            className="w-16 h-16 rounded-full bg-white border-2 border-error flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Pass"
          >
            <svg className="w-8 h-8 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            onClick={handleLike}
            className="w-20 h-20 rounded-full bg-pink flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Like"
          >
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
