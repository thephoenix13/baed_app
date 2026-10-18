import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerificationStore } from '@/stores/verification-store';
import { Icon } from '@/ui/Icon';
import { analyzeImage, ISSUE_TEXT } from '@/ui/capture/analyze';
import type { ImageReport } from '@/ui/capture/analyze';
import { CameraView } from '@/ui/capture/CameraView';
import { FilePicker } from '@/ui/capture/FilePicker';
import { ImageError, prepareImage } from '@/ui/capture/files';
import { Button, Footer, Item, Kicker, Screen, StepHeader } from '@/ui/kit';

interface Pending {
  blob: Blob;
  url: string;
  report: ImageReport | null; // null while the quality check runs
}

interface CaptureStepProps {
  kind: 'id' | 'selfie';
  step: number;
  backTo: string;
  nextTo: string;
  nextLabel: string;
  kicker: string;
  title: string;
  lead: string;
  cameraTitle: string;
  cameraHint: string;
  tipsTitle: string;
  tips: { title: string; sub?: string }[];
  emptyText: string;
  /** Selfies must be live, so we only offer the phone's own camera app, never the photo library. */
  allowLibrary: boolean;
  children?: ReactNode;
}

const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

export function CaptureStep(props: CaptureStepProps) {
  const { kind, step, backTo, nextTo, nextLabel, kicker, title, lead, cameraTitle, cameraHint, tipsTitle, tips, emptyText, allowLibrary } = props;
  const navigate = useNavigate();
  const stored = useVerificationStore((s) => (kind === 'id' ? s.id : s.selfie));
  const setStored = useVerificationStore((s) => (kind === 'id' ? s.setId : s.setSelfie));
  const [cameraOpen, setCameraOpen] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const pendingUrl = useRef<string | null>(null);

  // Drop an unaccepted preview if the person leaves this screen
  useEffect(
    () => () => {
      if (pendingUrl.current) URL.revokeObjectURL(pendingUrl.current);
    },
    [],
  );

  const discardPending = () => {
    if (pendingUrl.current) URL.revokeObjectURL(pendingUrl.current);
    pendingUrl.current = null;
    setPending(null);
  };

  const accept = (p: Pending) => {
    // Hand the URL to the store, which now owns releasing it
    pendingUrl.current = null;
    setStored({ blob: p.blob, url: p.url });
    setPending(null);
  };

  const review = async (blob: Blob) => {
    discardPending();
    setProblem(null);
    const url = URL.createObjectURL(blob);
    pendingUrl.current = url;
    setPending({ blob, url, report: null });
    try {
      const report = await analyzeImage(blob);
      const next = { blob, url, report };
      if (report.issues.length === 0) accept(next);
      else setPending(next);
    } catch {
      // If the check itself fails, let the person decide by eye
      setPending({ blob, url, report: { width: 0, height: 0, brightness: 128, sharpness: 100, issues: [] } });
    }
  };

  const onCamera = (blob: Blob) => {
    setCameraOpen(false);
    void review(blob);
  };

  const onFiles = async (files: File[]) => {
    try {
      const prepared = await prepareImage(files[0]);
      URL.revokeObjectURL(prepared.url); // review() makes its own URL
      void review(prepared.blob);
    } catch (err) {
      setProblem(err instanceof ImageError ? err.message : "We couldn't open that photo. Please try another.");
    }
  };

  const shown = pending ?? stored;
  const checking = !!pending && pending.report === null;
  const issues = pending?.report?.issues ?? [];
  const accepted = !pending && !!stored;

  return (
    <>
      <Screen footer>
        <StepHeader step={step} total={4} to={backTo} />
        <Kicker>{kicker}</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 8px' }}>
          {title}
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 20px' }}>
          {lead}
        </p>

        <div className="bd-hero pale" style={{ padding: 0, minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {shown ? (
            <img
              src={shown.url}
              alt={kind === 'id' ? 'The photo of your ID' : 'Your selfie'}
              style={{ width: '100%', maxHeight: 360, objectFit: 'cover', display: 'block', borderRadius: 28 }}
            />
          ) : (
            <div className="bd-small bd-muted" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 24 }}>
              <Icon name={kind === 'id' ? 'id' : 'user'} size={20} />
              {emptyText}
            </div>
          )}
        </div>

        <div role="status" aria-live="polite" style={{ marginTop: 14 }}>
          {checking && (
            <p className="bd-small bd-muted" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <span className="bd-spin" aria-hidden="true" /> Checking the photo
            </p>
          )}
          {accepted && (
            <span className="bd-badge">
              <Icon name="check" size={11} strokeWidth={3.2} />
              Looks clear
            </span>
          )}
          {issues.length > 0 && (
            <div className="bd-warn" role="alert" style={{ margin: 0 }}>
              <Icon name="warn" size={18} />
              <div>
                <b style={{ display: 'block' }}>This may be hard to read.</b>
                {issues.map((i) => (
                  <div key={i}>{ISSUE_TEXT[i]}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {problem && (
          <div className="bd-warn" role="alert" style={{ marginTop: 14 }}>
            <Icon name="warn" size={18} />
            <div>{problem}</div>
          </div>
        )}

        <p className="bd-small bd-muted" style={{ margin: '14px 0 0' }}>
          Your photo stays on this device until you submit it.
        </p>

        <div className="bd-section">
          <Kicker>{tipsTitle}</Kicker>
          {tips.map((t) => (
            <Item key={t.title} title={t.title} sub={t.sub} />
          ))}
        </div>
        {props.children}
      </Screen>

      <Footer>
        {accepted ? (
          <>
            <Button onClick={() => navigate(nextTo)}>{nextLabel}</Button>
            <Button variant="ghost" onClick={() => setCameraOpen(true)}>
              Retake
            </Button>
          </>
        ) : issues.length > 0 && pending ? (
          <>
            <Button onClick={() => setCameraOpen(true)}>Retake</Button>
            <Button variant="ghost" onClick={() => accept(pending)}>
              Use this photo anyway
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setCameraOpen(true)} disabled={checking}>
              <Icon name="camera" size={18} />
              Open camera
            </Button>
            {allowLibrary ? (
              <FilePicker onFiles={onFiles} disabled={checking}>
                Choose a photo instead
              </FilePicker>
            ) : (
              isTouchDevice() && (
                <FilePicker capture="user" onFiles={onFiles} disabled={checking}>
                  Use my phone's camera app
                </FilePicker>
              )
            )}
          </>
        )}
      </Footer>

      {cameraOpen && (
        <CameraView
          kind={kind}
          title={cameraTitle}
          hint={cameraHint}
          onCapture={onCamera}
          onClose={() => setCameraOpen(false)}
          fallback={
            allowLibrary ? (
              <FilePicker
                onFiles={(files) => {
                  setCameraOpen(false);
                  void onFiles(files);
                }}
              >
                Choose a photo instead
              </FilePicker>
            ) : isTouchDevice() ? (
              <FilePicker
                capture="user"
                onFiles={(files) => {
                  setCameraOpen(false);
                  void onFiles(files);
                }}
              >
                Use my phone's camera app
              </FilePicker>
            ) : (
              <p className="bd-small" style={{ margin: 0, opacity: 0.85 }}>
                We need a live selfie. Open Bae'd on your phone to continue.
              </p>
            )
          }
        />
      )}
    </>
  );
}
