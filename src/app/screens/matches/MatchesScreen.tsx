/**
 * Matches Screen
 *
 * List of all matches with match animation.
 */

import { useState, useEffect } from 'react';
import { fontDisplay } from '@/lib/fonts';
import { getUserMatches, resetMatchingData } from '@/modules/matching/services/matching.service';
import type { Match } from '@/modules/matching/types/matching.types';

interface MatchesScreenProps {
  userId: string;
  onOpenChat: (matchId: string) => void;
  newMatch?: Match | null;
  onDismissMatch?: () => void;
}

export function MatchesScreen({
  userId,
  onOpenChat,
  newMatch,
  onDismissMatch,
}: MatchesScreenProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [userId]);

  useEffect(() => {
    if (newMatch) {
      setShowMatchAnimation(true);
    }
  }, [newMatch]);

  const loadMatches = () => {
    const userMatches = getUserMatches(userId);
    setMatches(userMatches);
  };

  const handleDismissMatch = () => {
    setShowMatchAnimation(false);
    onDismissMatch?.();
    loadMatches(); // Reload to show updated list
  };

  const handleReset = () => {
    resetMatchingData();
    loadMatches();
  };

  const getPartner = (match: Match) => {
    return match.user1Id === userId ? match.user2Profile : match.user1Profile;
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <h1 className="text-h3 text-plum" style={fontDisplay.style}>
          Matches
        </h1>
      </header>

      {/* Match Animation Overlay — Editorial, Premium */}
      {showMatchAnimation && newMatch && (
        <div className="fixed inset-0 bg-plum-deep z-50 flex items-center justify-center px-6">
          <div className="text-center">
            {/* Verified Badge — Hero Moment */}
            <div className="mb-8">
              <div className="verified-badge verified-badge-large mx-auto mb-6" style={{ borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <svg className="verified-badge-icon" style={{ color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span className="verified-badge-text" style={{ color: 'white' }}>Verified Match</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-hero text-white mb-4 font-display">
                It's a Match
              </h2>
              <p className="text-lead text-white/70">
                You and {getPartner(newMatch).displayName} liked each other
              </p>
            </div>

            {/* Profile Photos — Minimal */}
            <div className="flex items-center justify-center gap-6 mb-12">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/30">
                <svg className="w-12 h-12 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="w-12 h-12 bg-rose rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/30">
                <svg className="w-12 h-12 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            <button onClick={handleDismissMatch} className="btn btn-primary w-full mb-3">
              Send a Message
            </button>
            <button onClick={handleDismissMatch} className="btn btn-ghost w-full !border-white/30 !text-white hover:!bg-white/10">
              Keep Swiping
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 pb-8">
        {matches.length > 0 ? (
          <>
            {/* New Matches */}
            <div className="mb-6">
              <h2 className="text-label text-muted mb-3">New Matches</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {matches.slice(0, 5).map((match) => {
                  const partner = getPartner(match);
                  return (
                    <button
                      key={match.id}
                      onClick={() => onOpenChat(match.id)}
                      className="flex-shrink-0 text-center"
                    >
                      <div className="w-20 h-20 bg-pink-pale rounded-full flex items-center justify-center mb-2 border-2 border-pink">
                        <svg className="w-10 h-10 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <p className="text-body text-ink text-sm font-semibold">{partner.displayName}</p>
                      <p className="text-body text-muted text-xs">{partner.age}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All Matches */}
            <div>
              <h2 className="text-label text-muted mb-3">All Matches ({matches.length})</h2>
              <div className="space-y-2">
                {matches.map((match) => {
                  const partner = getPartner(match);
                  return (
                    <button
                      key={match.id}
                      onClick={() => onOpenChat(match.id)}
                      className="card w-full text-left hover:shadow-elevated transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-pink-pale rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-7 h-7 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-body font-semibold text-ink">{partner.displayName}</h3>
                            {partner.isVerified && (
                              <svg className="w-4 h-4 text-verified-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 12l2 2 4-4" />
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                            )}
                          </div>
                          <p className="text-body text-muted text-sm">
                            {partner.age} · {partner.city}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Button (for demo) */}
            <div className="mt-8 text-center">
              <button onClick={handleReset} className="btn btn-ghost text-sm">
                Reset Matches (Demo)
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-pink-pale rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="text-h3 text-ink mb-2" style={fontDisplay.style}>
              No matches yet
            </h2>
            <p className="text-body text-muted">
              Keep swiping to find your match!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
