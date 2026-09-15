import { fontDisplay, fontSans } from '@/lib/fonts';

interface HomeScreenProps {
  onAdminVerification: () => void;
  onAdminModeration: () => void;
}

export function HomeScreen({ onAdminVerification, onAdminModeration }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-h3 text-plum" style={fontDisplay.style}>
          Bae'd
        </h1>
        <div className="verified-badge !px-2 !py-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="text-xs">Verified</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Welcome Card */}
        <div className="card mb-6">
          <h2 className="text-h3 text-ink mb-2" style={fontSans.style}>
            Welcome to Bae'd!
          </h2>
          <p className="text-body text-muted">
            Your profile is live. Start discovering verified people near you.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button className="card text-left hover:shadow-elevated transition-shadow">
            <div className="w-10 h-10 bg-pink-pale rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <h3 className="text-body font-semibold text-ink">Discover</h3>
            <p className="text-body text-muted text-sm">Find matches</p>
          </button>

          <button className="card text-left hover:shadow-elevated transition-shadow">
            <div className="w-10 h-10 bg-pink-pale rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h3 className="text-body font-semibold text-ink">Matches</h3>
            <p className="text-body text-muted text-sm">Your connections</p>
          </button>
        </div>

        {/* Admin Section */}
        <div className="mb-6">
          <p className="text-label text-muted mb-3">Admin Console</p>
          <div className="space-y-2">
            <button
              onClick={onAdminVerification}
              className="card w-full text-left hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-verified-green/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-verified-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-body font-semibold text-ink">Verification Queue</h3>
                  <p className="text-body text-muted text-sm">Review pending verifications</p>
                </div>
              </div>
            </button>

            <button
              onClick={onAdminModeration}
              className="card w-full text-left hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-body font-semibold text-ink">Photo Moderation</h3>
                  <p className="text-body text-muted text-sm">Review flagged photos</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <p className="text-body text-muted text-sm">
          Bae'd — Dating, without the doubt.
        </p>
      </footer>
    </div>
  );
}
