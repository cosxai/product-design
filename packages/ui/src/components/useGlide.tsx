import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type ComponentProps, type RefObject } from 'react';

import { cn } from '../lib/cn';

/** x — a row of items (tabs, segments); y — a column (rail, list). */
export type GlideAxis = 'x' | 'y';

export type GlideOptions = {
  /** The direction the items run. `auto` follows the larger move. @default "auto" */
  axis?: GlideAxis | 'auto' | undefined;
  /** No indicator: items paint their own selection. */
  disabled?: boolean | undefined;
};

export type Glide = {
  /**
   * The indicator sits on the selection. While true the selected item must
   * not paint its own selected background — the indicator is it
   * (`on && !glide.active && 'bg-brand-field'`).
   */
  active: boolean;
  /** For GlideIndicator (or your own element, absolutely positioned). */
  indicatorRef: RefObject<HTMLSpanElement | null>;
};

/** The attribute that names an item for useGlide: put it on the element that carries the selected background. */
export const GLIDE_KEY = 'data-glide-key';

const EASE = 'cubic-bezier(.16,1,.3,1)';

/**
 * The B "stretch then close" transition (Motion & Native Feel §07c): the
 * leading edge moves first (200ms), the trailing edge follows 50ms later
 * and closes in over 300ms + 40ms per item beyond the first (capped at 6) —
 * the farther the jump the longer it stretches. Cross-axis edges 240ms. All
 * ease-out, no overshoot.
 */
export function glideTransition(axis: GlideAxis, forward: boolean, distance: number): string {
  const trail = Math.round(300 + 40 * Math.min(6, Math.max(0, distance - 1)));
  const [start, end, c1, c2] = axis === 'y' ? ['top', 'bottom', 'left', 'right'] : ['left', 'right', 'top', 'bottom'];
  const lead = forward ? end : start;
  const follow = forward ? start : end;
  return `${lead} 200ms ${EASE}, ${follow} ${trail}ms ${EASE} 50ms, ${c1} 240ms ${EASE}, ${c2} 240ms ${EASE}, border-radius 200ms ${EASE}`;
}

type Box = { left: number; top: number; right: number; bottom: number; width: number; height: number };

/** el's box as insets from the container's padding box, in its scrolled content — what an absolutely placed child uses. */
function measure(c: HTMLElement, el: HTMLElement): Box {
  const cr = c.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const left = r.left - cr.left - c.clientLeft + c.scrollLeft;
  const top = r.top - cr.top - c.clientTop + c.scrollTop;
  return { left, top, right: c.clientWidth - left - r.width, bottom: c.clientHeight - top - r.height, width: r.width, height: r.height };
}

const same = (a: Box, b: Box) =>
  Math.abs(a.left - b.left) < 0.5 && Math.abs(a.top - b.top) < 0.5 && Math.abs(a.right - b.right) < 0.5 && Math.abs(a.bottom - b.bottom) < 0.5;

