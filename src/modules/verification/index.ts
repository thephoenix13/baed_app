/**
 * Verification Module — Public API
 *
 * Exports all public types, services, and utilities for the verification module.
 */

// Types
export {
  VerificationState,
  DocumentType,
  type VerificationRequest,
  type VerificationResult,
  type KycProviderConfig,
  type DocumentUploadResult,
  type SelfieUploadResult,
  type VerificationCheckResult,
  type KycCallbackPayload,
} from './types/verification.types';

// KYC Adapter
export {
  type VerificationProviderAdapter,
  MockVerificationProvider,
  createVerificationProvider,
  verificationProvider,
} from './services/kyc-adapter.service';

// State Machine
export {
  VALID_TRANSITIONS,
  STATE_METADATA,
  type StateMetadata,
  type StateTransition,
  type VerificationStateMachine,
  createVerificationStateMachine,
  isVerifiedState,
  isInProgressState,
  isFailedState,
  requiresReverification,
  getStateMessage,
} from './services/state-machine.service';

// Verification Service
export {
  startVerification,
  getDocumentUploadUrl,
  confirmDocumentUpload,
  submitSelfie,
  getVerification,
  getActiveVerification,
  getVerificationStatus,
  cancelVerification,
  retryVerification,
  expireVerification,
} from './services/verification.service';
