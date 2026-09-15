import { useState, useEffect } from 'react';
import { getUserMatches, resetMatchingData } from '@/modules/matching/services/matching.service';
import type { Match } from '@/modules/matching/types/matching.types';

interface MatchesScreenProps {
  userId: string;
  onOpenChat: (matchId: string) => void;
  newMatch?: Match | null;
  onDismissMatch?: () => void;
}

export function MatchesScreen({ userId, onOpenChat, newMatch, onDismissMatch }: MatchesScreenProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => { loadMatches(); }, [userId]);
  useEffect(() => { if (newMatch) setShowAnimation(true); }, [newMatch]);

  const loadMatches = () => setMatches(getUserMatches(userId));

  const handleDismiss = () => {
    setShowAnimation(false);
    onDismissMatch?.();
    loadMatches();
  };

  const getPartner = (m: Match) => m.user1Id === userId ? m.user2Profile : m.user1Profile;

  return (
    <div className="page">
      {/* Match animation overlay */}
      {showAnimation && newMatch && (
        <div className="fixed inset-0 z-50 bg-[var(--color-bg)] flex flex-col items-center justify-center px-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[var(--color-success-light)] flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h2 className="text-screen-title mb-2">It's a Match</h2>
          <p className="text-body-secondary mb-8">You and {getPartner(newMatch).displayName} liked each other</p>
          <button onClick={handleDismiss} className="btn btn-primary mb-3">Send a Message</button>
          <button onClick={handleDismiss} className="btn btn-ghost">Keep Swiping</button>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <h1 className="text-screen-title">Matches</h1>
        <p className="text-caption mt-1">{matches.length} connections</p>
      </div>

      <div className="page-content">
        {matches.length > 0 ? (
          <>
            {/* New matches — horizontal scroll */}
            {matches.length > 0 && (
              <div className="mb-8">
                <p className="text-section-label mb-4">New</p>
                <div className="flex gap-4 overflow-x-auto -mx-6 px-6 pb-2">
                  {matches.slice(0, 6).map((match) => {
                    const partner = getPartner(match);
                    return (
                      <button
                        key={match.id}
                        onClick={() => onOpenChat(match.id)}
                        className="flex-shrink-0 text-center"
                      >
                        <div className="avatar avatar-lg bg-[var(--color-bg-chip)] mb-2">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <p className="text-caption font-medium">{partner.displayName}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All matches */}
            <div>
              <p className="text-section-label mb-4">All</p>
              <div className="card p-0 overflow-hidden">
                {matches.map((match, i) => {
                  const partner = getPartner(match);
                  return (
                    <button
                      key={match.id}
                      onClick={() => onOpenChat(match.id)}
                      className={`list-row w-full px-5 ${i < matches.length - 1 ? 'border-b border-[var(--color-border)]' : ''}`}
                    >
                      <div className="avatar avatar-md bg-[var(--color-bg-chip)]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-1.5">
                          <p className="text-body font-medium">{partner.displayName}</p>
                          {partner.isVerified && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                              <path d="M9 12l2 2 4-4" />
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                          )}
                        </div>
                        <p className="text-caption">{partner.age} · {partner.city}</p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-center mt-6">
              <button onClick={() => { resetMatchingData(); loadMatches(); }} className="text-caption text-[var(--color-text-tertiary)]">
                Reset (Demo)
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ minHeight: '50vh' }}>
            <div className="empty-state-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p className="text-section-title mb-2">No matches yet</p>
            <p className="text-body-secondary">Keep swiping to find your match</p>
          </div>
        )}
      </div>
    </div>
  );
}
