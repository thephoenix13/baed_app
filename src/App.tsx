import { fontDisplay, fontSans, typeScale } from './lib/fonts';

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      {/* ═══ HERO SECTION ═══ */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Brand Pill */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-pink-pale">
            <span className="text-label text-plum">Verified-First Dating</span>
          </div>
        </div>

        {/* Hero Headline — Using fontDisplay module */}
        <h1
          className={typeScale.hero + ' text-plum mb-4'}
          style={fontDisplay.style}
        >
          Bae'd
        </h1>

        <p className={typeScale.h2 + ' text-plum mb-6'}>
          Dating, without the doubt.
        </p>

        {/* Lead Text */}
        <p className={typeScale.lead + ' max-w-md mb-10'}>
          Every person on Bae'd is verified. Real identities. Real intentions.
          Real connections.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-ghost">Learn More</button>
        </div>

        {/* Verified Badge */}
        <div className="mt-12">
          <div className="verified-badge">
            <svg
              className="verified-badge-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="verified-badge-text">Identity Verified</span>
          </div>
        </div>
      </section>

      {/* ═══ TYPOGRAPHY SHOWCASE ═══ */}
      <section className="px-4 py-10 max-w-2xl mx-auto">
        <p className="text-label text-muted mb-6">Typography Scale</p>

        <div className="space-5 flex flex-col gap-6">
          {/* Hero */}
          <div className="card">
            <p className="text-label text-muted mb-2">Hero — DM Serif Display</p>
            <h2 className="text-hero text-plum" style={fontDisplay.style}>
              The quick brown fox
            </h2>
            <p className="text-body text-muted mt-2">
              clamp(52px, 7vw, 88px) · 400 · -3px tracking
            </p>
          </div>

          {/* H1 */}
          <div className="card">
            <p className="text-label text-muted mb-2">H1 — DM Serif Display</p>
            <h2 className="text-h1 text-plum">
              Connections worth trusting
            </h2>
            <p className="text-body text-muted mt-2">
              clamp(38px, 5vw, 64px) · 400 · -2px tracking
            </p>
          </div>

          {/* H2 */}
          <div className="card">
            <p className="text-label text-muted mb-2">H2 — DM Serif Display</p>
            <h3 className="text-h2 text-plum">
              Verified first, always
            </h3>
            <p className="text-body text-muted mt-2">
              clamp(28px, 4vw, 44px) · 400 · -1.5px tracking
            </p>
          </div>

          {/* H3 */}
          <div className="card">
            <p className="text-label text-muted mb-2">H3 — Inter 700</p>
            <h4 className="text-h3 text-ink" style={fontSans.style}>
              Real people. Real intentions.
            </h4>
            <p className="text-body text-muted mt-2">
              22px · 700 · Inter
            </p>
          </div>

          {/* Lead */}
          <div className="card">
            <p className="text-label text-muted mb-2">Lead — Inter 400</p>
            <p className="text-lead text-muted">
              Trust is the mechanism; connection is the promise. Every profile
              you see belongs to a verified person.
            </p>
            <p className="text-body text-muted mt-2">
              19px · 400 · Inter · muted
            </p>
          </div>

          {/* Body */}
          <div className="card">
            <p className="text-label text-muted mb-2">Body — Inter 400</p>
            <p className="text-body text-ink">
              Bae'd is India's first verified-first dating app. We believe that
              when you know someone is who they say they are, you can focus on
              what matters — building a real connection.
            </p>
            <p className="text-body text-muted mt-2">
              16px · 400 · Inter · ink
            </p>
          </div>

          {/* Label */}
          <div className="card">
            <p className="text-label text-muted mb-2">Label — Inter 800</p>
            <p className="text-label text-plum">
              Verified · Trusted · Real
            </p>
            <p className="text-body text-muted mt-2">
              11px · 800 · UPPERCASE · 2.5px tracking
            </p>
          </div>
        </div>
      </section>

      {/* ═══ COLOR SHOWCASE ═══ */}
      <section className="px-4 py-10 max-w-2xl mx-auto">
        <p className="text-label text-muted mb-6">Color Tokens</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Plum', bg: 'bg-plum', text: 'text-white', hex: '#1B0B2C' },
            { name: 'Pink', bg: 'bg-pink', text: 'text-white', hex: '#D9607E' },
            { name: 'Cream', bg: 'bg-cream', text: 'text-ink', hex: '#FDF7F0', border: true },
            { name: 'Peach', bg: 'bg-peach', text: 'text-ink', hex: '#FFE0D8' },
            { name: 'Pink Pale', bg: 'bg-pink-pale', text: 'text-plum', hex: '#FDE8EF' },
            { name: 'Rose White', bg: 'bg-rose-white', text: 'text-ink', hex: '#FFF0F3' },
            { name: 'Verified', bg: 'bg-verified-green', text: 'text-white', hex: '#2B7A57' },
            { name: 'Error', bg: 'bg-error', text: 'text-white', hex: '#B83D55' },
          ].map((color) => (
            <div
              key={color.name}
              className={`h-20 rounded-xl ${color.bg} ${color.text} flex flex-col items-center justify-center ${
                color.border ? 'border border-line' : ''
              }`}
            >
              <span className="text-body font-semibold">{color.name}</span>
              <span className="text-xs opacity-70 font-mono">{color.hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ COMPONENT SHOWCASE ═══ */}
      <section className="px-4 py-10 max-w-2xl mx-auto">
        <p className="text-label text-muted mb-6">Components</p>

        <div className="flex flex-col gap-4">
          {/* Buttons */}
          <div className="card">
            <p className="text-label text-muted mb-4">Buttons</p>
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-primary">Primary</button>
              <button className="btn btn-secondary">Secondary</button>
              <button className="btn btn-ghost">Ghost</button>
              <button className="btn btn-primary btn-disabled">Disabled</button>
            </div>
          </div>

          {/* Verified Badge */}
          <div className="card">
            <p className="text-label text-muted mb-4">Verified Badge</p>
            <div className="verified-badge">
              <svg
                className="verified-badge-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="verified-badge-text">Identity Verified</span>
            </div>
          </div>

          {/* Pills */}
          <div className="card">
            <p className="text-label text-muted mb-4">Pills / Tags</p>
            <div className="flex flex-wrap gap-2">
              <span className="pill">Coffee lover</span>
              <span className="pill">Travel</span>
              <span className="pill pill-active">Mumbai</span>
              <span className="pill">Long-term</span>
            </div>
          </div>

          {/* Input */}
          <div className="card">
            <p className="text-label text-muted mb-4">Input</p>
            <label className="block text-body font-semibold text-ink mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              className="input"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-4 py-10 text-center bg-plum-deep text-dark-text mt-10">
        <p className="text-h3 mb-2" style={fontDisplay.style}>
          Bae'd
        </p>
        <p className="text-lead text-dark-muted">
          Dating, without the doubt.
        </p>
        <p className="text-body text-dark-muted mt-4">
          Mumbai · Pune · Bengaluru
        </p>
      </footer>
    </div>
  );
}
