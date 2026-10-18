import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMatchPartner } from '@/modules/matching/services/matching.service';
import { useMatch } from '@/lib/queries';
import { ErrorPanel, Skeleton } from '@/ui/states';
import { DEMO_USER_ID } from '@/lib/session';
import { useUIStore } from '@/stores/ui-store';
import { useChatStore } from '@/stores/chat-store';
import { Icon } from '@/ui/Icon';
import { Avatar, BackButton, Button, Row, Sheet, VerifiedBadge } from '@/ui/kit';
import { REPORT_REASONS } from './ProfileDetailScreen';

const EMPTY: never[] = [];

const dayKey = (at: number) => new Date(at).toDateString();
function dayLabel(at: number) {
  const days = Math.round((new Date(new Date().toDateString()).getTime() - new Date(new Date(at).toDateString()).getTime()) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return new Date(at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
const clock = (at: number) => new Date(at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

// Messages that ask for money or push the chat off the app get a calm warning.
const RISKY = /(₹|rs\.?\s?\d|\bupi\b|\bpaytm\b|\bgpay\b|bank|\botp\b|send (me )?money|whatsapp|telegram|\bgift card)/i;
const REPLIES = ['Hey! Nice to match with you', 'Hi there! How are you?', 'Hey! What are you up to?', 'Hello! Love your profile'];

export function ChatScreen() {
  const { matchId = '' } = useParams();
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);
  const { data: match, isPending, error, refetch } = useMatch(matchId);
  const messages = useChatStore((s) => s.threads[matchId]) ?? EMPTY;
  const sendMessage = useChatStore((s) => s.send);
  const receiveMessage = useChatStore((s) => s.receive);
  const markRead = useChatStore((s) => s.markRead);
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
    endRef.current?.scrollIntoView({ block: 'end' });
    // Whatever is on screen counts as read
    markRead(matchId);
  }, [messages, matchId, markRead]);

  const risky = useMemo(() => messages.some((m) => RISKY.test(m.text)), [messages]);

  if (isPending || error || !match) {
    return (
      <main className="bd-screen">
        <BackButton to="/chats" />
        {isPending ? (
          <div role="status" aria-label="Loading chat" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Skeleton w={44} h={44} r={22} />
              <Skeleton w={140} h={16} />
            </div>
            <Skeleton w="60%" h={44} r={18} style={{ marginTop: 40 }} />
            <Skeleton w="45%" h={44} r={18} style={{ marginTop: 14, marginLeft: 'auto' }} />
          </div>
        ) : (
          <ErrorPanel error={error} what="this chat" onRetry={() => refetch()} />
        )}
      </main>
    );
  }

  const partner = getMatchPartner(match, DEMO_USER_ID);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    sendMessage(matchId, text);
    setDraft('');
    // Demo reply until real chat exists
    timer.current = window.setTimeout(() => {
      receiveMessage(matchId, REPLIES[Math.floor(Math.random() * REPLIES.length)]);
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

        {messages.map((m, i) => {
          const newDay = i === 0 || dayKey(m.at) !== dayKey(messages[i - 1].at);
          const endOfRun = i === messages.length - 1 || messages[i + 1].from !== m.from || dayKey(messages[i + 1].at) !== dayKey(m.at);
          return (
            <div key={m.id}>
              {newDay && (
                <div className="bd-kicker" style={{ textAlign: 'center', margin: '14px 0 6px' }}>
                  {dayLabel(m.at)}
                </div>
              )}
              <div className={`bd-bubble ${m.from === 'me' ? 'out' : 'in'}`}>{m.text}</div>
              {endOfRun && (
                <div className="bd-small bd-muted" style={{ fontSize: 11, textAlign: m.from === 'me' ? 'right' : 'left', margin: '0 4px 4px' }}>
                  {clock(m.at)}
                </div>
              )}
            </div>
          );
        })}

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
