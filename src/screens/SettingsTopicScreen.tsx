import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileDraft } from '@/stores/profile-draft-store';
import { useUIStore } from '@/stores/ui-store';
import { BackButton, Button, Footer, Item, Kicker, Pill, Screen, Section, VerifiedBadge } from '@/ui/kit';

function Toggle({ id, label, sub, on, onChange }: { id: string; label: string; sub?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="bd-row" style={{ cursor: 'pointer' }}>
      <span>
        {label}
        {sub && <span className="sub">{sub}</span>}
      </span>
      <input id={id} type="checkbox" role="switch" checked={on} onChange={(e) => onChange(e.target.checked)} style={{ width: 24, height: 24, accentColor: 'var(--bd-plum)', flex: 'none' }} />
    </label>
  );
}

const TOPICS = ['notifications', 'privacy', 'verification', 'blocked', 'report', 'delete'] as const;
type Topic = (typeof TOPICS)[number];

export function SettingsTopicScreen() {
  const { topic = '' } = useParams();
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);
  const logout = useAuthStore((s) => s.logout);
  const isVerified = useAuthStore((s) => s.isVerified);
  const resetDraft = useProfileDraft((s) => s.reset);

  const [notif, setNotif] = useState({ matches: true, messages: true, tips: false });
  const [priv, setPriv] = useState({ incognito: false, hideDistance: false, verifiedOnly: true });
  const [reportReason, setReportReason] = useState('');
  const [confirmText, setConfirmText] = useState('');

  if (!TOPICS.includes(topic as Topic)) return <Navigate to="/you" replace />;

  const body = {
    notifications: (
      <>
        <Toggle id="n1" label="New matches" on={notif.matches} onChange={(v) => setNotif({ ...notif, matches: v })} />
        <Toggle id="n2" label="Messages" on={notif.messages} onChange={(v) => setNotif({ ...notif, messages: v })} />
        <Toggle id="n3" label="Tips and updates" sub="Safety tips and product news" on={notif.tips} onChange={(v) => setNotif({ ...notif, tips: v })} />
      </>
    ),
    privacy: (
      <>
        <Toggle id="p1" label="Incognito mode" sub="Only people you like can see you" on={priv.incognito} onChange={(v) => setPriv({ ...priv, incognito: v })} />
        <Toggle id="p2" label="Hide exact distance" sub="Show a rounded distance only" on={priv.hideDistance} onChange={(v) => setPriv({ ...priv, hideDistance: v })} />
        <Toggle id="p3" label="Only verified people can message me" on={priv.verifiedOnly} onChange={(v) => setPriv({ ...priv, verifiedOnly: v })} />
      </>
    ),
    verification: (
      <div className="bd-hero plum" style={{ marginTop: 14 }}>
        {isVerified ? <VerifiedBadge label="Bae'd Verified" /> : <span className="bd-small">Not verified yet</span>}
        <div className="bd-serif" style={{ fontSize: 26, margin: '12px 0 6px' }}>
          {isVerified ? 'Your identity is verified.' : 'Verify to appear in Discover.'}
        </div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>We keep only the result and a reference number. Your ID image and selfie were deleted.</div>
      </div>
    ),
    blocked: (
      <div className="bd-hero pale" style={{ marginTop: 14 }}>
        <div className="bd-kicker">Nobody blocked</div>
        <div className="bd-serif" style={{ fontSize: 24, margin: '8px 0 4px' }}>
          Your list is empty.
        </div>
        <div className="bd-small bd-muted">People you block show up here, and you can unblock them.</div>
      </div>
    ),
    report: (
      <>
        <div className="bd-chips" style={{ margin: '14px 0' }}>
          {['Something is broken', 'Someone is misusing the app', 'My account', 'Something else'].map((r) => (
            <Pill key={r} selected={reportReason === r} onClick={() => setReportReason(r)}>
              {r}
            </Pill>
          ))}
        </div>
        <div className="bd-field">
          <label htmlFor="r-detail">What happened</label>
          <textarea id="r-detail" className="bd-input" style={{ minHeight: 120 }} placeholder="Tell us what you saw" />
        </div>
      </>
    ),
    delete: (
      <>
        <Section title="What is erased">
          <Item title="Your profile, photos and matches" />
          <Item title="Your messages" />
          <Item title="Your verification result and reference" />
        </Section>
        <Section title="When">
          <Item title="Right away from the app" sub="Backups are cleared within 30 days." />
        </Section>
        <div className="bd-field" style={{ marginTop: 24 }}>
          <label htmlFor="del-confirm">Type DELETE to confirm</label>
          <input id="del-confirm" className="bd-input" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} autoComplete="off" />
        </div>
      </>
    ),
  }[topic as Topic];

  const titles: Record<Topic, [string, string]> = {
    notifications: ['Settings', 'Notifications'],
    privacy: ['Settings', 'Privacy and safety'],
    verification: ['Settings', 'Verification'],
    blocked: ['Settings', 'Blocked people'],
    report: ['Help', 'Report a problem'],
    delete: ['Account', 'Delete your account'],
  };
  const [kicker, title] = titles[topic as Topic];
  const hasFooter = topic === 'report' || topic === 'delete';

  return (
    <>
      <Screen footer={hasFooter}>
        <div className="bd-topbar">
          <BackButton to="/you" />
        </div>
        <Kicker>{kicker}</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 14px' }}>
          {title}
        </h1>
        {body}
      </Screen>
      {topic === 'report' && (
        <Footer>
          <Button
            disabled={!reportReason}
            onClick={() => {
              addToast({ type: 'success', title: 'Thanks, we got it', message: "We'll look into it." });
              navigate('/you');
            }}
          >
            Send
          </Button>
        </Footer>
      )}
      {topic === 'delete' && (
        <Footer>
          <Button
            variant="danger"
            disabled={confirmText.trim() !== 'DELETE'}
            onClick={() => {
              resetDraft();
              logout();
              addToast({ type: 'info', title: 'Account deleted', message: 'Your data has been erased.' });
              navigate('/welcome', { replace: true });
            }}
          >
            Delete my account
          </Button>
        </Footer>
      )}
    </>
  );
}
