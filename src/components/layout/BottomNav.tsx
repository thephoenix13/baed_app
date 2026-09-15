/**
 * Bottom Navigation — Redesigned
 *
 * Native app feel. Rose for active, stone for inactive.
 * 48px touch targets, safe-area aware.
 */

interface BottomNavProps {
  activeTab: 'discover' | 'matches' | 'chat' | 'settings';
  onTabChange: (tab: 'discover' | 'matches' | 'chat' | 'settings') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {/* Discover */}
      <button
        onClick={() => onTabChange('discover')}
        className={`bottom-nav-item ${activeTab === 'discover' ? 'bottom-nav-item-active' : ''}`}
        aria-label="Discover"
      >
        <svg viewBox="0 0 24 24" fill={activeTab === 'discover' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <span>Discover</span>
      </button>

      {/* Matches */}
      <button
        onClick={() => onTabChange('matches')}
        className={`bottom-nav-item ${activeTab === 'matches' ? 'bottom-nav-item-active' : ''}`}
        aria-label="Matches"
      >
        <svg viewBox="0 0 24 24" fill={activeTab === 'matches' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>Matches</span>
      </button>

      {/* Chat */}
      <button
        onClick={() => onTabChange('chat')}
        className={`bottom-nav-item ${activeTab === 'chat' ? 'bottom-nav-item-active' : ''}`}
        aria-label="Chat"
      >
        <svg viewBox="0 0 24 24" fill={activeTab === 'chat' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Chat</span>
      </button>

      {/* Settings */}
      <button
        onClick={() => onTabChange('settings')}
        className={`bottom-nav-item ${activeTab === 'settings' ? 'bottom-nav-item-active' : ''}`}
        aria-label="Settings"
      >
        <svg viewBox="0 0 24 24" fill={activeTab === 'settings' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span>Settings</span>
      </button>
    </nav>
  );
}
