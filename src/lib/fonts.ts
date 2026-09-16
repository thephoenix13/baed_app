/**
 * BAE'D — Font Configuration
 *
 * Adapted from next/font/google for Vite + React.
 * Fonts are loaded via Google Fonts <link> in index.html with display: swap.
 *
 * Usage:
 *   import { fontDisplay, fontSans, fontMono } from '@/lib/fonts';
 *   <h1 className={fontDisplay.className}>Bae'd</h1>
 *   <p className={fontSans.className}>Body text</p>
 *
 * Or use Tailwind utilities directly:
 *   <h1 className="font-display">Bae'd</h1>
 *   <p className="font-sans">Body text</p>
 */

// ═══════════════════════════════════════════════════════════════
// FONT DEFINITIONS
// ═══════════════════════════════════════════════════════════════

/**
 * DM Serif Display — Used for headlines, hero text, brand moments.
 * Weight: 400 only
 * Letter-spacing: -2px to -3px (tight)
 * Line-height: 0.92–1.1
 */
export const fontDisplay = {
  className: 'font-display',
  style: {
    fontFamily: "'DM Serif Display', serif",
    fontWeight: 400,
  } as const,
  variable: '--font-display',
};

/**
 * Inter — Used for all body copy, UI, buttons, labels.
 * Weights: 400, 500, 600, 700, 800
 * Loaded with display: swap for optimal FCP.
 */
export const fontSans = {
  className: 'font-sans',
  style: {
    fontFamily:
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeight: 400,
  } as const,
  variable: '--font-sans',
};

/**
 * Monospace — Used for code, tokens, technical display.
 * System font stack for performance.
 */
export const fontMono = {
  className: 'font-mono',
  style: {
    fontFamily: "ui-monospace, 'SFMono-Regular', Consolas, monospace",
    fontWeight: 400,
  } as const,
  variable: '--font-mono',
};

// ═══════════════════════════════════════════════════════════════
// TYPE SCALE HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Type scale classes — use with Tailwind's `text-*` utilities.
 * These are defined in src/index.css via @theme.
 *
 * --text-hero:   clamp(52px, 7vw, 88px)  · Display · -3px tracking
 * --text-h1:     clamp(38px, 5vw, 64px)  · Display · -2px tracking
 * --text-h2:     clamp(28px, 4vw, 44px)  · Display · -1.5px tracking
 * --text-h3:     22px                     · Inter 700
 * --text-lead:   19px                     · Inter 400 · muted
 * --text-body:   16px                     · Inter 400 · ink
 * --text-label:  11px                     · Inter 800 · UPPERCASE · 2.5px tracking
 */
export const typeScale = {
  hero: 'text-hero font-display tracking-tightest',
  h1: 'text-h1 font-display tracking-tighter',
  h2: 'text-h2 font-display tracking-tight',
  h3: 'text-h3 font-sans font-bold',
  lead: 'text-lead font-sans text-muted',
  body: 'text-body font-sans text-ink',
  label: 'text-label font-sans font-extrabold uppercase tracking-wide',
} as const;

// ═══════════════════════════════════════════════════════════════
// COMPOSED FONT STYLES (for inline style usage)
// ═══════════════════════════════════════════════════════════════

/**
 * Pre-composed style objects for use in inline `style` props.
 * Useful when Tailwind classes aren't available (e.g., email templates,
 * dynamically rendered content, or third-party integrations).
 */
export const fontStyles = {
  hero: {
    fontFamily: fontDisplay.style.fontFamily,
    fontWeight: 400,
    fontSize: 'clamp(52px, 7vw, 88px)',
    lineHeight: 0.92,
    letterSpacing: '-0.03em',
  },
  h1: {
    fontFamily: fontDisplay.style.fontFamily,
    fontWeight: 400,
    fontSize: 'clamp(38px, 5vw, 64px)',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontFamily: fontDisplay.style.fontFamily,
    fontWeight: 400,
    fontSize: 'clamp(28px, 4vw, 44px)',
    lineHeight: 1.1,
    letterSpacing: '-0.015em',
  },
  h3: {
    fontFamily: fontSans.style.fontFamily,
    fontWeight: 700,
    fontSize: '22px',
    lineHeight: 1.3,
  },
  lead: {
    fontFamily: fontSans.style.fontFamily,
    fontWeight: 400,
    fontSize: '19px',
    lineHeight: 1.5,
    color: '#756B73',
  },
  body: {
    fontFamily: fontSans.style.fontFamily,
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#180D24',
  },
  label: {
    fontFamily: fontSans.style.fontFamily,
    fontWeight: 800,
    fontSize: '11px',
    lineHeight: 1.2,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// FONT LOADING STATE
// ═══════════════════════════════════════════════════════════════

/**
 * Check if fonts are loaded.
 * Uses the Font Loading API (supported in all modern browsers).
 *
 * Usage:
 *   const loaded = await waitForFonts();
 */
export async function waitForFonts(timeoutMs = 3000): Promise<boolean> {
  if (!('fonts' in document)) return true;

  try {
    await Promise.race([
      document.fonts.ready,
      new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(false), timeoutMs)
      ),
    ]);
    return (
      document.fonts.check('400 16px "DM Serif Display"') &&
      document.fonts.check('400 16px "Inter"')
    );
  } catch {
    return false;
  }
}
