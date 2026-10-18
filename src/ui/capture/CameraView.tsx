import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { isIOS } from '@/lib/pwa';
import { Icon } from '../Icon';
import { Button } from '../kit';
import { useCamera } from './useCamera';
import type { CameraStatus, Facing } from './useCamera';

export type CaptureKind = 'id' | 'selfie' | 'photo';

interface CameraViewProps {
  kind: CaptureKind;
  title: string;
  hint: string;
  onCapture: (blob: Blob) => void;
  onClose: () => void;
  /** Shown beside the error message, e.g. a button to choose a file instead. */
  fallback?: ReactNode;
}

const FACING: Record<CaptureKind, Facing> = { id: 'environment', selfie: 'user', photo: 'user' };

const PROBLEMS: Record<Exclude<CameraStatus, 'idle' | 'requesting' | 'ready'>, { title: string; message: (ios: boolean) => string; retry: boolean }> = {
  denied: {
    title: 'Camera access is blocked.',
    message: (ios) =>
      ios
        ? 'Open Settings, find your browser or Bae\'d, turn on Camera, then come back and try again.'
        : 'Tap the lock icon next to the address, set Camera to Allow, then try again.',
    retry: true,
  },
  'no-camera': {
    title: "We can't find a camera.",
    message: () => 'Check that your device has a working camera, or choose a photo instead.',
    retry: false,
  },
  'in-use': {
    title: 'Another app is using the camera.',
    message: () => 'Close any video call or camera app, then try again.',
    retry: true,
  },
  insecure: {
    title: "The camera isn't available here.",
    message: () => 'Cameras only work on a secure (https) page in a supported browser. You can choose a photo instead.',
    retry: false,
  },
  error: {
    title: "The camera didn't start.",
    message: () => 'Something went wrong opening the camera. Try again, or choose a photo instead.',
    retry: true,
  },
};

/** Dims everything outside the guide so the person knows where to place their ID or face. */
const guideStyle = (kind: CaptureKind): CSSProperties =>
  kind === 'id'
    ? { width: 'min(86%, 360px)', aspectRatio: '1.586 / 1', borderRadius: 18 }
    : { width: 'min(70%, 280px)', aspectRatio: '3 / 4', borderRadius: '50%' };

export function CameraView({ kind, title, hint, onCapture, onClose, fallback }: CameraViewProps) {
  const camera = useCamera(FACING[kind]);
  const { status, start, videoRef, capture, canFlip, flip, facing } = camera;
  const [busy, setBusy] = useState(false);
  const shutter = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    void start();
    // start once when the camera opens; later restarts are explicit (retry, flip)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (status === 'ready') shutter.current?.focus();
  }, [status]);

  const take = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await capture();
      camera.stop();
      onCapture(blob);
    } catch {
      setBusy(false);
    }
  };

  const problem = status in PROBLEMS ? PROBLEMS[status as keyof typeof PROBLEMS] : null;
  const mirrored = facing === 'user';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bd-plum-deep)', color: '#fff', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: '100%', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            aria-label="Camera preview"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: mirrored ? 'scaleX(-1)' : undefined,
              visibility: status === 'ready' ? 'visible' : 'hidden',
            }}
          />

          {status === 'ready' && kind !== 'photo' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }} aria-hidden="true">
              <div style={{ ...guideStyle(kind), boxShadow: '0 0 0 100vmax rgba(18, 8, 32, .55)', border: '2.5px solid rgba(255,255,255,.9)' }} />
            </div>
          )}

          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 'calc(14px + env(safe-area-inset-top, 0px)) 16px 12px', display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(180deg, rgba(18,8,32,.7), rgba(18,8,32,0))' }}>
            <button type="button" className="bd-back" style={{ color: '#fff' }} aria-label="Close camera" onClick={onClose}>
              <Icon name="x" size={22} />
            </button>
            <div style={{ minWidth: 0 }}>
              <div className="bd-serif" style={{ fontSize: 20 }}>{title}</div>
              {status === 'ready' && <div style={{ fontSize: 13, opacity: 0.85 }}>{hint}</div>}
            </div>
          </div>

          {status === 'requesting' && (
            <div role="status" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 32, textAlign: 'center' }}>
              <span className="bd-spin" style={{ width: 28, height: 28 }} aria-hidden="true" />
              <div className="bd-serif" style={{ fontSize: 26 }}>Allow camera access.</div>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.85, maxWidth: 280 }}>Your browser will ask. We only use the camera while this screen is open.</p>
            </div>
          )}

          {problem && (
            <div role="alert" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 28, textAlign: 'center' }}>
              <Icon name="camera" size={30} style={{ color: 'var(--bd-pink-light)' }} />
              <div className="bd-serif" style={{ fontSize: 28, lineHeight: 1.1 }}>{problem.title}</div>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.85, maxWidth: 300 }}>{problem.message(isIOS())}</p>
              <div className="bd-on-dark" style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300, marginTop: 8 }}>
                {problem.retry && <Button variant="pink" onClick={() => void start()}>Try again</Button>}
                {fallback}
                <Button variant="ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.35)' }} onClick={onClose}>
                  Go back
                </Button>
              </div>
            </div>
          )}

          {status === 'ready' && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '20px 24px calc(26px + env(safe-area-inset-bottom, 0px))', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, background: 'linear-gradient(0deg, rgba(18,8,32,.75), rgba(18,8,32,0))' }}>
              <span style={{ width: 48 }} />
              <button
                ref={shutter}
                type="button"
                onClick={take}
                disabled={busy}
                aria-label="Take photo"
                style={{ width: 76, height: 76, borderRadius: '50%', background: '#fff', border: '5px solid rgba(255,255,255,.45)', backgroundClip: 'padding-box', cursor: 'pointer', opacity: busy ? 0.6 : 1 }}
              />
              {canFlip ? (
                <button type="button" className="bd-circ sm" style={{ background: 'rgba(255,255,255,.18)', color: '#fff', borderColor: 'rgba(255,255,255,.3)', width: 48, height: 48 }} aria-label="Switch camera" onClick={() => void flip()}>
                  <Icon name="camera" size={20} />
                </button>
              ) : (
                <span style={{ width: 48 }} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
