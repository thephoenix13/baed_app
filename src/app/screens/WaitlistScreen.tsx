import { useState } from 'react';

export function WaitlistScreen() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [waitlistCount] = useState(2847); // Mock count

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    // TODO: Replace with actual API call
    console.log('Waitlist signup:', email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 9 9.5 11 12 11C14.5 11 16.5 9 16.5 6.5C16.5 4 14.5 2 12 2Z"
                fill="var(--color-accent)"
                opacity="0.3"
              />
              <path
                d="M12 20L12 11"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-body font-semibold">Bae'd</span>
          </div>
          <div className="badge badge-success">
            <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse"></div>
            <span>Coming Soon</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-2xl w-full">
            {!submitted ? (
              <>
                {/* Hero Section */}
                <div className="text-center mb-12">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-chip)] rounded-full mb-6">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E8B4B8] to-[#D4A5A5] border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4A5A5] to-[#C99A9D] border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C99A9D] to-[#B88A8A] border-2 border-white"></div>
                    </div>
                    <span className="text-caption font-medium">
                      {waitlistCount.toLocaleString()} people waiting
                    </span>
                  </div>

                  {/* Headline */}
                  <h1 className="text-[40px] font-semibold leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
                    Dating, without
                    <br />
                    the doubt.
                  </h1>

                  {/* Subheadline */}
                  <p className="text-body-secondary text-lg mb-8 max-w-lg mx-auto">
                    India's first verified-first dating app. Every profile is real. 
                    Every connection is genuine. No catfishing, ever.
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    <div className="card text-center">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-success-light)] flex items-center justify-center mx-auto mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                          <path d="M9 12l2 2 4-4" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                      <h3 className="text-body font-semibold mb-1">ID Verified</h3>
                      <p className="text-caption">Every profile verified with government ID</p>
                    </div>

                    <div className="card text-center">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center mx-auto mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="10" r="3" />
                          <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                        </svg>
                      </div>
                      <h3 className="text-body font-semibold mb-1">Selfie Match</h3>
                      <p className="text-caption">Face matched with your ID photo</p>
                    </div>

                    <div className="card text-center">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-success-light)] flex items-center justify-center mx-auto mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <h3 className="text-body font-semibold mb-1">100% Safe</h3>
                      <p className="text-caption">Your data encrypted and private</p>
                    </div>
                  </div>
                </div>

                {/* Email Form */}
                <div className="max-w-md mx-auto">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="input"
                      />
                      {error && (
                        <p className="text-caption text-[var(--color-error)] mt-2">
                          {error}
                        </p>
                      )}
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Join the Waitlist
                    </button>
                  </form>

                  <div className="flex items-center justify-center gap-4 mt-6">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span className="text-small">Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span className="text-small">No spam</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full bg-[var(--color-success-light)] flex items-center justify-center mx-auto">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  {/* Celebration dots */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>

                <h2 className="text-[32px] font-semibold mb-3" style={{ letterSpacing: '-0.02em' }}>
                  You're in! 🎉
                </h2>
                <p className="text-body-secondary text-lg mb-2">
                  Welcome to the Bae'd waitlist.
                </p>
                <p className="text-body-secondary mb-8">
                  We'll send you an exclusive invite as soon as we launch.
                  <br />
                  You're #{waitlistCount + 1} in line.
                </p>

                {/* Share Section */}
                <div className="card max-w-md mx-auto mb-6">
                  <p className="text-body font-semibold mb-3">Invite your friends</p>
                  <p className="text-caption mb-4">
                    The more friends who join, the higher your priority in the queue.
                  </p>
                  <button className="btn btn-secondary w-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    Share Invite Link
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                  }}
                  className="btn btn-ghost"
                >
                  Join with another email
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-6 text-center border-t border-[var(--color-border)]">
          <p className="text-small mb-2">
            Launching soon in Mumbai, Pune & Bengaluru
          </p>
          <p className="text-small mb-4">
            © 2024 Bae'd. Made with care in India.
          </p>
          {/* Hidden link for internal access */}
          <button
            onClick={() => window.location.href = '?app=true'}
            className="text-small text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] underline"
          >
            Enter App
          </button>
        </footer>
      </div>
    </div>
  );
}
