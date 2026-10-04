import { useState } from 'react';

export function WaitlistScreen() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {/* Logo & Tagline */}
          <div className="text-center mb-12">
            <h1 className="text-screen-title mb-3">Bae'd</h1>
            <p className="text-body-secondary">
              Dating, without the doubt.
            </p>
          </div>

          {/* Value Proposition */}
          {!submitted ? (
            <>
              <div className="mb-8">
                <h2 className="text-section-title mb-4 text-center">
                  Join the waitlist
                </h2>
                <p className="text-body-secondary text-center mb-6">
                  Be among the first to experience verified dating. 
                  Real people. Real connections. No catfishing.
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-success-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-body">Every profile is ID-verified</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-success-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-body">Selfie match verification</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-success-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-body">Safe, respectful community</p>
                  </div>
                </div>
              </div>

              {/* Email Form */}
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
                  Join Waitlist
                </button>
              </form>

              <p className="text-small text-center mt-4">
                We'll notify you when we launch. No spam, ever.
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-success-light)] flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-section-title mb-3">You're on the list!</h2>
              <p className="text-body-secondary mb-6">
                We'll send you an invite as soon as we're ready. 
                Thanks for your interest in Bae'd.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
                className="btn btn-secondary"
              >
                Join another email
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-6 text-center">
        <p className="text-small">
          © 2024 Bae'd. Made with care in India.
        </p>
      </footer>
    </div>
  );
}
