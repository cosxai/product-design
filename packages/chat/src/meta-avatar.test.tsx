import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { a11y } from '../test/a11y';
import { MetaAvatar, type MetaAvatarState } from './MetaAvatar';

const STATES: MetaAvatarState[] = ['idle', 'listening', 'thinking', 'talking', 'done', 'error', 'sleeping'];

type Call = { name: string; args: unknown[] };

/** A 2D context that records calls and fillStyle writes (jsdom has no canvas). */
function stubContext() {
  const calls: Call[] = [];
  const fills: string[] = [];
  const target = {} as Record<string, unknown>;
  const ctx = new Proxy(target, {
    get(_, key: string) {
      if (key in target) return target[key];
      return (...args: unknown[]) => calls.push({ name: key, args });
    },
    set(_, key: string, value: unknown) {
      if (key === 'fillStyle') fills.push(String(value));
      target[key] = value;
      return true;
    },
  });
  return { ctx, calls, fills };
}

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: reduce && q.includes('reduce'),
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

let stub: ReturnType<typeof stubContext>;

beforeEach(() => {
  stub = stubContext();
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => stub.ctx as unknown as CanvasRenderingContext2D);
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('MetaAvatar', () => {
  it('renders a canvas of the size, named by its state', () => {
    mockReducedMotion(false);
    const { rerender } = render(<MetaAvatar size={72} />);
    const cv = screen.getByRole('img', { name: 'Meta · idle' });
    expect(cv.tagName).toBe('CANVAS');
    expect(cv.style.width).toBe('72px');
    expect(cv.style.height).toBe('72px');
    expect(cv.getAttribute('width')).toBe(String(Math.round(72 * (window.devicePixelRatio || 1))));
    for (const s of STATES) {
      rerender(<MetaAvatar size={72} state={s} />);
      expect(screen.getByRole('img')).toHaveAccessibleName(`Meta · ${s}`);
      expect(screen.getByRole('img')).toHaveAttribute('data-state', s);
    }
    rerender(<MetaAvatar size={72} state="thinking" label="Meta · 思考中" />);
    expect(screen.getByRole('img', { name: 'Meta · 思考中' })).toBeInTheDocument();
  });

  it('clamps the size to at least 16px', () => {
    mockReducedMotion(true);
    render(<MetaAvatar size={8} />);
    expect(screen.getByRole('img').style.width).toBe('16px');
  });

  it('animates with requestAnimationFrame and cancels it on unmount', () => {
    mockReducedMotion(false);
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 42);
    const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    const { unmount } = render(<MetaAvatar />);
    expect(raf).toHaveBeenCalled();
    unmount();
    expect(cancel).toHaveBeenCalledWith(42);
  });

  it('under reduced motion draws one still frame per change and never loops', () => {
    mockReducedMotion(true);
    const raf = vi.spyOn(window, 'requestAnimationFrame');
    const { rerender } = render(<MetaAvatar state="thinking" />);
    expect(raf).not.toHaveBeenCalled();
    const frames = () => stub.calls.filter((c) => c.name === 'clearRect').length;
    expect(frames()).toBe(1);
    rerender(<MetaAvatar state="talking" />);
    expect(frames()).toBe(2);
    expect(raf).not.toHaveBeenCalled();
  });

  it('paints the body in --brand-field, falling back to the COSX yellow', () => {
    mockReducedMotion(true);
    const { unmount } = render(<MetaAvatar />);
    expect(stub.fills).toContain('#FFE3A0');
    expect(stub.fills).not.toContain('#D6E4DA');
    unmount();
    stub.fills.length = 0;
    render(<MetaAvatar style={{ ['--brand-field' as string]: '#D6E4DA' }} />);
    expect(stub.fills).toContain('#D6E4DA');
  });

  it('becomes a tile below 34px and eyes only below 22px', () => {
    mockReducedMotion(true);
    const bodyStart = () => stub.calls.find((c) => c.name === 'moveTo')!.args;
    const mouth = () => stub.calls.some((c) => c.name === 'quadraticCurveTo');

    const { unmount } = render(<MetaAvatar size={34} />);
    expect(bodyStart()).toEqual([39, 10]); // inset body, 30 corners
    expect(mouth()).toBe(true);
    unmount();

    stub.calls.length = 0;
    const tile = render(<MetaAvatar size={33} />);
    expect(bodyStart()).toEqual([22, 0]); // full-bleed tile, 22 corners
    expect(mouth()).toBe(true);
    tile.unmount();

    stub.calls.length = 0;
    render(<MetaAvatar size={21} />);
    expect(bodyStart()).toEqual([22, 0]);
    expect(mouth()).toBe(false);
  });

  it('follows the pointer only when tracking', () => {
    mockReducedMotion(false);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    const add = vi.spyOn(window, 'addEventListener');
    const { rerender } = render(<MetaAvatar track={false} />);
    expect(add.mock.calls.some(([type]) => type === 'pointermove')).toBe(false);
    rerender(<MetaAvatar />);
    expect(add.mock.calls.some(([type]) => type === 'pointermove')).toBe(true);
  });

  it('passes axe', async () => {
    mockReducedMotion(true);
    const { container } = render(<MetaAvatar state="listening" size={32} track={false} />);
    expect(await a11y(container)).toHaveNoViolations();
  });
});
