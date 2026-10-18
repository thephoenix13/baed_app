import { useNavigate } from 'react-router-dom';
import { useProfileDraft } from '@/stores/profile-draft-store';
import { Button, Footer, Kicker, Pill, Screen, StepHeader } from '@/ui/kit';

const CITIES = ['Mumbai', 'Pune', 'Bengaluru', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata', 'Other'];
const GENDERS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'];

export function ProfileCreateScreen() {
  const navigate = useNavigate();
  const { name, age, gender, city, set } = useProfileDraft();
  const ageNum = Number(age);
  const valid = name.trim().length >= 2 && ageNum >= 18 && ageNum <= 99 && gender && city;

  return (
    <>
      <Screen footer>
        <StepHeader step={1} total={8} to="/verify/result" />
        <Kicker>Your profile</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          Let's get to know you.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 24px' }}>
          Just the basics to start.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="bd-field">
            <label htmlFor="pc-name">First name</label>
            <input id="pc-name" className="bd-input" value={name} onChange={(e) => set({ name: e.target.value })} placeholder="Your first name" autoComplete="given-name" />
          </div>
          <div className="bd-field">
            <label htmlFor="pc-age">Age</label>
            <input
              id="pc-age"
              className="bd-input"
              inputMode="numeric"
              value={age}
              onChange={(e) => set({ age: e.target.value.replace(/\D/g, '').slice(0, 2) })}
              placeholder="18 or older"
              aria-invalid={!!age && ageNum < 18}
            />
            {!!age && ageNum < 18 && <span className="bd-small" style={{ color: 'var(--bd-error)' }}>You must be 18 or older to use Bae'd.</span>}
          </div>
          <div className="bd-field">
            <label>I am</label>
            <div className="bd-chips">
              {GENDERS.map((g) => (
                <Pill key={g} selected={gender === g} onClick={() => set({ gender: g })}>
                  {g}
                </Pill>
              ))}
            </div>
          </div>
          <div className="bd-field">
            <label>City</label>
            <div className="bd-chips">
              {CITIES.map((c) => (
                <Pill key={c} selected={city === c} onClick={() => set({ city: c })}>
                  {c}
                </Pill>
              ))}
            </div>
          </div>
        </div>
      </Screen>
      <Footer>
        <Button disabled={!valid} onClick={() => navigate('/profile/preference')}>
          Continue
        </Button>
      </Footer>
    </>
  );
}
