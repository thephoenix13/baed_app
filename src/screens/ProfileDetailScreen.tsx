import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCandidateProfile } from '@/modules/discovery/services/discovery.service';
import { likeProfile, passProfile } from '@/modules/matching/services/matching.service';
import { DEMO_USER_ID } from '@/lib/session';
import { useUIStore } from '@/stores/ui-store';
import { Icon } from '@/ui/Icon';
import { useScrollFade } from '@/ui/useScrollFade';
import {
  BackButton,
  Button,
  Dots,
  Footer,
  Item,
  Kicker,
  Pill,
  RoundButton,
  Row,
  Screen,
  Section,
  Sheet,
  SlimBar,
  VerifiedBadge,
  variantFor,
} from '@/ui/kit';

export const REPORT_REASONS = [
  'Asked for money',
  "Fake or someone else's photos",
  'Harassment or abuse',
  'Something else',
];

export function ProfileDetailScreen() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);
  const { slim } = useScrollFade();
  const [reportOpen, setReportOpen] = useState(false);
  const profile = getCandidateProfile(id);

  if (!profile) {
    return (
      <Screen wash={false}>
        <BackButton />
        <div className="bd-center" style={{ textAlign: 'center' }}>
          <h1 className="bd-title">Profile not found</h1>
          <p className="bd-lead" style={{ marginTop: 8 }}>
            This person may have left Bae'd.
          </p>
          <div style={{ marginTop: 20 }}>
            <Button auto onClick={() => navigate('/discover')}>
              Back to Discover
            </Button>
          </div>
        </div>
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
  const interestLine = profile.interests.slice(0, 2).join(' and ');

  return (
    <>
      <SlimBar show={slim} name={`${profile.displayName}, ${profile.age}`} verified={profile.isVerified} />
      <Screen footer>
        <div className="bd-topbar" style={{ marginBottom: 8 }}>
          <BackButton />
        </div>

        <div className={`bd-portrait bd-photo ${variantFor(profile.id)}`} style={{ height: 380 }}>
          {profile.isVerified && <VerifiedBadge />}
          <div className="cap">
            <div className="bd-serif" style={{ fontSize: 36, lineHeight: 1 }}>
              {profile.displayName}, {profile.age}
            </div>
            <div style={{ fontSize: 14, opacity: 0.92, marginTop: 8 }}>
              {[profile.occupation, profile.city].filter(Boolean).join(' · ')} · {profile.distance} km away
            </div>
          </div>
        </div>

        <Section title="Why you may connect">
          <Item title={`Looking for: ${profile.intent}`} />
          {interestLine && <Item title={`Into ${interestLine}`} sub={`${profile.interests.length} interests listed`} />}
          <Item title={`${profile.distance} km apart`} />
        </Section>

        {profile.bio && (
          <>
            <Dots />
            <Kicker>About</Kicker>
            <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.5 }}>{profile.bio}</p>
          </>
        )}

        <Dots />
        <Kicker>Interests</Kicker>
        <div className="bd-chips" style={{ marginTop: 10 }}>
          {profile.interests.map((interest) => (
            <Pill key={interest}>{interest}</Pill>
          ))}
        </div>

        {lifestyle.length > 0 && (
          <>
            <Dots />
            <Kicker>Lifestyle</Kicker>
            {lifestyle.map(([key, value]) => (
              <Item key={key} title={value} sub={key.charAt(0).toUpperCase() + key.slice(1)} />
            ))}
          </>
        )}

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
