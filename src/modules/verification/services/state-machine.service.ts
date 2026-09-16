/**
 * Verification Module — State Machine
 *
 * Manages verification workflow state transitions.
 * Enforces valid state transitions and emits domain events.
 *
 * STATE FLOW:
 * NOT_STARTED → IN_PROGRESS → DOCUMENT_SUBMITTED → SELFIE_REQUIRED →
 * PROCESSING → VERIFIED | FAILED | MANUAL_REVIEW
 *
 * Any state → EXPIRED (after timeout)
 * VERIFIED → REVERIFICATION_REQUIRED (after expiry or admin action)
 * FAILED → IN_PROGRESS (retry)
 * MANUAL_REVIEW → VERIFIED | FAILED (admin decision)
 */

import { VerificationState } from '../types/verification.types';

// ═══════════════════════════════════════════════════════════════
// STATE TRANSITION RULES
// ═══════════════════════════════════════════════════════════════

/**
 * Valid state transitions map.
 * Key: current state
 * Value: array of valid next states
 */
export const VALID_TRANSITIONS: Record<VerificationState, VerificationState[]> = {
  [VerificationState.NOT_STARTED]: [
    VerificationState.IN_PROGRESS,
    VerificationState.EXPIRED,
  ],

  [VerificationState.IN_PROGRESS]: [
    VerificationState.DOCUMENT_SUBMITTED,
    VerificationState.FAILED,
    VerificationState.EXPIRED,
  ],

  [VerificationState.DOCUMENT_SUBMITTED]: [
    VerificationState.SELFIE_REQUIRED,
    VerificationState.FAILED,
    VerificationState.EXPIRED,
  ],

  [VerificationState.SELFIE_REQUIRED]: [
    VerificationState.PROCESSING,
    VerificationState.FAILED,
    VerificationState.EXPIRED,
  ],

  [VerificationState.PROCESSING]: [
    VerificationState.VERIFIED,
    VerificationState.FAILED,
    VerificationState.MANUAL_REVIEW,
    VerificationState.EXPIRED,
  ],

  [VerificationState.VERIFIED]: [
    VerificationState.REVERIFICATION_REQUIRED,
    VerificationState.EXPIRED,
  ],

  [VerificationState.FAILED]: [
    VerificationState.IN_PROGRESS, // Retry
    VerificationState.EXPIRED,
  ],

  [VerificationState.MANUAL_REVIEW]: [
    VerificationState.VERIFIED, // Admin approves
    VerificationState.FAILED, // Admin rejects
    VerificationState.EXPIRED,
  ],

  [VerificationState.EXPIRED]: [
    VerificationState.IN_PROGRESS, // Restart
  ],

  [VerificationState.REVERIFICATION_REQUIRED]: [
    VerificationState.IN_PROGRESS, // Restart
    VerificationState.EXPIRED,
  ],
};

// ═══════════════════════════════════════════════════════════════
// STATE METADATA
// ═══════════════════════════════════════════════════════════════

export interface StateMetadata {
  label: string;
  description: string;
  isTerminal: boolean;
  requiresAction: boolean;
  userFacing: boolean;
}

/**
 * Metadata for each verification state.
 */
export const STATE_METADATA: Record<VerificationState, StateMetadata> = {
  [VerificationState.NOT_STARTED]: {
    label: 'Not Started',
    description: 'Verification has not been initiated',
    isTerminal: false,
    requiresAction: true,
    userFacing: true,
  },

  [VerificationState.IN_PROGRESS]: {
    label: 'In Progress',
    description: 'Verification is in progress - awaiting document upload',
    isTerminal: false,
    requiresAction: true,
    userFacing: true,
  },

  [VerificationState.DOCUMENT_SUBMITTED]: {
    label: 'Document Submitted',
    description: 'ID document uploaded - awaiting selfie',
    isTerminal: false,
    requiresAction: true,
    userFacing: true,
  },

  [VerificationState.SELFIE_REQUIRED]: {
    label: 'Selfie Required',
    description: 'Document uploaded - please take a selfie',
    isTerminal: false,
    requiresAction: true,
    userFacing: true,
  },

  [VerificationState.PROCESSING]: {
    label: 'Processing',
    description: 'Verification is being processed',
    isTerminal: false,
    requiresAction: false,
    userFacing: true,
  },

  [VerificationState.VERIFIED]: {
    label: 'Verified',
    description: 'Identity successfully verified',
    isTerminal: true,
    requiresAction: false,
    userFacing: true,
  },

  [VerificationState.FAILED]: {
    label: 'Failed',
    description: 'Verification failed - please try again',
    isTerminal: true,
    requiresAction: true,
    userFacing: true,
  },

  [VerificationState.MANUAL_REVIEW]: {
    label: 'Manual Review',
    description: 'Verification requires manual review by our team',
    isTerminal: false,
    requiresAction: false,
    userFacing: true,
  },

  [VerificationState.EXPIRED]: {
    label: 'Expired',
    description: 'Verification request has expired',
    isTerminal: true,
    requiresAction: true,
    userFacing: true,
  },

  [VerificationState.REVERIFICATION_REQUIRED]: {
    label: 'Re-verification Required',
    description: 'Previous verification expired or revoked - please verify again',
    isTerminal: false,
    requiresAction: true,
    userFacing: true,
  },
};

// ═══════════════════════════════════════════════════════════════
// STATE MACHINE
// ═══════════════════════════════════════════════════════════════

