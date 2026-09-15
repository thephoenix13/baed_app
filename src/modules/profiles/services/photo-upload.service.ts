/**
 * Profile Module — Photo Upload Service
 *
 * Handles photo upload flow with signed URLs and moderation pipeline.
 *
 * CRITICAL RULES:
 * - Never store raw images on our servers
 * - Client uploads directly to S3/R2 via signed URL
 * - Signed URLs expire in 5 minutes
 * - All photos go through moderation pipeline
 */

import {
  PhotoModerationStatus,
  type ProfilePhoto,
  type PhotoUploadRequest,
  type PhotoUploadResponse,
  type ModerationJobPayload,
} from '../types/photo.types';
import { handleModerationJob, storePhoto, getPhoto, getProfilePhotos } from './photo-moderation.service';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const SIGNED_URL_EXPIRY_SECONDS = 5 * 60; // 5 minutes
const STORAGE_BUCKET = 'baed-profile-photos';

// ═══════════════════════════════════════════════════════════════
// PHOTO UPLOAD SERVICE
// ═══════════════════════════════════════════════════════════════

/**
 * Initiate photo upload.
 *
 * Flow:
 * 1. Validate request
 * 2. Generate storage key
 * 3. Create signed upload URL (5-min expiry)
 * 4. Create photo record in database
 * 5. Return upload URL to client
 *
 * Client then uploads directly to S3/R2.
 */
