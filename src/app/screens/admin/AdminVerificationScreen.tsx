interface AdminVerificationScreenProps {
  onBack: () => void;
}

const MOCK_VERIFICATIONS = [
  {
    id: 'v-001',
    name: 'Rahul S.',
    age: 28,
    city: 'Mumbai',
    status: 'PROCESSING',
    submittedAt: '2 min ago',
    documentType: 'Aadhaar',
  },
  {
    id: 'v-002',
    name: 'Ananya M.',
    age: 25,
    city: 'Pune',
    status: 'MANUAL_REVIEW',
    submittedAt: '15 min ago',
    documentType: 'PAN Card',
  },
  {
    id: 'v-003',
    name: 'Vikram P.',
    age: 31,
    city: 'Bengaluru',
    status: 'MANUAL_REVIEW',
    submittedAt: '1 hour ago',
    documentType: 'Passport',
  },
  {
    id: 'v-004',
    name: 'Sneha K.',
    age: 27,
    city: 'Mumbai',
    status: 'PROCESSING',
    submittedAt: '3 hours ago',
    documentType: 'Driver\'s License',
  },
];

const statusColors: Record<string, string> = {
  PROCESSING: 'bg-[var(--color-warning)] text-white',
  MANUAL_REVIEW: 'bg-[var(--color-accent)] text-white',
  VERIFIED: 'bg-[var(--color-success)] text-white',
  FAILED: 'bg-[var(--color-error)] text-white',
};

export function AdminVerificationScreen({ onBack }: AdminVerificationScreenProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="px-6 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="btn-icon" aria-label="Go back">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-screen-title">
          Verification Queue
        </h1>
      </div>

      {/* Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center !p-3">
            <p className="text-section-title text-[var(--color-text)]">24</p>
            <p className="text-small">Pending</p>
          </div>
          <div className="card text-center !p-3">
            <p className="text-section-title text-[var(--color-warning)]">8</p>
            <p className="text-small">Review</p>
          </div>
          <div className="card text-center !p-3">
            <p className="text-section-title text-[var(--color-success)]">142</p>
            <p className="text-small">Verified</p>
          </div>
        </div>
      </div>

      {/* Queue */}
      <div className="px-6 space-y-3">
        {MOCK_VERIFICATIONS.map((v) => (
          <div key={v.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-body font-semibold">{v.name}, {v.age}</h3>
                <p className="text-caption">{v.city} · {v.documentType}</p>
              </div>
              <span className={`chip !text-xs !h-6 ${statusColors[v.status]}`}>
                {v.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex gap-2">
              <button className="btn btn-primary !h-10 flex-1 text-sm">
                Approve
              </button>
              <button className="btn btn-ghost !h-10 flex-1 text-sm !text-[var(--color-error)]">
                Reject
              </button>
            </div>

            <p className="text-small mt-2">
              Submitted {v.submittedAt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
