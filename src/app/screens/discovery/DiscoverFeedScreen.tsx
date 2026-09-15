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
    <div className="min-h-screen bg-white relative">
      {/* Profile Card - Full Bleed Photo */}
      {hasMore && currentProfile ? (
        <div
          className={`relative w-full h-screen transition-transform duration-300 ${
            swipeDirection === 'left'
              ? '-translate-x-full -rotate-12 opacity-0'
              : swipeDirection === 'right'
              ? 'translate-x-full rotate-12 opacity-0'
              : ''
          }`}
        >
          {/* Large Photo - Takes up 85% of screen */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-200 to-stone-300">
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-32 h-32 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>

          {/* Gradient Overlay at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Profile Info - Minimal Overlay */}
          <div className="absolute bottom-32 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-bold">
                {currentProfile.displayName}
              </h1>
              <span className="text-3xl font-light">{currentProfile.age}</span>
              {currentProfile.isVerified && (
                <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="text-lg opacity-90 mb-1">
              {currentProfile.occupation}
            </p>
            <p className="text-base opacity-75">
              {currentProfile.city} · {currentProfile.distance} km away
            </p>
          </div>

          {/* Action Buttons - Bottom */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6">
            <button
              onClick={handlePass}
              className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Pass"
            >
              <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <button
              onClick={handleLike}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Like"
            >
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Filter Button - Top Right */}
          <button
            onClick={onOpenFilters}
            className="absolute top-12 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            aria-label="Filters"
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No more profiles
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Check back later or adjust your filters
          </p>
          <button onClick={handleReset} className="px-8 py-3 bg-rose-500 text-white rounded-full font-semibold hover:bg-rose-600 transition-colors">
            Reset & Start Over
          </button>
        </div>
      )}
    </div>
  );
}
