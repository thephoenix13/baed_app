import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { demoTools } from '@/lib/api';
import { useVerificationStore } from '@/stores/verification-store';
import { Icon } from '@/ui/Icon';
import { Kicker, Screen } from '@/ui/kit';

const STAGES = ['Checking your ID', 'Matching your selfie', 'Confirming the result'];
const STAGE_MS = 1700;

export function ProcessingScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [stage, setStage] = useState(0);
  // Demo only: add ?fail to the URL to see the failed state until the real provider is connected.
  const willFail = new URLSearchParams(search).has('fail');
  const ready = useVerificationStore((s) => !!s.id && !!s.selfie);
  const clearPhotos = useVerificationStore((s) => s.clear);

  useEffect(() => {
    const timer = window.setInterval(() => setStage((s) => s + 1), STAGE_MS);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (stage >= STAGES.length) {
      // The check is done: the ID photo and selfie are discarded, only the result is kept
      clearPhotos();
      navigate('/verify/result', {
        replace: true,
        state: willFail ? { success: false, reason: 'The selfie did not match the photo on the ID.' } : { success: true },
      });
    }
  }, [stage, navigate, willFail, clearPhotos]);

  // Nothing to check without both photos
  if (!ready && !demoTools) return <Navigate to="/verify/id" replace />;

  return (
    <Screen tint="var(--bd-peach)">
      <div className="bd-center">
        <Kicker>Verification</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 10px' }}>
          Checking it's you.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 24px' }} aria-live="polite">
          This usually takes under a minute. You can leave this screen open.
        </p>
        <div className="bd-hero plum" style={{ padding: '10px 22px' }}>
          {STAGES.map((label, i) => {
            const done = i < stage;
            const active = i === stage;
            return (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 0',
                  borderTop: i ? '1.5px dotted rgba(255,255,255,.25)' : 'none',
                  opacity: done || active ? 1 : 0.5,
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    flex: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: done ? 'var(--bd-pink)' : 'transparent',
                    border: done ? 'none' : '1.5px solid rgba(255,255,255,.5)',
                    color: 'var(--bd-plum)',
                  }}
                >
                  {done && <Icon name="check" size={14} strokeWidth={3} />}
                </span>
                <span style={{ fontSize: 15, fontWeight: active ? 700 : 500 }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
