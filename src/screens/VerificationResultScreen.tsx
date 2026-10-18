import { useLocation, useNavigate } from 'react-router-dom';
import { useMarkVerified } from '@/hooks/use-auth';
import { Button, Footer, Item, Kicker, Screen, VerifiedBadge } from '@/ui/kit';

interface ResultState {
  success?: boolean;
  reason?: string;
}

export function VerificationResultScreen() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: ResultState | null };
  const markVerified = useMarkVerified();
  const success = state?.success !== false;

  if (success) {
    return (
      <>
        <Screen tint="var(--bd-peach)" footer>
          <div style={{ paddingTop: 24 }}>
            <Kicker>Verification</Kicker>
            <h1 className="bd-title" style={{ margin: '10px 0 18px' }}>
              You're in.
            </h1>
            <div className="bd-hero plum" style={{ padding: '26px 22px' }}>
              <VerifiedBadge label="Bae'd Verified" />
              <div className="bd-serif" style={{ fontSize: 40, lineHeight: 1, margin: '16px 0 6px' }}>
                Verified.
              </div>
              <div style={{ fontSize: 14, opacity: 0.85 }}>Your government ID matched your live selfie.</div>
            </div>

            <div className="bd-section">
              <Kicker>What we kept</Kicker>
              <Item title="Your verification result" sub="And a reference number, nothing more" />
            </div>
            <div className="bd-section">
              <Kicker>What we deleted</Kicker>
              <Item title="ID image and selfie" sub="Removed as soon as the check finished" />
            </div>
          </div>
        </Screen>
        <Footer>
          <Button
            onClick={() => {
              markVerified();
              navigate('/profile/create');
            }}
          >
            Create your profile
          </Button>
        </Footer>
      </>
    );
  }

  return (
    <>
      <Screen tint="var(--bd-rose-white)" footer>
        <div style={{ paddingTop: 24 }}>
          <Kicker>Verification</Kicker>
          <h1 className="bd-title" style={{ margin: '10px 0 18px' }}>
            We couldn't match it.
          </h1>
          <div className="bd-hero rose" style={{ padding: '26px 22px' }}>
            <div className="bd-kicker" style={{ color: 'var(--bd-error)' }}>
              Check did not pass
            </div>
            <div className="bd-serif" style={{ fontSize: 26, lineHeight: 1.1, margin: '10px 0 8px' }}>
              {state?.reason ?? 'The photo on the ID was too dark to read.'}
            </div>
            <div className="bd-small bd-muted">This happens a lot. A second try in daylight usually works.</div>
          </div>

          <div className="bd-section">
            <Kicker>Before you retry</Kicker>
            <Item title="Face a window or lamp" sub="Avoid glare on the card" />
            <Item title="Use the original ID card" sub="Not a photocopy or a photo of a screen" />
          </div>
          <p className="bd-small bd-muted" style={{ marginTop: 14 }}>
            2 tries left today
          </p>
        </div>
      </Screen>
      <Footer>
        <Button onClick={() => navigate('/verify/id')}>Try again</Button>
        <Button variant="ghost" onClick={() => navigate('/verify/review')}>
          Ask for a manual review
        </Button>
      </Footer>
    </>
  );
}
