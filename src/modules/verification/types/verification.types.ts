/**
 * Verification Module — Types
 *
 * Core types for identity verification workflow.
 */

// ═══════════════════════════════════════════════════════════════
// VERIFICATION STATES (10 states)
// ═══════════════════════════════════════════════════════════════

export enum VerificationState {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  DOCUMENT_SUBMITTED = 'DOCUMENT_SUBMITTED',
  SELFIE_REQUIRED = 'SELFIE_REQUIRED',
  PROCESSING = 'PROCESSING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  EXPIRED = 'EXPIRED',
  REVERIFICATION_REQUIRED = 'REVERIFICATION_REQUIRED',
}

// ═══════════════════════════════════════════════════════════════
// DOCUMENT TYPES
// ═══════════════════════════════════════════════════════════════

export enum DocumentType {
  AADHAAR = 'AADHAAR',
  PAN_CARD = 'PAN_CARD',
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  VOTER_ID = 'VOTER_ID',
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION REQUEST
// ═══════════════════════════════════════════════════════════════

export interface VerificationRequest {
  id: string;
  userId: string;
  status: VerificationState;

  // Document info (NEVER store raw documents — only references)
  documentType: DocumentType | null;
  documentReference: string | null; // External KYC provider reference
  documentHash: string | null; // Hash of document metadata (not the doc itself)

  // Selfie info
  selfieReference: string | null;

  // Results
  confidenceScore: number | null; // 0.0 - 1.0
  faceMatchScore: number | null;
  livenessScore: number | null;

  // Provider info
  providerName: string | null;
  providerResponse: Record<string, unknown> | null; // Encrypted raw response

  // Timestamps
  startedAt: Date;
  submittedAt: Date | null;
  processedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION RESULT
// ═══════════════════════════════════════════════════════════════

export interface VerificationResult {
  id: string;
  verificationId: string;
  status: VerificationState;
  reason: string | null; // If failed, why
  confidenceScore: number | null;
  faceMatchScore: number | null;
  livenessScore: number | null;
  processedBy: string | null; // "auto" or admin user ID
  notes: string | null;
  createdAt: Date;
}

// ═══════════════════════════════════════════════════════════════
// KYC PROVIDER TYPES
// ═══════════════════════════════════════════════════════════════

export interface KycProviderConfig {
  providerName: string;
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  webhookUrl: string;
}

export interface DocumentUploadResult {
  success: boolean;
  documentReference: string;
  uploadUrl: string; // Signed URL for client to upload directly
  expiresAt: Date;
}

export interface SelfieUploadResult {
  success: boolean;
  selfieReference: string;
  uploadUrl: string; // Signed URL for client to upload directly
  expiresAt: Date;
}

export interface VerificationCheckResult {
  success: boolean;
  status: VerificationState;
  confidenceScore: number;
  faceMatchScore: number;
  livenessScore: number;
  documentValid: boolean;
  selfieMatch: boolean;
  livenessPassed: boolean;
  failureReason?: string;
  requiresManualReview?: boolean;
  providerData: Record<string, unknown>;
}

export interface KycCallbackPayload {
  verificationId: string;
  status: VerificationState;
  confidenceScore?: number;
  faceMatchScore?: number;
  livenessScore?: number;
  failureReason?: string;
  providerData?: Record<string, unknown>;
}
