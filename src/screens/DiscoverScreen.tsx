import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetSeenProfiles } from '@/modules/discovery/services/discovery.service';
import { likeProfile, passProfile } from '@/modules/matching/services/matching.service';
import { DEMO_USER_ID } from '@/lib/session';
import { profilePhotos } from '@/lib/photos';
import { useFeed } from '@/lib/queries';
import { useFilters } from '@/stores/filters-store';
import { useProfileDraft } from '@/stores/profile-draft-store';
import { Icon } from '@/ui/Icon';
import { CardSkeleton, ErrorPanel } from '@/ui/states';
import { Button, PortraitPhoto, RoundButton, Screen, VerifiedBadge } from '@/ui/kit';

export function DiscoverScreen() {
  const navigate = useNavigate();
  const filters = useFilters((s) => s.filters);
  const { intent, interests, city } = useProfileDraft();
  const viewer = useMemo(() => ({ intent, interests, city }), [intent, interests, city]);
  const { data, isPending, error, refetch } = useFeed(DEMO_USER_ID, filters, viewer);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<'left' | 'right' | null>(null);

  const profiles = data?.profiles ?? [];
  const current = profiles[index];

  useEffect(() => {
    setIndex(0);
  }, [data]);

  const decide = (direction: 'left' | 'right') => {
    if (!current || leaving) return;
    setLeaving(direction);
    window.setTimeout(() => {
      if (direction === 'right') {
        const result = likeProfile(DEMO_USER_ID, current.userId);
        if (result.isMatch && result.match) {
          navigate('/matches', { state: { newMatchId: result.match.id } });
          return;
        }
      } else {
        passProfile(DEMO_USER_ID, current.userId);
      }
      setIndex((i) => i + 1);
      setLeaving(null);
    }, 220);
  };

  const shared = current ? current.interests.filter((i) => interests.includes(i)) : [];

  return (
    <Screen nav>
      <div className="bd-topbar">
        <h1 className="bd-title" style={{ fontSize: 30 }}>
          Discover
        </h1>
        <RoundButton icon="sliders" label="Filters" variant="sm" onClick={() => navigate('/filters')} />
      </div>

      {isPending ? (
        <CardSkeleton />
      ) : error ? (
        <ErrorPanel error={error} what="people near you" onRetry={() => refetch()} />
      ) : current ? (
        <>
          <button
            type="button"
            className="bd-photo-btn"
            onClick={() => navigate(`/profile/${current.id}`)}
            aria-label={`Open ${current.displayName}'s profile`}
          >
            <PortraitPhoto
              id={current.id}
              src={profilePhotos(current.id)[0]}
              eager
              label={`${current.displayName}, ${current.age}`}
              className="bd-photo"
              style={{
                height: 'min(480px, calc(100dvh - 300px))',
                minHeight: 340,
                transition: 'transform 220ms ease-out, opacity 220ms ease-out',
                transform:
                  leaving === 'right' ? 'translateX(60px) rotate(5deg)' : leaving === 'left' ? 'translateX(-60px) rotate(-5deg)' : 'none',
                opacity: leaving ? 0 : 1,
              }}
            >
              {current.isVerified && <VerifiedBadge />}
              <div className="cap">
                <div className="bd-serif" style={{ fontSize: 34, lineHeight: 1 }}>
                  {current.displayName}, {current.age}
                </div>
                <div style={{ fontSize: 14, opacity: 0.95, margin: '8px 0 10px', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Icon name="pin" size={15} />
                  {current.distance} km away{current.occupation ? ` · ${current.occupation}` : ''}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <span className="bd-pill static" style={{ background: 'rgba(255,255,255,.2)', borderColor: 'rgba(255,255,255,.4)', color: '#fff' }}>
                    {current.intent}
                  </span>
                  {shared.length > 0 && (
                    <span className="bd-pill static" style={{ background: 'rgba(255,255,255,.2)', borderColor: 'rgba(255,255,255,.4)', color: '#fff' }}>
                      {shared.length} in common
                    </span>
                  )}
                </div>
              </div>
            </PortraitPhoto>
          </button>

          <div className="bd-actions" style={{ marginTop: 18 }}>
            <RoundButton icon="x" label="Pass" onClick={() => decide('left')} />
            <RoundButton icon="heart" label="Like" variant="like" filled onClick={() => decide('right')} />
          </div>
        </>
      ) : (
        <div className="bd-hero plum" style={{ marginTop: 56, padding: '28px 22px' }}>
          <div className="bd-kicker" style={{ color: 'var(--bd-pink-light)' }}>
            All caught up
          </div>
          <div className="bd-serif" style={{ fontSize: 30, lineHeight: 1.05, margin: '10px 0 10px' }}>
            You've seen everyone nearby.
          </div>
          <p style={{ fontSize: 14, opacity: 0.85, margin: '0 0 18px' }}>
            New verified people join every day. Widen your distance or check back tomorrow.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button variant="pink" auto onClick={() => navigate('/filters')}>
              Change filters
            </Button>
            <Button
              variant="ghost"
              auto
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,.35)' }}
              onClick={() => {
                resetSeenProfiles();
                refetch();
              }}
            >
              Start over
            </Button>
          </div>
        </div>
      )}
    </Screen>
  );
}
