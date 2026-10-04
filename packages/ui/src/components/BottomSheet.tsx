import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type PointerEvent as ReactPointerEvent, type ReactElement, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { useReducedMotion } from './status-motion';

export type BottomSheetProps = Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title' | 'children' | 'ref'> & {
  /** Says what the sheet is for ("Switch workspace", "Language"). Labels the dialog. */
  title: ReactNode;
  /** Keep the title for screen readers only. @default false */
  hideTitle?: boolean | undefined;
  /** A line under the title, read out with it. */
  description?: ReactNode;
  /** The main button, at the end of the title row (seen at half height too). */
  action?: ReactNode;
  /** Pinned below the scrolling content, above the home indicator (a Done or Add button). */
  footer?: ReactNode;
  /**
   * "content": as tall as what it holds, up to half the screen — menus and
   * confirmations. "two": half (60%) and full — browsing and picking;
   * typing in it, scrolling its list or dragging it up lifts it to full,
   * dragging down from full goes back to half. @default "content"
   */
  detents?: 'content' | 'two' | undefined;
  children?: ReactNode;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** The element that opens it (rendered asChild). Or control `open`. */
  trigger?: ReactElement | undefined;
  /** Accessible name of the screen-reader close button (touch readers have no Esc). @default "Close" */
  closeLabel?: string | undefined;
};

// Motion & Native Feel §04: rises in 280ms, leaves in 220ms (a quarter faster).
const ENTER_MS = 280;
const EXIT_MS = 220;
const ENTER = 'cubic-bezier(.16,1,.3,1)';
const EXIT = 'cubic-bezier(.4,0,1,1)';
const RELEASE = 'cubic-bezier(.2,.8,.2,1)';
// A drag past this share of the sheet's height (at most CLOSE_MAX), or a flick, closes it.
const CLOSE_SHARE = 0.25;
const CLOSE_MAX = 120;
const FLICK = 0.6; // px per ms
// Dragged above its top, the sheet gives way at this rate.
const OVERSHOOT = 0.3;
const HALF = 0.6;

const currentY = (el: HTMLElement) => {
  try {
    return new DOMMatrixReadOnly(getComputedStyle(el).transform).m42 || 0;
  } catch {
    return 0;
  }
};

/**
 * BottomSheet — the phone's sheet: a page-coloured sheet rising from the
 * bottom with a drag handle and a title (Metaroom Agent phone: switch
 * workspace, language, an object's menu; link files, with two heights).
 * 20px top corners over the scrim; the bottom padding clears the home
 * indicator (safe area). Rises in 280ms and leaves in 220ms. Drag the
 * handle or the title row down, or flick, to close (from full height: back
 * to half); Esc, a tap on the scrim and the screen-reader close button
 * close it too. Built on Radix Dialog: focus moves in, is trapped and
 * returns to the opener.
 *
 * Compose with: BottomTabs (the Me tab opens it), rows of 48–56px buttons
 * inside. On desktop use Popover or DialogContent instead.
 */
