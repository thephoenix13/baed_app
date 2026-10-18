import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMatch, getMatchPartner, getUserMatches } from '@/modules/matching/services/matching.service';
import { DEMO_USER_ID } from '@/lib/session';
import { Icon } from '@/ui/Icon';
import { Avatar, Button, Dots, Kicker, Screen, VerifiedBadge } from '@/ui/kit';

export function MatchesScreen() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { newMatchId?: string } | null };
  const matches = useMemo(() => getUserMatches(DEMO_USER_ID), []);
  const fresh = state?.newMatchId ? getMatch(state.newMatchId) : null;

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
            <Avatar seed="you" size="lg" ring />
            <div style={{ marginLeft: -10 }}>
              <Avatar seed={partner.id} size="lg" ring />
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
        {matches.length === 0 ? 'No matches yet' : `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`}
      </p>

      {matches.length === 0 ? (
        <div className="bd-hero pale" style={{ marginTop: 40, padding: '28px 22px' }}>
          <div className="bd-kicker">Nothing yet</div>
          <div className="bd-serif" style={{ fontSize: 28, lineHeight: 1.05, margin: '10px 0 8px' }}>
            Your matches will show up here.
          </div>
          <p className="bd-small bd-muted" style={{ margin: '0 0 16px' }}>
            Like a few people and they will appear the moment it's mutual.
          </p>
          <Button auto onClick={() => navigate('/discover')}>
            Go to Discover
          </Button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 16, margin: '18px 0 4px', overflowX: 'auto' }}>
            {matches.map((m) => {
              const p = getMatchPartner(m, DEMO_USER_ID);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => navigate(`/chat/${m.id}`)}
                  style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}
                >
                  <Avatar seed={p.id} size="lg" ring />
                  {p.displayName}
                </button>
              );
            })}
          </div>
          <Dots />
          <Kicker>Conversations</Kicker>
          {matches.map((m) => {
            const p = getMatchPartner(m, DEMO_USER_ID);
            return (
              <button
                key={m.id}
                type="button"
                className="bd-row"
                style={{ gap: 14, alignItems: 'center', justifyContent: 'flex-start' }}
                onClick={() => navigate(`/chat/${m.id}`)}
              >
                <Avatar seed={p.id} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.displayName}
                    {p.isVerified && <Icon name="check" size={14} strokeWidth={3} style={{ color: 'var(--bd-verified)' }} />}
                  </span>
                  <span className="sub">Say hello to {p.displayName}</span>
                </span>
                <span className="bd-unread" aria-label="New match" />
              </button>
            );
          })}
        </>
      )}
    </Screen>
  );
}
