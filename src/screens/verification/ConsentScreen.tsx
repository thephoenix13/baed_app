import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Footer, Item, Kicker, Screen, StepHeader } from '@/ui/kit';

export function ConsentScreen() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      <Screen footer>
        <StepHeader step={2} total={4} to="/verify/why" />
        <Kicker>Your data</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          Here's what happens to it.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 8px' }}>
          Plain words, before you share anything.
        </p>

        <div className="bd-section">
          <Kicker>What we collect</Kicker>
          <Item title="A photo of your government ID" sub="Passport, Aadhaar, driving licence or another accepted ID." />
          <Item title="A live selfie" sub="Used to check that the ID is yours." />
        </div>
        <div className="bd-section">
          <Kicker>Who sees it</Kicker>
          <Item title="Our verification provider" sub="They run the check. Your documents go straight to them, not through our servers." />
        </div>
        <div className="bd-section">
          <Kicker>What we keep</Kicker>
          <Item title="Only the result and a reference" sub="The ID image and selfie are deleted once the check finishes." />
          <Item title="You can delete everything" sub="Settings > Delete account removes your data." />
        </div>

        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 24, cursor: 'pointer' }}>
          <input
            id="consent-agree"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: 22, height: 22, marginTop: 1, accentColor: 'var(--bd-plum)', flex: 'none' }}
          />
          <span className="bd-small">
            I'm 18 or older and I agree to Bae'd checking my ID and selfie as described above.
          </span>
        </label>
      </Screen>
      <Footer>
        <Button disabled={!agreed} onClick={() => navigate('/verify/id')}>
          I agree, continue
        </Button>
      </Footer>
    </>
  );
}
