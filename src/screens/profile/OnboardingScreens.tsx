import { useNavigate } from 'react-router-dom';
import { useProfileDraft } from '@/stores/profile-draft-store';
import { Icon } from '@/ui/Icon';
import { Button, Footer, Item, Kicker, Pill, Screen, StepHeader } from '@/ui/kit';

/* ─── Who you want to meet ─── */

const SHOW_ME = ['Women', 'Men', 'Non-binary people'];

export function PreferenceScreen() {
  const navigate = useNavigate();
  const { showMe, set } = useProfileDraft();
  const toggle = (g: string) => set({ showMe: showMe.includes(g) ? showMe.filter((x) => x !== g) : [...showMe, g] });

  return (
    <>
      <Screen footer>
        <StepHeader step={2} total={8} to="/profile/create" />
        <Kicker>Your preferences</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          Who would you like to meet?
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 24px' }}>
          Pick all that apply. You can change this any time.
        </p>
        <div className="bd-chips" role="group" aria-label="Show me">
          {SHOW_ME.map((g) => (
            <Pill key={g} selected={showMe.includes(g)} onClick={() => toggle(g)}>
              {g}
            </Pill>
          ))}
        </div>
      </Screen>
      <Footer>
        <Button disabled={showMe.length === 0} onClick={() => navigate('/profile/intent')}>
          Continue
        </Button>
      </Footer>
    </>
  );
}

/* ─── What you are looking for ─── */

const INTENTS: { label: string; sub: string }[] = [
  { label: 'Long-term', sub: 'A serious relationship' },
  { label: 'Marriage', sub: 'Marriage, eventually' },
  { label: 'Short-term', sub: 'Casual dating' },
  { label: 'Friendship', sub: 'New connections' },
  { label: 'Not sure yet', sub: "Open to seeing where it goes" },
];

export function IntentScreen() {
  const navigate = useNavigate();
  const { intent, set } = useProfileDraft();

  return (
    <>
      <Screen footer>
        <StepHeader step={3} total={8} to="/profile/preference" />
        <Kicker>Your intent</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          What are you looking for?
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 12px' }}>
          Being honest here saves everyone time. People see this on your profile.
        </p>
        <div role="radiogroup" aria-label="Looking for">
          {INTENTS.map((i) => {
            const on = intent === i.label;
            return (
              <button
                key={i.label}
                type="button"
                role="radio"
                aria-checked={on}
                className="bd-row"
                onClick={() => set({ intent: i.label })}
                style={{ alignItems: 'center' }}
              >
                <span>
                  {i.label}
                  <span className="sub">{i.sub}</span>
                </span>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    flex: 'none',
                    border: `2px solid ${on ? 'var(--bd-plum)' : 'var(--bd-line)'}`,
                    background: on ? 'var(--bd-plum)' : 'transparent',
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {on && <Icon name="check" size={14} strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      </Screen>
      <Footer>
        <Button disabled={!intent} onClick={() => navigate('/profile/location')}>
          Continue
        </Button>
      </Footer>
    </>
  );
}

/* ─── Location ─── */

export function LocationScreen() {
  const navigate = useNavigate();
  const { city, set } = useProfileDraft();

  const allow = () => {
    // The browser asks for permission; either answer moves on, and we fall back to the chosen city.
    if (!('geolocation' in navigator)) {
      navigate('/profile/photos');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        set({ nearby: true });
        navigate('/profile/photos');
      },
      () => navigate('/profile/photos'),
      { timeout: 8000 },
    );
  };

  return (
    <>
      <Screen footer>
        <StepHeader step={4} total={8} to="/profile/intent" />
        <Kicker>Your location</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          Find people near you.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 20px' }}>
          We use your location to show who's nearby.
        </p>

        <div className="bd-hero pale">
          <Icon name="pin" size={28} style={{ color: 'var(--bd-plum)' }} />
          <div className="bd-serif" style={{ fontSize: 26, margin: '10px 0 4px' }}>
            {city || 'Your city'}
          </div>
          <div className="bd-small bd-muted">You can always change your city in Settings.</div>
        </div>

        <div className="bd-section">
          <Kicker>How we use it</Kicker>
          <Item title="Only a rounded distance is shown" sub="Nobody sees your exact location." />
          <Item title="You stay in control" sub="Turn location off any time in your phone settings." />
        </div>
      </Screen>
      <Footer>
        <Button onClick={allow}>Allow location</Button>
        <Button variant="ghost" onClick={() => navigate('/profile/photos')}>
          Not now, use my city
        </Button>
      </Footer>
    </>
  );
}
