interface HomeScreenProps {
  onAdminVerification: () => void;
  onAdminModeration: () => void;
}

export function HomeScreen({ onAdminVerification, onAdminModeration }: HomeScreenProps) {
  return (
    <div className="page">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-screen-title">Bae'd</h1>
          <p className="text-caption mt-1">Welcome back</p>
        </div>
        <div className="badge badge-success">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          Verified
        </div>
      </div>

      <div className="page-content">
        {/* Stats — minimal, no card wrapper */}
        <div className="mb-8">
          <p className="text-section-label mb-4">This week</p>
          <div className="flex gap-6">
            <div>
              <p className="text-section-title">24</p>
              <p className="text-caption">Likes</p>
            </div>
            <div>
              <p className="text-section-title">8</p>
              <p className="text-caption">Matches</p>
            </div>
            <div>
              <p className="text-section-title">12</p>
              <p className="text-caption">Messages</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <p className="text-section-label mb-4">Quick actions</p>
          <div className="grid grid-cols-2 gap-3">
            <button className="card text-left">
              <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <p className="text-body font-medium">Discover</p>
              <p className="text-caption">Find matches</p>
            </button>
            <button className="card text-left">
              <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <p className="text-body font-medium">Matches</p>
              <p className="text-caption">Your connections</p>
            </button>
            <button className="card text-left">
              <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-body font-medium">Messages</p>
              <p className="text-caption">Chat now</p>
            </button>
            <button className="card text-left">
              <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <p className="text-body font-medium">Settings</p>
              <p className="text-caption">Preferences</p>
            </button>
          </div>
        </div>

        {/* Admin tools */}
        <div className="mb-8">
          <p className="text-section-label mb-4">Admin tools</p>
          <div className="card p-0 overflow-hidden">
            <button
              onClick={onAdminVerification}
              className="list-row w-full px-5 border-b border-[var(--color-border)]"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-success-light)] flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-body font-medium">Verification Queue</p>
                <p className="text-caption">Review pending verifications</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button
              onClick={onAdminModeration}
              className="list-row w-full px-5"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-error-light)] flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-body font-medium">Photo Moderation</p>
                <p className="text-caption">Review flagged photos</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <p className="text-section-label mb-4">Recent activity</p>
          <div className="card p-0 overflow-hidden">
            <div className="list-row px-5 border-b border-[var(--color-border)]">
              <div className="avatar avatar-sm bg-[var(--color-accent-light)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-body">New match with Priya</p>
                <p className="text-small">2 hours ago</p>
              </div>
            </div>
            <div className="list-row px-5">
              <div className="avatar avatar-sm bg-[var(--color-bg-chip)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-body">Message from Arjun</p>
                <p className="text-small">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