function items(c: HTMLElement): HTMLElement[] {
  return Array.from(c.querySelectorAll<HTMLElement>(`[${GLIDE_KEY}]`));
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/**
 * useGlide — one shared selected block that moves between items instead of
 * the selection blinking (Motion & Native Feel §07c, "stretch then close").
 *
 * Mark each selectable item with `data-glide-key={key}` (on the element
 * that carries the selected background), render a GlideIndicator inside
 * the container, and drop the item's own selected background while
 * `glide.active`. The first placement, a resize, a change in the list
 * that moves the selection, and reduced motion all jump without animating;
 * a new key glides — from wherever the block is, so fast clicks retarget
 * instead of queueing. The block takes the selected item's border radius.
 *
 * The container is made `position: relative` (if static) and
 * `isolation: isolate`, and the block sits at z-index -1 behind the items.
 * In a scrolling list make the scroller itself the container: the block
 * lives in its content and scrolls with it.
 *
 *   const listRef = useRef<HTMLDivElement>(null);
 *   const glide = useGlide(listRef, selectedId, { axis: 'y' });
 *   <div ref={listRef} className="overflow-y-auto">
 *     <GlideIndicator glide={glide} />
 *     {rows.map((r) => (
 *       <button key={r.id} data-glide-key={r.id}
 *         className={cn('rounded-md', r.id === selectedId && !glide.active && 'bg-brand-field')} />
 *     ))}
 *   </div>
 */
export function useGlide(
  containerRef: RefObject<HTMLElement | null>,
  selectedKey: string | null | undefined,
  { axis = 'auto', disabled = false }: GlideOptions = {},
): Glide {
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(false);
  // The last target placed — key and box.
  const last = useRef<{ key: string; box: Box } | null>(null);
  const keyRef = useRef(selectedKey);
  keyRef.current = selectedKey;

  const place = useCallback(
    (instant: boolean) => {
      const c = containerRef.current;
      const ind = indicatorRef.current;
      if (!c || !ind) return;
      const key = disabled ? null : keyRef.current;
      const list = key == null ? [] : items(c);
      const target = list.find((el) => el.getAttribute(GLIDE_KEY) === key);
      if (key == null || !target) {
        ind.style.transition = 'none';
        ind.style.opacity = '0';
        last.current = null;
        setActive(false);
        return;
      }
      if (getComputedStyle(c).position === 'static') c.style.position = 'relative';
      c.style.isolation = 'isolate';
      const box = measure(c, target);
      const prev = last.current;
      if (prev && prev.key === key && same(prev.box, box) && ind.style.opacity === '1') return;

      let transition = 'none';
      if (!instant && prev && prev.key !== key && !reduced()) {
        // From where the block is now (mid-flight on a fast click).
        const now = measure(c, ind);
        const dx = box.left + box.width / 2 - (now.left + now.width / 2);
        const dy = box.top + box.height / 2 - (now.top + now.height / 2);
        const ax = axis === 'auto' ? (Math.abs(dy) > Math.abs(dx) ? 'y' : 'x') : axis;
        const from = list.findIndex((el) => el.getAttribute(GLIDE_KEY) === prev.key);
        const distance = from < 0 ? 1 : Math.abs(list.indexOf(target) - from);
        transition = glideTransition(ax, ax === 'y' ? dy > 0 : dx > 0, distance);
      }
      ind.style.transition = transition;
      ind.style.borderRadius = getComputedStyle(target).borderRadius || '';
      ind.style.left = `${box.left}px`;
      ind.style.top = `${box.top}px`;
      ind.style.right = `${box.right}px`;
      ind.style.bottom = `${box.bottom}px`;
      ind.style.opacity = '1';
      last.current = { key, box };
      setActive(true);
    },
    [containerRef, axis, disabled],
  );

  // Every render: a new key glides; the same key in a new place snaps.
  useLayoutEffect(() => {
    place(false);
  });

  // Resizes and list changes outside this component's renders snap.
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    let frame = 0;
    const snap = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        place(true);
      });
    };
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(snap);
    ro?.observe(c);
    const mo = typeof MutationObserver === 'undefined' ? null : new MutationObserver(snap);
    mo?.observe(c, { childList: true, subtree: true });
    window.addEventListener('resize', snap);
    return () => {
      cancelAnimationFrame(frame);
      ro?.disconnect();
      mo?.disconnect();
      window.removeEventListener('resize', snap);
    };
  }, [containerRef, place]);

  return { active, indicatorRef };
}

export type GlideIndicatorProps = Omit<ComponentProps<'span'>, 'ref' | 'children'> & {
  glide: Glide;
};

/**
 * GlideIndicator — the shared selected block useGlide moves: the brand
 * field (--brand-field, so a workspace's colour carries), behind the items,
 * hidden until placed. Render it once, inside the container useGlide
 * watches. `className` can recolour it (`bg-selected`) — its position and
 * radius are useGlide's.
 */
export const GlideIndicator = forwardRef<HTMLSpanElement, GlideIndicatorProps>(function GlideIndicator({ glide, className, ...rest }, ref) {
  useImperativeHandle(ref, () => glide.indicatorRef.current as HTMLSpanElement);
  return (
    <span
      ref={glide.indicatorRef}
      aria-hidden
      data-glide-indicator=""
      className={cn('pointer-events-none absolute z-[-1] bg-brand-field opacity-0', className)}
      {...rest}
    />
  );
});
