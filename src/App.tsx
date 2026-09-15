export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Brand Mark */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-pink-pale">
            <span className="text-label text-plum">Verified-First Dating</span>
          </div>
        </div>

        {/* Hero Headline */}
        <h1 className="text-hero text-plum mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Bae'd
        </h1>

        <p className="text-h2 text-plum mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Dating, without the doubt.
        </p>

        {/* Lead Text */}
        <p className="text-lead max-w-md mb-10">
          Every person on Bae'd is verified. Real identities. Real intentions. Real connections.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn btn-primary">
            Get Started
          </button>
          <button className="btn btn-ghost">
            Learn More
          </button>
        </div>

        {/* Verified Badge Demo */}
        <div className="mt-12">
          <div className="verified-badge">
            <svg className="verified-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="verified-badge-text">Identity Verified</span>
          </div>
        </div>

        {/* Design Token Showcase */}
        <div className="mt-16 w-full max-w-lg">
          <p className="text-label text-muted mb-4">Design System Tokens</p>
          
          {/* Color Swatches */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            <div className="h-12 rounded-xl bg-plum" title="Plum"></div>
            <div className="h-12 rounded-xl bg-pink" title="Pink"></div>
            <div className="h-12 rounded-xl bg-cream border border-line" title="Cream"></div>
            <div className="h-12 rounded-xl bg-peach" title="Peach"></div>
            <div className="h-12 rounded-xl bg-pink-pale" title="Pink Pale"></div>
            <div className="h-12 rounded-xl bg-rose-white" title="Rose White"></div>
            <div className="h-12 rounded-xl bg-verified-green" title="Verified Green"></div>
            <div className="h-12 rounded-xl bg-error" title="Error"></div>
          </div>

          {/* Card Demo */}
          <div className="card">
            <h3 className="text-h3 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
              Trust is the mechanism
            </h3>
            <p className="text-body text-muted">
              Connection is the promise. Every profile you see belongs to a real, verified person.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
