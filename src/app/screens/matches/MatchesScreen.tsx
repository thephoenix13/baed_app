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
    loadMatches();
  };

  const handleReset = () => {
    resetMatchingData();
    loadMatches();
  };

  const getPartner = (match: Match) => {
    return match.user1Id === userId ? match.user2Profile : match.user1Profile;
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <header className="px-4 pt-12 pb-4">
        <h1 className="text-h2 text-plum font-display">Matches</h1>
        <p className="text-small text-stone mt-1">{matches.length} connections</p>
      </header>

      {/* Match Animation Overlay */}
      {showMatchAnimation && newMatch && (
        <div className="fixed inset-0 bg-cream z-50 flex items-center justify-center px-4">
          <div className="text-center">
            {/* Verified Badge */}
            <div className="mb-6">
              <div className="verified-badge verified-badge-large mx-auto mb-4">
                <svg className="verified-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span className="verified-badge-text">Verified Match</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-hero text-plum mb-3 font-display">
                It's a Match
              </h2>
              <p className="text-lead text-stone">
                You and {getPartner(newMatch).displayName} liked each other
              </p>
            </div>

            {/* Profile Photos */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-20 h-20 bg-sand rounded-full flex items-center justify-center border-2 border-line">
                <svg className="w-10 h-10 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="w-10 h-10 bg-rose rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="w-20 h-20 bg-sand rounded-full flex items-center justify-center border-2 border-line">
                <svg className="w-10 h-10 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            <button onClick={handleDismissMatch} className="btn btn-primary w-full mb-2">
              Send a Message
            </button>
            <button onClick={handleDismissMatch} className="btn btn-ghost w-full">
              Keep Swiping
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4">
        {matches.length > 0 ? (
          <>
            {/* New Matches - Horizontal Scroll */}
            <div className="mb-4">
              <h3 className="text-label text-stone mb-3">New Matches</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                {matches.slice(0, 5).map((match) => {
                  const partner = getPartner(match);
                  return (
                    <button
                      key={match.id}
                      onClick={() => onOpenChat(match.id)}
                      className="flex-shrink-0 text-center"
                    >
                      <div className="w-16 h-16 bg-rose-pale rounded-full flex items-center justify-center mb-2 border-2 border-rose">
                        <svg className="w-8 h-8 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <p className="text-small text-ink font-semibold">{partner.displayName}</p>
                      <p className="text-tiny text-stone">{partner.age}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All Matches - Grid Layout */}
            <div>
              <h3 className="text-label text-stone mb-3">All Matches</h3>
              <div className="grid grid-cols-2 gap-3">
                {matches.map((match) => {
                  const partner = getPartner(match);
                  return (
                    <button
                      key={match.id}
                      onClick={() => onOpenChat(match.id)}
                      className="card text-left hover:shadow-medium transition-shadow"
                    >
                      <div className="w-full aspect-square bg-sand rounded-lg flex items-center justify-center mb-2">
                        <svg className="w-12 h-12 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <h4 className="text-body font-semibold text-ink">{partner.displayName}</h4>
                        {partner.isVerified && (
                          <svg className="w-3 h-3 text-verified" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 12l2 2 4-4" />
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                      </div>
                      <p className="text-tiny text-stone">
                        {partner.age} · {partner.city}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Button */}
            <div className="mt-6 text-center">
              <button onClick={handleReset} className="btn btn-ghost text-small">
                Reset Matches (Demo)
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-rose-pale rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="text-h3 text-ink mb-2 font-display">
              No matches yet
            </h2>
            <p className="text-body text-stone">
              Keep swiping to find your match!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
