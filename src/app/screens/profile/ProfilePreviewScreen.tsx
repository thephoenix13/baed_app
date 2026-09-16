import { ProfileCard } from '@/components/shared/ProfileCard';

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
        <div className="mb-6">
          <ProfileCard
            name="Priya"
            age={26}
            city="Mumbai"
            distance={0}
            bio="Coffee enthusiast and weekend hiker. Looking for someone to explore the city with."
            interests={['Coffee', 'Travel', 'Music', 'Fitness', 'Reading']}
            verified={true}
            variant="gradient-rich"
          />
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
