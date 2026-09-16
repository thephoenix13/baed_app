/**
 * Offline Banner Component
 *
 * Shows a banner when the user is offline.
 */

import { useState, useEffect } from 'react';
import { isOffline, onConnectionChange } from '@/lib/pwa';

export function OfflineBanner() {
  const [offline, setOffline] = useState(isOffline());

  useEffect(() => {
    const unsubscribe = onConnectionChange(
      () => setOffline(false),
      () => setOffline(true)
    );
    return unsubscribe;
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber text-white px-4 py-2 text-center">
      <p className="text-body font-semibold">
        You're offline. Some features may not be available.
      </p>
    </div>
  );
}
