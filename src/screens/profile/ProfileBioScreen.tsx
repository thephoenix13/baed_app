import { useNavigate } from 'react-router-dom';
import { useProfileDraft } from '@/stores/profile-draft-store';
import { Button, Footer, Kicker, Pill, Screen, StepHeader } from '@/ui/kit';

const INTENTS = ['Long-term', 'Short-term', 'Marriage', 'Friendship', 'Not sure yet'];
const MAX = 500;

export function ProfileBioScreen() {
  const navigate = useNavigate();
  const { bio, occupation, intent, set } = useProfileDraft();

  return (
    <>
      <Screen footer>
        <StepHeader step={3} total={5} to="/profile/photos" />
        <Kicker>About you</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          Say a little about you.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 24px' }}>
          Specific beats clever. A line about a weekend you loved is enough.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="bd-field">
            <label htmlFor="pb-bio">Bio</label>
            <textarea
              id="pb-bio"
              className="bd-input"
              style={{ minHeight: 120, resize: 'vertical' }}
              maxLength={MAX}
              value={bio}
              onChange={(e) => set({ bio: e.target.value })}
              placeholder="What would you like someone to know?"
            />
            <span className="bd-small bd-muted" style={{ alignSelf: 'flex-end' }}>
              {bio.length}/{MAX}
            </span>
          </div>
          <div className="bd-field">
            <label htmlFor="pb-job">What you do</label>
            <input id="pb-job" className="bd-input" value={occupation} onChange={(e) => set({ occupation: e.target.value })} placeholder="Product designer" />
          </div>
          <div className="bd-field">
            <label>Looking for</label>
            <div className="bd-chips">
              {INTENTS.map((i) => (
                <Pill key={i} selected={intent === i} onClick={() => set({ intent: i })}>
                  {i}
                </Pill>
              ))}
            </div>
          </div>
        </div>
      </Screen>
      <Footer>
        <Button disabled={!intent} onClick={() => navigate('/profile/interests')}>
          Continue
        </Button>
      </Footer>
    </>
  );
}
