/**
 * Verification Module — Verification Service
 *
 * Orchestrates the entire verification workflow.
 * Coordinates between state machine, KYC adapter, and storage.
 */

import {
  VerificationState,
  DocumentType,
  type VerificationRequest,
  type VerificationResult,
} from '../types/verification.types';
import {
  createVerificationStateMachine,
  type VerificationStateMachine,
  isInProgressState,
  isVerifiedState,
  isFailedState,
} from './state-machine.service';
import { verificationProvider } from './kyc-adapter.service';

// ═══════════════════════════════════════════════════════════════
// VERIFICATION STORE (In-Memory for MVP — Use Database in Production)
// ═══════════════════════════════════════════════════════════════

const verificationStore = new Map<string, VerificationRequest>();
const stateMachines = new Map<string, VerificationStateMachine>();

// ═══════════════════════════════════════════════════════════════
// VERIFICATION SERVICE
// ═══════════════════════════════════════════════════════════════

/**
 * Start a new verification request.
 *
 * @param userId - User ID to verify
 * @returns Verification request
 */
export async function startVerification(userId: string): Promise<VerificationRequest> {
  // Check if user already has an active verification
  const existing = getActiveVerification(userId);
  if (existing && isInProgressState(existing.status)) {
    throw new Error('User already has an active verification in progress');
  }

  // Initialize with KYC provider
  const providerVerificationId = await verificationProvider.initializeVerification(userId);

  // Create verification request
  const request: VerificationRequest = {
    id: providerVerificationId,
    userId,
    status: VerificationState.IN_PROGRESS,
    documentType: null,
    documentReference: null,
    documentHash: null,
    selfieReference: null,
    confidenceScore: null,
    faceMatchScore: null,
    livenessScore: null,
    providerName: verificationProvider.providerName,
    providerResponse: null,
    startedAt: new Date(),
    submittedAt: null,
    processedAt: null,
    expiresAt: new Date(Date.now() + verificationProvider.getVerificationExpiryMs()),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Store request and state machine
  verificationStore.set(request.id, request);
  stateMachines.set(request.id, createVerificationStateMachine(VerificationState.IN_PROGRESS));

  console.log(`[VerificationService] Started verification ${request.id} for user ${userId}`);
  return request;
}

/**
 * Get signed URL for document upload.
 *
 * @param verificationId - Verification request ID
 * @param documentType - Type of document to upload
 * @returns Signed upload URL
 */
export async function getDocumentUploadUrl(
  verificationId: string,
  documentType: DocumentType
): Promise<{ uploadUrl: string; expiresAt: Date }> {
  const request = verificationStore.get(verificationId);
  if (!request) {
    throw new Error(`Verification ${verificationId} not found`);
  }

  const stateMachine = stateMachines.get(verificationId);
  if (!stateMachine) {
    throw new Error(`State machine for ${verificationId} not found`);
  }

  // Validate state
  if (request.status !== VerificationState.IN_PROGRESS) {
    throw new Error(`Cannot upload document in state ${request.status}`);
  }

  // Get upload URL from provider
  const result = await verificationProvider.getDocumentUploadUrl(
    verificationId,
    documentType
  );

  // Update request
  request.documentType = documentType;
  request.status = VerificationState.DOCUMENT_SUBMITTED;
  request.updatedAt = new Date();

  // Transition state machine
  stateMachine.transition(
    VerificationState.DOCUMENT_SUBMITTED,
    'Document upload URL generated',
    'user',
    request.userId
  );

  console.log(`[VerificationService] Generated document upload URL for ${verificationId}`);
  return {
    uploadUrl: result.uploadUrl,
    expiresAt: result.expiresAt,
  };
}

/**
 * Confirm document upload and get selfie upload URL.
 *
 * @param verificationId - Verification request ID
 * @param documentReference - Reference to uploaded document
 * @returns Signed selfie upload URL
 */
export async function confirmDocumentUpload(
  verificationId: string,
  documentReference: string
): Promise<{ uploadUrl: string; expiresAt: Date }> {
  const request = verificationStore.get(verificationId);
  if (!request) {
    throw new Error(`Verification ${verificationId} not found`);
  }

  const stateMachine = stateMachines.get(verificationId);
  if (!stateMachine) {
    throw new Error(`State machine for ${verificationId} not found`);
  }

  // Validate state
  if (request.status !== VerificationState.DOCUMENT_SUBMITTED) {
    throw new Error(`Cannot confirm document in state ${request.status}`);
  }

  // Get selfie upload URL
  const result = await verificationProvider.getSelfieUploadUrl(verificationId);

  // Update request
  request.documentReference = documentReference;
  request.documentHash = await hashDocumentMetadata(documentReference);
  request.status = VerificationState.SELFIE_REQUIRED;
  request.updatedAt = new Date();

  // Transition state machine
  stateMachine.transition(
    VerificationState.SELFIE_REQUIRED,
    'Document upload confirmed',
    'user',
    request.userId
  );

  console.log(`[VerificationService] Confirmed document upload for ${verificationId}`);
  return {
    uploadUrl: result.uploadUrl,
    expiresAt: result.expiresAt,
  };
}

/**
 * Submit selfie and start verification processing.
 *
 * @param verificationId - Verification request ID
 * @param selfieReference - Reference to uploaded selfie
 * @returns Updated verification request
 */
export async function submitSelfie(
  verificationId: string,
  selfieReference: string
): Promise<VerificationRequest> {
  const request = verificationStore.get(verificationId);
  if (!request) {
    throw new Error(`Verification ${verificationId} not found`);
  }

  const stateMachine = stateMachines.get(verificationId);
  if (!stateMachine) {
    throw new Error(`State machine for ${verificationId} not found`);
  }

  // Validate state
  if (request.status !== VerificationState.SELFIE_REQUIRED) {
    throw new Error(`Cannot submit selfie in state ${request.status}`);
  }

  // Validate document reference exists
  if (!request.documentReference) {
    throw new Error('Document reference not found - upload document first');
  }

  // Update request
  request.selfieReference = selfieReference;
  request.status = VerificationState.PROCESSING;
  request.submittedAt = new Date();
  request.updatedAt = new Date();

  // Transition state machine
  stateMachine.transition(
    VerificationState.PROCESSING,
    'Selfie submitted - starting verification',
    'user',
    request.userId
  );

  // Submit to KYC provider (async)
  submitForProcessing(verificationId).catch((error) => {
    console.error(`[VerificationService] Processing failed for ${verificationId}:`, error);
    // Handle failure
    handleVerificationFailure(verificationId, error.message);
  });

  console.log(`[VerificationService] Submitted selfie for ${verificationId} - processing started`);
  return request;
}

/**
 * Submit verification to KYC provider for processing.
 */
async function submitForProcessing(verificationId: string): Promise<void> {
  const request = verificationStore.get(verificationId);
  if (!request || !request.documentReference || !request.selfieReference) {
    throw new Error('Missing document or selfie reference');
  }

  const result = await verificationProvider.submitForVerification(
    verificationId,
    request.documentReference,
    request.selfieReference
  );

  // Handle result
  await handleVerificationResult(verificationId, result);
}

/**
 * Handle verification result from KYC provider.
 */
async function handleVerificationResult(
  verificationId: string,
  result: {
    success: boolean;
    status: VerificationState;
    confidenceScore: number;
    faceMatchScore: number;
    livenessScore: number;
    failureReason?: string;
    providerData: Record<string, unknown>;
  }
): Promise<void> {
  const request = verificationStore.get(verificationId);
  if (!request) {
    throw new Error(`Verification ${verificationId} not found`);
  }

  const stateMachine = stateMachines.get(verificationId);
  if (!stateMachine) {
    throw new Error(`State machine for ${verificationId} not found`);
  }

  // Update request with results
  request.status = result.status;
  request.confidenceScore = result.confidenceScore;
  request.faceMatchScore = result.faceMatchScore;
  request.livenessScore = result.livenessScore;
  request.providerResponse = result.providerData;
  request.processedAt = new Date();
  request.updatedAt = new Date();

  // Transition state machine
  stateMachine.transition(
    result.status,
    result.success ? 'Verification approved' : result.failureReason || 'Verification failed',
    'system'
  );

  // Create verification result record
  const verificationResult: VerificationResult = {
    id: `result-${verificationId}-${Date.now()}`,
    verificationId,
    status: result.status,
    reason: result.failureReason || null,
    confidenceScore: result.confidenceScore,
    faceMatchScore: result.faceMatchScore,
    livenessScore: result.livenessScore,
    processedBy: 'auto',
    notes: null,
    createdAt: new Date(),
  };

  console.log(
    `[VerificationService] Verification ${verificationId} completed: ${result.status}` +
    (result.failureReason ? ` - ${result.failureReason}` : '')
  );

  // If verified, update user status (would call user service in production)
  if (result.status === VerificationState.VERIFIED) {
    console.log(`[VerificationService] User ${request.userId} is now VERIFIED`);
    // In production: await userService.markUserVerified(request.userId);
  }
}

/**
 * Handle verification failure.
 */
async function handleVerificationFailure(
  verificationId: string,
  reason: string
): Promise<void> {
  const request = verificationStore.get(verificationId);
  if (!request) return;

  const stateMachine = stateMachines.get(verificationId);
  if (!stateMachine) return;

  request.status = VerificationState.FAILED;
  request.processedAt = new Date();
  request.updatedAt = new Date();

  stateMachine.transition(
    VerificationState.FAILED,
    reason,
    'system'
  );

  console.log(`[VerificationService] Verification ${verificationId} failed: ${reason}`);
}

/**
 * Get verification request by ID.
 */
export function getVerification(verificationId: string): VerificationRequest | null {
  return verificationStore.get(verificationId) || null;
}

/**
 * Get active verification for a user.
 */
export function getActiveVerification(userId: string): VerificationRequest | null {
  for (const request of verificationStore.values()) {
    if (request.userId === userId) {
      return request;
    }
  }
  return null;
}

/**
 * Get verification status for a user.
 */
export function getVerificationStatus(userId: string): {
  isVerified: boolean;
  status: VerificationState | null;
  request: VerificationRequest | null;
} {
  const request = getActiveVerification(userId);

  if (!request) {
    return {
      isVerified: false,
      status: null,
      request: null,
    };
  }

  return {
    isVerified: isVerifiedState(request.status),
    status: request.status,
    request,
  };
}

/**
 * Cancel a verification request.
 */
export async function cancelVerification(verificationId: string): Promise<void> {
  const request = verificationStore.get(verificationId);
  if (!request) {
    throw new Error(`Verification ${verificationId} not found`);
  }

  const stateMachine = stateMachines.get(verificationId);
  if (!stateMachine) {
    throw new Error(`State machine for ${verificationId} not found`);
  }

  // Cancel with provider
  await verificationProvider.cancelVerification(verificationId);

  // Update request
  request.status = VerificationState.FAILED;
  request.updatedAt = new Date();

  // Transition state machine
  stateMachine.transition(
    VerificationState.FAILED,
    'Verification cancelled by user',
    'user',
    request.userId
  );

  console.log(`[VerificationService] Cancelled verification ${verificationId}`);
}

/**
 * Retry a failed verification.
 */
export async function retryVerification(verificationId: string): Promise<VerificationRequest> {
  const request = verificationStore.get(verificationId);
  if (!request) {
    throw new Error(`Verification ${verificationId} not found`);
  }

  const stateMachine = stateMachines.get(verificationId);
  if (!stateMachine) {
    throw new Error(`State machine for ${verificationId} not found`);
  }

  // Validate state allows retry
  if (!isFailedState(request.status)) {
    throw new Error(`Cannot retry verification in state ${request.status}`);
  }

  // Reset request
  request.status = VerificationState.IN_PROGRESS;
  request.documentType = null;
  request.documentReference = null;
  request.documentHash = null;
  request.selfieReference = null;
  request.confidenceScore = null;
  request.faceMatchScore = null;
  request.livenessScore = null;
  request.providerResponse = null;
  request.submittedAt = null;
  request.processedAt = null;
  request.expiresAt = new Date(Date.now() + verificationProvider.getVerificationExpiryMs());
  request.updatedAt = new Date();

  // Reset state machine
  stateMachine.transition(
    VerificationState.IN_PROGRESS,
    'Retry initiated',
    'user',
    request.userId
  );

  console.log(`[VerificationService] Retrying verification ${verificationId}`);
  return request;
}

/**
 * Expire a verification request (called by scheduled job).
 */
export function expireVerification(verificationId: string): void {
  const request = verificationStore.get(verificationId);
  if (!request) return;

  const stateMachine = stateMachines.get(verificationId);
  if (!stateMachine) return;

  request.status = VerificationState.EXPIRED;
  request.updatedAt = new Date();

  stateMachine.transition(
    VerificationState.EXPIRED,
    'Verification request expired',
    'system'
  );

  console.log(`[VerificationService] Expired verification ${verificationId}`);
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Hash document metadata (not the document itself).
 */
async function hashDocumentMetadata(reference: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(reference + (import.meta.env.VITE_VERIFICATION_SECRET || 'baed-verify-secret'));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
