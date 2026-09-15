/**
 * Camera Capture Component
 *
 * Uses getUserMedia API for ID document and selfie capture.
 * Handles iOS Safari camera permission flow gracefully.
 *
 * CRITICAL: Requires HTTPS in production (getUserMedia restriction).
 * Development: localhost is allowed.
 */

import { useState, useRef, useEffect, useCallback } from 'react';

type CaptureMode = 'id' | 'selfie';

interface CameraCaptureProps {
  mode: CaptureMode;
  onCapture: (imageBlob: Blob) => void;
  onError: (error: string) => void;
  onClose: () => void;
}

export function CameraCapture({ mode, onCapture, onError, onClose }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check HTTPS requirement
  useEffect(() => {
    const isSecure = window.isSecureContext;
    if (!isSecure) {
      setError('Camera requires HTTPS. Please use a secure connection.');
      onError('Camera requires HTTPS');
      return;
    }
  }, [onError]);

  // Initialize camera
  useEffect(() => {
    if (error) return;

    let currentStream: MediaStream | null = null;

    async function initCamera() {
      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: mode === 'selfie' ? 'user' : 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(currentStream);

        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error('[CameraCapture] Failed to access camera:', err);

        let errorMessage = 'Failed to access camera';

        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
          } else if (err.name === 'NotFoundError') {
            errorMessage = 'No camera found. Please connect a camera and try again.';
          } else if (err.name === 'NotReadableError') {
            errorMessage = 'Camera is being used by another application. Please close other apps and try again.';
          }
        }

        setError(errorMessage);
        onError(errorMessage);
      }
    }

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mode, error, onError]);

  // Capture photo
  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      setError('Failed to capture image');
      setIsCapturing(false);
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('Failed to capture image');
          setIsCapturing(false);
          return;
        }

        // Create preview URL
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);

        // Stop camera stream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }

        setIsCapturing(false);
      },
      'image/jpeg',
      0.9 // Quality
    );
  }, [stream]);

  // Retake photo
  const handleRetake = useCallback(async () => {
    setCapturedImage(null);

    // Restart camera
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode === 'selfie' ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('[CameraCapture] Failed to restart camera:', err);
      setError('Failed to restart camera');
    }
  }, [mode]);

  // Confirm and upload
  const handleConfirm = useCallback(() => {
    if (!capturedImage) return;

    // Convert data URL to blob
    fetch(capturedImage)
      .then((res) => res.blob())
      .then((blob) => {
        onCapture(blob);
      })
      .catch((err) => {
        console.error('[CameraCapture] Failed to process image:', err);
        setError('Failed to process image');
      });
  }, [capturedImage, onCapture]);

  // Render instructions based on mode
  const renderInstructions = () => {
    if (mode === 'id') {
      return (
        <div className="text-center mb-4">
          <h3 className="text-h3 text-ink mb-2">Capture Your ID</h3>
          <p className="text-body text-muted">
            Position your ID card within the frame. Ensure all text is clear and readable.
          </p>
        </div>
      );
    } else {
      return (
        <div className="text-center mb-4">
          <h3 className="text-h3 text-ink mb-2">Take a Selfie</h3>
          <p className="text-body text-muted">
            Look directly at the camera. Ensure your face is clearly visible and well-lit.
          </p>
        </div>
      );
    }
  };

  // Render camera guide overlay
  const renderGuide = () => {
    if (mode === 'id') {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-4/5 h-3/5 border-4 border-white/50 rounded-lg"></div>
        </div>
      );
    } else {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 border-4 border-white/50 rounded-full"></div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center justify-between bg-black/50">
        <button
          onClick={onClose}
          className="btn btn-ghost !px-3 !py-2 !border-white !text-white"
          aria-label="Close camera"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <span className="text-body font-semibold text-white">
          {mode === 'id' ? 'Capture ID' : 'Take Selfie'}
        </span>
        <div className="w-10"></div>
      </div>

      {/* Camera View / Preview */}
      <div className="flex-1 relative overflow-hidden">
        {error ? (
          // Error state
          <div className="flex items-center justify-center h-full px-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <p className="text-body text-white mb-4">{error}</p>
              <button onClick={onClose} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        ) : capturedImage ? (
          // Preview captured image
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          </div>
        ) : stream ? (
          // Live camera feed
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {renderGuide()}
          </div>
        ) : (
          // Loading state
          <div className="flex items-center justify-center h-full">
            <div className="spinner !w-8 !h-8 !border-4"></div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-6 py-8 bg-black/50">
        {renderInstructions()}

        {capturedImage ? (
          // Retake / Confirm buttons
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              className="btn btn-ghost flex-1 !border-white !text-white"
            >
              Retake
            </button>
            <button
              onClick={handleConfirm}
              className="btn btn-primary flex-1"
            >
              Use Photo
            </button>
          </div>
        ) : (
          // Capture button
          <div className="flex justify-center">
            <button
              onClick={handleCapture}
              disabled={isCapturing || !stream}
              className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all ${
                isCapturing || !stream
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-110 active:scale-95'
              }`}
              aria-label="Capture photo"
            >
              <div className="w-16 h-16 rounded-full bg-white"></div>
            </button>
          </div>
        )}
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
