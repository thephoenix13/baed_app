import { useNavigate } from 'react-router-dom';
import { useProfileDraft } from '@/stores/profile-draft-store';
import { Icon } from '@/ui/Icon';
import { Button, Footer, Kicker, Screen, StepHeader, variantFor } from '@/ui/kit';

const MAX = 6;
const MIN = 2;

export function ProfilePhotosScreen() {
  const navigate = useNavigate();
  const { photos, set } = useProfileDraft();

  const tile = (i: number, big = false) => {
    const filled = i < photos;
    return (
      <button
        key={i}
        type="button"
        onClick={() => (filled ? set({ photos: photos - 1 }) : i === photos && set({ photos: photos + 1 }))}
        aria-label={filled ? `Remove photo ${i + 1}` : i === photos ? 'Add a photo' : 'Photo slot'}
        className={filled ? `bd-portrait ${variantFor(`photo-${i}`)}` : ''}
        style={{
          gridColumn: big ? 'span 2' : undefined,
          gridRow: big ? 'span 2' : undefined,
          aspectRatio: big ? '1 / 1.1' : '1 / 1.2',
          borderRadius: 22,
          border: filled ? 'none' : '1.5px dashed var(--bd-dotted)',
          background: filled ? undefined : 'rgba(255,255,255,.6)',
          cursor: i <= photos ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 6,
          color: 'var(--bd-muted)',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {!filled && i === photos && (
          <>
            <Icon name="plus" size={22} />
            {big ? 'Add main photo' : 'Add'}
          </>
        )}
        {filled && big && (
          <span className="bd-badge" style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
            Main
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <Screen footer>
        <StepHeader step={2} total={5} to="/profile/create" />
        <Kicker>Your photos</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          Show them you.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 22px' }}>
          Add at least {MIN} photos, up to {MAX}. Tap a photo to remove it.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {tile(0, true)}
          {Array.from({ length: MAX - 1 }, (_, k) => tile(k + 1))}
        </div>
        <p className="bd-small bd-muted" style={{ marginTop: 16 }}>
          Every photo is checked before it goes live. Your face has to be clearly visible in at least one.
        </p>
      </Screen>
      <Footer>
        <Button disabled={photos < MIN} onClick={() => navigate('/profile/bio')}>
          {photos < MIN ? `Add ${MIN - photos} more` : 'Continue'}
        </Button>
      </Footer>
    </>
  );
}
