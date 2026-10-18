import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_PHOTOS, useProfileDraft } from '@/stores/profile-draft-store';
import { Icon } from '@/ui/Icon';
import { CameraView } from '@/ui/capture/CameraView';
import { FilePicker } from '@/ui/capture/FilePicker';
import { ImageError, prepareImage } from '@/ui/capture/files';
import { Button, Footer, Kicker, Screen, Sheet, StepHeader } from '@/ui/kit';

const MIN = 2;

export function ProfilePhotosScreen() {
  const navigate = useNavigate();
  const { photos, addPhotos, removePhoto, makeMainPhoto } = useProfileDraft();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);

  const room = MAX_PHOTOS - photos.length;

  const handleBlobs = async (blobs: Blob[]) => {
    setWorking(true);
    setProblems([]);
    const urls: string[] = [];
    const errors: string[] = [];
    for (const blob of blobs.slice(0, room)) {
      try {
        const prepared = await prepareImage(blob, { maxEdge: 1400, quality: 0.85 });
        urls.push(prepared.url);
      } catch (err) {
        errors.push(err instanceof ImageError ? err.message : "We couldn't open one of the photos.");
      }
    }
    if (blobs.length > room) errors.push(`Only ${MAX_PHOTOS} photos fit, so we added the first ${room}.`);
    if (urls.length) addPhotos(urls);
    setProblems(Array.from(new Set(errors)));
    setWorking(false);
  };

  const tile = (i: number) => {
    const url = photos[i];
    const isMain = i === 0;
    if (url) {
      return (
        <div
          key={url}
          style={{ gridColumn: isMain ? 'span 2' : undefined, gridRow: isMain ? 'span 2' : undefined, position: 'relative', aspectRatio: isMain ? '1 / 1.1' : '1 / 1.2', borderRadius: 22, overflow: 'hidden', background: 'var(--bd-pink-pale)' }}
        >
          <img src={url} alt={`Photo ${i + 1}${isMain ? ', main photo' : ''}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {isMain && (
            <span className="bd-badge" style={{ position: 'absolute', top: 10, left: 10 }}>
              Main
            </span>
          )}
          <button
            type="button"
            aria-label={`Remove photo ${i + 1}`}
            onClick={() => removePhoto(i)}
            className="bd-circ sm"
            style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(255,255,255,.92)' }}
          >
            <Icon name="x" size={16} />
          </button>
          {!isMain && (
            <button
              type="button"
              onClick={() => makeMainPhoto(i)}
              style={{ all: 'unset', cursor: 'pointer', position: 'absolute', left: 6, right: 6, bottom: 6, minHeight: 36, textAlign: 'center', background: 'rgba(255,255,255,.92)', borderRadius: 999, fontSize: 12, fontWeight: 700, color: 'var(--bd-plum)' }}
              aria-label={`Make photo ${i + 1} your main photo`}
            >
              Make main
            </button>
          )}
        </div>
      );
    }
    const nextEmpty = i === photos.length;
    return (
      <button
        key={`empty-${i}`}
        type="button"
        disabled={!nextEmpty || working}
        onClick={() => setSheetOpen(true)}
        aria-label={nextEmpty ? 'Add a photo' : 'Empty photo slot'}
        style={{
          gridColumn: isMain ? 'span 2' : undefined,
          gridRow: isMain ? 'span 2' : undefined,
          aspectRatio: isMain ? '1 / 1.1' : '1 / 1.2',
          borderRadius: 22,
          border: '1.5px dashed var(--bd-dotted)',
          background: 'rgba(255,255,255,.6)',
          cursor: nextEmpty ? 'pointer' : 'default',
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
        {nextEmpty &&
          (working ? (
            <span className="bd-spin" aria-hidden="true" />
          ) : (
            <>
              <Icon name="plus" size={22} />
              {isMain ? 'Add main photo' : 'Add'}
            </>
          ))}
      </button>
    );
  };

  return (
    <>
      <Screen footer>
        <StepHeader step={5} total={8} to="/profile/location" />
        <Kicker>Your photos</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          Show them you.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 22px' }}>
          Add at least {MIN} photos, up to {MAX_PHOTOS}. Your first photo is the one people see first.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {Array.from({ length: MAX_PHOTOS }, (_, i) => tile(i))}
        </div>

        <div role="status" aria-live="polite">
          {problems.map((p) => (
            <div key={p} className="bd-warn" role="alert" style={{ marginTop: 14 }}>
              <Icon name="warn" size={18} />
              <div>{p}</div>
            </div>
          ))}
        </div>

        <p className="bd-small bd-muted" style={{ marginTop: 16 }}>
          Every photo is checked before it goes live. Your face has to be clearly visible in at least one. Photos stay on this device until your profile is submitted.
        </p>
      </Screen>
      <Footer>
        <Button disabled={photos.length < MIN} onClick={() => navigate('/profile/bio')}>
          {photos.length < MIN ? `Add ${MIN - photos.length} more` : 'Continue'}
        </Button>
      </Footer>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} label="Add a photo">
        <div className="bd-serif" style={{ fontSize: 24, marginBottom: 14 }}>
          Add a photo
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button
            onClick={() => {
              setSheetOpen(false);
              setCameraOpen(true);
            }}
          >
            <Icon name="camera" size={18} />
            Take a photo
          </Button>
          <FilePicker
            multiple
            onFiles={(files) => {
              setSheetOpen(false);
              void handleBlobs(files);
            }}
          >
            Choose from your library
          </FilePicker>
        </div>
      </Sheet>

      {cameraOpen && (
        <CameraView
          kind="photo"
          title="Take a photo"
          hint="Face the light and smile"
          onClose={() => setCameraOpen(false)}
          onCapture={(blob) => {
            setCameraOpen(false);
            void handleBlobs([blob]);
          }}
          fallback={
            <FilePicker
              multiple
              onFiles={(files) => {
                setCameraOpen(false);
                void handleBlobs(files);
              }}
            >
              Choose from your library
            </FilePicker>
          }
        />
      )}
    </>
  );
}
