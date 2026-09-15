import { fontDisplay } from '@/lib/fonts';

interface HomeScreenProps {
  onAdminVerification: () => void;
  onAdminModeration: () => void;
}

export function HomeScreen({ onAdminVerification, onAdminModeration }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <header className="px-4 pt-12 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-plum font-display">Bae'd</h1>
          <p className="text-small text-stone mt-1">Welcome back</p>
        </div>
        <div className="verified-badge">
          <svg className="verified-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="verified-badge-text">Verified</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4">
        {/* Hero Stats Card */}
        <div className="card-elevated mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h3 text-ink">Your Activity</h2>
            <span className="text-tiny text-stone">This week</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-h2 text-rose font-display">24</p>
              <p className="text-tiny text-stone">Likes</p>
            </div>
            <div className="text-center">
              <p className="text-h2 text-rose font-display">8</p>
              <p className="text-tiny text-stone">Matches</p>
            </div>
            <div className="text-center">
              <p className="text-h2 text-rose font-display">12</p>
              <p className="text-tiny text-stone">Messages</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-4">
          <h3 className="text-label text-stone mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="card text-left hover:shadow-medium transition-shadow">
              <div className="w-10 h-10 bg-rose-pale rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <h4 className="text-body font-semibold text-ink mb-1">Discover</h4>
              <p className="text-tiny text-stone">Find verified matches</p>
            </button>

            <button className="card text-left hover:shadow-medium transition-shadow">
              <div className="w-10 h-10 bg-rose-pale rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h4 className="text-body font-semibold text-ink mb-2">Matches</h4>
              <p className="text-tiny text-stone">View your matches</p>
            </button>

            <button className="card text-left hover:shadow-medium transition-shadow">
              <div className="w-10 h-10 bg-rose-pale rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h4 className="text-body font-semibold text-ink mb-1">Messages</h4>
              <p className="text-tiny text-stone">Chat with matches</p>
            </button>

            <button className="card text-left hover:shadow-medium transition-shadow">
              <div className="w-10 h-10 bg-rose-pale rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <h4 className="text-body font-semibold text-ink mb-1">Settings</h4>
              <p className="text-tiny text-stone">Manage preferences</p>
            </button>
          </div>
        </div>

        {/* Admin Section */}
        <div className="mb-4">
          <h3 className="text-label text-stone mb-3">Admin Tools</h3>
          <div className="space-y-2">
            <button
              onClick={onAdminVerification}
              className="card w-full text-left hover:shadow-medium transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-verified-light rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-verified" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-body font-semibold text-ink">Verification Queue</h4>
                  <p className="text-tiny text-stone">Review pending verifications</p>
                </div>
                <svg className="w-4 h-4 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>

            <button
              onClick={onAdminModeration}
              className="card w-full text-left hover:shadow-medium transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-pending" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-body font-semibold text-ink">Photo Moderation</h4>
                  <p className="text-tiny text-stone">Review flagged photos</p>
                </div>
                <svg className="w-4 h-4 text-stone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-label text-stone mb-3">Recent Activity</h3>
          <div className="card">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-pale rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-body text-ink">New match with Priya</p>
                  <p className="text-tiny text-stone">2 hours ago</p>
                </div>
              </div>
              <div className="divider"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-pale rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-body text-ink">Message from Arjun</p>
                  <p className="text-tiny text-stone">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
