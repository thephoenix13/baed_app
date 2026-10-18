import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/ui/Icon';
import { Button, Footer, Item, Kicker, Screen, StepHeader } from '@/ui/kit';

const corner = (pos: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties => ({
  position: 'absolute',
  width: 34,
  height: 34,
  borderColor: 'var(--bd-plum)',
  borderStyle: 'solid',
  borderWidth: 0,
  ...(pos === 'tl' && { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 14 }),
  ...(pos === 'tr' && { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 14 }),
  ...(pos === 'bl' && { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 14 }),
  ...(pos === 'br' && { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 14 }),
});

export function IdCaptureScreen() {
  const navigate = useNavigate();
  const [captured, setCaptured] = useState(false);

  return (
    <>
      <Screen footer>
        <StepHeader step={3} total={4} to="/verify/consent" />
        <Kicker>Step 1 of 2</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          Take a photo of your ID.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 20px' }}>
          Make sure all four corners are visible.
        </p>

        <div className="bd-hero pale" style={{ padding: 0, minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {captured ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <span className="bd-badge">
                <Icon name="check" size={11} strokeWidth={3.2} />
                Captured
              </span>
              <div className="bd-serif" style={{ fontSize: 26, margin: '12px 0 4px' }}>
                ID photo saved.
              </div>
              <div className="bd-small bd-muted">It goes straight to our verification provider.</div>
            </div>
          ) : (
            <div style={{ position: 'relative', width: 'min(100% - 48px, 300px)', aspectRatio: '1.6 / 1' }}>
              <i style={corner('tl')} />
              <i style={corner('tr')} />
              <i style={corner('bl')} />
              <i style={corner('br')} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} className="bd-small bd-muted">
                <Icon name="id" size={20} />
                Position your ID here
              </div>
            </div>
          )}
        </div>

        <div className="bd-section">
          <Kicker>For a clear photo</Kicker>
          <Item title="Face a window or lamp" sub="Daylight works best." />
          <Item title="Avoid glare" sub="Tilt the card if you see a reflection." />
          <Item title="Keep the ID flat" sub="Use the original card, not a photocopy." />
        </div>
      </Screen>
      <Footer>
        {captured ? (
          <>
            <Button onClick={() => navigate('/verify/selfie')}>Continue</Button>
            <Button variant="ghost" onClick={() => setCaptured(false)}>
              Retake
            </Button>
          </>
        ) : (
          <Button onClick={() => setCaptured(true)}>
            <Icon name="camera" size={18} />
            Open camera
          </Button>
        )}
      </Footer>
    </>
  );
}
