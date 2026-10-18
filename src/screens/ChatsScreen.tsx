import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatchPartner, getUserMatches } from '@/modules/matching/services/matching.service';
import { DEMO_USER_ID } from '@/lib/session';
import { Icon } from '@/ui/Icon';
import { Avatar, Button, Screen } from '@/ui/kit';

export function ChatsScreen() {
  const navigate = useNavigate();
  const matches = useMemo(() => getUserMatches(DEMO_USER_ID), []);

  return (
    <Screen tint="var(--bd-rose-white)" nav>
      <h1 className="bd-title" style={{ fontSize: 30 }}>
        Chats
      </h1>

      {matches.length === 0 ? (
        <div className="bd-hero pale" style={{ marginTop: 40, padding: '28px 22px' }}>
          <div className="bd-kicker">No chats yet</div>
          <div className="bd-serif" style={{ fontSize: 28, lineHeight: 1.05, margin: '10px 0 8px' }}>
            Conversations start after a match.
          </div>
          <p className="bd-small bd-muted" style={{ margin: '0 0 16px' }}>
            Everyone you chat with has passed the same ID check.
          </p>
          <Button auto onClick={() => navigate('/discover')}>
            Go to Discover
          </Button>
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          {matches.map((m) => {
            const p = getMatchPartner(m, DEMO_USER_ID);
            return (
              <button
                key={m.id}
                type="button"
                className="bd-row"
                style={{ gap: 14, justifyContent: 'flex-start' }}
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
              </button>
            );
          })}
        </div>
      )}
    </Screen>
  );
}
