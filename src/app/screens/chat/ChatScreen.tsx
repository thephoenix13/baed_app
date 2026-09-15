import { useState } from 'react';
import { getMatch, getMatchPartner } from '@/modules/matching/services/matching.service';
import type { Match } from '@/modules/matching/types/matching.types';

interface ChatScreenProps {
  matchId: string;
  userId: string;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
}

export function ChatScreen({ matchId, userId, onBack }: ChatScreenProps) {
  const match = getMatch(matchId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  if (!match) {
    return (
      <div className="page flex items-center justify-center">
        <p className="text-body-secondary">Match not found</p>
      </div>
    );
  }

  const partner = getMatchPartner(match, userId);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      senderId: userId,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage('');

    setTimeout(() => {
      const replies = ['Hey! Nice to match with you', 'Hi there! How are you?', 'Hey! What are you up to?', 'Hello! Love your profile'];
      const reply: Message = {
        id: `msg-${Date.now()}-reply`,
        text: replies[Math.floor(Math.random() * replies.length)],
        senderId: partner.id,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  };

  return (
    <div className="page flex flex-col" style={{ paddingBottom: 0 }}>
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]" style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))' }}>
        <button onClick={onBack} className="btn-icon" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="avatar avatar-sm bg-[var(--color-bg-chip)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-body font-medium">{partner.displayName}</p>
          <p className="text-small">{partner.age} · {partner.city}</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="empty-state" style={{ minHeight: '40vh' }}>
            <div className="empty-state-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-body-secondary">Say hello to {partner.displayName}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isMe = msg.senderId === userId;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 ${
                      isMe
                        ? 'bg-[var(--color-accent)] text-white rounded-[18px] rounded-br-[4px]'
                        : 'bg-[var(--color-bg-chip)] text-[var(--color-text)] rounded-[18px] rounded-bl-[4px]'
                    }`}
                  >
                    <p className="text-[15px]">{msg.text}</p>
                    <p className={`text-[11px] mt-1 ${isMe ? 'text-white/60' : 'text-[var(--color-text-tertiary)]'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-card)]" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="input flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              newMessage.trim() ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-chip)] text-[var(--color-text-tertiary)]'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
