interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient' | 'gradient-rich';
  verified?: boolean;
  className?: string;
}

export function Avatar({ size = 'md', variant = 'default', verified = false, className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl',
  };

  const variantClasses = {
    default: '',
    gradient: 'avatar-gradient',
    'gradient-rich': 'avatar-gradient-rich',
  };

  return (
    <div className={`avatar ${sizeClasses[size]} ${variantClasses[variant]} relative ${className}`}>
      {verified && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-[var(--color-bg)]">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3">
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
      )}
    </div>
  );
}
