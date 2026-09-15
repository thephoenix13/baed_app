/**
 * Identity Module — Domain Events
 *
 * Events emitted by the identity module for other modules to consume.
 */

// ═══════════════════════════════════════════════════════════════
// EVENT TYPES
// ═══════════════════════════════════════════════════════════════

export interface UserCreatedEvent {
  type: 'UserCreated';
  payload: {
    userId: string;
    phoneNumber: string;
    countryCode: string;
    createdAt: Date;
  };
  timestamp: Date;
}

export interface UserLoggedInEvent {
  type: 'UserLoggedIn';
  payload: {
    userId: string;
    sessionId: string;
    deviceId: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    isNewUser: boolean;
    timestamp: Date;
  };
  timestamp: Date;
}

export interface UserLoggedOutEvent {
  type: 'UserLoggedOut';
  payload: {
    userId: string;
    sessionId: string;
    timestamp: Date;
  };
  timestamp: Date;
}

export interface UserVerifiedEvent {
  type: 'UserVerified';
  payload: {
    userId: string;
    verificationId: string;
    verifiedAt: Date;
  };
  timestamp: Date;
}

export interface UserDeletedEvent {
  type: 'UserDeleted';
  payload: {
    userId: string;
    deletedAt: Date;
    reason: string;
  };
  timestamp: Date;
}

export interface DeviceRegisteredEvent {
  type: 'DeviceRegistered';
  payload: {
    userId: string;
    deviceId: string;
    deviceType: string;
    pushEnabled: boolean;
    timestamp: Date;
  };
  timestamp: Date;
}

export interface SessionRefreshedEvent {
  type: 'SessionRefreshed';
  payload: {
    userId: string;
    sessionId: string;
    timestamp: Date;
  };
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════
// EVENT UNION
// ═══════════════════════════════════════════════════════════════

export type IdentityEvent =
  | UserCreatedEvent
  | UserLoggedInEvent
  | UserLoggedOutEvent
  | UserVerifiedEvent
  | UserDeletedEvent
  | DeviceRegisteredEvent
  | SessionRefreshedEvent;

// ═══════════════════════════════════════════════════════════════
// EVENT EMITTER (Simple implementation — Use proper event bus in production)
// ═══════════════════════════════════════════════════════════════

type EventHandler = (event: IdentityEvent) => void;

const handlers: Map<string, EventHandler[]> = new Map();

/**
 * Subscribe to an event type.
 */
export function on<T extends IdentityEvent['type']>(
  eventType: T,
  handler: EventHandler
): () => void {
  const existing = handlers.get(eventType) || [];
  existing.push(handler);
  handlers.set(eventType, existing);

  // Return unsubscribe function
  return () => {
    const current = handlers.get(eventType) || [];
    handlers.set(
      eventType,
      current.filter(h => h !== handler)
    );
  };
}

/**
 * Emit an event.
 */
export function emit(event: IdentityEvent): void {
  const eventHandlers = handlers.get(event.type) || [];
  for (const handler of eventHandlers) {
    try {
      handler(event);
    } catch (error) {
      console.error(`[EventBus] Error in handler for ${event.type}:`, error);
    }
  }
}

/**
 * Create and emit UserCreated event.
 */
export function emitUserCreated(userId: string, phoneNumber: string, countryCode: string): void {
  emit({
    type: 'UserCreated',
    payload: {
      userId,
      phoneNumber,
      countryCode,
      createdAt: new Date(),
    },
    timestamp: new Date(),
  });
}

/**
 * Create and emit UserLoggedIn event.
 */
export function emitUserLoggedIn(
  userId: string,
  sessionId: string,
  deviceId: string | null,
  ipAddress: string | null,
  userAgent: string | null,
  isNewUser: boolean
): void {
  emit({
    type: 'UserLoggedIn',
    payload: {
      userId,
      sessionId,
      deviceId,
      ipAddress,
      userAgent,
      isNewUser,
      timestamp: new Date(),
    },
    timestamp: new Date(),
  });
}

/**
 * Create and emit UserLoggedOut event.
 */
export function emitUserLoggedOut(userId: string, sessionId: string): void {
  emit({
    type: 'UserLoggedOut',
    payload: {
      userId,
      sessionId,
      timestamp: new Date(),
    },
    timestamp: new Date(),
  });
}

/**
 * Create and emit UserVerified event.
 */
export function emitUserVerified(userId: string, verificationId: string): void {
  emit({
    type: 'UserVerified',
    payload: {
      userId,
      verificationId,
      verifiedAt: new Date(),
    },
    timestamp: new Date(),
  });
}

/**
 * Create and emit UserDeleted event.
 */
export function emitUserDeleted(userId: string, reason: string): void {
  emit({
    type: 'UserDeleted',
    payload: {
      userId,
      deletedAt: new Date(),
      reason,
    },
    timestamp: new Date(),
  });
}
