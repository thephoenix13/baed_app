import { useCallback, useEffect, useRef, useState } from 'react';

export type CameraStatus =
  | 'idle'
  | 'requesting' // waiting for the browser's permission prompt
  | 'ready'
  | 'denied' // the person said no, or the browser blocks the camera
  | 'no-camera' // nothing to use
  | 'in-use' // another app has the camera
  | 'insecure' // not https, or the browser has no camera support
  | 'error';

export type Facing = 'user' | 'environment';

/**
 * Open the camera, show it in a <video>, and capture a still.
 * The stream is stopped when the hook unmounts or stop() is called.
 */
export function useCamera(initialFacing: Facing) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [facing, setFacing] = useState<Facing>(initialFacing);
  const [canFlip, setCanFlip] = useState(false);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const start = useCallback(
    async (want: Facing = facing) => {
      stop();
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setStatus('insecure');
        return;
      }
      setStatus('requesting');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: want }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        streamRef.current = stream;
        setFacing(want);
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => undefined); // autoplay can be blocked until the first tap
        }
        // Only now do labels and the full device list become available
        const devices = await navigator.mediaDevices.enumerateDevices().catch(() => []);
        setCanFlip(devices.filter((d) => d.kind === 'videoinput').length > 1);
        setStatus('ready');
      } catch (err) {
        const name = err instanceof DOMException ? err.name : '';
        if (name === 'NotAllowedError' || name === 'SecurityError') setStatus('denied');
        else if (name === 'NotFoundError' || name === 'OverconstrainedError') setStatus('no-camera');
        else if (name === 'NotReadableError' || name === 'AbortError') setStatus('in-use');
        else setStatus('error');
      }
    },
    [facing, stop],
  );

  useEffect(() => stop, [stop]);

  /** Capture the current frame as a JPEG, as the camera sees it (not mirrored). */
  const capture = useCallback(async (maxEdge = 1600, quality = 0.88): Promise<Blob> => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) throw new Error('The camera is not ready yet.');
    const scale = Math.min(1, maxEdge / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not capture the photo.');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob) throw new Error('Could not capture the photo.');
    return blob;
  }, []);

  const flip = useCallback(() => start(facing === 'user' ? 'environment' : 'user'), [facing, start]);

  return { videoRef, status, facing, canFlip, start, stop, capture, flip };
}
