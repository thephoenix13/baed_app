import { useState, useEffect } from 'react';
import { getUserMatches } from '@/modules/matching/services/matching.service';
import type { Match } from '@/modules/matching/types/matching.types';

interface MessagesScreenProps {
  userId: string;
  onOpenConversation: (matchId: string) => void;
}

interface Conversation {
  id: string;
  matchId: string;
  partnerName: string;
  partnerAge: number;
  partnerCity: string;
  isVerified: boolean;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

export function MessagesScreen({ userId, onOpenConversation }: MessagesScreenProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // Mock conversations based on matches
    const matches = getUserMatches(userId);
    const mockConversations: Conversation[] = matches.map((match) => {
      const partner = match.user1Id === userId ? match.user2Profile : match.user1Profile;
      return {
        id: `conv-${match.id}`,
        matchId: match.id,
        partnerName: partner.displayName,
        partnerAge: partner.age,
        partnerCity: partner.city,
        isVerified: partner.isVerified,
        lastMessage: 'Hey! How are you?',
        timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
        unread: Math.random() > 0.5,
      };
    });
    setConversations(mockConversations);
  }, [userId]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-screen-title">Messages</h1>
      </div>

      <div className="page-content">
        {conversations.length === 0 ? (
          /* Empty state */
          <div className="empty-state" style={{ minHeight: '60vh' }}>
            <div className="empty-state-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-section-title mb-2">No conversations yet</p>
            <p className="text-body-secondary">
              When you match with someone, your conversations will appear here.
            </p>
          </div>
        ) : (
          /* Conversation list */
          <div className="space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onOpenConversation(conv.matchId)}
                className="w-full flex items-center gap-4 py-4 hover:bg-[var(--color-bg-chip)] transition-colors rounded-[var(--radius-md)] px-2 -mx-2"
              >
                {/* Profile photo */}
                <div className="avatar avatar-md bg-gradient-to-br from-[#E8B4B8] to-[#D4A5A5] relative flex-shrink-0">
                  {conv.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-[var(--color-bg)]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3">
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className={`text-body ${conv.unread ? 'font-semibold' : 'font-medium'} truncate`}>
                      {conv.partnerName}
                    </p>
                    <span className="text-small flex-shrink-0">{conv.partnerAge}</span>
                  </div>
                  <p className={`text-caption truncate ${conv.unread ? 'text-[var(--color-text)] font-medium' : ''}`}>
                    {conv.lastMessage}
                  </p>
                </div>

                {/* Time and unread indicator */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-small">{formatTime(conv.timestamp)}</span>
                  {conv.unread && (
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
