import { useEffect, useId, useRef } from 'react';

import { LOOP } from './logo-art';

/**
 * BrandLoader — the COSX loop as a loading indicator (Claude Design, COSX
 * Loader). A short stroke runs along the loop, blooms into the full mark,
 * holds 0.6 s, gathers back and runs again: 3.4 s a round, the head's
 * speed continuous. At rest it is the logo itself — the fill is the logo
 * path, the stroke only a mask over it.
 *
 * For whole-page and start-up waits, where the brand belongs. Buttons,
 * rows, inputs and anything under 24 px wide keep Spinner or a skeleton.
 * Reduced motion: the full mark, still.
 */
export type BrandLoaderProps = {
  /** Width in px (height follows the mark: 106 / 202). Default 48; 24 at least. */
  size?: number | undefined;
  /**
   * ink on paper and yellow; linen or accent on ink; current follows the
   * text colour (light and dark themes alike). The mark is never yellow on paper.
   */
  tone?: 'ink' | 'linen' | 'accent' | 'current' | undefined;
  /** The faint full mark under the stroke (default on), so it always reads as COSX. */
  track?: boolean | undefined;
  /** 1 = a 3.4 s round. */
  speed?: number | undefined;
  /** What is loading, for assistive tech. Default "Loading". */
  label?: string | undefined;
  className?: string | undefined;
};

const TONES = {
  ink: ['#111111', 'rgba(17,17,17,.12)'],
  linen: ['#F5F2EC', 'rgba(245,242,236,.16)'],
  accent: ['#FFD166', 'rgba(255,209,102,.18)'],
  current: ['currentColor', 'currentColor'],
} as const;

// The stroke's centre line: the C counter-clockwise, the diagonal, the O
// clockwise, then back across the open gap.
const R = 38.3;
const LC = [96.12, 144.62] as const;
const RC = [193.32, 144.62] as const;
const pt = (c: readonly [number, number], deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(c[0] + R * Math.cos(a)).toFixed(2)},${(c[1] + R * Math.sin(a)).toFixed(2)}`;
};
const CENTRE = `M${pt(LC, -42)} A${R},${R} 0 1,0 ${pt(LC, 48)} L${pt(RC, 214)} A${R},${R} 0 0,1 ${pt(RC, 34)} A${R},${R} 0 0,1 ${pt(RC, 214)} L${pt(LC, -42)} Z`;

// Seconds: run, bloom, hold, gather; SEG = the running stroke's share of the loop.
const RUN = 1.5;
const GROW = 0.7;
const HOLD = 0.6;
const SHRINK = 0.6;
const T = RUN + GROW + HOLD + SHRINK;
const SEG = 0.14;
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const easeInOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);

/** Head position h (in loop lengths) and visible share s (0..1) at t seconds. */
export function loaderState(t: number): { h: number; s: number } {
  const c = Math.floor(t / T);
  let u = t - c * T;
  const base = c * (RUN + GROW / 2 + SHRINK / 2);
  if (u < RUN) return { h: base + u, s: SEG };
  u -= RUN;
  if (u < GROW) {
    const g = u / GROW;
    return { h: base + RUN + GROW * (g - (g * g) / 2), s: SEG + (1 - SEG) * easeOut(g) };
  }
  u -= GROW;
  if (u < HOLD) return { h: base + RUN + GROW / 2, s: 1 };
  u -= HOLD;
  const k = u / SHRINK;
  return { h: base + RUN + GROW / 2 + (SHRINK * k * k) / 2, s: 1 - (1 - SEG) * easeInOut(k) };
}

export function BrandLoader({ size = 48, tone = 'ink', track = true, speed = 1, label = 'Loading', className }: BrandLoaderProps) {
  const maskId = `cosx-loader-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const stroke = useRef<SVGPathElement>(null);
  const [fill, faint] = TONES[tone];

  useEffect(() => {
    const c = stroke.current;
    if (!c || typeof c.getTotalLength !== 'function') return undefined;
    const L = c.getTotalLength();
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const st = still?.matches ? { h: 0, s: 1 } : loaderState(((now - t0) / 1000) * speed);
      const s = Math.min(1, st.s);
      const tail = (((st.h - s) % 1) + 1) % 1;
      c.setAttribute('stroke-dasharray', s >= 0.999 ? `${L} 0` : `${(s * L).toFixed(2)} ${((1 - s) * L).toFixed(2)}`);
      c.setAttribute('stroke-dashoffset', (-tail * L).toFixed(2));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="44 92 202 106"
      width={size}
      height={Number(((size * 106) / 202).toFixed(1))}
      className={className}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="30" y="80" width="230" height="130">
          <path ref={stroke} d={CENTRE} fill="none" stroke="#fff" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" />
        </mask>
      </defs>
      {track && <path d={LOOP.paths[0]} fill={faint} fillOpacity={tone === 'current' ? 0.12 : undefined} />}
      <path d={LOOP.paths[0]} fill={fill} mask={`url(#${maskId})`} />
    </svg>
  );
}
