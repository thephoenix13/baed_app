import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompatibility } from '@/modules/discovery/services/discovery.service';
import { likeProfile, passProfile } from '@/modules/matching/services/matching.service';
import type { CandidateProfile } from '@/modules/discovery/types/discovery.types';
import { DEMO_USER_ID } from '@/lib/session';
import { profilePhotos } from '@/lib/photos';
import { useCandidate } from '@/lib/queries';
import { useProfileDraft } from '@/stores/profile-draft-store';
import { useUIStore } from '@/stores/ui-store';
import { Icon } from '@/ui/Icon';
import { useScrollFade } from '@/ui/useScrollFade';
import { ErrorPanel, ProfileSkeleton } from '@/ui/states';
import {
  BackButton,
  Button,
  Dots,
  Footer,
  Item,
  Kicker,
  Pill,
  PortraitPhoto,
  RoundButton,
  Row,
  Screen,
  Section,
  Sheet,
  SlimBar,
  VerifiedBadge,
} from '@/ui/kit';

export const REPORT_REASONS = [
  'Asked for money',
  "Fake or someone else's photos",
  'Harassment or abuse',
  'Something else',
];

const BAND_LABEL = { strong: 'Strong fit', good: 'Good fit', early: 'Early days' } as const;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/* ─── Photo carousel: native swipe, segment bars and prev/next buttons ─── */

function PhotoCarousel({ profile }: { profile: CandidateProfile }) {
  const photos = profilePhotos(profile.id);
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = Math.max(photos.length, 1);

  const go = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className="bd-photo" style={{ position: 'relative', height: 400, overflow: 'hidden', borderRadius: 28 }}>
      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        style={{ display: 'flex', height: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        aria-roledescription="carousel"
        aria-label={`${profile.displayName}'s photos`}
      >
        {(photos.length ? photos : [undefined]).map((src, i) => (
          <PortraitPhoto
            key={src ?? 'placeholder'}
            id={profile.id}
            src={src}
            eager={i === 0}
            label={`${profile.displayName}, photo ${i + 1} of ${count}`}
            style={{ flex: '0 0 100%', height: '100%', scrollSnapAlign: 'start' }}
          />
        ))}
      </div>

      {count > 1 && (
        <>
          <div style={{ position: 'absolute', top: 10, left: 14, right: 14, display: 'flex', gap: 4, zIndex: 3 }} aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
              <i key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i === index ? '#fff' : 'rgba(255,255,255,.45)' }} />
            ))}
          </div>
          {index > 0 && (
            <button type="button" className="bd-circ sm" style={{ position: 'absolute', left: 10, top: '42%', zIndex: 3, background: 'rgba(255,255,255,.85)' }} aria-label="Previous photo" onClick={() => go(index - 1)}>
              <Icon name="back" size={18} />
            </button>
          )}
          {index < count - 1 && (
            <button type="button" className="bd-circ sm" style={{ position: 'absolute', right: 10, top: '42%', zIndex: 3, background: 'rgba(255,255,255,.85)' }} aria-label="Next photo" onClick={() => go(index + 1)}>
              <Icon name="chev" size={18} />
            </button>
          )}
        </>
      )}

      {profile.isVerified && (
        <span style={{ position: 'absolute', top: count > 1 ? 24 : 14, left: 14, zIndex: 3 }}>
          <VerifiedBadge />
        </span>
      )}
      <div className="cap" style={{ pointerEvents: 'none' }}>
        <div className="bd-serif" style={{ fontSize: 36, lineHeight: 1 }}>
          {profile.displayName}, {profile.age}
        </div>
        <div style={{ fontSize: 14, opacity: 0.95, marginTop: 8 }}>
          {[profile.occupation, profile.city].filter(Boolean).join(' · ')} · {profile.distance} km away
        </div>
      </div>
    </div>
  );
}

