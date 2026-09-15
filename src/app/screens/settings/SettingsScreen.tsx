import { fontDisplay } from '@/lib/fonts';

interface SettingsScreenProps {
  onLogout: () => void;
}

export function SettingsScreen({ onLogout }: SettingsScreenProps) {
  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <header className="px-4 pt-12 pb-4">
        <h1 className="text-h2 text-plum font-display">Settings</h1>
      </header>

      {/* Content */}
      <div className="px-4">
        {/* Profile Section */}
        <div className="mb-4">
          <h3 className="text-label text-stone mb-3">Profile</h3>
          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-rose-pale rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-h3 text-ink">Your Profile</h2>
                <div className="verified-badge mt-1">
                  <svg className="verified-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span className="verified-badge-text">Verified</span>
                </div>
              </div>
            </div>
            <button className="btn btn-ghost w-full">Edit Profile</button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-4">
          <h3 className="text-label text-stone mb-3">Preferences</h3>
          <div className="card">
            <div className="space-y-3">
              <button className="flex items-center justify-between w-full text-left">
                <span className="text-body text-ink">Discovery Filters</span>
                <svg className="w-4 h-4 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <div className="divider"></div>
              <button className="flex items-center justify-between w-full text-left">
                <span className="text-body text-ink">Notification Settings</span>
                <svg className="w-4 h-4 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <div className="divider"></div>
              <button className="flex items-center justify-between w-full text-left">
                <span className="text-body text-ink">Privacy Settings</span>
                <svg className="w-4 h-4 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Safety Section */}
        <div className="mb-4">
          <h3 className="text-label text-stone mb-3">Safety</h3>
          <div className="card">
            <div className="space-y-3">
              <button className="flex items-center justify-between w-full text-left">
                <span className="text-body text-ink">Blocked Users</span>
                <svg className="w-4 h-4 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <div className="divider"></div>
              <button className="flex items-center justify-between w-full text-left">
                <span className="text-body text-ink">Report a Problem</span>
                <svg className="w-4 h-4 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-4">
          <h3 className="text-label text-stone mb-3">About</h3>
          <div className="card">
            <div className="space-y-3">
              <button className="flex items-center justify-between w-full text-left">
                <span className="text-body text-ink">Terms of Service</span>
                <svg className="w-4 h-4 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <div className="divider"></div>
              <button className="flex items-center justify-between w-full text-left">
                <span className="text-body text-ink">Privacy Policy</span>
                <svg className="w-4 h-4 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <div className="divider"></div>
              <button className="flex items-center justify-between w-full text-left">
                <span className="text-body text-ink">Community Guidelines</span>
                <svg className="w-4 h-4 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="btn btn-ghost w-full !border-danger !text-danger mb-4"
        >
          Log Out
        </button>

        {/* App Version */}
        <p className="text-tiny text-stone text-center">
          Bae'd v1.0.0 · Made with 💜 in India
        </p>
      </div>
    </div>
  );
}
