/**
 * Verification Module — KYC Provider Adapter
 *
 * Abstract interface for identity verification providers.
 * Allows swapping between different KYC services (Onfido, Sumsub, Veriff, etc.)
 * or using a mock for local development.
 *
 * CRITICAL RULES:
 * - NEVER store raw ID documents
 * - Store only verification references and results
 * - All uploads via signed URLs (5-min expiry)
 * - Provider responses are encrypted at rest
 */

import type {
  KycProviderConfig,
  DocumentUploadResult,
  SelfieUploadResult,
  VerificationCheckResult,
  KycCallbackPayload,
} from '../types/verification.types';
import { VerificationState } from '../types/verification.types';

// ═══════════════════════════════════════════════════════════════
// PROVIDER ADAPTER INTERFACE
// ═══════════════════════════════════════════════════════════════

/**
 * Abstract interface for KYC verification providers.
 *
 * Implementation responsibilities:
 * - Generate signed upload URLs (5-min expiry)
 * - Submit documents to external KYC service
 * - Retrieve verification results
 * - Handle webhook callbacks
 * - Encrypt sensitive provider responses
 */
export interface VerificationProviderAdapter {
  /**
   * Provider name (e.g., "onfido", "sumsub", "mock")
   */
  readonly providerName: string;

  /**
   * Initialize a new verification session.
   *
   * @param userId - User ID to verify
   * @returns Verification request ID from provider
   */
  initializeVerification(userId: string): Promise<string>;

  /**
   * Generate a signed URL for document upload.
   *
   * CRITICAL: Client uploads directly to storage (S3/R2).
   * Never route documents through our servers.
   *
   * @param verificationId - Provider's verification ID
   * @param documentType - Type of document (AADHAAR, PASSPORT, etc.)
   * @returns Signed upload URL + document reference
   */
  getDocumentUploadUrl(
    verificationId: string,
    documentType: string
  ): Promise<DocumentUploadResult>;

  /**
   * Generate a signed URL for selfie upload.
   *
   * CRITICAL: Client uploads directly to storage (S3/R2).
   * Never route selfies through our servers.
   *
   * @param verificationId - Provider's verification ID
   * @returns Signed upload URL + selfie reference
   */
  getSelfieUploadUrl(verificationId: string): Promise<SelfieUploadResult>;

  /**
   * Submit document and selfie for verification.
   * Triggers the KYC provider to process the verification.
   *
   * @param verificationId - Provider's verification ID
   * @param documentReference - Reference to uploaded document
   * @param selfieReference - Reference to uploaded selfie
   * @returns Verification result (may be async)
   */
  submitForVerification(
    verificationId: string,
    documentReference: string,
    selfieReference: string
  ): Promise<VerificationCheckResult>;

  /**
   * Check verification status.
   *
   * @param verificationId - Provider's verification ID
   * @returns Current verification result
   */
  checkVerificationStatus(
    verificationId: string
  ): Promise<VerificationCheckResult>;

  /**
   * Handle webhook callback from KYC provider.
   *
   * @param payload - Webhook payload from provider
   * @returns Processed verification result
   */
  handleWebhookCallback(payload: KycCallbackPayload): Promise<VerificationCheckResult>;

  /**
   * Cancel an in-progress verification.
   *
   * @param verificationId - Provider's verification ID
   */
  cancelVerification(verificationId: string): Promise<void>;

  /**
   * Get verification expiry time.
   *
   * @returns Expiry duration in milliseconds
   */
  getVerificationExpiryMs(): number;
}

// ═══════════════════════════════════════════════════════════════
// MOCK VERIFICATION PROVIDER (Local Development)
// ═══════════════════════════════════════════════════════════════

/**
 * Mock KYC provider for local development and testing.
 *
 * Simulates verification workflow without external dependencies.
 * Configurable success/failure rates for testing different scenarios.
 */
export class MockVerificationProvider implements VerificationProviderAdapter {
  readonly providerName = 'mock';

  private verificationStore = new Map<
    string,
    {
      userId: string;
      status: VerificationState;
      documentReference?: string;
      selfieReference?: string;
      initializedAt: Date;
    }
  >();

