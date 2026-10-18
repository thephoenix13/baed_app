/**
 * Install prompt: a sheet inviting the user to add Bae'd to their home screen.
 * Android and Chrome use the native prompt; iOS Safari shows the manual steps.
 * Dismissed for 7 days.
 */

import { useState, useEffect } from 'react';
import { canInstall, showInstallPrompt, isInstalled, isIOSSafari } from '@/lib/pwa';
import { Button } from '@/ui/kit';

const KEY = 'install-prompt-dismissed';
const WEEK = 7 * 24 * 60 * 60 * 1000;

function recentlyDismissed() {
  try {
    const at = Number(localStorage.getItem(KEY));
    return !!at && Date.now() - at < WEEK;
  } catch {
    return false;
  }
}

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isInstalled() || recentlyDismissed()) return;
    if (canInstall()) {
      setVisible(true);
      return;
    }
    if (isIOSSafari()) {
      const timer = window.setTimeout(() => {
        setIos(true);
        setVisible(true);
      }, 3000);
      return () => {
        window.clearTimeout(timer);
      };
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {
      /* storage can be blocked; the prompt simply shows again next visit */
    }
  };

  const install = async () => {
    if (await showInstallPrompt()) setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Add Bae'd to your home screen"
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
        width: 'min(calc(100% - 28px), 452px)',
        zIndex: 70,
        background: '#fff',
        borderRadius: 28,
        padding: 20,
        boxShadow: 'var(--bd-shadow-nav)',
        border: '1px solid var(--bd-line)',
      }}
    >
      <div className="bd-serif" style={{ fontSize: 24 }}>
        Add Bae'd to your home screen.
      </div>
      <p className="bd-small bd-muted" style={{ margin: '6px 0 14px' }}>
        {ios
          ? 'Tap the Share button in Safari, then choose "Add to Home Screen".'
          : 'Open it like an app, with quick access and notifications for new matches.'}
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        {!ios && <Button onClick={install}>Install</Button>}
        <Button variant="ghost" onClick={dismiss}>
          {ios ? 'Got it' : 'Not now'}
        </Button>
      </div>
    </div>
  );
}
