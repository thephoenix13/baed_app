/**
 * Settings Screen
 *
 * User settings and account management.
 */

import { fontDisplay } from '@/lib/fonts';

interface SettingsScreenProps {
  onLogout: () => void;
}

export function SettingsScreen({ onLogout }: SettingsScreenProps) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <h1 className="text-h3 text-plum" style={fontDisplay.style}>
          Settings
        </h1>
      </header>

      {/* Content */}
      <div className="px-6 pb-8">
        {/* Profile Section */}
        <div className="card mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-pink-pale rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h2 className="text-h3 text-ink">Your Profile</h2>
              <div className="verified-badge !px-2 !py-1 mt-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span className="text-xs">Verified</span>
              </div>
            </div>
          </div>
          <button className="btn btn-ghost w-full">Edit Profile</button>
        </div>

        {/* Preferences */}
        <div className="card mb-4">
          <h3 className="text-label text-muted mb-3">Preferences</h3>
          <div className="space-y-2">
            <button className="btn btn-ghost w-full justify-between">
              <span>Discovery Filters</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button className="btn btn-ghost w-full justify-between">
              <span>Notification Settings</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button className="btn btn-ghost w-full justify-between">
              <span>Privacy Settings</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Safety */}
        <div className="card mb-4">
          <h3 className="text-label text-muted mb-3">Safety</h3>
          <div className="space-y-2">
            <button className="btn btn-ghost w-full justify-between">
              <span>Blocked Users</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button className="btn btn-ghost w-full justify-between">
              <span>Report a Problem</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="card mb-4">
          <h3 className="text-label text-muted mb-3">About</h3>
          <div className="space-y-2">
            <button className="btn btn-ghost w-full justify-between">
              <span>Terms of Service</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button className="btn btn-ghost w-full justify-between">
              <span>Privacy Policy</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button className="btn btn-ghost w-full justify-between">
              <span>Community Guidelines</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="btn btn-ghost w-full !border-error !text-error mb-4"
        >
          Log Out
        </button>

        {/* App Version */}
        <p className="text-body text-muted text-center text-sm">
          Bae'd v1.0.0 · Made with 💜 in India
        </p>
      </div>
    </div>
  );
}
