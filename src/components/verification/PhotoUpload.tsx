/**
 * Photo Upload Component
 *
 * Integrates camera capture with photo upload service.
 * Handles the full flow: capture → upload → moderation status.
 */

import { useState, useCallback } from 'react';
import { CameraCapture } from './CameraCapture';
import { initiatePhotoUpload, confirmPhotoUpload } from '@/modules/profiles/services/photo-upload.service';
import type { ProfilePhoto } from '@/modules/profiles/types/photo.types';

type UploadMode = 'id' | 'selfie' | 'profile';

interface PhotoUploadProps {
  mode: UploadMode;
  profileId: string;
  userId: string;
  onSuccess: (photo: ProfilePhoto) => void;
  onError: (error: string) => void;
  onClose: () => void;
}

export function PhotoUpload({ mode, profileId, userId, onSuccess, onError, onClose }: PhotoUploadProps) {
  const [step, setStep] = useState<'capture' | 'uploading' | 'processing' | 'complete'>('capture');
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle photo capture from camera
  const handleCapture = useCallback(
    async (imageBlob: Blob) => {
      try {
        setStep('uploading');
        setError(null);

        console.log(`[PhotoUpload] Starting upload for ${mode} photo`);

        // 1. Initiate upload (get signed URL)
        const uploadResponse = await initiatePhotoUpload({
          profileId,
          userId,
          fileName: `${mode}-${Date.now()}.jpg`,
          fileSize: imageBlob.size,
          mimeType: imageBlob.type || 'image/jpeg',
          position: mode === 'profile' ? 1 : 0,
          isPrimary: mode === 'profile',
        });

        setPhotoId(uploadResponse.photoId);

        // 2. Upload directly to S3/R2 using signed URL
        // In production, this would be a PUT request to the signed URL
        console.log(`[PhotoUpload] Uploading to: ${uploadResponse.uploadUrl}`);

        // Mock upload (in production: await fetch(uploadResponse.uploadUrl, { method: 'PUT', body: imageBlob }))
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 3. Confirm upload (triggers moderation)
        await confirmPhotoUpload(uploadResponse.photoId);

        setStep('processing');

        // 4. Poll for moderation status
        // In production, this would poll the API or use WebSocket
        await pollModerationStatus(uploadResponse.photoId);

      } catch (err) {
        console.error('[PhotoUpload] Upload failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        onError(errorMessage);
        setStep('capture');
      }
    },
    [mode, profileId, userId, onError]
  );

  // Poll moderation status
  const pollModerationStatus = async (photoId: string) => {
    const maxAttempts = 30; // 30 seconds max
    const pollInterval = 1000; // 1 second

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));

      // In production: const photo = await api.getPhoto(photoId);
      // Mock: simulate moderation completing after 3-5 seconds
      if (i >= 3 && i <= 5) {
        // Simulate moderation complete
        const mockPhoto: ProfilePhoto = {
          id: photoId,
          profileId,
          userId,
          storageKey: `profiles/${profileId}/${photoId}.jpg`,
          storageBucket: 'baed-profile-photos',
          originalUrl: null,
          thumbnailUrl: null,
          displayUrl: `https://mock-storage.baed.in/${photoId}.jpg`,
          position: 0,
          isPrimary: true,
          width: 1280,
          height: 720,
          fileSize: 500000,
          mimeType: 'image/jpeg',
          moderationStatus: 'APPROVED' as any,
          moderationLayer: 'CLASSIFIER' as any,
          rejectionReason: null,
          moderationNotes: 'Passed all checks',
          moderatedBy: 'auto',
          nsfwScore: 0.05,
          faceScore: 0.95,
          aiGeneratedScore: 0.02,
          qualityScore: 0.88,
          uploadedAt: new Date(),
          moderationStartedAt: new Date(),
          moderationCompletedAt: new Date(),
          approvedAt: new Date(),
          rejectedAt: null,
          removedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setStep('complete');
        onSuccess(mockPhoto);
        return;
      }
    }

    // Timeout
    setError('Moderation is taking longer than expected. Please check back later.');
    onError('Moderation timeout');
  };

  // Render based on step
  if (step === 'capture') {
    return (
      <CameraCapture
        mode={mode === 'profile' ? 'selfie' : mode}
        onCapture={handleCapture}
        onError={onError}
        onClose={onClose}
      />
    );
  }

  if (step === 'uploading') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner !w-12 !h-12 !border-4 mb-4"></div>
          <p className="text-body text-white">Uploading...</p>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="spinner !w-12 !h-12 !border-4 mb-4"></div>
          <h3 className="text-h3 text-white mb-2">Processing Your Photo</h3>
          <p className="text-body text-white/70 mb-6">
            We're checking your photo to ensure it meets our community guidelines.
            This usually takes a few seconds.
          </p>
          <p className="text-body text-white/50 text-sm">
            Please don't close this screen.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 bg-verified-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-verified-green"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h3 className="text-h3 text-white mb-2">Photo Approved!</h3>
          <p className="text-body text-white/70 mb-6">
            Your photo has been verified and added to your profile.
          </p>
          <button onClick={onClose} className="btn btn-primary">
            Continue
          </button>
        </div>
      </div>
    );
  }

  return null;
}