export async function initiatePhotoUpload(
  request: PhotoUploadRequest
): Promise<PhotoUploadResponse> {
  console.log(`[PhotoUpload] Initiating upload for profile ${request.profileId}`);

  // Validate file size
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (request.fileSize > MAX_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_SIZE / 1024 / 1024}MB`);
  }

  // Validate MIME type
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  if (!ALLOWED_TYPES.includes(request.mimeType)) {
    throw new Error(`Invalid file type: ${request.mimeType}. Allowed: ${ALLOWED_TYPES.join(', ')}`);
  }

  // Generate storage key
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  const storageKey = `profiles/${request.profileId}/${timestamp}-${randomSuffix}.${getExtension(request.mimeType)}`;

  // Generate signed upload URL
  // In production, this would call S3/R2 to generate a real signed URL
  const uploadUrl = await generateSignedUploadUrl(storageKey, request.mimeType);

  // Create photo record
  const photo: ProfilePhoto = {
    id: `photo-${timestamp}-${randomSuffix}`,
    profileId: request.profileId,
    userId: request.userId,
    storageKey,
    storageBucket: STORAGE_BUCKET,
    originalUrl: null,
    thumbnailUrl: null,
    displayUrl: null,
    position: request.position ?? 0,
    isPrimary: request.isPrimary ?? false,
    width: null,
    height: null,
    fileSize: request.fileSize,
    mimeType: request.mimeType,
    moderationStatus: PhotoModerationStatus.UPLOADED,
    moderationLayer: null,
    rejectionReason: null,
    moderationNotes: null,
    moderatedBy: null,
    nsfwScore: null,
    faceScore: null,
    aiGeneratedScore: null,
    qualityScore: null,
    uploadedAt: new Date(),
    moderationStartedAt: null,
    moderationCompletedAt: null,
    approvedAt: null,
    rejectedAt: null,
    removedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Store photo record
  storePhoto(photo);

  console.log(`[PhotoUpload] Created photo record ${photo.id}, storage key: ${storageKey}`);

  return {
    photoId: photo.id,
    uploadUrl,
    expiresAt: new Date(Date.now() + SIGNED_URL_EXPIRY_SECONDS * 1000),
    storageKey,
  };
}

/**
 * Confirm photo upload and start moderation.
 *
 * Called after client successfully uploads to S3/R2.
 */
export async function confirmPhotoUpload(photoId: string): Promise<ProfilePhoto> {
  const photo = getPhoto(photoId);
  if (!photo) {
    throw new Error(`Photo ${photoId} not found`);
  }

  if (photo.moderationStatus !== PhotoModerationStatus.UPLOADED) {
    throw new Error(`Photo ${photoId} is not in UPLOADED state`);
  }

  console.log(`[PhotoUpload] Confirming upload for photo ${photoId}`);

  // Update status
  photo.moderationStatus = PhotoModerationStatus.SECURITY_CHECK;
  photo.moderationStartedAt = new Date();
  photo.updatedAt = new Date();
  storePhoto(photo);

  // Queue moderation job
  // In production, this would add to BullMQ queue
  const payload: ModerationJobPayload = {
    photoId: photo.id,
    profileId: photo.profileId,
    userId: photo.userId,
    storageKey: photo.storageKey,
    storageBucket: photo.storageBucket,
    mimeType: photo.mimeType || 'image/jpeg',
    fileSize: photo.fileSize || 0,
    priority: 'normal',
  };

  // Run moderation pipeline (async)
  // In production: await moderationQueue.add('moderate', payload);
  runModerationAsync(payload).catch((error) => {
    console.error(`[PhotoUpload] Moderation failed for photo ${photoId}:`, error);
  });

  return photo;
}

/**
 * Run moderation pipeline asynchronously.
 */
async function runModerationAsync(payload: ModerationJobPayload): Promise<void> {
  console.log(`[PhotoUpload] Starting moderation for photo ${payload.photoId}`);

  // Update status to PROCESSING
  const photo = getPhoto(payload.photoId);
  if (photo) {
    photo.moderationStatus = PhotoModerationStatus.PROCESSING;
    photo.updatedAt = new Date();
    storePhoto(photo);
  }

  // Run moderation pipeline
  const result = await handleModerationJob(payload);

  // Update photo with moderation result
  const { updatePhotoModeration } = await import('./photo-moderation.service');
  updatePhotoModeration(payload.photoId, result);

  console.log(
    `[PhotoUpload] Moderation complete for photo ${payload.photoId}: ` +
    `${result.approved ? 'APPROVED' : 'REJECTED'} (${result.layer})`
  );

  // If rejected, notify user
  if (!result.approved) {
    console.log(`[PhotoUpload] Photo ${payload.photoId} rejected: ${result.rejectionReason}`);
    // In production: await notificationService.sendPhotoRejectionNotification(payload.userId, result);
  }
}

/**
 * Get signed URL for photo display.
 *
 * Signed URLs expire in 5 minutes.
 * Client should cache and refresh as needed.
 */
export async function getPhotoDisplayUrl(photoId: string): Promise<string | null> {
  const photo = getPhoto(photoId);
  if (!photo) return null;

  // Only return URL for approved photos
  if (photo.moderationStatus !== PhotoModerationStatus.APPROVED &&
      photo.moderationStatus !== PhotoModerationStatus.AUTO_APPROVED) {
    return null;
  }

  // Generate signed URL
  // In production: await s3.getSignedUrl('getObject', { Bucket, Key, Expires })
  const signedUrl = await generateSignedDisplayUrl(photo.storageKey);

  // Update photo record with current display URL
  photo.displayUrl = signedUrl;
  photo.updatedAt = new Date();
  storePhoto(photo);

  return signedUrl;
}

/**
 * Delete a photo.
 */
export async function deletePhoto(photoId: string, userId: string): Promise<boolean> {
  const photo = getPhoto(photoId);
  if (!photo) return false;

  // Verify ownership
  if (photo.userId !== userId) {
    throw new Error('Unauthorized: Cannot delete photo owned by another user');
  }

  console.log(`[PhotoUpload] Deleting photo ${photoId}`);

  // Mark as removed
  photo.moderationStatus = PhotoModerationStatus.REMOVED;
  photo.removedAt = new Date();
  photo.updatedAt = new Date();
  storePhoto(photo);

  // In production: Delete from S3/R2
  // await s3.deleteObject({ Bucket, Key: photo.storageKey });

  return true;
}

/**
 * Set photo as primary.
 */
export async function setPrimaryPhoto(photoId: string, userId: string): Promise<ProfilePhoto> {
  const photo = getPhoto(photoId);
  if (!photo) {
    throw new Error(`Photo ${photoId} not found`);
  }

  // Verify ownership
  if (photo.userId !== userId) {
    throw new Error('Unauthorized: Cannot modify photo owned by another user');
  }

  // Only approved photos can be primary
  if (photo.moderationStatus !== PhotoModerationStatus.APPROVED &&
      photo.moderationStatus !== PhotoModerationStatus.AUTO_APPROVED) {
    throw new Error('Only approved photos can be set as primary');
  }

  console.log(`[PhotoUpload] Setting photo ${photoId} as primary`);

  // Unset other primary photos
  const profilePhotos = getProfilePhotos(photo.profileId);
  for (const p of profilePhotos) {
    if (p.isPrimary && p.id !== photoId) {
      p.isPrimary = false;
      p.updatedAt = new Date();
      storePhoto(p);
    }
  }

  // Set this photo as primary
  photo.isPrimary = true;
  photo.position = 0; // Primary photo is always first
  photo.updatedAt = new Date();
  storePhoto(photo);

  return photo;
}

/**
 * Reorder photos.
 */
export async function reorderPhotos(
  profileId: string,
  userId: string,
  photoIds: string[]
): Promise<void> {
  const profilePhotos = getProfilePhotos(profileId);

  // Verify all photos belong to user
  for (const photo of profilePhotos) {
    if (photo.userId !== userId) {
      throw new Error('Unauthorized: Cannot reorder photos owned by another user');
    }
  }

  console.log(`[PhotoUpload] Reordering photos for profile ${profileId}`);

  // Update positions
  for (let i = 0; i < photoIds.length; i++) {
    const photo = getPhoto(photoIds[i]);
    if (photo && photo.profileId === profileId) {
      photo.position = i;
      photo.updatedAt = new Date();
      storePhoto(photo);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Generate signed upload URL.
 *
 * In production, this would call S3/R2:
 *
 * ```typescript
 * const command = new PutObjectCommand({
 *   Bucket: STORAGE_BUCKET,
 *   Key: storageKey,
 *   ContentType: mimeType,
 * });
 * return await getSignedUrl(s3Client, command, { expiresIn: SIGNED_URL_EXPIRY_SECONDS });
 * ```
 */
async function generateSignedUploadUrl(storageKey: string, mimeType: string): Promise<string> {
  // Mock signed URL for development
  const expiresAt = Date.now() + SIGNED_URL_EXPIRY_SECONDS * 1000;
  const signature = Math.random().toString(36).slice(2);

  return `https://${STORAGE_BUCKET}.s3.amazonaws.com/${storageKey}?X-Amz-Expires=${SIGNED_URL_EXPIRY_SECONDS}&X-Amz-Signature=${signature}&Content-Type=${encodeURIComponent(mimeType)}`;
}

/**
 * Generate signed display URL.
 *
 * In production, this would call S3/R2:
 *
 * ```typescript
 * const command = new GetObjectCommand({
 *   Bucket: STORAGE_BUCKET,
 *   Key: storageKey,
 * });
 * return await getSignedUrl(s3Client, command, { expiresIn: SIGNED_URL_EXPIRY_SECONDS });
 * ```
 */
async function generateSignedDisplayUrl(storageKey: string): Promise<string> {
  // Mock signed URL for development
  const expiresAt = Date.now() + SIGNED_URL_EXPIRY_SECONDS * 1000;
  const signature = Math.random().toString(36).slice(2);

  return `https://${STORAGE_BUCKET}.s3.amazonaws.com/${storageKey}?X-Amz-Expires=${SIGNED_URL_EXPIRY_SECONDS}&X-Amz-Signature=${signature}`;
}

/**
 * Get file extension from MIME type.
 */
function getExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return extensions[mimeType] || 'jpg';
}
