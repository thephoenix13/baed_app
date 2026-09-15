/**
 * Bottom Navigation Component
 *
 * Main app navigation with 4 tabs: Discover, Matches, Chat, Settings.
 */

interface BottomNavProps {
  activeTab: 'discover' | 'matches' | 'chat' | 'settings';
  onTabChange: (tab: 'discover' | 'matches' | 'chat' | 'settings') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-line z-40">
      <div className="flex items-center justify-around px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {/* Discover */}
        <button
          onClick={() => onTabChange('discover')}
          className={`flex flex-col items-center gap-1 px-4 py-2 ${
            activeTab === 'discover' ? 'text-pink' : 'text-muted'
          }`}
          aria-label="Discover"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span className="text-xs font-medium">Discover</span>
        </button>

        {/* Matches */}
        <button
          onClick={() => onTabChange('matches')}
          className={`flex flex-col items-center gap-1 px-4 py-2 ${
            activeTab === 'matches' ? 'text-pink' : 'text-muted'
          }`}
          aria-label="Matches"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="text-xs font-medium">Matches</span>
        </button>

        {/* Chat */}
        <button
          onClick={() => onTabChange('chat')}
          className={`flex flex-col items-center gap-1 px-4 py-2 ${
            activeTab === 'chat' ? 'text-pink' : 'text-muted'
          }`}
          aria-label="Chat"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-xs font-medium">Chat</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center gap-1 px-4 py-2 ${
            activeTab === 'settings' ? 'text-pink' : 'text-muted'
          }`}
          aria-label="Settings"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
}
