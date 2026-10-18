import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMatch, getMatchPartner } from '@/modules/matching/services/matching.service';
import { DEMO_USER_ID } from '@/lib/session';
import { profilePhotos } from '@/lib/photos';
import { useMatches } from '@/lib/queries';
import { unreadFor, useChatStore } from '@/stores/chat-store';
import { ErrorPanel, Skeleton } from '@/ui/states';
import { Avatar, Button, Kicker, PortraitPhoto, Row, Screen, VerifiedBadge } from '@/ui/kit';

function matchedAgo(at: Date) {
  const mins = Math.floor((Date.now() - at.getTime()) / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
}

/** New matches only: people you have matched with but not messaged yet. Conversations live in Chats. */
export function MatchesScreen() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { newMatchId?: string } | null };
  const { data: matches = [], isPending, error, refetch } = useMatches(DEMO_USER_ID);
  const threads = useChatStore((s) => s.threads);
  const lastRead = useChatStore((s) => s.lastRead);
  const fresh = state?.newMatchId ? getMatch(state.newMatchId) : null;

  const { newMatches, chatCount, unread } = useMemo(() => {
    const isNew = (id: string) => (threads[id]?.length ?? 0) === 0;
    const chats = matches.filter((m) => !isNew(m.id));
    return {
      newMatches: matches.filter((m) => isNew(m.id)),
      chatCount: chats.length,
      unread: chats.reduce((n, m) => n + unreadFor(threads, lastRead, m.id), 0),
    };
  }, [matches, threads, lastRead]);

  if (fresh) {
    const partner = getMatchPartner(fresh, DEMO_USER_ID);
    return (
      <Screen tint="var(--bd-peach)">
        <div className="bd-center" style={{ textAlign: 'center', alignItems: 'center' }}>
          <Kicker>It's a match</Kicker>
          <h1 className="bd-display" style={{ margin: '12px 0 22px' }}>
            You and {partner.displayName}.
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 14 }}>
            <Avatar seed="you" size="lg" ring label="You" />
            <div style={{ marginLeft: -10 }}>
              <Avatar seed={partner.id} size="lg" ring label={partner.displayName} />
            </div>
          </div>
          <VerifiedBadge />
          <p className="bd-lead" style={{ margin: '16px 0 28px', maxWidth: 280 }}>
            You both liked each other. Say something about what caught your eye.
          </p>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button onClick={() => navigate(`/chat/${fresh.id}`, { replace: true })}>Send a message</Button>
            <Button variant="ghost" onClick={() => navigate('/discover', { replace: true })}>
              Keep exploring
            </Button>
          </div>
        </div>
      </Screen>
    );
  }

  return (
    <Screen tint="var(--bd-peach)" nav>
      <h1 className="bd-title" style={{ fontSize: 30 }}>
        Matches
      </h1>
      <p className="bd-small bd-muted" style={{ margin: '4px 0 0' }}>
        {isPending ? 'Loading' : error ? 'Could not load' : newMatches.length === 0 ? 'No new matches' : `${newMatches.length} new, waiting for a hello`}
      </p>

      {isPending ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 22 }} role="status" aria-label="Loading matches">
          <Skeleton h={220} r={22} />
          <Skeleton h={220} r={22} />
        </div>
      ) : error ? (
        <ErrorPanel error={error} what="your matches" onRetry={() => refetch()} />
      ) : (
        <>
          {newMatches.length === 0 ? (
            <div className="bd-hero pale" style={{ marginTop: 28, padding: '28px 22px' }}>
              <div className="bd-kicker">{matches.length === 0 ? 'Nothing yet' : 'All caught up'}</div>
              <div className="bd-serif" style={{ fontSize: 28, lineHeight: 1.05, margin: '10px 0 8px' }}>
                {matches.length === 0 ? 'Your matches will show up here.' : "You've said hello to everyone."}
              </div>
              <p className="bd-small bd-muted" style={{ margin: '0 0 16px' }}>
                {matches.length === 0 ? "Like a few people and they will appear the moment it's mutual." : 'New matches appear here the moment it is mutual.'}
              </p>
              <Button auto onClick={() => navigate('/discover')}>
                Go to Discover
              </Button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 22 }}>
              {newMatches.map((m) => {
                const p = getMatchPartner(m, DEMO_USER_ID);
                return (
                  <button
                    key={m.id}
                    type="button"
                    className="bd-photo-btn"
                    onClick={() => navigate(`/chat/${m.id}`)}
                    aria-label={`Say hello to ${p.displayName}, ${p.age}. Matched ${matchedAgo(m.matchedAt)}`}
                  >
                    <PortraitPhoto
                      id={p.id}
                      src={profilePhotos(p.id)[0]}
                      label={`${p.displayName}, ${p.age}`}
                      className="bd-photo"
                      style={{ aspectRatio: '4 / 5', borderRadius: 22, boxShadow: 'var(--bd-shadow-card)' }}
                    >
                      <div className="cap" style={{ padding: '44px 14px 14px' }}>
                        <div className="bd-serif" style={{ fontSize: 22, lineHeight: 1 }}>
                          {p.displayName}, {p.age}
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.92, marginTop: 4 }}>Matched {matchedAgo(m.matchedAt)}</div>
                      </div>
                    </PortraitPhoto>
                  </button>
                );
              })}
            </div>
          )}

          {chatCount > 0 && (
            <div style={{ marginTop: 22 }}>
              <Row
                title="Your chats"
                sub={unread > 0 ? `${unread} unread` : `${chatCount} ${chatCount === 1 ? 'conversation' : 'conversations'}`}
                onClick={() => navigate('/chats')}
              />
            </div>
          )}
        </>
      )}
    </Screen>
  );
}