  private config = {
    successRate: 0.85, // 85% auto-approve
    manualReviewRate: 0.1, // 10% manual review
    processingTimeMs: 3000, // 3 seconds
    verificationExpiryMs: 24 * 60 * 60 * 1000, // 24 hours
  };

  async initializeVerification(userId: string): Promise<string> {
    const verificationId = `mock-verify-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    this.verificationStore.set(verificationId, {
      userId,
      status: VerificationState.IN_PROGRESS,
      initializedAt: new Date(),
    });

    console.log(`[MockKYC] Initialized verification ${verificationId} for user ${userId}`);
    return verificationId;
  }

  async getDocumentUploadUrl(
    verificationId: string,
    documentType: string
  ): Promise<DocumentUploadResult> {
    const verification = this.verificationStore.get(verificationId);
    if (!verification) {
      throw new Error(`Verification ${verificationId} not found`);
    }

    // Generate mock signed URL (in production, this would be a real S3/R2 signed URL)
    const documentReference = `doc-${verificationId}-${Date.now()}`;
    const uploadUrl = `https://mock-storage.baed.in/upload?ref=${documentReference}&type=${documentType}&expires=${Date.now() + 5 * 60 * 1000}`;

    console.log(`[MockKYC] Generated document upload URL for ${verificationId}`);

    return {
      success: true,
      documentReference,
      uploadUrl,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    };
  }

  async getSelfieUploadUrl(verificationId: string): Promise<SelfieUploadResult> {
    const verification = this.verificationStore.get(verificationId);
    if (!verification) {
      throw new Error(`Verification ${verificationId} not found`);
    }

    const selfieReference = `selfie-${verificationId}-${Date.now()}`;
    const uploadUrl = `https://mock-storage.baed.in/upload?ref=${selfieReference}&type=selfie&expires=${Date.now() + 5 * 60 * 1000}`;

    console.log(`[MockKYC] Generated selfie upload URL for ${verificationId}`);

    return {
      success: true,
      selfieReference,
      uploadUrl,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    };
  }

