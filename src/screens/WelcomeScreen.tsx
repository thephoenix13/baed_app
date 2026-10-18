import { useNavigate } from 'react-router-dom';
import { Button, Footer, Item, Kicker, Screen } from '@/ui/kit';

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <>
      <Screen footer>
        <div style={{ paddingTop: 28 }}>
          <Kicker>Welcome to Bae'd</Kicker>
          <h1 className="bd-display" style={{ margin: '12px 0 14px' }}>
            Dating, without the doubt.
          </h1>
          <p className="bd-lead" style={{ margin: '0 0 24px' }}>
            Every profile is ID-verified before it can match.
          </p>

          <div className="bd-hero plum">
            <div className="bd-kicker" style={{ color: 'var(--bd-pink-light)' }}>
              Real people only
            </div>
            <div className="bd-serif" style={{ fontSize: 30, margin: '8px 0 6px' }}>
              Verified first.
            </div>
            <div style={{ fontSize: 14, opacity: 0.85, maxWidth: 240 }}>
              A quick ID and selfie check, once. We keep the result, not your documents.
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <Item title="Verify once" sub="About three minutes" />
            <Item title="Match with real people" sub="Everyone here passed the same check" />
          </div>
        </div>
      </Screen>
      <Footer>
        <Button onClick={() => navigate('/signin')}>Get started</Button>
        <Button variant="ghost" onClick={() => navigate('/signin')}>
          I already have an account
        </Button>
      </Footer>
    </>
  );
}
