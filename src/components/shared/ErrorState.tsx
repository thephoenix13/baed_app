interface ErrorStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div className="error-state">
      <div className="error-state-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-section-title mb-2">{title}</h3>
      {description && <p className="text-body-secondary mb-6">{description}</p>}
      {action}
    </div>
  );
}
