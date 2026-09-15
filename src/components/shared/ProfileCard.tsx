import { Avatar } from './Avatar';

interface ProfileCardProps {
  name: string;
  age: number;
  city: string;
  distance: number;
  occupation?: string;
  bio?: string;
  interests?: string[];
  verified?: boolean;
  variant?: 'default' | 'gradient-rich';
}

export function ProfileCard({
  name,
  age,
  city,
  distance,
  occupation,
  bio,
  interests = [],
  verified = false,
  variant = 'default',
}: ProfileCardProps) {
  return (
    <div className="profile-card">
      {/* Background */}
      <div className={`absolute inset-0 ${variant === 'gradient-rich' ? 'avatar-gradient-rich' : 'avatar-gradient'}`} />

      {/* Overlay */}
      <div className="profile-card-overlay">
        {/* Name, age, verified */}
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-profile-name">{name}</h2>
          <span className="text-profile-age">{age}</span>
          {verified && (
            <div className="profile-card-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="profile-card-badge-text">Verified</span>
            </div>
          )}
        </div>

        {/* Occupation and location */}
        <div className="mb-3">
          {occupation && <p className="text-profile-detail mb-1">{occupation}</p>}
          <p className="text-profile-location">{city} · {distance} km away</p>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-profile-bio mb-3 line-clamp-2">{bio}</p>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {interests.slice(0, 3).map((interest) => (
              <span key={interest} className="profile-card-interest">
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
