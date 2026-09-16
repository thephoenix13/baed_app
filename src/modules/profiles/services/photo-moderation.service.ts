/**
 * Profile Module — Photo Moderation Pipeline
 *
 * Layered moderation approach:
 * - Layer 1: Rules (fast, cheap) — file type, size, dimensions
 * - Layer 2: Classifier (fast, moderate) — NSFW, face detection, quality
 * - Layer 3: LLM (slow, expensive) — ambiguous cases only
 * - Layer 4: Human (slowest) — final review for edge cases
 *
 * CRITICAL: Never call expensive LLM for every photo.
 * Use layered approach to minimize costs and latency.
 */

import {
  PhotoModerationStatus,
  ModerationLayer,
  PhotoRejectionReason,
  type ProfilePhoto,
  type ModerationResult,
  type ModerationJobPayload,
} from '../types/photo.types';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const MODERATION_THRESHOLDS = {
  // NSFW detection
  NSFW_AUTO_REJECT: 0.85,      // > 85% = auto reject
  NSFW_HUMAN_REVIEW: 0.60,     // 60-85% = human review
  NSFW_SAFE: 0.60,             // < 60% = safe

  // Face detection
  FACE_MIN_CONFIDENCE: 0.80,   // < 80% = reject (no clear face)
  FACE_MAX_FACES: 1,           // > 1 face = reject (group photo)

  // AI-generated detection
  AI_AUTO_REJECT: 0.90,        // > 90% = auto reject
  AI_HUMAN_REVIEW: 0.70,       // 70-90% = human review
  AI_LIKELY_REAL: 0.70,        // < 70% = likely real

  // Quality
  QUALITY_MIN_SCORE: 0.50,     // < 50% = reject (too blurry/dark)
  QUALITY_HUMAN_REVIEW: 0.70,  // 50-70% = human review
  QUALITY_GOOD: 0.70,          // > 70% = good quality

  // File constraints
  MAX_FILE_SIZE_MB: 10,
  MIN_WIDTH_PX: 400,
  MIN_HEIGHT_PX: 400,
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

// ═══════════════════════════════════════════════════════════════
// LAYER 1: RULES-BASED CHECKS
// ═══════════════════════════════════════════════════════════════

/**
 * Layer 1: Fast, rule-based validation.
 * No ML, no API calls — just basic checks.
 *
 * @returns null if passes, rejection reason if fails
 */
function layer1RulesCheck(payload: ModerationJobPayload): PhotoRejectionReason | null {
  console.log(`[Moderation:Layer1] Rules check for photo ${payload.photoId}`);

  // Check file size
  const maxSizeBytes = MODERATION_THRESHOLDS.MAX_FILE_SIZE_MB * 1024 * 1024;
  if (payload.fileSize > maxSizeBytes) {
    console.log(`[Moderation:Layer1] File too large: ${payload.fileSize} bytes`);
    return PhotoRejectionReason.LOW_RESOLUTION; // Reuse for size issues
  }

  // Check MIME type
  if (!MODERATION_THRESHOLDS.ALLOWED_MIME_TYPES.includes(payload.mimeType)) {
    console.log(`[Moderation:Layer1] Invalid MIME type: ${payload.mimeType}`);
    return PhotoRejectionReason.OTHER;
  }

  // Check if file is too small (likely corrupted or placeholder)
  if (payload.fileSize < 10 * 1024) {
    // < 10KB
    console.log(`[Moderation:Layer1] File too small: ${payload.fileSize} bytes`);
    return PhotoRejectionReason.LOW_RESOLUTION;
  }

  console.log(`[Moderation:Layer1] ✓ Passed rules check`);
  return null; // Passes
}

// ═══════════════════════════════════════════════════════════════
// LAYER 2: LIGHTWEIGHT CLASSIFIER
// ═══════════════════════════════════════════════════════════════

interface ClassifierScores {
  nsfwScore: number;
  faceScore: number;
  faceCount: number;
  aiGeneratedScore: number;
  qualityScore: number;
}

/**
 * Layer 2: Lightweight ML classifier.
 * Fast inference, moderate cost.
 *
 * In production, this would call:
 * - AWS Rekognition / Google Vision for face detection
 * - Custom NSFW classifier (TensorFlow.js or API)
 * - Quality assessment model
 *
 * For MVP, we simulate with random scores.
 */
async function layer2Classifier(
  payload: ModerationJobPayload
): Promise<ClassifierScores> {
  console.log(`[Moderation:Layer2] Running classifier for photo ${payload.photoId}`);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock scores (in production, these come from actual ML models)
  const scores: ClassifierScores = {
    nsfwScore: Math.random() * 0.3, // Most photos are safe (0-30%)
    faceScore: 0.85 + Math.random() * 0.15, // 85-100% face confidence
    faceCount: Math.random() > 0.9 ? 2 : 1, // 10% chance of multiple faces
    aiGeneratedScore: Math.random() * 0.2, // Most photos are real (0-20%)
    qualityScore: 0.6 + Math.random() * 0.4, // 60-100% quality
  };

  console.log(`[Moderation:Layer2] Scores:`, scores);
  return scores;
}

/**
 * Evaluate Layer 2 scores and determine next action.
 */
function evaluateLayer2Scores(scores: ClassifierScores): {
  approved: boolean;
  requiresHumanReview: boolean;
  rejectionReason: PhotoRejectionReason | null;
} {
  // NSFW check
  if (scores.nsfwScore >= MODERATION_THRESHOLDS.NSFW_AUTO_REJECT) {
    return {
      approved: false,
      requiresHumanReview: false,
      rejectionReason: PhotoRejectionReason.NSFW_CONTENT,
    };
  }

  // Face detection
  if (scores.faceScore < MODERATION_THRESHOLDS.FACE_MIN_CONFIDENCE) {
    return {
      approved: false,
      requiresHumanReview: false,
      rejectionReason: PhotoRejectionReason.NO_FACE,
    };
  }

  if (scores.faceCount > MODERATION_THRESHOLDS.FACE_MAX_FACES) {
    return {
      approved: false,
      requiresHumanReview: false,
      rejectionReason: PhotoRejectionReason.GROUP_PHOTO,
    };
  }

  // AI-generated check
  if (scores.aiGeneratedScore >= MODERATION_THRESHOLDS.AI_AUTO_REJECT) {
    return {
      approved: false,
      requiresHumanReview: false,
      rejectionReason: PhotoRejectionReason.AI_GENERATED,
    };
  }

  // Quality check
  if (scores.qualityScore < MODERATION_THRESHOLDS.QUALITY_MIN_SCORE) {
    return {
      approved: false,
      requiresHumanReview: false,
      rejectionReason: PhotoRejectionReason.BLURRY,
    };
  }

  // Check for ambiguous cases that need human review
  const needsReview =
    scores.nsfwScore >= MODERATION_THRESHOLDS.NSFW_HUMAN_REVIEW ||
    scores.aiGeneratedScore >= MODERATION_THRESHOLDS.AI_HUMAN_REVIEW ||
    scores.qualityScore < MODERATION_THRESHOLDS.QUALITY_HUMAN_REVIEW;

  if (needsReview) {
    return {
      approved: false,
      requiresHumanReview: true,
      rejectionReason: null,
    };
  }

  // All checks passed
  return {
    approved: true,
    requiresHumanReview: false,
    rejectionReason: null,
  };
}

// ═══════════════════════════════════════════════════════════════
// LAYER 3: LLM ANALYSIS (EXPENSIVE — USE SPARINGLY)
// ═══════════════════════════════════════════════════════════════

/**
 * Layer 3: LLM analysis for ambiguous cases.
 * Slow and expensive — only called when Layer 2 is uncertain.
 *
 * In production, this would call:
 * - GPT-4 Vision / Claude 3 / Gemini Pro Vision
 * - Analyze image context, detect manipulation, verify identity
 *
 * For MVP, we simulate with a decision.
 */
async function layer3LLMAnalysis(
  payload: ModerationJobPayload,
  scores: ClassifierScores
): Promise<{
  approved: boolean;
  requiresHumanReview: boolean;
  rejectionReason: PhotoRejectionReason | null;
  notes: string;
}> {
  console.log(`[Moderation:Layer3] LLM analysis for photo ${payload.photoId} (EXPENSIVE)`);

  // Simulate API call delay (LLM is slow)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock LLM decision
  // In production, this would analyze the image and provide detailed reasoning
  const llmDecision = Math.random() > 0.5; // 50% chance of approval

  if (llmDecision) {
    return {
      approved: true,
      requiresHumanReview: false,
      rejectionReason: null,
      notes: 'LLM analysis: Photo appears authentic and appropriate',
    };
  } else {
    return {
      approved: false,
      requiresHumanReview: true, // LLM uncertain → human review
      rejectionReason: null,
      notes: 'LLM analysis: Uncertain about authenticity — requires human review',
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// LAYER 4: HUMAN REVIEW
// ═══════════════════════════════════════════════════════════════

/**
 * Layer 4: Human moderator review.
 * Slowest but most accurate. Used for edge cases.
 *
 * In production, this would:
 * - Add to admin moderation queue
 * - Notify moderators via push/email
 * - Wait for manual decision
 *
 * For MVP, we simulate with a random decision.
 */
async function layer4HumanReview(
  payload: ModerationJobPayload,
  scores: ClassifierScores,
  llmNotes?: string
): Promise<{
  approved: boolean;
  rejectionReason: PhotoRejectionReason | null;
  moderatorNotes: string;
  moderatedBy: string;
}> {
  console.log(`[Moderation:Layer4] Sent to human review for photo ${payload.photoId}`);

  // In production, this would queue the photo for manual review
  // and wait for a moderator to make a decision

  // Simulate moderator decision (70% approval rate)
  const approved = Math.random() > 0.3;

  return {
    approved,
    rejectionReason: approved ? null : PhotoRejectionReason.INAPPROPRIATE,
    moderatorNotes: approved
      ? 'Approved by moderator'
      : 'Rejected: Does not meet community guidelines',
    moderatedBy: 'moderator-123', // In production, actual admin user ID
  };
}

// ═══════════════════════════════════════════════════════════════
// MODERATION PIPELINE ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════

/**
 * Run the complete moderation pipeline.
 *
 * Flow:
 * 1. Layer 1: Rules check (instant)
 * 2. Layer 2: Classifier (fast)
 * 3. Layer 3: LLM (only if Layer 2 uncertain)
 * 4. Layer 4: Human (only if Layer 3 uncertain)
 */
export async function runModerationPipeline(
  payload: ModerationJobPayload
): Promise<ModerationResult> {
  const startTime = Date.now();
  console.log(`[ModerationPipeline] Starting pipeline for photo ${payload.photoId}`);

  // ═══ LAYER 1: Rules ═══
  const rulesRejection = layer1RulesCheck(payload);
  if (rulesRejection) {
    return {
      photoId: payload.photoId,
      status: PhotoModerationStatus.AUTO_REJECTED,
      layer: ModerationLayer.RULES,
      nsfwScore: 0,
      faceScore: 0,
      aiGeneratedScore: 0,
      qualityScore: 0,
      approved: false,
      requiresHumanReview: false,
      rejectionReason: rulesRejection,
      notes: 'Failed rules-based validation',
      processingTimeMs: Date.now() - startTime,
      completedAt: new Date(),
    };
  }

  // ═══ LAYER 2: Classifier ═══
  const scores = await layer2Classifier(payload);
  const layer2Result = evaluateLayer2Scores(scores);

  // Clear rejection
  if (layer2Result.rejectionReason) {
    return {
      photoId: payload.photoId,
      status: PhotoModerationStatus.AUTO_REJECTED,
      layer: ModerationLayer.CLASSIFIER,
      nsfwScore: scores.nsfwScore,
      faceScore: scores.faceScore,
      aiGeneratedScore: scores.aiGeneratedScore,
      qualityScore: scores.qualityScore,
      approved: false,
      requiresHumanReview: false,
      rejectionReason: layer2Result.rejectionReason,
      notes: 'Failed classifier checks',
      processingTimeMs: Date.now() - startTime,
      completedAt: new Date(),
    };
  }

  // Clear approval
  if (layer2Result.approved && !layer2Result.requiresHumanReview) {
    return {
      photoId: payload.photoId,
      status: PhotoModerationStatus.AUTO_APPROVED,
      layer: ModerationLayer.CLASSIFIER,
      nsfwScore: scores.nsfwScore,
      faceScore: scores.faceScore,
      aiGeneratedScore: scores.aiGeneratedScore,
      qualityScore: scores.qualityScore,
      approved: true,
      requiresHumanReview: false,
      rejectionReason: null,
      notes: 'Passed all classifier checks',
      processingTimeMs: Date.now() - startTime,
      completedAt: new Date(),
    };
  }

  // ═══ LAYER 3: LLM (only if uncertain) ═══
  if (layer2Result.requiresHumanReview) {
    console.log(`[ModerationPipeline] Layer 2 uncertain — calling LLM (expensive)`);

    const llmResult = await layer3LLMAnalysis(payload, scores);

    // LLM approved
    if (llmResult.approved && !llmResult.requiresHumanReview) {
      return {
        photoId: payload.photoId,
        status: PhotoModerationStatus.AUTO_APPROVED,
        layer: ModerationLayer.LLM,
        nsfwScore: scores.nsfwScore,
        faceScore: scores.faceScore,
        aiGeneratedScore: scores.aiGeneratedScore,
        qualityScore: scores.qualityScore,
        approved: true,
        requiresHumanReview: false,
        rejectionReason: null,
        notes: llmResult.notes,
        processingTimeMs: Date.now() - startTime,
        completedAt: new Date(),
      };
    }

    // ═══ LAYER 4: Human Review (only if LLM uncertain) ═══
    if (llmResult.requiresHumanReview) {
      console.log(`[ModerationPipeline] LLM uncertain — sending to human review`);

      const humanResult = await layer4HumanReview(payload, scores, llmResult.notes);

      return {
        photoId: payload.photoId,
        status: humanResult.approved
          ? PhotoModerationStatus.APPROVED
          : PhotoModerationStatus.REJECTED,
        layer: ModerationLayer.HUMAN,
        nsfwScore: scores.nsfwScore,
        faceScore: scores.faceScore,
        aiGeneratedScore: scores.aiGeneratedScore,
        qualityScore: scores.qualityScore,
        approved: humanResult.approved,
        requiresHumanReview: false,
        rejectionReason: humanResult.rejectionReason,
        notes: humanResult.moderatorNotes,
        processingTimeMs: Date.now() - startTime,
        completedAt: new Date(),
      };
    }
  }

  // Fallback (should never reach here)
  throw new Error('Moderation pipeline reached unexpected state');
}

// ═══════════════════════════════════════════════════════════════
// BULLMQ JOB HANDLER (Production)
// ═══════════════════════════════════════════════════════════════

/**
 * BullMQ job handler for photo moderation.
 *
 * In production, this would be a separate worker process:
 *
 * ```typescript
 * import { Worker } from 'bullmq';
 *
 * const moderationWorker = new Worker('photo-moderation', async (job) => {
 *   const payload = job.data as ModerationJobPayload;
 *   const result = await runModerationPipeline(payload);
 *
 *   // Update photo record in database
 *   await prisma.profilePhoto.update({
 *     where: { id: payload.photoId },
 *      result.status, result.rejectionReason, ...
 *     },
 *   });
 *
 *   // Notify user if rejected
 *   if (!result.approved) {
 *     await notificationService.sendPhotoRejectionNotification(payload.userId, result);
 *   }
 *
 *   return result;
 * }, { connection: { host: 'localhost', port: 6379 } });
 * ```
 */
export async function handleModerationJob(payload: ModerationJobPayload): Promise<ModerationResult> {
  console.log(`[ModerationJob] Processing job for photo ${payload.photoId}`);
  return runModerationPipeline(payload);
}

// ═══════════════════════════════════════════════════════════════
// PHOTO STORE (In-Memory for MVP)
// ═══════════════════════════════════════════════════════════════

const photoStore = new Map<string, ProfilePhoto>();

/**
 * Get photo by ID.
 */
export function getPhoto(photoId: string): ProfilePhoto | null {
  return photoStore.get(photoId) || null;
}

/**
 * Update photo moderation status.
 */
export function updatePhotoModeration(
  photoId: string,
  result: ModerationResult
): ProfilePhoto | null {
  const photo = photoStore.get(photoId);
  if (!photo) return null;

  photo.moderationStatus = result.status;
  photo.moderationLayer = result.layer;
  photo.rejectionReason = result.rejectionReason;
  photo.moderationNotes = result.notes;
  photo.nsfwScore = result.nsfwScore;
  photo.faceScore = result.faceScore;
  photo.aiGeneratedScore = result.aiGeneratedScore;
  photo.qualityScore = result.qualityScore;
  photo.moderationCompletedAt = result.completedAt;

  if (result.approved) {
    photo.moderationStatus = PhotoModerationStatus.APPROVED;
    photo.approvedAt = result.completedAt;
  } else if (result.rejectionReason) {
    photo.moderationStatus = PhotoModerationStatus.REJECTED;
    photo.rejectedAt = result.completedAt;
  }

  photo.updatedAt = new Date();
  photoStore.set(photoId, photo);

  return photo;
}

/**
 * Store a new photo.
 */
export function storePhoto(photo: ProfilePhoto): void {
  photoStore.set(photo.id, photo);
}

/**
 * Get all photos for a profile.
 */
export function getProfilePhotos(profileId: string): ProfilePhoto[] {
  return Array.from(photoStore.values())
    .filter((p) => p.profileId === profileId)
    .sort((a, b) => a.position - b.position);
}
