interface ProfilePreviewScreenProps {
  onSubmit: () => void;
  onBack: () => void;
}

export function ProfilePreviewScreen({ onSubmit, onBack }: ProfilePreviewScreenProps) {
  return (
    <div className="page flex flex-col">
      {/* Header */}
      <div className="page-header flex items-center">
        <button onClick={onBack} className="btn-icon -ml-3" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="page-content flex-1">
        {/* Title section */}
        <div className="mb-8">
          <h1 className="text-screen-title mb-2">Your profile</h1>
          <p className="text-body-secondary">This is how people will see you.</p>
        </div>

        {/* Profile card - looks like Discover card */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-[#E8B4B8] to-[#D4A5A5] rounded-[var(--radius-xl)] overflow-hidden mb-6 shadow-[var(--shadow-lg)]">
          {/* Photo area - gradient simulating a photo */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5D5D8] via-[#E8B4B8] to-[#C99A9D]"></div>
          
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {/* Profile info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {/* Name, age, verified */}
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[28px] font-semibold">Priya</h2>
              <span className="text-[28px] font-light">26</span>
              <div className="badge badge-success" style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span style={{ fontSize: 11, color: 'white' }}>Verified</span>
              </div>
            </div>
            
            {/* City */}
            <p className="text-[15px] text-white/90">Mumbai</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <p className="text-body-secondary">
            Coffee enthusiast and weekend hiker. Looking for someone to explore the city with.
          </p>
        </div>

        {/* Interests */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {['Coffee', 'Travel', 'Music', 'Fitness', 'Reading'].map((i) => (
              <span key={i} className="chip" style={{ height: 32, padding: '0 12px', fontSize: 13 }}>
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="page-content pb-8 space-y-3">
        <button onClick={onSubmit} className="btn btn-primary">
          Looks good
        </button>
        <button onClick={onBack} className="btn btn-ghost">
          Edit profile
        </button>
      </div>
    </div>
  );
}
