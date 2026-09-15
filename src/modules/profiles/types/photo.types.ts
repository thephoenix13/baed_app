/**
 * Profile Module — Photo Types
 *
 * Types for profile photos and moderation workflow.
 */

// ═══════════════════════════════════════════════════════════════
// PHOTO MODERATION STATES
// ═══════════════════════════════════════════════════════════════

export enum PhotoModerationStatus {
  // Initial states
  UPLOADED = 'UPLOADED',              // Just uploaded, not yet processed
  SECURITY_CHECK = 'SECURITY_CHECK',  // Checking for malware/malicious content

  // Processing states
  PROCESSING = 'PROCESSING',          // Being processed by moderation pipeline
  NSFW_DETECTION = 'NSFW_DETECTION', // Checking for explicit content
  AI_ANALYSIS = 'AI_ANALYSIS',       // Checking for AI-generated/manipulated images
  FACE_CHECK = 'FACE_CHECK',         // Face detection + identity verification

  // Review states
  IN_REVIEW = 'IN_REVIEW',           // Sent to human moderator (ambiguous cases)
  AUTO_APPROVED = 'AUTO_APPROVED',   // Passed all automated checks
  AUTO_REJECTED = 'AUTO_REJECTED',   // Failed automated checks

  // Final states
  APPROVED = 'APPROVED',             // Final approval (auto or manual)
  REJECTED = 'REJECTED',             // Final rejection (auto or manual)
  REMOVED = 'REMOVED',               // Removed after approval (user/admin action)
}

// ═══════════════════════════════════════════════════════════════
// MODERATION LAYERS
// ═══════════════════════════════════════════════════════════════

export enum ModerationLayer {
  RULES = 'RULES',                   // Layer 1: Rule-based checks
  CLASSIFIER = 'CLASSIFIER',         // Layer 2: Lightweight ML classifier
  LLM = 'LLM',                       // Layer 3: LLM analysis (expensive)
  HUMAN = 'HUMAN',                   // Layer 4: Human review
}

// ═══════════════════════════════════════════════════════════════
// REJECTION REASONS
// ═══════════════════════════════════════════════════════════════

export enum PhotoRejectionReason {
  // Content violations
  NSFW_CONTENT = 'NSFW_CONTENT',
  VIOLENCE = 'VIOLENCE',
  HATE_SYMBOLS = 'HATE_SYMBOLS',
  ILLEGAL_ACTIVITY = 'ILLEGAL_ACTIVITY',

  // Quality issues
  BLURRY = 'BLURRY',
  DARK = 'DARK',
  LOW_RESOLUTION = 'LOW_RESOLUTION',
  MULTIPLE_FACES = 'MULTIPLE_FACES',
  NO_FACE = 'NO_FACE',
  GROUP_PHOTO = 'GROUP_PHOTO',

  // Identity issues
  NOT_YOU = 'NOT_YOU',
  CELEBRITY = 'CELEBRITY',
  AI_GENERATED = 'AI_GENERATED',
  MANIPULATED = 'MANIPULATED',
  FILTERED = 'FILTERED',

  // Other
  COPYRIGHT = 'COPYRIGHT',
  SPAM = 'SPAM',
  INAPPROPRIATE = 'INAPPROPRIATE',
  OTHER = 'OTHER',
}

// ═══════════════════════════════════════════════════════════════
// PHOTO RECORD
// ═══════════════════════════════════════════════════════════════

export interface ProfilePhoto {
  id: string;
  profileId: string;
  userId: string;

  // Storage (NEVER store raw images — only references)
  storageKey: string;          // S3/R2 object key
  storageBucket: string;       // Bucket name
  originalUrl: string | null;  // Signed URL (temporary, 5-min expiry)
  thumbnailUrl: string | null; // Signed URL for thumbnail
  displayUrl: string | null;   // Signed URL for display (current)

  // Metadata
  position: number;            // Display order (0 = primary)
  isPrimary: boolean;          // Main profile photo
  width: number | null;
  height: number | null;
  fileSize: number | null;     // bytes
  mimeType: string | null;

  // Moderation
  moderationStatus: PhotoModerationStatus;
  moderationLayer: ModerationLayer | null; // Which layer made the decision
  rejectionReason: PhotoRejectionReason | null;
  moderationNotes: string | null;
  moderatedBy: string | null;  // "auto" or admin user ID

  // Moderation scores
  nsfwScore: number | null;        // 0.0 - 1.0
  faceScore: number | null;        // 0.0 - 1.0 (face detection confidence)
  aiGeneratedScore: number | null; // 0.0 - 1.0 (probability of AI generation)
  qualityScore: number | null;     // 0.0 - 1.0 (overall quality)

  // Timestamps
  uploadedAt: Date;
  moderationStartedAt: Date | null;
  moderationCompletedAt: Date | null;
  approvedAt: Date | null;
  rejectedAt: Date | null;
  removedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ═══════════════════════════════════════════════════════════════
// MODERATION RESULT
// ═══════════════════════════════════════════════════════════════

export interface ModerationResult {
  photoId: string;
  status: PhotoModerationStatus;
  layer: ModerationLayer;

  // Scores
  nsfwScore: number;
  faceScore: number;
  aiGeneratedScore: number;
  qualityScore: number;

  // Decision
  approved: boolean;
  requiresHumanReview: boolean;
  rejectionReason: PhotoRejectionReason | null;
  notes: string | null;

  // Metadata
  processingTimeMs: number;
  completedAt: Date;
}

// ═══════════════════════════════════════════════════════════════
// UPLOAD REQUEST
// ═══════════════════════════════════════════════════════════════

export interface PhotoUploadRequest {
  profileId: string;
  userId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  position?: number;
  isPrimary?: boolean;
}

export interface PhotoUploadResponse {
  photoId: string;
  uploadUrl: string;        // Signed URL for direct upload to S3/R2
  expiresAt: Date;          // URL expiry (5 minutes)
  storageKey: string;       // Object key in storage
}

// ═══════════════════════════════════════════════════════════════
// MODERATION JOB PAYLOAD
// ═══════════════════════════════════════════════════════════════

export interface ModerationJobPayload {
  photoId: string;
  profileId: string;
  userId: string;
  storageKey: string;
  storageBucket: string;
  mimeType: string;
  fileSize: number;
  priority: 'low' | 'normal' | 'high';
}
