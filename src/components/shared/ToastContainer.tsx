/**
 * Toasts: quiet pills at the top of the screen, from the UI store.
 */

import { useUIStore } from '@/stores/ui-store';
import { Icon } from '@/ui/Icon';
import type { IconName } from '@/ui/Icon';

const ICON: Record<string, IconName> = { success: 'check', error: 'x', warning: 'warn', info: 'bell' };

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 'calc(12px + env(safe-area-inset-top, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(calc(100% - 28px), 452px)',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.type === 'error' ? 'alert' : 'status'}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            background: 'var(--bd-plum)',
            color: '#fff',
            borderRadius: 20,
            padding: '12px 14px',
            boxShadow: 'var(--bd-shadow-hero)',
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              flex: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: toast.type === 'error' ? 'var(--bd-error)' : 'var(--bd-pink)',
              color: toast.type === 'error' ? '#fff' : 'var(--bd-plum)',
            }}
          >
            <Icon name={ICON[toast.type] ?? 'bell'} size={14} strokeWidth={2.6} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{toast.title}</div>
            {toast.message && <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{toast.message}</div>}
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss"
            style={{ all: 'unset', cursor: 'pointer', color: '#fff', opacity: 0.7, padding: 4 }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
