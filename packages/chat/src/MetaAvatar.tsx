import { cn } from '@cosxai/ui';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type ComponentProps } from 'react';

export type MetaAvatarState = 'idle' | 'listening' | 'thinking' | 'talking' | 'done' | 'error' | 'sleeping';

export type MetaAvatarProps = Omit<ComponentProps<'canvas'>, 'children' | 'width' | 'height'> & {
  /** What Meta is doing. @default "idle" */
  state?: MetaAvatarState | undefined;
  /** CSS px, at least 16. Below 34 it becomes a plain tile; below 22 only the eyes remain. @default 96 */
  size?: number | undefined;
  /** Lean and look toward the pointer. Off in lists and message gutters. @default true */
  track?: boolean | undefined;
  /** Accessible name. @default "Meta · <state>" */
  label?: string | undefined;
};

// Fallbacks when the page sets no brand variables (the COSX yellow).
const FIELD = '#FFE3A0';
const ACCENT = '#FFD166';
const RED = '#E0362F';
const INK = '#111111';
const PAPER = '#FEFDFB';
const REDUCE = '(prefers-reduced-motion: reduce)';

type Point = { x: number; y: number };

type Motion = {
  look: Point;
  lookT: Point;
  near: number;
  nearT: number;
  blink: number;
  nextBlink: number;
  glance: (Point & { until: number }) | null;
  nextGlance: number;
  lastMove: number;
  since: number;
  open: number;
  mood: number;
  think: number;
  squash: number;
  tilt: number;
  colorsAt: number;
  field: string;
  accent: string;
  red: string;
};

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
const ease = (a: number, b: number, k: number) => a + (b - a) * k;
// The cosine-infinity path (a lemniscate of Bernoulli) the thinking eyes chase along.
function lem(u: number, a: number): [number, number] {
  const s = Math.sin(u);
  const c = Math.cos(u);
  const d = 1 + s * s;
  return [(a * c) / d, (a * s * c) / d];
}

function cssColor(el: Element, name: string, fallback: string): string {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}

function initialMotion(now: number): Motion {
  return {
    look: { x: 0, y: 0 },
    lookT: { x: 0, y: 0 },
    near: 0,
    nearT: 0,
    blink: 0,
    nextBlink: now + 1500 + Math.random() * 2500,
    glance: null,
    nextGlance: now + 4000 + Math.random() * 4000,
    lastMove: 0,
    since: now,
    open: 0,
    mood: 0,
    think: 0,
    squash: 0,
    tilt: 0,
    colorsAt: -Infinity,
    field: FIELD,
    accent: ACCENT,
    red: RED,
  };
}

/** Advance the motion one frame toward the state's targets. */
function step(m: Motion, st: MetaAvatarState, track: boolean, now: number, still: boolean) {
  const t = (now - m.since) / 1000;
  const k = still ? 1 : 0.12;
  // Gaze: the pointer, or an occasional idle glance when the pointer is away.
  let tgt: Point = track ? m.lookT : { x: 0, y: 0 };
  if (!still && st === 'idle' && (!m.lastMove || now - m.lastMove > 2500)) {
    if (now > m.nextGlance) {
      m.glance = { x: (Math.random() * 2 - 1) * 0.8, y: (Math.random() * 2 - 1) * 0.4, until: now + 900 };
      m.nextGlance = now + 3500 + Math.random() * 4500;
    }
    tgt = m.glance && now < m.glance.until ? m.glance : { x: 0, y: 0 };
  }
  if (st === 'listening') tgt = { x: tgt.x * 0.6, y: Math.min(tgt.y, 0) - 0.1 };
  if (st === 'sleeping' || st === 'done') tgt = { x: 0, y: 0 };
  if (st === 'error') tgt = { x: 0, y: 0.45 };
  m.look.x = ease(m.look.x, tgt.x, k);
  m.look.y = ease(m.look.y, tgt.y, k);
  m.near = ease(m.near, st === 'sleeping' ? 0 : m.nearT, still ? 1 : 0.08);
  // Tilt: toward the pointer when near, a curious tilt while listening.
  let tiltT = (st === 'listening' ? -0.07 : 0) + m.look.x * 0.06 * (0.4 + m.near);
  if (st === 'sleeping') tiltT = 0.05;
  m.tilt = ease(m.tilt, still ? 0 : tiltT, 0.08);
  // Blink (a double blink sometimes).
  if (!still && st !== 'sleeping' && st !== 'done' && st !== 'thinking' && now > m.nextBlink) {
    m.blink = 1;
    m.nextBlink = now + (Math.random() < 0.25 ? 220 : 2400 + Math.random() * 3600);
  }
  m.blink = still ? 0 : Math.max(0, m.blink - 0.14);
  m.squash = still ? 0 : Math.max(0, m.squash - 0.045);
  let open = 0;
  if (st === 'talking') open = still ? 0.5 : 0.3 + 0.7 * Math.abs(Math.sin(t * 9.5) * Math.sin(t * 3.7 + 1));
  m.open = ease(m.open, open, still ? 1 : 0.35);
  m.mood = ease(m.mood, st === 'done' ? 1 : st === 'error' ? -1 : 0, still ? 1 : 0.16);
  m.think = ease(m.think, st === 'thinking' ? 1 : 0, still ? 1 : 0.1);
  return t;
}

