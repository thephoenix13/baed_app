/**
 * Identity Module — Device Service
 *
 * Handles device registration, push token management, and device tracking.
 */

import type { UserDevice, DeviceInfo, DeviceType } from '../types/user.types';

// ═══════════════════════════════════════════════════════════════
// DEVICE STORAGE (In-Memory for MVP — Use Database in Production)
// ═══════════════════════════════════════════════════════════════

const deviceStore = new Map<string, UserDevice>();

// ═══════════════════════════════════════════════════════════════
// DEVICE SERVICE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Register or update a device for a user.
 */
export function registerDevice(userId: string, deviceInfo: DeviceInfo): UserDevice {
  // Check if device already exists (by deviceToken or generate new ID)
  const deviceId = deviceInfo.deviceToken 
    ? `device-${deviceInfo.deviceToken.slice(0, 8)}`
    : `device-${crypto.randomUUID().slice(0, 8)}`;

  const existing = deviceStore.get(deviceId);

  if (existing) {
    // Update existing device
    existing.deviceToken = deviceInfo.deviceToken || existing.deviceToken;
    existing.deviceModel = deviceInfo.deviceModel || existing.deviceModel;
    existing.osVersion = deviceInfo.osVersion || existing.osVersion;
    existing.appVersion = deviceInfo.appVersion || existing.appVersion;
    existing.lastActiveAt = new Date();
    existing.updatedAt = new Date();
    deviceStore.set(deviceId, existing);
    return existing;
  }

  // Create new device
  const device: UserDevice = {
    id: deviceId,
    userId,
    deviceToken: deviceInfo.deviceToken || null,
    deviceType: deviceInfo.deviceType,
    deviceModel: deviceInfo.deviceModel || null,
    osVersion: deviceInfo.osVersion || null,
    appVersion: deviceInfo.appVersion || null,
    pushEnabled: !!deviceInfo.deviceToken,
    lastActiveAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  deviceStore.set(deviceId, device);
  return device;
}

/**
 * Update device push token.
 */
export function updateDevicePushToken(deviceId: string, pushToken: string): boolean {
  const device = deviceStore.get(deviceId);
  if (!device) return false;

  device.deviceToken = pushToken;
  device.pushEnabled = true;
  device.updatedAt = new Date();
  deviceStore.set(deviceId, device);

  return true;
}

/**
 * Disable push notifications for a device.
 */
export function disableDevicePush(deviceId: string): boolean {
  const device = deviceStore.get(deviceId);
  if (!device) return false;

  device.pushEnabled = false;
  device.deviceToken = null;
  device.updatedAt = new Date();
  deviceStore.set(deviceId, device);

  return true;
}

/**
 * Get device by ID.
 */
export function getDevice(deviceId: string): UserDevice | null {
  return deviceStore.get(deviceId) || null;
}

/**
 * Get all devices for a user.
 */
export function getUserDevices(userId: string): UserDevice[] {
  return Array.from(deviceStore.values()).filter(d => d.userId === userId);
}

/**
 * Get devices with push enabled for a user.
 */
export function getUserPushDevices(userId: string): UserDevice[] {
  return Array.from(deviceStore.values()).filter(
    d => d.userId === userId && d.pushEnabled && d.deviceToken
  );
}

/**
 * Delete a device.
 */
export function deleteDevice(deviceId: string): boolean {
  return deviceStore.delete(deviceId);
}

/**
 * Delete all devices for a user.
 */
export function deleteUserDevices(userId: string): number {
  let count = 0;
  for (const [id, device] of deviceStore.entries()) {
    if (device.userId === userId) {
      deviceStore.delete(id);
      count++;
    }
  }
  return count;
}

/**
 * Detect device type from user agent.
 */
export function detectDeviceType(userAgent: string): DeviceType {
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
  if (/Android/.test(userAgent)) return 'Android';
  return 'Web';
}

/**
 * Update device last active timestamp.
 */
export function touchDevice(deviceId: string): void {
  const device = deviceStore.get(deviceId);
  if (device) {
    device.lastActiveAt = new Date();
    deviceStore.set(deviceId, device);
  }
}
