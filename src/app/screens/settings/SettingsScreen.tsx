interface SettingsScreenProps {
  onLogout: () => void;
}

export function SettingsScreen({ onLogout }: SettingsScreenProps) {
  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-screen-title">Settings</h1>
      </div>

      <div className="page-content">
        {/* Profile */}
        <div className="mb-8">
          <p className="text-section-label mb-4">Profile</p>
          <div className="card flex items-center gap-4">
            <div className="avatar avatar-lg bg-[var(--color-bg-chip)]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-body font-medium">Your Profile</p>
              <div className="badge badge-success mt-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                Verified
              </div>
            </div>
            <button className="btn btn-secondary" style={{ width: 'auto', padding: '0 16px', height: 40 }}>
              Edit
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-8">
          <p className="text-section-label mb-4">Preferences</p>
          <div className="card p-0 overflow-hidden">
            <button className="list-row w-full px-5 border-b border-[var(--color-border)]">
              <span className="text-body flex-1 text-left">Discovery Filters</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button className="list-row w-full px-5 border-b border-[var(--color-border)]">
              <span className="text-body flex-1 text-left">Notifications</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button className="list-row w-full px-5">
              <span className="text-body flex-1 text-left">Privacy</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Safety */}
        <div className="mb-8">
          <p className="text-section-label mb-4">Safety</p>
          <div className="card p-0 overflow-hidden">
            <button className="list-row w-full px-5 border-b border-[var(--color-border)]">
              <span className="text-body flex-1 text-left">Blocked Users</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button className="list-row w-full px-5">
              <span className="text-body flex-1 text-left">Report a Problem</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="mb-8">
          <p className="text-section-label mb-4">About</p>
          <div className="card p-0 overflow-hidden">
            <button className="list-row w-full px-5 border-b border-[var(--color-border)]">
              <span className="text-body flex-1 text-left">Terms of Service</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button className="list-row w-full px-5 border-b border-[var(--color-border)]">
              <span className="text-body flex-1 text-left">Privacy Policy</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button className="list-row w-full px-5">
              <span className="text-body flex-1 text-left">Community Guidelines</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Logout */}
        <button onClick={onLogout} className="btn btn-secondary mb-4" style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
          Log Out
        </button>

        <p className="text-small text-center">Bae'd v1.0.0</p>
      </div>
    </div>
  );
}