/** Draw one frame onto a 100×100 design grid scaled to the canvas. */
function draw(c: CanvasRenderingContext2D, m: Motion, st: MetaAvatarState, S: number, dpr: number, t: number, still: boolean) {
  c.setTransform((dpr * S) / 100, 0, 0, (dpr * S) / 100, 0, 0);
  c.clearRect(0, 0, 100, 100);
  const tiny = S < 34;
  const micro = S < 22;
  let bx = 9;
  let by = 10;
  let bw = 82;
  let bh = 80;
  let br = 30;
  if (tiny) {
    bx = 0;
    by = 0;
    bw = 100;
    bh = 100;
    br = 22;
  }
  // Body motion: breathing, squash-and-settle, lean.
  const breathe = still ? 0 : Math.sin(t * (st === 'sleeping' ? 1.3 : st === 'thinking' ? 2.6 : 1.8)) * (st === 'idle' ? 0.008 : 0.016);
  const sq = m.squash;
  const sqY = -Math.sin(sq * Math.PI) * 0.09 * (sq > 0.5 ? 1 : -0.6);
  const sy = 1 + breathe + sqY;
  const sx = 1 - breathe * 0.7 - sqY * 0.8;
  const shake = !still && st === 'error' && t < 0.5 ? Math.sin(t * 38) * (1 - t / 0.5) * 2.2 : 0;
  c.save();
  c.translate(50 + shake, by + bh);
  c.rotate(m.tilt);
  c.scale(tiny ? 1 : sx, tiny ? 1 : sy);
  c.translate(-50, -(by + bh));
  if (!tiny) c.translate(m.look.x * 1.6 * m.near, 0);
  rr(c, bx, by, bw, bh, br);
  c.fillStyle = FIELD;
  c.fillStyle = m.field; // an unparsable value leaves the fallback
  c.fill();
  if (!tiny && m.mood > 0.05) {
    c.globalAlpha = m.mood;
    c.fillStyle = ACCENT;
    c.fillStyle = m.accent;
    c.beginPath();
    c.ellipse(26, 66, 7.5, 4.8, 0, 0, 7);
    c.ellipse(74, 66, 7.5, 4.8, 0, 0, 7);
    c.fill();
    c.globalAlpha = 1;
  }
  if (st === 'error') {
    c.fillStyle = RED;
    c.fillStyle = m.red;
    c.beginPath();
    c.arc(tiny ? 84 : 80, tiny ? 16 : 20, tiny ? 9 : 5, 0, 7);
    c.fill();
  }
  // Face.
  const fx = 50 + m.look.x * (tiny ? 6 : 8);
  const fy = 48 + m.look.y * (tiny ? 5 : 6);
  const ex = tiny ? 19 : 15;
  let erx = tiny ? 8.5 : 6.6;
  let ery = tiny ? 12.5 : 9.8;
  if (st === 'listening') {
    erx *= 1.12;
    ery *= 1.14;
  }
  ery *= 1 - m.squash * 0.25;
  c.fillStyle = INK;
  c.strokeStyle = INK;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  const lw = tiny ? 6.5 : 3.6;
  const th = m.think;
  [-1, 1].forEach((side, i) => {
    let x = fx + side * ex;
    let y = fy;
    if (th > 0.02 && !micro) {
      // The eyes shrink to dots and chase each other along the infinity path.
      const u = (still ? 0.7 : t * 2.6) + i * Math.PI;
      const p = lem(u, tiny ? 24 : 21);
      x = ease(x, 50 + p[0], th);
      y = ease(y, 46 + p[1] * 1.15, th);
      c.beginPath();
      c.ellipse(x, y, ease(erx, tiny ? 7 : 5, th), ease(ery, tiny ? 7 : 5, th), 0, 0, 7);
      c.fill();
      return;
    }
    if (st === 'sleeping') {
      c.lineWidth = lw;
      c.beginPath();
      c.arc(x, y - 3, erx, 0.18 * Math.PI, 0.82 * Math.PI);
      c.stroke();
      return;
    }
    if (m.mood > 0.5) {
      c.lineWidth = lw;
      c.beginPath();
      c.arc(x, y + 3.5, erx * 1.05, 1.12 * Math.PI, 1.88 * Math.PI);
      c.stroke();
      return;
    }
    if (m.mood < -0.5) {
      c.lineWidth = lw;
      c.beginPath();
      c.moveTo(x - erx, y + 1);
      c.lineTo(x + erx, y + 1);
      c.stroke();
      return;
    }
    const h = Math.max(1.4, ery * (1 - m.blink));
    c.beginPath();
    c.ellipse(x, y, erx, h, 0, 0, 7);
    c.fill();
    if (h > 4.5 && !micro) {
      c.fillStyle = PAPER;
      c.beginPath();
      c.arc(x + erx * 0.32 + m.look.x * 1.4, y - h * 0.42 + m.look.y * 1.2, tiny ? 2.8 : 2.1 + m.near * 0.5, 0, 7);
      c.fill();
      c.fillStyle = INK;
    }
  });
  // Mouth.
  if (!micro) {
    const mx = fx;
    const my = fy + (tiny ? 22 : 19);
    const mw = tiny ? 12 : 7.5;
    c.lineWidth = tiny ? 5 : 3.2;
    c.globalAlpha = Math.max(0, 1 - th);
    if (st === 'sleeping') {
      c.beginPath();
      c.ellipse(mx, my, 2.8, 2.1, 0, 0, 7);
      c.fill();
    } else if (m.open > 0.06) {
      c.beginPath();
      c.ellipse(mx, my, mw * 0.75, 1.5 + m.open * 5.4, 0, 0, 7);
      c.fill();
    } else if (st === 'listening' && !tiny) {
      c.beginPath();
      c.ellipse(mx, my, 3, 3.2, 0, 0, 7);
      c.fill();
    } else {
      const curve = 3.8 * m.mood + 1.6 + m.near * 1.4;
      c.beginPath();
      c.moveTo(mx - mw, my);
      c.quadraticCurveTo(mx, my + curve * 1.6, mx + mw, my);
      c.stroke();
    }
    c.globalAlpha = 1;
  }
  c.restore();
  if (st === 'sleeping' && !tiny) {
    c.fillStyle = INK;
    c.font = '600 11px Geist, system-ui, sans-serif';
    for (let z = 0; z < 2; z++) {
      const ph = still ? 0.4 + z * 0.3 : (t * 0.35 + z * 0.5) % 1;
      c.globalAlpha = Math.sin(ph * Math.PI);
      c.fillText('z', 74 + ph * 10 + z * 4, 14 - ph * 10);
    }
    c.globalAlpha = 1;
  }
}

