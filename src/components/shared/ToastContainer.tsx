/**
 * Toast Container Component
 *
 * Renders active toasts from the UI store.
 */

import { useUIStore } from '@/stores/ui-store';

const toastIcons: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const toastColors: Record<string, string> = {
  success: 'border-verified-green bg-green-50',
  error: 'border-error bg-red-50',
  warning: 'border-amber bg-amber-50',
  info: 'border-plum bg-pink-pale',
};

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toastColors[toast.type] || ''}`}
          role="alert"
        >
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm font-bold">
              {toastIcons[toast.type]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-body font-semibold text-ink">{toast.title}</p>
              {toast.message && (
                <p className="text-body text-muted text-sm mt-0.5">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-muted hover:text-ink"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
