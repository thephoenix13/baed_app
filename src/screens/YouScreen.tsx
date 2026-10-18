import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileDraft } from '@/stores/profile-draft-store';
import { Icon } from '@/ui/Icon';
import { Avatar, Button, Kicker, Row, Screen, Section, VerifiedBadge } from '@/ui/kit';

export function YouScreen() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const isVerified = useAuthStore((s) => s.isVerified);
  const { name, age, city, photos } = useProfileDraft();

  return (
    <Screen tint="var(--bd-pink-pale)" nav>
      <h1 className="bd-title" style={{ fontSize: 30, marginBottom: 14 }}>
        You
      </h1>

      <div className="bd-hero plum" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Avatar seed={name || 'you'} size="lg" ring src={photos[0]} label={name ? `${name}, your photo` : 'Your photo'} />
        <div style={{ minWidth: 0 }}>
          <div className="bd-serif" style={{ fontSize: 28, lineHeight: 1.05 }}>
            {name || 'Your profile'}
            {age ? `, ${age}` : ''}
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, margin: '4px 0 8px' }}>{city || 'Add your city'}</div>
          {isVerified ? <VerifiedBadge label="Bae'd Verified" /> : <span className="bd-small">Not verified yet</span>}
        </div>
      </div>

      <Section title="Profile">
        <Row title="Edit profile" onClick={() => navigate('/profile/create')} />
        <Row title="Discovery preferences" onClick={() => navigate('/filters')} />
      </Section>
      <Section title="Settings">
        <Row title="Notifications" onClick={() => navigate('/settings/notifications')} />
        <Row title="Privacy and safety" onClick={() => navigate('/settings/privacy')} />
        <Row title="Verification" sub={isVerified ? 'Verified' : 'Start verification'} onClick={() => navigate(isVerified ? '/settings/verification' : '/verify/why')} />
        <Row title="Blocked people" onClick={() => navigate('/settings/blocked')} />
      </Section>
      <Section title="Account">
        <Row title="Report a problem" onClick={() => navigate('/settings/report')} />
        <Row title="Delete account" trailing={<Icon name="trash" size={18} />} onClick={() => navigate('/settings/delete')} />
      </Section>
      <Section title="Safety">
        <Row title="Plan a Safe Date" sub="Let someone you trust know where you'll be" onClick={() => navigate('/safe-date')} />
      </Section>
      <Section title="Team tools">
        <Row title="Team console" onClick={() => navigate('/admin')} />
      </Section>

      <div style={{ marginTop: 26 }}>
        <Button
          variant="ghost"
          onClick={() => {
            logout();
            navigate('/welcome');
          }}
        >
          <Icon name="logout" size={18} />
          Log out
        </Button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <Kicker>{`Bae'd prototype · build ${__BUILD_ID__}`}</Kicker>
      </div>
    </Screen>
  );
}
