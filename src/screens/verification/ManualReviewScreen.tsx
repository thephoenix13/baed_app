import { useNavigate } from 'react-router-dom';
import { Icon } from '@/ui/Icon';
import { Button, Footer, Item, Kicker, Screen } from '@/ui/kit';

export function ManualReviewScreen() {
  const navigate = useNavigate();

  return (
    <>
      <Screen tint="var(--bd-peach)" footer>
        <div style={{ paddingTop: 24 }}>
          <Kicker>Verification</Kicker>
          <h1 className="bd-title" style={{ margin: '10px 0 18px' }}>
            A person is taking a look.
          </h1>

          <div className="bd-hero plum" style={{ padding: '26px 22px' }}>
            <Icon name="clock" size={28} style={{ color: 'var(--bd-pink-light)' }} />
            <div className="bd-serif" style={{ fontSize: 32, lineHeight: 1.02, margin: '14px 0 6px' }}>
              In review.
            </div>
            <div style={{ fontSize: 14, opacity: 0.85 }}>
              Our team will check your ID and selfie by hand. We'll message you when it's done.
            </div>
          </div>

          <div className="bd-section">
            <Kicker>While you wait</Kicker>
            <Item title="You can finish your profile" sub="It goes live the moment you're verified." />
            <Item title="Nothing else is needed from you" sub="Don't send the documents again unless we ask." />
          </div>
          <div className="bd-section">
            <Kicker>Your data</Kicker>
            <Item title="Only our review team sees it" sub="Your ID image and selfie are deleted once the review ends." />
          </div>
        </div>
      </Screen>
      <Footer>
        <Button onClick={() => navigate('/profile/create')}>Finish my profile</Button>
        <Button variant="ghost" onClick={() => navigate('/welcome')}>
          Back to start
        </Button>
      </Footer>
    </>
  );
}
