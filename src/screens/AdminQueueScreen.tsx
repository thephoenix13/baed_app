import { useState } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { Icon } from '@/ui/Icon';
import { Avatar, BackButton, Button, Kicker, Screen } from '@/ui/kit';

export interface QueueItem {
  id: string;
  name: string;
  detail: string;
  status: string;
  tone: 'amber' | 'pink' | 'error';
  when: string;
  note?: string;
}

interface AdminQueueProps {
  kicker: string;
  title: string;
  approve: string;
  reject: string;
  items: QueueItem[];
}

const TONE = {
  amber: 'var(--bd-amber)',
  pink: 'var(--bd-pink)',
  error: 'var(--bd-error)',
} as const;

/** Flat, dense queue for the team tools. Every decision records an audit entry once the backend exists. */
export function AdminQueueScreen({ kicker, title, approve, reject, items }: AdminQueueProps) {
  const addToast = useUIStore((s) => s.addToast);
  const [queue, setQueue] = useState(items);

  const decide = (item: QueueItem, label: string) => {
    setQueue((q) => q.filter((x) => x.id !== item.id));
    addToast({ type: 'success', title: `${label}: ${item.name}`, message: 'Recorded in the audit log.' });
  };

  return (
    <Screen wash={false}>
      <div className="bd-topbar">
        <BackButton to="/you" />
      </div>
      <Kicker>{kicker}</Kicker>
      <h1 className="bd-title" style={{ margin: '10px 0 4px' }}>
        {title}
      </h1>
      <p className="bd-small bd-muted" style={{ margin: '0 0 16px' }}>
        {queue.length} waiting
      </p>

      {queue.length === 0 && (
        <div className="bd-hero pale">
          <div className="bd-kicker">Queue clear</div>
          <div className="bd-serif" style={{ fontSize: 24, margin: '8px 0 0' }}>
            Nothing is waiting.
          </div>
        </div>
      )}

      {queue.map((item) => (
        <article key={item.id} style={{ borderTop: '1.5px dotted var(--bd-dotted)', padding: '16px 0 18px' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Avatar seed={item.id} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700 }}>{item.name}</div>
              <div className="bd-small bd-muted">
                {item.detail} · {item.when}
              </div>
            </div>
            <span
              className="bd-pill static"
              style={{ borderColor: TONE[item.tone], color: TONE[item.tone], fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 800, padding: '5px 9px' }}
            >
              {item.status}
            </span>
          </div>
          {item.note && (
            <p className="bd-small" style={{ margin: '10px 0 0', display: 'flex', gap: 8 }}>
              <Icon name="warn" size={16} style={{ color: 'var(--bd-amber)', flex: 'none', marginTop: 1 }} />
              {item.note}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <Button onClick={() => decide(item, approve)} style={{ minHeight: 42, padding: '10px 16px', fontSize: 14 }}>
              {approve}
            </Button>
            <Button variant="ghost" onClick={() => decide(item, reject)} style={{ minHeight: 42, padding: '10px 16px', fontSize: 14, color: 'var(--bd-error)' }}>
              {reject}
            </Button>
          </div>
        </article>
      ))}
    </Screen>
  );
}

export function AdminVerificationScreen() {
  return (
    <AdminQueueScreen
      kicker="Team tools"
      title="Verification queue"
      approve="Approve"
      reject="Reject"
      items={[
        { id: 'v-001', name: 'Rahul S., 28', detail: 'Aadhaar · Mumbai', status: 'Processing', tone: 'amber', when: '2 min ago' },
        { id: 'v-002', name: 'Ananya M., 25', detail: 'PAN card · Pune', status: 'Manual review', tone: 'pink', when: '15 min ago', note: 'Face match score is below the automatic threshold.' },
        { id: 'v-003', name: 'Vikram P., 31', detail: 'Passport · Bengaluru', status: 'Manual review', tone: 'pink', when: '1 hour ago' },
        { id: 'v-004', name: "Sneha K., 27", detail: "Driver's licence · Mumbai", status: 'Processing', tone: 'amber', when: '3 hours ago' },
      ]}
    />
  );
}

export function AdminModerationScreen() {
  return (
    <AdminQueueScreen
      kicker="Team tools"
      title="Photo moderation"
      approve="Approve photo"
      reject="Remove photo"
      items={[
        { id: 'p-001', name: 'Rahul S.', detail: 'Profile photo', status: 'In review', tone: 'amber', when: '5 min ago', note: 'Uncertain authenticity. Possible stock image.' },
        { id: 'p-002', name: 'Neha T.', detail: 'Photo 3', status: 'Flagged', tone: 'error', when: '22 min ago', note: 'Reported by 2 people as not matching the verified selfie.' },
        { id: 'p-003', name: 'Arjun D.', detail: 'Profile photo', status: 'In review', tone: 'amber', when: '1 hour ago' },
      ]}
    />
  );
}
