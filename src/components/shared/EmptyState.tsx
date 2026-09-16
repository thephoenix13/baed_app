interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="text-section-title mb-2">{title}</h3>
      {description && <p className="text-body-secondary mb-6">{description}</p>}
      {action}
    </div>
  );
}