export function BottomSheet({
  title,
  hideTitle = false,
  description,
  action,
  footer,
  detents = 'content',
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  closeLabel = 'Close',
  className,
  style,
  onOpenAutoFocus,
  onFocusCapture,
  ...rest
}: BottomSheetProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const reduce = useReducedMotion();
  // Mounted while open and while leaving (the exit plays before it goes)
  const [mounted, setMounted] = useState(open);
  const [full, setFull] = useState(false);
  const sheet = useRef<HTMLDivElement | null>(null);
  const scrim = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ y0: number; t0: number } | null>(null);
  const entering = useRef(open);

  useLayoutEffect(() => {
    if (open) {
      entering.current = true;
      setMounted(true);
      setFull(false);
      return;
    }
    if (!mounted) return;
    const el = sheet.current;
    if (!el || reduce || typeof el.animate !== 'function') {
      setMounted(false);
      return;
    }
    // The scrim's leaving is a CSS animation: listeners (a status bar
    // following the page) hear it start, as with Dialog's
    scrim.current?.setAttribute('data-leaving', '');
    const from = currentY(el) || parseFloat(el.style.transform.replace(/[^\d.-]/g, '')) || 0;
    el.style.transform = '';
    el.animate([{ transform: `translateY(${from}px)` }, { transform: 'translateY(100%)' }], { duration: EXIT_MS, easing: EXIT, fill: 'forwards' }).onfinish = () => setMounted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Radix puts the content on the page a render after ours: the rise starts when it arrives
  const setSheet = (el: HTMLDivElement | null) => {
    sheet.current = el;
    if (!el || !entering.current) return;
    entering.current = false;
    if (reduce || typeof el.animate !== 'function') return;
    el.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: ENTER_MS, easing: ENTER });
  };

  useEffect(() => () => void (drag.current = null), []);

  const height = () => sheet.current?.offsetHeight ?? 0;
  const settle = () => {
    const el = sheet.current;
    if (!el) return;
    const from = el.style.transform;
    el.style.transform = '';
    if (from && !reduce && typeof el.animate === 'function') {
      el.animate([{ transform: from }, { transform: 'translateY(0)' }], { duration: 200, easing: RELEASE });
    }
  };
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, a, input, textarea, select')) return;
    drag.current = { y0: e.clientY, t0: performance.now() };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || !sheet.current) return;
    const raw = e.clientY - d.y0;
    const dy = raw < 0 ? raw * OVERSHOOT : raw;
    sheet.current.style.transform = `translateY(${dy}px)`;
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dist = e.clientY - d.y0;
    const speed = dist / Math.max(1, performance.now() - d.t0);
    const h = height();
    const limit = h > 0 ? Math.min(CLOSE_MAX, h * CLOSE_SHARE) : CLOSE_MAX;
    const down = dist > limit || (dist > 8 && speed > FLICK);
    if (down && detents === 'two' && full) {
      setFull(false);
      settle();
    } else if (down) {
      setOpen(false);
    } else {
      if (detents === 'two' && !full && (dist < -24 || speed < -FLICK)) setFull(true);
      settle();
    }
  };

  const two = detents === 'two';
  return (
    // Open while shown, leaving included; the trigger stays the same element throughout
    <DialogPrimitive.Root open={mounted} onOpenChange={(o) => (o ? setOpen(true) : open && setOpen(false))}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      {mounted && (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay ref={scrim} className="cosx-sheet-scrim fixed inset-0 z-50 bg-scrim" />
        <DialogPrimitive.Content
          ref={setSheet}
          {...(description ? {} : { 'aria-describedby': undefined })}
          onOpenAutoFocus={(e) => {
            onOpenAutoFocus?.(e);
            if (e.defaultPrevented) return;
            // The sheet itself takes focus (read out by its title), not the first row.
            e.preventDefault();
            (e.currentTarget as HTMLElement | null)?.focus();
          }}
          // Typing lifts a two-height sheet to full (the keyboard needs the room)
          onFocusCapture={(e) => {
            onFocusCapture?.(e);
            if (two && (e.target as HTMLElement).matches('input, textarea')) setFull(true);
          }}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[20px] bg-page px-4 pt-2 font-sans text-fg outline-none',
            two ? 'transition-[height] duration-300 ease-[cubic-bezier(.2,0,0,1)]' : 'max-h-[90dvh]',
            className,
          )}
          style={{
            paddingBottom: footer ? 'max(16px, calc(env(safe-area-inset-bottom, 0px) + 8px))' : 'max(30px, calc(env(safe-area-inset-bottom, 0px) + 12px))',
            ...(two ? { height: full ? 'calc(100dvh - env(safe-area-inset-top, 0px) - 8px)' : `${HALF * 100}dvh` } : {}),
            ...style,
          }}
          {...rest}
        >
          <div
            data-sheet-drag=""
            className="flex shrink-0 cursor-grab touch-none flex-col select-none active:cursor-grabbing"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={() => {
              drag.current = null;
              settle();
            }}
          >
            <span aria-hidden className="mb-2.5 h-1 w-9 self-center rounded-pill bg-rule" />
            <div className="flex items-center gap-3">
              <DialogPrimitive.Title className={cn('m-0 min-w-0 flex-1 truncate px-1 pb-2 text-[17px] leading-[1.3] font-medium', hideTitle && 'sr-only')}>{title}</DialogPrimitive.Title>
              {action && <div className="shrink-0 pb-2">{action}</div>}
            </div>
            {description && <DialogPrimitive.Description className="m-0 px-1 pb-2 text-small text-fg-secondary">{description}</DialogPrimitive.Description>}
          </div>
          <div
            className={cn('flex min-h-0 flex-1 flex-col gap-0.5', two && !full ? 'overflow-hidden' : 'overflow-y-auto overscroll-contain')}
            // At half height, a pull up on the list lifts the sheet first
            onWheel={(e) => two && !full && e.deltaY > 0 && setFull(true)}
            onTouchMove={() => two && !full && setFull(true)}
          >
            {children}
          </div>
          {footer && <div className="shrink-0 border-t border-rule-soft pt-2.5">{footer}</div>}
          <DialogPrimitive.Close className="sr-only">{closeLabel}</DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
      )}
    </DialogPrimitive.Root>
  );
}
