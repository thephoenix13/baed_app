/**
 * Core — Admin RBAC (Role-Based Access Control)
 *
 * Admin roles and permissions for the Trust & Operations Console.
 */

// ═══════════════════════════════════════════════════════════════
// ADMIN ROLES
// ═══════════════════════════════════════════════════════════════

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'TRUST_AND_SAFETY'
  | 'VERIFICATION_OPERATOR'
  | 'CUSTOMER_SUPPORT'
  | 'FINANCE'
  | 'ANALYST';

// ═══════════════════════════════════════════════════════════════
// PERMISSIONS
// ═══════════════════════════════════════════════════════════════

export type AdminPermission =
  // User management
  | 'users:read'
  | 'users:write'
  | 'users:suspend'
  | 'users:delete'
  // Verification
  | 'verification:read'
  | 'verification:approve'
  | 'verification:reject'
  | 'verification:manual_review'
  // Reports & Safety
  | 'reports:read'
  | 'reports:resolve'
  | 'reports:escalate'
  | 'blocks:read'
  | 'risk:read'
  | 'risk:acknowledge'
  // Moderation
  | 'moderation:read'
  | 'moderation:resolve'
  | 'moderation:assign'
  // Analytics
  | 'analytics:read'
  | 'analytics:export'
  // Admin management (Super Admin only)
  | 'admin:read'
  | 'admin:write'
  | 'admin:delete'
  // Finance
  | 'subscriptions:read'
  | 'payments:read'
  | 'refunds:process';

// ═══════════════════════════════════════════════════════════════
// ROLE → PERMISSION MAPPING
// ═══════════════════════════════════════════════════════════════

export const rolePermissions: Record<AdminRole, AdminPermission[]> = {
  SUPER_ADMIN: [
    // All permissions
    'users:read', 'users:write', 'users:suspend', 'users:delete',
    'verification:read', 'verification:approve', 'verification:reject', 'verification:manual_review',
    'reports:read', 'reports:resolve', 'reports:escalate',
    'blocks:read',
    'risk:read', 'risk:acknowledge',
    'moderation:read', 'moderation:resolve', 'moderation:assign',
    'analytics:read', 'analytics:export',
    'admin:read', 'admin:write', 'admin:delete',
    'subscriptions:read', 'payments:read', 'refunds:process',
  ],

  TRUST_AND_SAFETY: [
    'users:read', 'users:suspend',
    'verification:read', 'verification:manual_review',
    'reports:read', 'reports:resolve', 'reports:escalate',
    'blocks:read',
    'risk:read', 'risk:acknowledge',
    'moderation:read', 'moderation:resolve', 'moderation:assign',
  ],

  VERIFICATION_OPERATOR: [
    'users:read',
    'verification:read', 'verification:approve', 'verification:reject', 'verification:manual_review',
  ],

  CUSTOMER_SUPPORT: [
    'users:read',
    'reports:read', 'reports:resolve',
    'blocks:read',
  ],

  FINANCE: [
    'subscriptions:read',
    'payments:read',
    'refunds:process',
  ],

  ANALYST: [
    'users:read',
    'analytics:read', 'analytics:export',
  ],
};

// ═══════════════════════════════════════════════════════════════
// ADMIN AUTH MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

export interface AdminContext {
  adminId: string;
  role: AdminRole;
  permissions: AdminPermission[];
}

/**
 * Check if admin has a specific permission.
 */
export function hasPermission(context: AdminContext, permission: AdminPermission): boolean {
  return context.permissions.includes(permission);
}

/**
 * Require a specific permission — throws if not authorized.
 */
export function requirePermission(context: AdminContext, permission: AdminPermission): void {
  if (!hasPermission(context, permission)) {
    throw new AdminAuthError(
      `Missing permission: ${permission}`,
      'FORBIDDEN',
      403
    );
  }
}

/**
 * Require admin role — throws if not admin.
 */
export function requireAdminRole(context: AdminContext, role: AdminRole): void {
  if (context.role !== role) {
    throw new AdminAuthError(
      `Required role: ${role}`,
      'FORBIDDEN',
      403
    );
  }
}

/**
 * Get admin context from token (mock implementation).
 */
export async function getAdminContext(adminToken: string | null): Promise<AdminContext | null> {
  if (!adminToken) return null;

  // In production, verify JWT and extract admin info
  // For MVP, mock implementation
  try {
    const payload = JSON.parse(atob(adminToken.split('.')[1]));
    return {
      adminId: payload.adminId,
      role: payload.role as AdminRole,
      permissions: rolePermissions[payload.role as AdminRole] || [],
    };
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// ERROR CLASS
// ═══════════════════════════════════════════════════════════════

export class AdminAuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'AdminAuthError';
  }
}
