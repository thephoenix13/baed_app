/**
 * Core — Database Client (Prisma)
 *
 * Singleton Prisma client instance.
 * In development, prevents multiple instances during hot reload.
 * In production, this connects to PostgreSQL + PostGIS.
 *
 * NOTE: This is a browser-compatible mock for the MVP.
 * In production (Next.js), use the actual Prisma client on the server.
 */

// ═══════════════════════════════════════════════════════════════
// PRISMA CLIENT (Server-side only in production)
// ═══════════════════════════════════════════════════════════════

/**
 * In a real Next.js app, this would be:
 *
 * import { PrismaClient } from '@prisma/client';
 *
 * const globalForPrisma = globalThis as unknown as {
 *   prisma: PrismaClient | undefined;
 * };
 *
 * export const prisma = globalForPrisma.prisma ?? new PrismaClient();
 *
 * if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
 */

// ═══════════════════════════════════════════════════════════════
// MOCK DATABASE CLIENT (Browser-compatible for MVP)
// ═══════════════════════════════════════════════════════════════

export interface DatabaseClient {
  user: {
    findUnique: (args: { where: { id?: string; phoneNumber?: string } }) => Promise<any>;
    create: (args: { data: any }) => Promise<any>;
    update: (args: { where: { id: string }; data: any }) => Promise<any>;
    delete: (args: { where: { id: string } }) => Promise<any>;
  };
  session: {
    create: (args: { data: any }) => Promise<any>;
    findUnique: (args: { where: { id?: string; refreshToken?: string } }) => Promise<any>;
    update: (args: { where: { id: string }; data: any }) => Promise<any>;
  };
  device: {
    create: (args: { data: any }) => Promise<any>;
    findMany: (args: { where: { userId: string } }) => Promise<any[]>;
  };
}

/**
 * In-memory mock database for browser environment.
 * In production, replace with actual Prisma client.
 */
class MockDatabaseClient implements DatabaseClient {
  private users = new Map<string, any>();
  private sessions = new Map<string, any>();
  private devices = new Map<string, any>();

  user = {
    findUnique: async (args: { where: { id?: string; phoneNumber?: string } }) => {
      if (args.where.id) return this.users.get(args.where.id) || null;
      if (args.where.phoneNumber) {
        for (const user of this.users.values()) {
          if (user.phoneNumber === args.where.phoneNumber) return user;
        }
      }
      return null;
    },
    create: async (args: { data: any }) => {
      const user = { id: crypto.randomUUID(), ...args.data, createdAt: new Date(), updatedAt: new Date() };
      this.users.set(user.id, user);
      return user;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const user = this.users.get(args.where.id);
      if (!user) throw new Error('User not found');
      const updated = { ...user, ...args.data, updatedAt: new Date() };
      this.users.set(args.where.id, updated);
      return updated;
    },
    delete: async (args: { where: { id: string } }) => {
      const user = this.users.get(args.where.id);
      if (!user) throw new Error('User not found');
      this.users.delete(args.where.id);
      return user;
    },
  };

  session = {
    create: async (args: { data: any }) => {
      const session = { id: crypto.randomUUID(), ...args.data, createdAt: new Date() };
      this.sessions.set(session.id, session);
      return session;
    },
    findUnique: async (args: { where: { id?: string; refreshToken?: string } }) => {
      if (args.where.id) return this.sessions.get(args.where.id) || null;
      if (args.where.refreshToken) {
        for (const session of this.sessions.values()) {
          if (session.refreshToken === args.where.refreshToken) return session;
        }
      }
      return null;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const session = this.sessions.get(args.where.id);
      if (!session) throw new Error('Session not found');
      const updated = { ...session, ...args.data };
      this.sessions.set(args.where.id, updated);
      return updated;
    },
  };

  device = {
    create: async (args: { data: any }) => {
      const device = { id: crypto.randomUUID(), ...args.data, createdAt: new Date(), updatedAt: new Date() };
      this.devices.set(device.id, device);
      return device;
    },
    findMany: async (args: { where: { userId: string } }) => {
      return Array.from(this.devices.values()).filter(d => d.userId === args.where.userId);
    },
  };
}

// Export singleton instance
export const db = new MockDatabaseClient();

// ═══════════════════════════════════════════════════════════════
// POSTGIS HELPERS (For production use)
// ═══════════════════════════════════════════════════════════════

/**
 * Convert latitude/longitude to PostGIS geography point.
 * In production, use raw SQL with Prisma's $executeRaw.
 */
export function toPostGISPoint(latitude: number, longitude: number): string {
  return `ST_GeographyFromText('SRID=4326;POINT(${longitude} ${latitude})')`;
}

/**
 * Calculate distance between two points in kilometers.
 * In production, use PostGIS ST_Distance.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
