/**
 * Profile Detail Screen
 *
 * Full profile view with all information.
 */

import { fontDisplay } from '@/lib/fonts';
import { getCandidateProfile } from '@/modules/discovery/services/discovery.service';
import type { CandidateProfile } from '@/modules/discovery/types/discovery.types';

interface ProfileDetailScreenProps {
  profileId: string;
  onBack: () => void;
  onLike: () => void;
  onPass: () => void;
}

export function ProfileDetailScreen({
  profileId,
  onBack,
  onLike,
  onPass,
}: ProfileDetailScreenProps) {
  const profile = getCandidateProfile(profileId);

  if (!profile) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-body text-muted">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="btn btn-ghost !px-3 !py-2" aria-label="Go back">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-h3 text-plum" style={fontDisplay.style}>
          Profile
        </h1>
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-8">
        {/* Photo */}
        <div className="aspect-[3/4] bg-gradient-to-b from-pink-pale to-peach rounded-2xl mb-6 flex items-center justify-center">
          <svg className="w-32 h-32 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        {/* Name + Age + Verified */}
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-h2 text-plum" style={fontDisplay.style}>
            {profile.displayName}, {profile.age}
          </h2>
          {profile.isVerified && (
            <div className="verified-badge !px-2 !py-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="text-xs">Verified</span>
            </div>
          )}
        </div>

        {/* Occupation + City + Distance */}
        <p className="text-body text-muted mb-4">
          {profile.occupation} · {profile.city} · {profile.distance} km away
        </p>

        {/* Bio */}
        {profile.bio && (
          <div className="card mb-4">
            <h3 className="text-label text-muted mb-2">About</h3>
            <p className="text-body text-ink">{profile.bio}</p>
          </div>
        )}

        {/* Intent */}
        <div className="card mb-4">
          <h3 className="text-label text-muted mb-2">Looking for</h3>
          <p className="text-body text-ink">{profile.intent}</p>
        </div>

        {/* Interests */}
        <div className="card mb-4">
          <h3 className="text-label text-muted mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span key={interest} className="pill">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Lifestyle */}
        <div className="card mb-6">
          <h3 className="text-label text-muted mb-3">Lifestyle</h3>
          <div className="space-y-2">
            {profile.lifestyle.drinking && (
              <div className="flex justify-between">
                <span className="text-body text-muted">Drinking</span>
                <span className="text-body text-ink">{profile.lifestyle.drinking}</span>
              </div>
            )}
            {profile.lifestyle.smoking && (
              <div className="flex justify-between">
                <span className="text-body text-muted">Smoking</span>
                <span className="text-body text-ink">{profile.lifestyle.smoking}</span>
              </div>
            )}
            {profile.lifestyle.diet && (
              <div className="flex justify-between">
                <span className="text-body text-muted">Diet</span>
                <span className="text-body text-ink">{profile.lifestyle.diet}</span>
              </div>
            )}
            {profile.lifestyle.exercise && (
              <div className="flex justify-between">
                <span className="text-body text-muted">Exercise</span>
                <span className="text-body text-ink">{profile.lifestyle.exercise}</span>
              </div>
            )}
          </div>
        </div>

        {/* Compatibility Score */}
        {profile.compatibilityScore && (
          <div className="card bg-pink-pale mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-label text-plum">Compatibility</h3>
              <span className="text-h3 text-plum" style={fontDisplay.style}>
                {Math.round(profile.compatibilityScore)}%
              </span>
            </div>
            <div className="bg-white/50 rounded-full h-3">
              <div
                className="bg-pink h-3 rounded-full"
                style={{ width: `${profile.compatibilityScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={onPass}
            className="w-16 h-16 rounded-full bg-white border-2 border-error flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Pass"
          >
            <svg className="w-8 h-8 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            onClick={onLike}
            className="w-20 h-20 rounded-full bg-pink flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Like"
          >
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
