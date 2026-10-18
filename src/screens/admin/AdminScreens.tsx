import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores/ui-store';
import { AdminQueueScreen } from '@/screens/AdminQueueScreen';
import { Avatar, BackButton, Button, Kicker, Row, Screen, Section, Sheet, VerifiedBadge } from '@/ui/kit';

/* ─── Dashboard ─── numbers are demo values until the admin API exists ─── */

const STATS = [
  { label: 'Verifications waiting', value: '4', to: '/admin/verification' },
  { label: 'Open reports', value: '3', to: '/admin/reports' },
  { label: 'Risk cases', value: '2', to: '/admin/risk' },
  { label: 'Photos in review', value: '3', to: '/admin/moderation' },
];

export function AdminDashboardScreen() {
  const navigate = useNavigate();
  return (
    <Screen wash={false}>
      <div className="bd-topbar">
        <BackButton to="/you" />
      </div>
      <Kicker>Team console</Kicker>
      <h1 className="bd-title" style={{ margin: '10px 0 18px' }}>
        What needs a person.
      </h1>

      <div className="bd-hero plum">
        <div className="bd-kicker" style={{ color: 'var(--bd-pink-light)' }}>
          Waiting now
        </div>
        <div className="bd-serif" style={{ fontSize: 52, lineHeight: 1, margin: '8px 0 4px' }}>
          {STATS.reduce((n, s) => n + Number(s.value), 0)}
        </div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>items across all queues. Demo numbers until the admin API is connected.</div>
      </div>

      <Section title="Queues">
        {STATS.map((s) => (
          <Row key={s.label} title={s.label} trailing={<span className="bd-serif" style={{ fontSize: 24 }}>{s.value}</span>} onClick={() => navigate(s.to)} />
        ))}
      </Section>
      <Section title="People">
        <Row title="Find a user" sub="Look up by name or ID" onClick={() => navigate('/admin/users')} />
      </Section>
    </Screen>
  );
}

/* ─── Users ─── */

interface AdminUser {
  id: string;
  name: string;
  city: string;
  verification: 'Verified' | 'In review' | 'Failed';
  reports: number;
  suspended: boolean;
}

const USERS: AdminUser[] = [
  { id: 'u-1001', name: 'Rahul S.', city: 'Mumbai', verification: 'In review', reports: 0, suspended: false },
  { id: 'u-1002', name: 'Ananya M.', city: 'Pune', verification: 'Verified', reports: 1, suspended: false },
  { id: 'u-1003', name: 'Vikram P.', city: 'Bengaluru', verification: 'Verified', reports: 0, suspended: false },
  { id: 'u-1004', name: 'Neha T.', city: 'Mumbai', verification: 'Verified', reports: 3, suspended: false },
  { id: 'u-1005', name: 'Sneha K.', city: 'Delhi', verification: 'Failed', reports: 0, suspended: true },
];

export function AdminUsersScreen() {
  const addToast = useUIStore((s) => s.addToast);
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState(USERS);
  const [openId, setOpenId] = useState<string | null>(null);

  const shown = useMemo(
    () => users.filter((u) => `${u.name} ${u.id} ${u.city}`.toLowerCase().includes(query.trim().toLowerCase())),
    [users, query],
  );
  const open = users.find((u) => u.id === openId) ?? null;

  const toggleSuspend = (u: AdminUser) => {
    setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, suspended: !x.suspended } : x)));
    addToast({ type: 'success', title: u.suspended ? `Reinstated ${u.name}` : `Suspended ${u.name}`, message: 'Recorded in the audit log.' });
    setOpenId(null);
  };

  return (
    <Screen wash={false}>
      <div className="bd-topbar">
        <BackButton to="/admin" />
      </div>
      <Kicker>Team console</Kicker>
      <h1 className="bd-title" style={{ margin: '10px 0 16px' }}>
        Find a user.
      </h1>
      <div className="bd-field">
        <label htmlFor="au-q">Name, ID or city</label>
        <input id="au-q" className="bd-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
      </div>

      <div style={{ marginTop: 14 }}>
        {shown.length === 0 && <p className="bd-small bd-muted">No one matches that search.</p>}
        {shown.map((u) => (
          <button key={u.id} type="button" className="bd-row" style={{ gap: 14, justifyContent: 'flex-start' }} onClick={() => setOpenId(u.id)}>
            <Avatar seed={u.id} />
            <span style={{ flex: 1, minWidth: 0 }}>
              {u.name}
              <span className="sub">
                {u.id} · {u.city}
              </span>
            </span>
            {u.suspended && (
              <span className="bd-pill static" style={{ borderColor: 'var(--bd-error)', color: 'var(--bd-error)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, padding: '5px 10px' }}>
                Suspended
              </span>
            )}
          </button>
        ))}
      </div>

      <Sheet open={!!open} onClose={() => setOpenId(null)} label="User details">
        {open && (
          <>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <Avatar seed={open.id} size="lg" />
              <div>
                <div className="bd-serif" style={{ fontSize: 26, lineHeight: 1.05 }}>{open.name}</div>
                <div className="bd-small bd-muted">
                  {open.id} · {open.city}
                </div>
              </div>
            </div>
            <div style={{ margin: '16px 0 6px' }}>
              {open.verification === 'Verified' ? <VerifiedBadge /> : <span className="bd-pill static">{open.verification}</span>}
            </div>
            <Row title="Reports against this user" trailing={<span className="bd-serif" style={{ fontSize: 22 }}>{open.reports}</span>} />
            <p className="bd-small bd-muted" style={{ margin: '4px 0 14px' }}>
              ID images and selfies are never shown here. Only the verification result and its reference.
            </p>
            <Button variant={open.suspended ? 'primary' : 'danger'} onClick={() => toggleSuspend(open)}>
              {open.suspended ? 'Reinstate account' : 'Suspend account'}
            </Button>
          </>
        )}
      </Sheet>
    </Screen>
  );
}

/* ─── Reports and risk ─── */

export function AdminReportsScreen() {
  return (
    <AdminQueueScreen
      kicker="Team console"
      title="Reports"
      approve="Take action"
      reject="Dismiss"
      items={[
        { id: 'r-001', name: 'Report on Neha T.', detail: 'Asked for money · 2 reports', status: 'Open', tone: 'error', when: '12 min ago', note: 'Chat contains a UPI request in the first message.' },
        { id: 'r-002', name: 'Report on Ananya M.', detail: 'Fake photos · 1 report', status: 'Open', tone: 'amber', when: '1 hour ago' },
        { id: 'r-003', name: 'Report on Karan B.', detail: 'Harassment · 1 report', status: 'Open', tone: 'amber', when: '3 hours ago' },
      ]}
    />
  );
}

export function AdminRiskScreen() {
  return (
    <AdminQueueScreen
      kicker="Team console"
      title="Risk cases"
      approve="Escalate"
      reject="Close case"
      items={[
        { id: 'k-001', name: 'Neha T.', detail: 'Romance-scam pattern', status: 'High', tone: 'error', when: '20 min ago', note: 'Money request, off-app push and 3 reports in one day.' },
        { id: 'k-002', name: 'Rahul S.', detail: 'Reused photo', status: 'Medium', tone: 'amber', when: '2 hours ago', note: 'Photo matches another account that was suspended.' },
      ]}
    />
  );
}
