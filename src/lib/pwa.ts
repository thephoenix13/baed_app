/**
 * PWA Utilities
 *
 * Helpers for PWA installation, offline detection, and push notifications.
 */

// ═══════════════════════════════════════════════════════════════
// INSTALL PROMPT
// ═══════════════════════════════════════════════════════════════

let deferredPrompt: any = null;

/**
 * Listen for the beforeinstallprompt event.
 * Call this once at app startup.
 */
export function setupInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
  });
}

/**
 * Show the install prompt.
 * Returns true if the prompt was shown, false if not available.
 */
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) return false;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;

  return outcome === 'accepted';
}

/**
 * Check if the app can be installed.
 */
export function canInstall(): boolean {
  return deferredPrompt !== null;
}

/**
 * Check if the app is already installed (standalone mode).
 */
export function isInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

// ═══════════════════════════════════════════════════════════════
// OFFLINE DETECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Check if the browser is currently offline.
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * Listen for online/offline events.
 */
export function onConnectionChange(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

// ═══════════════════════════════════════════════════════════════
// iOS DETECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Detect if the user is on iOS.
 */
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Detect if the user is on iOS Safari (not standalone).
 */
export function isIOSSafari(): boolean {
  return isIOS() && !isInstalled() && /Safari/.test(navigator.userAgent);
}

/**
 * Detect if the user is on Android.
 */
export function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent);
}

// ═══════════════════════════════════════════════════════════════
// PUSH NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Check if push notifications are supported.
 */
export function isPushSupported(): boolean {
  return 'PushManager' in window && 'serviceWorker' in navigator;
}

/**
 * Get current notification permission.
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!('Notification' in window)) return 'unsupported';

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Subscribe to push notifications.
 * Returns the push subscription or null if not supported.
 */
export async function subscribeToPush(
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
  });

  return subscription;
}

/**
 * Convert VAPID public key from base64 to Uint8Array.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// ═══════════════════════════════════════════════════════════════
// SERVICE WORKER
// ═══════════════════════════════════════════════════════════════

/**
 * Check if service worker is supported.
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

/**
 * Get the service worker registration.
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) return null;
  return navigator.serviceWorker.ready;
}

/**
 * Check for service worker updates.
 */
export async function checkForUpdates(): Promise<boolean> {
  if (!isServiceWorkerSupported()) return false;

  const registration = await navigator.serviceWorker.ready;
  await registration.update();

  return registration.waiting !== null;
}

/**
 * Apply service worker update.
 */
export async function applyUpdate(): Promise<void> {
  if (!isServiceWorkerSupported()) return;

  const registration = await navigator.serviceWorker.ready;
  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
}
