interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="loading-state">
      <div className="loading-spinner-lg" />
      {message && <p className="text-body-secondary">{message}</p>}
    </div>
  );
}
