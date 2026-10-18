import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMatch, getMatchPartner } from '@/modules/matching/services/matching.service';
import { DEMO_USER_ID } from '@/lib/session';
import { useUIStore } from '@/stores/ui-store';
import { Icon } from '@/ui/Icon';
import { Avatar, BackButton, Button, Row, Sheet, VerifiedBadge } from '@/ui/kit';
import { REPORT_REASONS } from './ProfileDetailScreen';

interface Message {
  id: string;
  text: string;
  from: 'me' | 'them';
}

// Messages that ask for money or push the chat off the app get a calm warning.
const RISKY = /(₹|rs\.?\s?\d|\bupi\b|\bpaytm\b|\bgpay\b|bank|\botp\b|send (me )?money|whatsapp|telegram|\bgift card)/i;
const REPLIES = ['Hey! Nice to match with you', 'Hi there! How are you?', 'Hey! What are you up to?', 'Hello! Love your profile'];

export function ChatScreen() {
  const { matchId = '' } = useParams();
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);
  const match = getMatch(matchId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const risky = useMemo(() => messages.some((m) => RISKY.test(m.text)), [messages]);

  if (!match) {
    return (
      <main className="bd-screen">
        <BackButton to="/chats" />
        <div className="bd-center" style={{ textAlign: 'center' }}>
          <h1 className="bd-title">Conversation not found</h1>
          <div style={{ marginTop: 20 }}>
            <Button auto onClick={() => navigate('/chats')}>
              Back to chats
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const partner = getMatchPartner(match, DEMO_USER_ID);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `m-${Date.now()}`, text, from: 'me' }]);
    setDraft('');
    timer.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `r-${Date.now()}`, text: REPLIES[Math.floor(Math.random() * REPLIES.length)], from: 'them' },
      ]);
    }, 1800);
  };

  const block = () => {
    setMenuOpen(false);
    addToast({ type: 'info', title: `${partner.displayName} is blocked`, message: 'The chat has ended.' });
    navigate('/chats', { replace: true });
  };

  return (
    <>
      <header className="bd-slim" style={{ gap: 8 }}>
        <BackButton to="/chats" />
        <Avatar seed={partner.id} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 15 }}>
            {partner.displayName}
            {partner.isVerified && <VerifiedBadge />}
          </div>
          <div className="bd-small bd-muted">
            {partner.age} · {partner.city}
          </div>
        </div>
        <button type="button" className="bd-back" aria-label="More options" onClick={() => setMenuOpen(true)}>
          <Icon name="dots" size={20} />
        </button>
      </header>

      <main className="bd-screen" style={{ paddingTop: 84, paddingBottom: 110, minHeight: '100dvh' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Avatar seed={partner.id} size="lg" ring />
            <div className="bd-serif" style={{ fontSize: 26, margin: '14px 0 4px' }}>
              You matched with {partner.displayName}
            </div>
            <p className="bd-small bd-muted" style={{ margin: 0 }}>
              Start with something about their profile.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`bd-bubble ${m.from === 'me' ? 'out' : 'in'}`}>
            {m.text}
          </div>
        ))}

        {risky && (
          <div className="bd-warn" role="alert">
            <Icon name="warn" size={18} />
            <div>
              <b style={{ display: 'block' }}>Be careful with money and off-app requests</b>
              Don't send money, share bank details or one-time codes with someone you haven't met.{' '}
              <button type="button" style={{ all: 'unset', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }} onClick={() => setMenuOpen(true)}>
                Report
              </button>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </main>

      <form className="bd-composer" onSubmit={send}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message ${partner.displayName}`}
          aria-label="Message"
          autoComplete="off"
        />
        <button type="submit" className="bd-circ sm" style={{ background: 'var(--bd-plum)', color: '#fff', borderColor: 'var(--bd-plum)' }} aria-label="Send">
          <Icon name="send" size={18} />
        </button>
      </form>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} label={`Report or block ${partner.displayName}`}>
        <div className="bd-serif" style={{ fontSize: 24 }}>
          Report or block {partner.displayName}
        </div>
        <p className="bd-small bd-muted" style={{ margin: '6px 0 8px' }}>
          They won't be told. Blocking ends the chat and hides you from each other.
        </p>
        <Row title="Plan a Safe Date" sub="Share your date with someone you trust" onClick={() => navigate('/safe-date')} />
        {REPORT_REASONS.map((reason) => (
          <Row
            key={reason}
            title={reason}
            onClick={() => {
              setMenuOpen(false);
              addToast({ type: 'success', title: 'Report sent', message: 'Our team will review it.' });
            }}
          />
        ))}
        <div style={{ marginTop: 14 }}>
          <Button onClick={block}>Block {partner.displayName}</Button>
        </div>
      </Sheet>
    </>
  );
}
