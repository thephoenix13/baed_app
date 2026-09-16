interface WhyVerifyScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

export function WhyVerifyScreen({ onContinue, onBack }: WhyVerifyScreenProps) {
  return (
    <div className="page flex flex-col">
      {/* Header with back button and progress */}
      <div className="page-header flex items-center justify-between">
        <button onClick={onBack} className="btn-icon -ml-3" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-border)]"></div>
        </div>
      </div>

      <div className="page-content flex-1 flex flex-col">
        {/* Hero section */}
        <div className="mb-12">
          {/* Minimal verification icon */}
          <div className="mb-8">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-screen-title mb-3">
            Real people. Real connections.
          </h1>
          
          {/* Supporting text */}
          <p className="text-body-secondary">
            Everyone here verifies their identity. It keeps the community safer and more genuine.
          </p>
        </div>

        {/* Benefits - simple rows */}
        <div className="space-y-6 mb-12 flex-1">
          {/* Benefit 1 */}
          <div className="flex items-start gap-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div>
              <p className="text-body font-medium mb-1">Real people</p>
              <p className="text-caption">Every profile belongs to a verified person.</p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex items-start gap-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div>
              <p className="text-body font-medium mb-1">Safer conversations</p>
              <p className="text-caption">Verification helps reduce fake and abusive accounts.</p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex items-start gap-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div>
              <p className="text-body font-medium mb-1">Better connections</p>
              <p className="text-caption">Spend less time filtering. More time connecting.</p>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="pb-8">
          <button onClick={onContinue} className="btn btn-primary mb-4">
            Continue
          </button>
          <button className="btn btn-ghost w-full">
            Why do we need this?
          </button>
        </div>
      </div>
    </div>
  );
}
