import { useNavigate } from 'react-router-dom';
import { useProfileDraft } from '@/stores/profile-draft-store';
import { Button, Footer, Kicker, Pill, Screen, StepHeader } from '@/ui/kit';

const INTERESTS = [
  'Coffee', 'Travel', 'Music', 'Fitness', 'Reading', 'Cooking',
  'Movies', 'Art', 'Photography', 'Dancing', 'Yoga', 'Gaming',
  'Hiking', 'Foodie', 'Dogs', 'Cats', 'Beach', 'Mountains',
  'Nightlife', 'Concerts', 'Theatre', 'Sports', 'Meditation', 'Wine',
];
const MIN = 3;
const MAX = 8;

export function ProfileInterestsScreen() {
  const navigate = useNavigate();
  const { interests, set } = useProfileDraft();

  const toggle = (interest: string) => {
    if (interests.includes(interest)) set({ interests: interests.filter((i) => i !== interest) });
    else if (interests.length < MAX) set({ interests: [...interests, interest] });
  };

  return (
    <>
      <Screen footer>
        <StepHeader step={4} total={5} to="/profile/bio" />
        <Kicker>Interests</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          What are you into?
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 22px' }}>
          Pick {MIN} to {MAX}. They help us show you people you'll click with.
        </p>
        <div className="bd-chips" role="group" aria-label="Interests">
          {INTERESTS.map((i) => (
            <Pill key={i} selected={interests.includes(i)} onClick={() => toggle(i)}>
              {i}
            </Pill>
          ))}
        </div>
        <p className="bd-small bd-muted" style={{ marginTop: 16 }}>
          {interests.length} of {MAX} selected
        </p>
      </Screen>
      <Footer>
        <Button disabled={interests.length < MIN} onClick={() => navigate('/profile/preview')}>
          {interests.length < MIN ? `Pick ${MIN - interests.length} more` : 'Continue'}
        </Button>
      </Footer>
    </>
  );
}
