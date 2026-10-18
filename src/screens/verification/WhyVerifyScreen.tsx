import { useNavigate } from 'react-router-dom';
import { Icon } from '@/ui/Icon';
import { Button, Footer, Item, Kicker, Screen, StepHeader } from '@/ui/kit';

export function WhyVerifyScreen() {
  const navigate = useNavigate();

  return (
    <>
      <Screen footer>
        <StepHeader step={1} total={4} to="/welcome" />
        <Kicker>Why we verify</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 12px' }}>
          Real people. Real connections.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 22px' }}>
          Everyone here verifies their identity once. It keeps fake and abusive accounts out.
        </p>

        <div className="bd-hero pale" style={{ padding: '20px 22px' }}>
          <Icon name="shield" size={30} style={{ color: 'var(--bd-plum)' }} />
          <div className="bd-serif" style={{ fontSize: 26, margin: '10px 0 4px' }}>
            Three steps, about three minutes.
          </div>
          <div className="bd-small bd-muted">Government ID, a live selfie, and a quick check.</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <Item title="Real people" sub="Every profile belongs to a verified person." />
          <Item title="Safer conversations" sub="Verification helps keep fake and abusive accounts out." />
          <Item title="Better connections" sub="Spend less time filtering and more time connecting." />
        </div>
      </Screen>
      <Footer>
        <Button onClick={() => navigate('/verify/consent')}>Continue</Button>
      </Footer>
    </>
  );
}
