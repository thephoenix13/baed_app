/**
 * Profile Module — Public API
 *
 * Exports all public types, services, and utilities for the profile module.
 */

// Photo Types
export {
  PhotoModerationStatus,
  ModerationLayer,
  PhotoRejectionReason,
  type ProfilePhoto,
  type ModerationResult,
  type PhotoUploadRequest,
  type PhotoUploadResponse,
  type ModerationJobPayload,
} from './types/photo.types';

// Photo Moderation Service
export {
  runModerationPipeline,
  handleModerationJob,
  getPhoto,
  updatePhotoModeration,
  storePhoto,
  getProfilePhotos,
} from './services/photo-moderation.service';

// Photo Upload Service
export {
  initiatePhotoUpload,
  confirmPhotoUpload,
  getPhotoDisplayUrl,
  deletePhoto,
  setPrimaryPhoto,
  reorderPhotos,
} from './services/photo-upload.service';
