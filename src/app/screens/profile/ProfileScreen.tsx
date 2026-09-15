import { Avatar } from '@/components/shared/Avatar';

interface ProfileScreenProps {
  onLogout: () => void;
}

export function ProfileScreen({ onLogout }: ProfileScreenProps) {
  return (
    <div className="page">
      <div className="page-content">
        {/* Profile Header */}
        <div className="text-center py-8">
          {/* Large Avatar */}
          <Avatar size="xl" variant="gradient" verified={true} className="mx-auto mb-4" />

          {/* Name, Age, Verified */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-section-title">Priya</h1>
            <span className="text-section-title font-light">26</span>
          </div>

          {/* Short Bio */}
          <p className="text-body-secondary max-w-xs mx-auto mb-6">
            Coffee enthusiast and weekend hiker. Looking for someone to explore the city with.
          </p>

          {/* Edit Profile Button */}
          <button className="btn btn-primary" style={{ width: 'auto', padding: '0 32px' }}>
            Edit profile
          </button>
        </div>

        {/* Profile Section */}
        <div className="mb-8">
          <p className="text-section-label mb-4">PROFILE</p>
          <button className="list-row w-full">
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-body">Edit profile</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Discover Section */}
        <div className="mb-8">
          <p className="text-section-label mb-4">DISCOVER</p>
          <button className="list-row w-full">
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-body">Discovery preferences</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Notifications Section */}
        <div className="mb-8">
          <p className="text-section-label mb-4">NOTIFICATIONS</p>
          <button className="list-row w-full">
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-body">Notification settings</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Privacy Section */}
        <div className="mb-8">
          <p className="text-section-label mb-4">PRIVACY</p>
          <button className="list-row w-full">
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-body">Privacy & safety</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Account Section */}
        <div className="mb-8">
          <p className="text-section-label mb-4">ACCOUNT</p>
          
          <button className="list-row w-full">
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-body">Blocked users</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <button className="list-row w-full">
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-body">Report a problem</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <button onClick={onLogout} className="list-row w-full">
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-chip)] flex items-center justify-center mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-body" style={{ color: 'var(--color-error)' }}>Log out</p>
            </div>
          </button>
        </div>

        {/* Version */}
        <p className="text-small text-center pb-4">Bae'd v1.0.0</p>
      </div>
    </div>
  );
}
