import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { avatarPhoto } from '@/lib/photos';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import type { IconName } from './Icon';

/* ─── Screen frame ─── */

interface ScreenProps {
  tint?: string; // a Bae'd token, e.g. 'var(--bd-peach)'
  nav?: boolean;
  footer?: boolean;
  wash?: boolean;
  children: ReactNode;
}

/** Tinted wash that fades on scroll + the padded content column. */
export function Screen({ tint, nav, footer, wash = true, children }: ScreenProps) {
  const style = tint ? ({ '--bd-tint': tint } as CSSProperties) : undefined;
  return (
    <div style={style}>
      {wash && <div className="bd-wash" aria-hidden="true" />}
      <main className={`bd-screen${nav ? ' has-nav' : ''}${footer ? ' has-footer' : ''}`}>{children}</main>
    </div>
  );
}

export function Footer({ children }: { children: ReactNode }) {
  return <div className="bd-footer">{children}</div>;
}

/* ─── Buttons ─── */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'pink' | 'ghost' | 'danger';
  auto?: boolean;
  loading?: boolean;
}

export function Button({ variant = 'primary', auto, loading, className = '', type = 'button', children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`bd-btn ${variant}${auto ? ' auto' : ''} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="bd-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function BackButton({ to, label = 'Back' }: { to?: string; label?: string }) {
  const navigate = useNavigate();
  return (
    <button type="button" className="bd-back" aria-label={label} onClick={() => (to ? navigate(to) : navigate(-1))}>
      <Icon name="back" size={22} />
    </button>
  );
}

export function RoundButton({
  icon,
  label,
  variant,
  onClick,
  filled,
}: {
  icon: IconName;
  label: string;
  variant?: 'like' | 'sm';
  onClick?: () => void;
  filled?: boolean;
}) {
  return (
    <button type="button" className={`bd-circ${variant ? ` ${variant}` : ''}`} aria-label={label} onClick={onClick}>
      <Icon name={icon} size={variant === 'like' ? 28 : variant === 'sm' ? 18 : 22} filled={filled} />
    </button>
  );
}

/* ─── Badges and chips ─── */

export function VerifiedBadge({ label = 'Verified' }: { label?: string }) {
  return (
    <span className="bd-badge">
      <Icon name="check" size={11} strokeWidth={3.2} />
      {label}
    </span>
  );
}

export function Pill({
  children,
  selected,
  onClick,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  if (!onClick) return <span className={`bd-pill static${selected ? ' sel' : ''}`}>{children}</span>;
  return (
    <button type="button" className={`bd-pill${selected ? ' sel' : ''}`} aria-pressed={!!selected} onClick={onClick}>
      {children}
    </button>
  );
}

/* ─── Portraits (illustrated placeholders) ─── */

const VARIANTS = ['v0', 'v1', 'v2', 'v3'] as const;

export function variantFor(key: string) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return VARIANTS[h % VARIANTS.length];
}

export function Avatar({ seed, size, ring, label = 'Profile photo' }: { seed: string; size?: 'lg'; ring?: boolean; label?: string }) {
  const src = avatarPhoto(seed);
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`bd-portrait bd-avatar ${variantFor(seed)}${size ? ` ${size}` : ''}${ring ? ' ring' : ''}`}
      role="img"
      aria-label={label}
    >
      {src && !failed && <img className="bd-photo-img" src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />}
    </div>
  );
}

/** A large person photo with the illustrated portrait showing while it loads or if it fails. */
export function PortraitPhoto({
  id,
  src,
  label,
  className = '',
  style,
  eager,
  children,
}: {
  id: string;
  src?: string;
  label: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
  children?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`bd-portrait ${variantFor(id)} ${className}`} style={style} role="img" aria-label={label}>
      {src && !failed && (
        <img
          className="bd-photo-img"
          src={src}
          alt=""
          width={720}
          height={900}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      {children}
    </div>
  );
}

/* ─── Open sections ─── */

export function Kicker({ children }: { children: ReactNode }) {
  return <div className="bd-kicker">{children}</div>;
}

export function Dots() {
  return <hr className="bd-dots" />;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bd-section">
      <Kicker>{title}</Kicker>
      {children}
    </section>
  );
}

export function Item({ title, sub, marker = true }: { title: ReactNode; sub?: ReactNode; marker?: boolean }) {
  return (
    <div className="bd-item">
      {marker && <span className="mk" />}
      <div>
        <b>{title}</b>
        {sub && <span className="sub">{sub}</span>}
      </div>
    </div>
  );
}

export function Row({
  title,
  sub,
  onClick,
  trailing,
}: {
  title: ReactNode;
  sub?: ReactNode;
  onClick?: () => void;
  trailing?: ReactNode;
}) {
  return (
    <button type="button" className="bd-row" onClick={onClick}>
      <span>
        {title}
        {sub && <span className="sub">{sub}</span>}
      </span>
      {trailing ?? <Icon name="chev" size={18} />}
    </button>
  );
}

/* ─── Floating navigation ─── */

const TABS: { to: string; label: string; icon: IconName }[] = [
  { to: '/discover', label: 'Discover', icon: 'compass' },
  { to: '/matches', label: 'Matches', icon: 'heart' },
  { to: '/chats', label: 'Chats', icon: 'chat' },
  { to: '/you', label: 'You', icon: 'user' },
];

export function FloatingNav({ unreadChats = false }: { unreadChats?: boolean }) {
  return (
    <nav className="bd-nav" aria-label="Main">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} className={({ isActive }) => (isActive ? 'on' : '')}>
          <Icon name={t.icon} size={22} />
          {t.label}
          {t.to === '/chats' && unreadChats && <i className="dot" aria-label="Unread messages" />}
        </NavLink>
      ))}
    </nav>
  );
}

/* ─── Slim bar that takes over after the hero scrolls away ─── */

export function SlimBar({ show, name, verified }: { show: boolean; name: string; verified?: boolean }) {
  if (!show) return null;
  return (
    <header className="bd-slim">
      <BackButton />
      <span className="bd-serif">{name}</span>
      {verified && <VerifiedBadge />}
    </header>
  );
}

/* ─── Sheet ─── */

export function Sheet({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="bd-dim" onClick={onClose} aria-hidden="true" />
      <div className="bd-sheet" role="dialog" aria-modal="true" aria-label={label}>
        <div className="bd-grab" />
        {children}
      </div>
    </>
  );
}

/* ─── Step header: back button + progress bar for multi-step flows ─── */

export function StepHeader({ step, total, to }: { step: number; total: number; to?: string }) {
  return (
    <div className="bd-topbar" style={{ marginBottom: 22 }}>
      <BackButton to={to} />
      <div className="bd-progress" style={{ flex: 1, maxWidth: 200 }} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label={`Step ${step} of ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <i key={i} className={i < step ? 'on' : ''} />
        ))}
      </div>
      <span style={{ width: 40 }} />
    </div>
  );
}
