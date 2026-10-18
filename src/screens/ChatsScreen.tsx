import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatchPartner } from '@/modules/matching/services/matching.service';
import { DEMO_USER_ID } from '@/lib/session';
import { useMatches } from '@/lib/queries';
import { formatChatTime, unreadFor, useChatStore } from '@/stores/chat-store';
import { Icon } from '@/ui/Icon';
import { ErrorPanel, ListSkeleton } from '@/ui/states';
import { Avatar, Button, Row, Screen } from '@/ui/kit';

/** Conversations only: matches with at least one message, newest first. New matches live in Matches. */
export function ChatsScreen() {
  const navigate = useNavigate();
  const { data: matches = [], isPending, error, refetch } = useMatches(DEMO_USER_ID);
  const threads = useChatStore((s) => s.threads);
  const lastRead = useChatStore((s) => s.lastRead);

  const { conversations, waiting } = useMemo(() => {
    const withMessages = matches
      .filter((m) => (threads[m.id]?.length ?? 0) > 0)
      .map((m) => {
        const thread = threads[m.id];
        return { match: m, last: thread[thread.length - 1], unread: unreadFor(threads, lastRead, m.id) };
      })
      .sort((a, b) => b.last.at - a.last.at);
    return { conversations: withMessages, waiting: matches.length - withMessages.length };
  }, [matches, threads, lastRead]);

  const totalUnread = conversations.reduce((n, c) => n + c.unread, 0);

  return (
    <Screen tint="var(--bd-rose-white)" nav>
      <h1 className="bd-title" style={{ fontSize: 30 }}>
        Chats
      </h1>
      {!isPending && !error && conversations.length > 0 && (
        <p className="bd-small bd-muted" style={{ margin: '4px 0 0' }}>
          {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
          {totalUnread > 0 ? ` · ${totalUnread} unread` : ''}
        </p>
      )}

      {isPending ? (
        <div style={{ marginTop: 16 }}>
          <ListSkeleton />
        </div>
      ) : error ? (
        <ErrorPanel error={error} what="your chats" onRetry={() => refetch()} />
      ) : conversations.length === 0 ? (
        <div className="bd-hero pale" style={{ marginTop: 40, padding: '28px 22px' }}>
          <div className="bd-kicker">{waiting > 0 ? 'Say hello' : 'No chats yet'}</div>
          <div className="bd-serif" style={{ fontSize: 28, lineHeight: 1.05, margin: '10px 0 8px' }}>
            {waiting > 0 ? `${waiting} ${waiting === 1 ? 'match is' : 'matches are'} waiting for a first message.` : 'Conversations start after a match.'}
          </div>
          <p className="bd-small bd-muted" style={{ margin: '0 0 16px' }}>
            Everyone you chat with has passed the same ID check.
          </p>
          <Button auto onClick={() => navigate(waiting > 0 ? '/matches' : '/discover')}>
            {waiting > 0 ? 'See your matches' : 'Go to Discover'}
          </Button>
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          {conversations.map(({ match, last, unread }) => {
            const p = getMatchPartner(match, DEMO_USER_ID);
            return (
              <button
                key={match.id}
                type="button"
                className="bd-row"
                style={{ gap: 14, justifyContent: 'flex-start', alignItems: 'center' }}
                onClick={() => navigate(`/chat/${match.id}`)}
                aria-label={`${p.displayName}, ${unread > 0 ? `${unread} unread, ` : ''}last message ${formatChatTime(last.at)}`}
              >
                <Avatar seed={p.id} label={p.displayName} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.displayName}
                    {p.isVerified && <Icon name="check" size={14} strokeWidth={3} style={{ color: 'var(--bd-verified)' }} />}
                  </span>
                  <span
                    className="sub"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: unread > 0 ? 'var(--bd-ink)' : undefined,
                      fontWeight: unread > 0 ? 600 : 400,
                    }}
                  >
                    {last.from === 'me' ? 'You: ' : ''}
                    {last.text}
                  </span>
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flex: 'none' }}>
                  <span className="bd-small" style={{ fontSize: 12, color: unread > 0 ? 'var(--bd-pink)' : 'var(--bd-muted)', fontWeight: unread > 0 ? 800 : 500 }}>
                    {formatChatTime(last.at)}
                  </span>
                  {unread > 0 && (
                    <span
                      style={{
                        minWidth: 20,
                        height: 20,
                        padding: '0 6px',
                        borderRadius: 10,
                        background: 'var(--bd-pink)',
                        color: 'var(--bd-plum)',
                        fontSize: 12,
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {unread}
                    </span>
                  )}
                </span>
              </button>
            );
          })}

          {waiting > 0 && (
            <div style={{ marginTop: 10 }}>
              <Row
                title={`${waiting} new ${waiting === 1 ? 'match' : 'matches'}`}
                sub="Waiting for a first message"
                onClick={() => navigate('/matches')}
              />
            </div>
          )}
        </div>
      )}
    </Screen>
  );
}
