interface AdminModerationScreenProps {
  onBack: () => void;
}

const MOCK_PHOTOS = [
  {
    id: 'p-001',
    userName: 'Rahul S.',
    status: 'IN_REVIEW',
    layer: 'LLM',
    reason: 'Uncertain authenticity',
    uploadedAt: '5 min ago',
    nsfwScore: 0.12,
    aiScore: 0.72,
    qualityScore: 0.65,
  },
  {
    id: 'p-002',
    userName: 'Ananya M.',
    status: 'IN_REVIEW',
    layer: 'CLASSIFIER',
    reason: 'Low quality score',
    uploadedAt: '20 min ago',
    nsfwScore: 0.05,
    aiScore: 0.15,
    qualityScore: 0.55,
  },
  {
    id: 'p-003',
    userName: 'Vikram P.',
    status: 'IN_REVIEW',
    layer: 'HUMAN',
    reason: 'Multiple faces detected',
    uploadedAt: '1 hour ago',
    nsfwScore: 0.08,
    aiScore: 0.22,
    qualityScore: 0.78,
  },
];

export function AdminModerationScreen({ onBack }: AdminModerationScreenProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="px-6 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="btn-icon" aria-label="Go back">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-screen-title">
          Photo Moderation
        </h1>
      </div>

      {/* Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-4 gap-2">
          <div className="card text-center !p-3">
            <p className="text-section-title text-[var(--color-text)]">3</p>
            <p className="text-small">Queue</p>
          </div>
          <div className="card text-center !p-3">
            <p className="text-section-title text-[var(--color-success)]">89</p>
            <p className="text-small">Auto</p>
          </div>
          <div className="card text-center !p-3">
            <p className="text-section-title text-[var(--color-error)]">12</p>
            <p className="text-small">Rejected</p>
          </div>
          <div className="card text-center !p-3">
            <p className="text-section-title text-[var(--color-warning)]">3</p>
            <p className="text-small">Review</p>
          </div>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="px-6 space-y-3">
        {MOCK_PHOTOS.map((photo) => (
          <div key={photo.id} className="card">
            <div className="flex items-start gap-3 mb-3">
              {/* Photo Placeholder */}
              <div className="w-16 h-16 bg-[var(--color-accent-light)] rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-body font-semibold">{photo.userName}</h3>
                <p className="text-caption">{photo.reason}</p>
                <div className="flex gap-2 mt-1">
                  <span className="chip !text-xs !h-6 !px-2">Layer: {photo.layer}</span>
                  <span className="text-small">{photo.uploadedAt}</span>
                </div>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-[var(--color-bg-chip)] rounded-[var(--radius-sm)] p-2 text-center">
                <p className="text-body font-semibold">{(photo.nsfwScore * 100).toFixed(0)}%</p>
                <p className="text-small">NSFW</p>
              </div>
              <div className="bg-[var(--color-bg-chip)] rounded-[var(--radius-sm)] p-2 text-center">
                <p className="text-body font-semibold">{(photo.aiScore * 100).toFixed(0)}%</p>
                <p className="text-small">AI Gen</p>
              </div>
              <div className="bg-[var(--color-bg-chip)] rounded-[var(--radius-sm)] p-2 text-center">
                <p className="text-body font-semibold">{(photo.qualityScore * 100).toFixed(0)}%</p>
                <p className="text-small">Quality</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="btn btn-primary !h-10 flex-1 text-sm">
                Approve
              </button>
              <button className="btn btn-ghost !h-10 flex-1 text-sm !text-[var(--color-error)]">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Info */}
      <div className="px-6 py-8">
        <div className="card bg-[var(--color-accent-light)]">
          <p className="text-small font-semibold mb-2">Moderation Pipeline</p>
          <div className="space-y-1 text-caption">
            <p>• Layer 1: Rules (instant) — 10% rejected</p>
            <p>• Layer 2: Classifier (~500ms) — 85% auto-approved</p>
            <p>• Layer 3: LLM (~2s) — 3% need review</p>
            <p>• Layer 4: Human — 2% edge cases</p>
          </div>
        </div>
      </div>
    </div>
  );
}
