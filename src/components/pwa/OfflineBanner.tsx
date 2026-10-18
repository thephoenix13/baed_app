/**
 * Offline banner: shown across the top while the device has no connection.
 */

import { useState, useEffect } from 'react';
import { isOffline, onConnectionChange } from '@/lib/pwa';
import { Icon } from '@/ui/Icon';

export function OfflineBanner() {
  const [offline, setOffline] = useState(isOffline());

  useEffect(() => {
    const unsubscribe = onConnectionChange(
      () => setOffline(false),
      () => setOffline(true),
    );
    return unsubscribe;
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(100%, 480px)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 'calc(8px + env(safe-area-inset-top, 0px)) 16px 8px',
        background: 'var(--bd-peach)',
        color: 'var(--bd-plum)',
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      <Icon name="warn" size={16} />
      You're offline. Some things won't work until you reconnect.
    </div>
  );
}
