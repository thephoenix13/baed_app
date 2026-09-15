import { fontDisplay } from '@/lib/fonts';

interface ProfilePreviewScreenProps {
  onSubmit: () => void;
  onBack: () => void;
}

export function ProfilePreviewScreen({ onSubmit, onBack }: ProfilePreviewScreenProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="px-6 pt-12 pb-4">
        <button onClick={onBack} className="btn btn-ghost !px-3 !py-2" aria-label="Go back">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-6">
        <h1 className="text-h2 text-plum mb-6" style={fontDisplay.style}>
          Preview your profile
        </h1>

        {/* Profile Card Preview */}
        <div className="card-elevated mb-6">
          {/* Photo */}
          <div className="aspect-[3/4] bg-pink-pale rounded-xl mb-4 flex items-center justify-center">
            <svg className="w-16 h-16 text-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* Name + Age */}
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-h3 text-ink">Priya, 26</h2>
            <div className="verified-badge !px-2 !py-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="text-xs">Verified</span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-body text-muted mb-3">
            Coffee enthusiast and weekend hiker. Looking for someone to explore the city with.
          </p>

          {/* Interests */}
          <div className="flex flex-wrap gap-1.5">
            {['Coffee', 'Travel', 'Music', 'Fitness', 'Reading'].map((i) => (
              <span key={i} className="pill !text-xs !px-2 !py-0.5">{i}</span>
            ))}
          </div>
        </div>

        <div className="bg-pink-pale rounded-xl p-4 mb-6">
          <p className="text-body text-plum text-sm">
            👀 Your profile will be reviewed by our team before going live. This usually takes a few minutes.
          </p>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-3">
        <button onClick={onSubmit} className="btn btn-primary w-full">
          Submit Profile
        </button>
        <button onClick={onBack} className="btn btn-ghost w-full">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
