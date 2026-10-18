import { useNavigate } from 'react-router-dom';
import { useProfileDraft } from '@/stores/profile-draft-store';
import { useUIStore } from '@/stores/ui-store';
import { Button, Dots, Footer, Item, Kicker, Pill, Screen, Section, StepHeader, VerifiedBadge } from '@/ui/kit';

export function ProfilePreviewScreen() {
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);
  const { name, age, city, occupation, bio, intent, interests } = useProfileDraft();

  return (
    <>
      <Screen footer>
        <StepHeader step={5} total={5} to="/profile/interests" />
        <Kicker>Preview</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          This is how people see you.
        </h1>

        <div className="bd-portrait v0 bd-photo" style={{ height: 340, marginTop: 20 }}>
          <VerifiedBadge />
          <div className="cap">
            <div className="bd-serif" style={{ fontSize: 34, lineHeight: 1 }}>
              {name || 'You'}, {age || '—'}
            </div>
            <div style={{ fontSize: 14, opacity: 0.92, marginTop: 8 }}>
              {[occupation, city].filter(Boolean).join(' · ')}
            </div>
          </div>
        </div>

        <Section title="Looking for">
          <Item title={intent || 'Not set'} marker={false} />
        </Section>
        {bio && (
          <>
            <Dots />
            <Kicker>About</Kicker>
            <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.5 }}>{bio}</p>
          </>
        )}
        <Dots />
        <Kicker>Interests</Kicker>
        <div className="bd-chips" style={{ marginTop: 10 }}>
          {interests.map((i) => (
            <Pill key={i}>{i}</Pill>
          ))}
        </div>
      </Screen>
      <Footer>
        <Button
          onClick={() => {
            addToast({ type: 'success', title: 'Your profile is live', message: 'Photos are checked within a few minutes.' });
            navigate('/discover');
          }}
        >
          Looks good, start exploring
        </Button>
        <Button variant="ghost" onClick={() => navigate('/profile/create')}>
          Edit details
        </Button>
      </Footer>
    </>
  );
}
