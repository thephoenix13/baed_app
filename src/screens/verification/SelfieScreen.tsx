import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/ui/Icon';
import { Button, Footer, Item, Kicker, Screen, StepHeader } from '@/ui/kit';

export function SelfieScreen() {
  const navigate = useNavigate();
  const [captured, setCaptured] = useState(false);

  return (
    <>
      <Screen footer>
        <StepHeader step={4} total={4} to="/verify/id" />
        <Kicker>Step 2 of 2</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          Now, take a selfie.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 20px' }}>
          We use it to check that the ID belongs to you.
        </p>

        <div className="bd-hero pale" style={{ padding: '28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 190,
              height: 190,
              borderRadius: '50%',
              border: `3px ${captured ? 'solid' : 'dashed'} var(--bd-plum)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: captured ? 'var(--bd-white)' : 'transparent',
            }}
          >
            <Icon name={captured ? 'check' : 'user'} size={captured ? 56 : 64} strokeWidth={captured ? 2.4 : 1.3} style={{ color: 'var(--bd-plum)' }} />
          </div>
          <div className="bd-small bd-muted">{captured ? 'Selfie saved.' : 'Look directly at the camera'}</div>
        </div>

        <div className="bd-section">
          <Kicker>For a good match</Kicker>
          <Item title="Remove glasses and hats" />
          <Item title="Keep your face in the circle" sub="Good, even light on your face." />
        </div>
      </Screen>
      <Footer>
        {captured ? (
          <>
            <Button onClick={() => navigate('/verify/processing')}>Submit for verification</Button>
            <Button variant="ghost" onClick={() => setCaptured(false)}>
              Retake
            </Button>
          </>
        ) : (
          <Button onClick={() => setCaptured(true)}>
            <Icon name="camera" size={18} />
            Take selfie
          </Button>
        )}
      </Footer>
    </>
  );
}
