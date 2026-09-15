import { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 pb-20">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Matches</h1>
        <p className="text-sm text-gray-600">{matches.length} connections</p>
      </header>

      {/* Match Animation Overlay */}
      {showMatchAnimation && newMatch && (
        <div className="fixed inset-0 bg-gradient-to-br from-rose-500 to-pink-600 z-50 flex items-center justify-center px-6">
          <div className="text-center text-white">
            <div className="mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-3">
                It's a Match!
              </h2>
              <p className="text-lg opacity-90">
                You and {getPartner(newMatch).displayName} liked each other
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <svg className="w-12 h-12 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <svg className="w-12 h-12 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            <button onClick={handleDismissMatch} className="w-full py-4 bg-white text-rose-600 rounded-full font-semibold text-lg mb-3">
              Send a Message
            </button>
            <button onClick={handleDismissMatch} className="w-full py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold">
              Keep Swiping
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6">
        {matches.length > 0 ? (
          <>
            {/* New Matches - Horizontal Scroll */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">New Matches</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
                {matches.slice(0, 5).map((match) => {
                  const partner = getPartner(match);
                  return (
                    <button
                      key={match.id}
                      onClick={() => onOpenChat(match.id)}
                      className="flex-shrink-0 text-center"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-2 border-4 border-white shadow-lg">
                        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{partner.displayName}</p>
                      <p className="text-xs text-gray-600">{partner.age}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All Matches - Grid */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">All Matches</h3>
              <div className="grid grid-cols-2 gap-3">
                {matches.map((match) => {
                  const partner = getPartner(match);
                  return (
                    <button
                      key={match.id}
                      onClick={() => onOpenChat(match.id)}
                      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow text-left"
                    >
                      <div className="aspect-square bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                        <svg className="w-16 h-16 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <h4 className="font-semibold text-gray-900">{partner.displayName}</h4>
                          {partner.isVerified && (
                            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {partner.age} · {partner.city}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Button */}
            <div className="mt-6 text-center">
              <button onClick={handleReset} className="text-sm text-gray-600 hover:text-gray-900">
                Reset Matches (Demo)
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No matches yet
            </h2>
            <p className="text-gray-600">
              Keep swiping to find your match!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