  async submitForVerification(
    verificationId: string,
    documentReference: string,
    selfieReference: string
  ): Promise<VerificationCheckResult> {
    const verification = this.verificationStore.get(verificationId);
    if (!verification) {
      throw new Error(`Verification ${verificationId} not found`);
    }

    verification.documentReference = documentReference;
    verification.selfieReference = selfieReference;
    verification.status = VerificationState.PROCESSING;

    console.log(`[MockKYC] Submitted verification ${verificationId} for processing`);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, this.config.processingTimeMs));

    // Determine result based on configured rates
    const random = Math.random();
    let result: VerificationCheckResult;

    if (random < this.config.successRate) {
      // Success
      result = {
        success: true,
        status: VerificationState.VERIFIED,
        confidenceScore: 0.95 + Math.random() * 0.05, // 0.95 - 1.0
        faceMatchScore: 0.90 + Math.random() * 0.10, // 0.90 - 1.0
        livenessScore: 0.85 + Math.random() * 0.15, // 0.85 - 1.0
        documentValid: true,
        selfieMatch: true,
        livenessPassed: true,
        providerData: {
          mockResult: 'approved',
          processedAt: new Date().toISOString(),
        },
      };
      console.log(`[MockKYC] Verification ${verificationId} APPROVED`);
    } else if (random < this.config.successRate + this.config.manualReviewRate) {
      // Manual review
      result = {
        success: false,
        status: VerificationState.MANUAL_REVIEW,
        confidenceScore: 0.5 + Math.random() * 0.2, // 0.5 - 0.7
        faceMatchScore: 0.6 + Math.random() * 0.2, // 0.6 - 0.8
        livenessScore: 0.7 + Math.random() * 0.2, // 0.7 - 0.9
        documentValid: true,
        selfieMatch: false,
        livenessPassed: true,
        failureReason: 'Low confidence score - requires human review',
        requiresManualReview: true,
        providerData: {
          mockResult: 'manual_review',
          reason: 'low_confidence',
          processedAt: new Date().toISOString(),
        },
      };
      console.log(`[MockKYC] Verification ${verificationId} requires MANUAL REVIEW`);
    } else {
      // Failure
      result = {
        success: false,
        status: VerificationState.FAILED,
        confidenceScore: 0.2 + Math.random() * 0.3, // 0.2 - 0.5
        faceMatchScore: 0.1 + Math.random() * 0.4, // 0.1 - 0.5
        livenessScore: 0.3 + Math.random() * 0.4, // 0.3 - 0.7
        documentValid: false,
        selfieMatch: false,
        livenessPassed: false,
        failureReason: 'Document does not match selfie',
        providerData: {
          mockResult: 'rejected',
          reason: 'document_selfie_mismatch',
          processedAt: new Date().toISOString(),
        },
      };
      console.log(`[MockKYC] Verification ${verificationId} REJECTED`);
    }

    verification.status = result.status;
    return result;
  }

  async checkVerificationStatus(
    verificationId: string
  ): Promise<VerificationCheckResult> {
    const verification = this.verificationStore.get(verificationId);
    if (!verification) {
      throw new Error(`Verification ${verificationId} not found`);
    }

    // Return current status (mock always returns final result)
    return {
      success: verification.status === VerificationState.VERIFIED,
      status: verification.status,
      confidenceScore: 0.9,
      faceMatchScore: 0.85,
      livenessScore: 0.88,
      documentValid: true,
      selfieMatch: true,
      livenessPassed: true,
      providerData: {
        mockResult: 'status_check',
        checkedAt: new Date().toISOString(),
      },
    };
  }

  async handleWebhookCallback(
    payload: KycCallbackPayload
  ): Promise<VerificationCheckResult> {
    console.log(`[MockKYC] Received webhook callback for ${payload.verificationId}`);

    // In mock, just return the payload as-is
    return {
      success: payload.status === VerificationState.VERIFIED,
      status: payload.status,
      confidenceScore: payload.confidenceScore || 0.9,
      faceMatchScore: payload.faceMatchScore || 0.85,
      livenessScore: payload.livenessScore || 0.88,
      documentValid: payload.status === VerificationState.VERIFIED,
      selfieMatch: payload.status === VerificationState.VERIFIED,
      livenessPassed: payload.status === VerificationState.VERIFIED,
      failureReason: payload.failureReason,
      providerData: payload.providerData || {},
    };
  }

  async cancelVerification(verificationId: string): Promise<void> {
    const verification = this.verificationStore.get(verificationId);
    if (verification) {
      verification.status = VerificationState.FAILED;
      console.log(`[MockKYC] Cancelled verification ${verificationId}`);
    }
  }

  getVerificationExpiryMs(): number {
    return this.config.verificationExpiryMs;
  }

  /**
   * Configure mock behavior for testing.
   */
  setConfig(config: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...config };
    console.log(`[MockKYC] Updated config:`, this.config);
  }
}

// ═══════════════════════════════════════════════════════════════
// PROVIDER FACTORY
// ═══════════════════════════════════════════════════════════════

/**
 * Create a verification provider instance.
 *
 * @param providerName - Provider name ("mock", "onfido", "sumsub", etc.)
 * @param config - Provider configuration
 * @returns VerificationProviderAdapter instance
 */
export function createVerificationProvider(
  providerName: string,
  config?: KycProviderConfig
): VerificationProviderAdapter {
  switch (providerName) {
    case 'mock':
      return new MockVerificationProvider();

    case 'onfido':
      // TODO: Implement OnfidoAdapter
      throw new Error('Onfido adapter not yet implemented');

    case 'sumsub':
      // TODO: Implement SumsubAdapter
      throw new Error('Sumsub adapter not yet implemented');

    case 'veriff':
      // TODO: Implement VeriffAdapter
      throw new Error('Veriff adapter not yet implemented');

    default:
      throw new Error(`Unknown verification provider: ${providerName}`);
  }
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT PROVIDER INSTANCE
// ═══════════════════════════════════════════════════════════════

/**
 * Default verification provider for the application.
 * Uses mock provider in development, real provider in production.
 */
export const verificationProvider: VerificationProviderAdapter =
  createVerificationProvider(import.meta.env.VITE_KYC_PROVIDER || 'mock');