/**
 * MetaAvatar — Meta, the COSX Agent, drawn on canvas: a field-coloured body
 * with ink eyes in seven states (idle, listening, thinking, talking, done,
 * error, sleeping). It blinks, leans toward the pointer (`track`), squashes
 * when poked, and while thinking its eyes chase each other along an
 * infinity path. Below 34px it becomes a plain tile; below 22px only the
 * eyes remain. The body takes the workspace's --brand-field (read from the
 * element, so a workspace colour applies). Under reduced motion it is drawn
 * once per state, still.
 *
 * Compose with: the Agent's message gutter (size 32, track off), the
 * empty conversation hero (72), AgentDrawer's header. Replaces AgentAvatar.
 * Port of the design project's <meta-avatar> (Claude Design, Meta Avatar).
 *
 * Forwards ref to the <canvas>; spreads `...rest` onto it.
 */
export const MetaAvatar = forwardRef<HTMLCanvasElement, MetaAvatarProps>(function MetaAvatar(
  { state = 'idle', size: sizeProp = 96, track = true, label, className, style, onPointerDown, ...rest },
  ref,
) {
  const size = Math.max(16, Math.round(sizeProp) || 96);
  const canvas = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(ref, () => canvas.current as HTMLCanvasElement);
  const motion = useRef<Motion | null>(null);
  const live = useRef({ state, size, track });
  live.current = { state, size, track };
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  const getMotion = () => (motion.current ??= initialMotion(performance.now()));

  const frame = useCallback((now: number, still: boolean) => {
    const el = canvas.current;
    const c = el?.getContext('2d');
    if (!el || !c) return;
    const m = getMotion();
    const { state: st, size: S, track: tr } = live.current;
    if (now - m.colorsAt > 800) {
      m.colorsAt = now;
      m.field = cssColor(el, '--brand-field', FIELD);
      m.accent = cssColor(el, '--brand-mark', ACCENT);
      m.red = cssColor(el, '--status-error', RED);
    }
    const t = step(m, st, tr, now, still);
    draw(c, m, st, S, window.devicePixelRatio || 1, t, still);
  }, []);

  // A new state restarts its clock; done and error land with a squash.
  const prevState = useRef(state);
  useEffect(() => {
    if (prevState.current === state) return;
    prevState.current = state;
    const m = getMotion();
    m.since = performance.now();
    if (state === 'done' || state === 'error') m.squash = state === 'done' ? 0.8 : 0.5;
  }, [state]);

  const reduce = useReducedMotion();

  // Reduced motion: one still frame whenever what it shows changes.
  useEffect(() => {
    if (reduce) frame(performance.now(), true);
  }, [reduce, state, size, frame]);

  // Otherwise: the animation loop, cancelled on unmount.
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      frame(now, false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, frame]);

  // Pointer tracking.
  useEffect(() => {
    if (reduce || !track) return;
    const onMove = (e: PointerEvent) => {
      const el = canvas.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const m = getMotion();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 240);
      m.lookT = { x: (dx / d) * k, y: (dy / d) * k };
      m.nearT = Math.max(0, 1 - d / Math.max(160, r.width * 2.2));
      m.lastMove = performance.now();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce, track]);

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={label ?? `Meta · ${state}`}
      data-state={state}
      width={Math.round(size * dpr)}
      height={Math.round(size * dpr)}
      className={cn('inline-block shrink-0 cursor-pointer align-middle [-webkit-tap-highlight-color:transparent]', className)}
      style={{ width: size, height: size, ...style }}
      onPointerDown={(e) => {
        // A poke: squash and blink.
        const m = getMotion();
        m.squash = 1;
        m.blink = 1;
        onPointerDown?.(e);
      }}
      {...rest}
    />
  );
});

/** Whether the person asked for reduced motion (live). */
function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(REDUCE).matches === true);
  useEffect(() => {
    const mq = window.matchMedia?.(REDUCE);
    if (!mq) return;
    const on = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}