export function ProfileDetailScreen() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);
  const { slim } = useScrollFade();
  const [reportOpen, setReportOpen] = useState(false);
  const { intent, interests, city } = useProfileDraft();
  const { data: profile, isPending, error, refetch } = useCandidate(id);

  const viewer = useMemo(() => ({ intent, interests, city }), [intent, interests, city]);
  const fit = useMemo(() => (profile ? getCompatibility(profile, viewer) : null), [profile, viewer]);
  const viewerHasInfo = !!intent || interests.length > 0;

  if (isPending || error || !profile || !fit) {
    return (
      <Screen wash={false}>
        <div className="bd-topbar" style={{ marginBottom: 8 }}>
          <BackButton to="/discover" />
        </div>
        {isPending ? <ProfileSkeleton /> : <ErrorPanel error={error} what="this profile" onRetry={() => refetch()} />}
      </Screen>
    );
  }

  const like = () => {
    const result = likeProfile(DEMO_USER_ID, profile.userId);
    if (result.isMatch && result.match) navigate('/matches', { state: { newMatchId: result.match.id } });
    else navigate('/discover');
  };
  const pass = () => {
    passProfile(DEMO_USER_ID, profile.userId);
    navigate('/discover');
  };
  const block = () => {
    passProfile(DEMO_USER_ID, profile.userId);
    setReportOpen(false);
    addToast({ type: 'info', title: `${profile.displayName} is blocked`, message: "You won't see each other again." });
    navigate('/discover');
  };

  const lifestyle = Object.entries(profile.lifestyle).filter(([, v]) => !!v) as [string, string][];
  const shared = profile.interests.filter((i) => interests.includes(i));

  return (
    <>
      <SlimBar show={slim} name={`${profile.displayName}, ${profile.age}`} verified={profile.isVerified} />
      <Screen footer>
        <div className="bd-topbar" style={{ marginBottom: 8 }}>
          <BackButton to="/discover" />
          <span className="bd-small bd-muted">{profile.lastActive}</span>
        </div>

        <PhotoCarousel profile={profile} />

        <Section title="Why you may connect">
          {viewerHasInfo && fit.reasons.length > 0 ? (
            <>
              <p className="bd-small" style={{ margin: '2px 0 0', fontWeight: 700 }}>
                {BAND_LABEL[fit.band]}
              </p>
              {fit.reasons.map((r) => (
                <Item key={r.title} title={r.title} sub={r.detail} />
              ))}
            </>
          ) : (
            <div className="bd-hero pale" style={{ marginTop: 10, padding: '18px 20px' }}>
              <div className="bd-serif" style={{ fontSize: 22, lineHeight: 1.15 }}>
                Tell us what you're into.
              </div>
              <p className="bd-small bd-muted" style={{ margin: '6px 0 12px' }}>
                Add your intent and interests and we'll show what you have in common with {profile.displayName}.
              </p>
              <Button auto onClick={() => navigate('/profile/create')}>
                Finish my profile
              </Button>
            </div>
          )}
        </Section>

        {profile.prompts.map((p) => (
          <div key={p.question}>
            <Dots />
            <Kicker>{p.question}</Kicker>
            <p className="bd-serif" style={{ fontSize: 24, lineHeight: 1.2, margin: '8px 0 0' }}>
              {p.answer}
            </p>
          </div>
        ))}

        {profile.bio && (
          <>
            <Dots />
            <Kicker>About</Kicker>
            <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.55 }}>{profile.bio}</p>
          </>
        )}

        <Dots />
        <Kicker>Basics</Kicker>
        <Item marker={false} title={profile.intent} sub="Looking for" />
        {profile.occupation && <Item marker={false} title={profile.occupation} sub="Work" />}
        {profile.education && <Item marker={false} title={profile.education} sub="Studied at" />}
        {profile.hometown && <Item marker={false} title={profile.hometown} sub="From" />}
        {profile.languages.length > 0 && <Item marker={false} title={profile.languages.join(', ')} sub="Speaks" />}

        <Dots />
        <Kicker>Interests</Kicker>
        <div className="bd-chips" style={{ marginTop: 10 }}>
          {profile.interests.map((interest) => (
            <Pill key={interest} selected={shared.includes(interest)}>
              {interest}
            </Pill>
          ))}
        </div>
        {shared.length > 0 && (
          <p className="bd-small bd-muted" style={{ margin: '8px 0 0' }}>
            Dark chips are interests you share.
          </p>
        )}

        {lifestyle.length > 0 && (
          <>
            <Dots />
            <Kicker>Lifestyle</Kicker>
            {lifestyle.map(([key, value]) => (
              <Item key={key} marker={false} title={value} sub={key.charAt(0).toUpperCase() + key.slice(1)} />
            ))}
          </>
        )}

        <Dots />
        <div className="bd-hero pale" style={{ padding: '18px 20px' }}>
          <VerifiedBadge label="Bae'd Verified" />
          <div className="bd-small" style={{ marginTop: 10 }}>
            Government ID and a live selfie were checked on {formatDate(profile.verifiedAt)}.
          </div>
        </div>

        <Dots />
        <Row
          title="Report or block"
          sub="They won't be told"
          trailing={<Icon name="flag" size={18} />}
          onClick={() => setReportOpen(true)}
        />
      </Screen>

      <Footer>
        <div className="bd-actions">
          <RoundButton icon="x" label="Pass" onClick={pass} />
          <RoundButton icon="heart" label="Like" variant="like" filled onClick={like} />
        </div>
      </Footer>

      <Sheet open={reportOpen} onClose={() => setReportOpen(false)} label={`Report or block ${profile.displayName}`}>
        <div className="bd-serif" style={{ fontSize: 24 }}>
          Report or block {profile.displayName}
        </div>
        <p className="bd-small bd-muted" style={{ margin: '6px 0 8px' }}>
          They won't be told. Blocking hides you from each other straight away.
        </p>
        {REPORT_REASONS.map((reason) => (
          <Row
            key={reason}
            title={reason}
            onClick={() => {
              setReportOpen(false);
              addToast({ type: 'success', title: 'Report sent', message: 'Our team will review it.' });
            }}
          />
        ))}
        <div style={{ marginTop: 14 }}>
          <Button onClick={block}>Block {profile.displayName}</Button>
        </div>
      </Sheet>
    </>
  );
}
