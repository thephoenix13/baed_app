import { Component } from 'react';
import type { CSSProperties, ErrorInfo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/lib/api';
import { Icon } from './Icon';
import { Button, Kicker, Screen } from './kit';

/* ─── Skeletons: the shape of what is loading, so the screen does not jump ─── */

export function Skeleton({ w = '100%', h = 16, r, style }: { w?: number | string; h?: number | string; r?: number; style?: CSSProperties }) {
  return <div className="bd-skel" aria-hidden="true" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

export function CardSkeleton() {
  return (
    <div role="status" aria-label="Loading people">
      <Skeleton h="min(480px, calc(100dvh - 300px))" r={28} style={{ minHeight: 340 }} />
      <div className="bd-actions" style={{ marginTop: 18 }}>
        <Skeleton w={54} h={54} r={27} />
        <Skeleton w={64} h={64} r={32} />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div role="status" aria-label="Loading profile">
      <Skeleton h={380} r={28} />
      <Skeleton w={120} h={12} style={{ marginTop: 28 }} />
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} w={`${80 - i * 12}%`} h={18} style={{ marginTop: 18 }} />
      ))}
      <Skeleton w={90} h={12} style={{ marginTop: 32 }} />
      <Skeleton h={64} style={{ marginTop: 14 }} />
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 0', borderTop: i ? '1.5px dotted var(--bd-dotted)' : 'none' }}>
          <Skeleton w={46} h={46} r={23} />
          <div style={{ flex: 1 }}>
            <Skeleton w="45%" h={14} />
            <Skeleton w="70%" h={12} style={{ marginTop: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Error panel ─── */

export function ErrorPanel({
  error,
  what,
  onRetry,
}: {
  error: unknown;
  what: string; // "people", "this profile", "your matches"
  onRetry?: () => void;
}) {
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  const notFound = error instanceof ApiError && error.code === 'not_found';
  const title = notFound ? 'We can\'t find that.' : offline ? "You're offline." : "That didn't load.";
  const message = notFound
    ? 'It may have been removed, or the link is wrong.'
    : offline
      ? `Check your connection and we'll load ${what}.`
      : `Something went wrong while loading ${what}. Try again in a moment.`;

  return (
    <div className="bd-hero rose" role="alert" style={{ marginTop: 28, padding: '28px 22px' }}>
      <Icon name={offline ? 'warn' : 'flag'} size={26} style={{ color: 'var(--bd-error)' }} />
      <div className="bd-serif" style={{ fontSize: 28, lineHeight: 1.05, margin: '12px 0 6px' }}>
        {title}
      </div>
      <p className="bd-small bd-muted" style={{ margin: '0 0 18px' }}>
        {message}
      </p>
      {!notFound && onRetry && (
        <Button auto onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/* ─── 404 ─── */

export function NotFoundScreen() {
  const navigate = useNavigate();
  return (
    <Screen>
      <div className="bd-center">
        <Kicker>404</Kicker>
        <h1 className="bd-title" style={{ margin: '10px 0 10px' }}>
          That page isn't here.
        </h1>
        <p className="bd-lead" style={{ margin: '0 0 24px' }}>
          The link may be old or mistyped.
        </p>
        <Button onClick={() => navigate('/discover')}>Go to Discover</Button>
      </div>
    </Screen>
  );
}

/* ─── Last-resort boundary: a render error should never leave a blank page ─── */

interface BoundaryState {
  failed: boolean;
}

export class AppErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Screen crashed', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="bd-app">
        <main className="bd-screen">
          <div className="bd-center">
            <Kicker>Something broke</Kicker>
            <h1 className="bd-title" style={{ margin: '10px 0 10px' }}>
              Sorry, that's on us.
            </h1>
            <p className="bd-lead" style={{ margin: '0 0 24px' }}>
              The screen hit a problem. Reloading usually fixes it.
            </p>
            <Button onClick={() => window.location.assign('/discover')}>Reload the app</Button>
          </div>
        </main>
      </div>
    );
  }
}
