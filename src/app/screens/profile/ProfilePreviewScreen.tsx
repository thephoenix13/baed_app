interface ProfilePreviewScreenProps {
  onSubmit: () => void;
  onBack: () => void;
}

export function ProfilePreviewScreen({ onSubmit, onBack }: ProfilePreviewScreenProps) {
  return (
    <div className="page flex flex-col">
      <div className="page-header flex items-center">
        <button onClick={onBack} className="btn-icon -ml-3" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="page-content flex-1">
        <h1 className="text-screen-title mb-6">Preview your profile</h1>

        {/* Profile card preview */}
        <div className="card mb-6">
          {/* Photo placeholder */}
          <div className="aspect-[3/4] bg-[var(--color-bg-chip)] rounded-[var(--radius-md)] mb-4 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* Name + verified */}
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-section-title">Priya, 26</h2>
            <div className="badge badge-success">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span style={{ fontSize: 11 }}>Verified</span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-body-secondary mb-3">
            Coffee enthusiast and weekend hiker. Looking for someone to explore the city with.
          </p>

          {/* Interests */}
          <div className="flex flex-wrap gap-1.5">
            {['Coffee', 'Travel', 'Music', 'Fitness', 'Reading'].map((i) => (
              <span key={i} className="chip" style={{ height: 28, padding: '0 10px', fontSize: 12 }}>
                {i}
              </span>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="card bg-[var(--color-bg-chip)] border-none mb-6">
          <p className="text-caption">
            👀 Your profile will be reviewed by our team before going live. This usually takes a few minutes.
          </p>
        </div>
      </div>

      <div className="page-content pb-8 space-y-3">
        <button onClick={onSubmit} className="btn btn-primary">
          Submit Profile
        </button>
        <button onClick={onBack} className="btn btn-ghost">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