export interface StateTransition {
  from: VerificationState;
  to: VerificationState;
  timestamp: Date;
  reason?: string;
  actor: 'user' | 'system' | 'admin';
  actorId?: string;
}

export interface VerificationStateMachine {
  currentState: VerificationState;
  history: StateTransition[];

  /**
   * Transition to a new state.
   *
   * @param nextState - Target state
   * @param reason - Optional reason for transition
   * @param actor - Who initiated the transition
   * @param actorId - ID of the actor (if applicable)
   * @throws Error if transition is invalid
   */
  transition(
    nextState: VerificationState,
    reason?: string,
    actor?: 'user' | 'system' | 'admin',
    actorId?: string
  ): void;

  /**
   * Check if a transition is valid.
   *
   * @param nextState - Target state
   * @returns true if transition is allowed
   */
  canTransitionTo(nextState: VerificationState): boolean;

  /**
   * Get metadata for current state.
   */
  getCurrentStateMetadata(): StateMetadata;

  /**
   * Check if current state is terminal (no further transitions possible).
   */
  isTerminal(): boolean;

  /**
   * Check if current state requires user action.
   */
  requiresUserAction(): boolean;

  /**
   * Get all valid next states from current state.
   */
  getValidNextStates(): VerificationState[];

  /**
   * Reset state machine to NOT_STARTED.
   */
  reset(): void;
}

/**
 * Create a new verification state machine.
 *
 * @param initialState - Starting state (defaults to NOT_STARTED)
 * @returns State machine instance
 */
export function createVerificationStateMachine(
  initialState: VerificationState = VerificationState.NOT_STARTED
): VerificationStateMachine {
  let currentState = initialState;
  const history: StateTransition[] = [];

  return {
    get currentState() {
      return currentState;
    },

    get history() {
      return [...history];
    },

    transition(
      nextState: VerificationState,
      reason?: string,
      actor: 'user' | 'system' | 'admin' = 'system',
      actorId?: string
    ): void {
      // Validate transition
      if (!this.canTransitionTo(nextState)) {
        throw new Error(
          `Invalid state transition: ${currentState} → ${nextState}. ` +
          `Valid transitions from ${currentState}: ${VALID_TRANSITIONS[currentState].join(', ')}`
        );
      }

      // Record transition
      const transition: StateTransition = {
        from: currentState,
        to: nextState,
        timestamp: new Date(),
        reason,
        actor,
        actorId,
      };

      history.push(transition);
      currentState = nextState;

      console.log(
        `[VerificationStateMachine] ${transition.from} → ${transition.to}` +
        (reason ? ` (${reason})` : '')
      );
    },

    canTransitionTo(nextState: VerificationState): boolean {
      return VALID_TRANSITIONS[currentState].includes(nextState);
    },

    getCurrentStateMetadata(): StateMetadata {
      return STATE_METADATA[currentState];
    },

    isTerminal(): boolean {
      return STATE_METADATA[currentState].isTerminal;
    },

    requiresUserAction(): boolean {
      return STATE_METADATA[currentState].requiresAction;
    },

    getValidNextStates(): VerificationState[] {
      return VALID_TRANSITIONS[currentState];
    },

    reset(): void {
      currentState = VerificationState.NOT_STARTED;
      history.length = 0;
      console.log('[VerificationStateMachine] Reset to NOT_STARTED');
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// STATE HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Check if a state indicates successful verification.
 */
export function isVerifiedState(state: VerificationState): boolean {
  return state === VerificationState.VERIFIED;
}

/**
 * Check if a state indicates verification is in progress.
 */
export function isInProgressState(state: VerificationState): boolean {
  return [
    VerificationState.IN_PROGRESS,
    VerificationState.DOCUMENT_SUBMITTED,
    VerificationState.SELFIE_REQUIRED,
    VerificationState.PROCESSING,
    VerificationState.MANUAL_REVIEW,
  ].includes(state);
}

/**
 * Check if a state indicates verification failed.
 */
export function isFailedState(state: VerificationState): boolean {
  return [
    VerificationState.FAILED,
    VerificationState.EXPIRED,
  ].includes(state);
}

/**
 * Check if a state requires re-verification.
 */
export function requiresReverification(state: VerificationState): boolean {
  return [
    VerificationState.REVERIFICATION_REQUIRED,
    VerificationState.EXPIRED,
  ].includes(state);
}

/**
 * Get user-friendly message for a state.
 */
export function getStateMessage(state: VerificationState): string {
  const messages: Record<VerificationState, string> = {
    [VerificationState.NOT_STARTED]: 'Start your verification to get matched with verified people.',
    [VerificationState.IN_PROGRESS]: 'Upload your ID document to continue.',
    [VerificationState.DOCUMENT_SUBMITTED]: 'Great! Now take a selfie to match with your ID.',
    [VerificationState.SELFIE_REQUIRED]: 'Please take a selfie to complete verification.',
    [VerificationState.PROCESSING]: 'We\'re verifying your identity. This usually takes a few minutes.',
    [VerificationState.VERIFIED]: 'You\'re verified! Start matching with other verified people.',
    [VerificationState.FAILED]: 'Verification failed. Please try again with a clearer photo.',
    [VerificationState.MANUAL_REVIEW]: 'Your verification is being reviewed by our team. We\'ll notify you once it\'s complete.',
    [VerificationState.EXPIRED]: 'Your verification request has expired. Please start a new verification.',
    [VerificationState.REVERIFICATION_REQUIRED]: 'Your previous verification has expired. Please verify again to continue.',
  };

  return messages[state];
}
