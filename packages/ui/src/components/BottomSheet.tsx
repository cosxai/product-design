import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useCallback, useEffect, useRef, useState, type ComponentProps, type PointerEvent as ReactPointerEvent, type ReactElement, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { useReducedMotion } from './status-motion';

export type BottomSheetProps = Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title' | 'children' | 'ref'> & {
  /** Says what the sheet is for ("Switch workspace", "Language"). Labels the dialog. */
  title: ReactNode;
  /** Keep the title for screen readers only. @default false */
  hideTitle?: boolean | undefined;
  /** A line under the title, read out with it. */
  description?: ReactNode;
  children?: ReactNode;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** The element that opens it (rendered asChild). Or control `open`. */
  trigger?: ReactElement | undefined;
  /** Accessible name of the screen-reader close button (touch readers have no Esc). @default "Close" */
  closeLabel?: string | undefined;
};

// A drag past this share of the sheet's height, or a flick, closes it.
const CLOSE_SHARE = 0.25;
const CLOSE_MAX = 120;
const FLICK = 0.6; // px per ms

/**
 * BottomSheet — the phone's light choice: a page-coloured sheet rising from
 * the bottom with a drag handle and a title (Metaroom Agent phone: switch
 * workspace, language). 20px top corners over the scrim; the bottom padding
 * clears the home indicator (safe area). Drag the handle or the title down,
 * or flick, to close; Esc, a tap on the scrim and the screen-reader close
 * button close it too. Built on Radix Dialog: focus moves in, is trapped and
 * returns to the opener.
 *
 * Compose with: BottomTabs (the Me tab opens it), rows of 48–56px buttons
 * inside. On desktop use Popover or DialogContent instead.
 */
export function BottomSheet({
  title,
  hideTitle = false,
  description,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  closeLabel = 'Close',
  className,
  style,
  onOpenAutoFocus,
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
  const sheet = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ y0: number; t0: number } | null>(null);
  const [dy, setDy] = useState(0);
  const [settling, setSettling] = useState(false);

  useEffect(() => {
    if (!open) setDy(0);
  }, [open]);

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    drag.current = { y0: e.clientY, t0: performance.now() };
    setSettling(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current) setDy(Math.max(0, e.clientY - drag.current.y0));
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dist = Math.max(0, e.clientY - d.y0);
    const speed = dist / Math.max(1, performance.now() - d.t0);
    const height = sheet.current?.offsetHeight ?? 0;
    const limit = height > 0 ? Math.min(CLOSE_MAX, height * CLOSE_SHARE) : CLOSE_MAX;
    setSettling(true);
    if (dist > limit || (dist > 8 && speed > FLICK)) setOpen(false);
    else setDy(0);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-scrim" />
        <DialogPrimitive.Content
          ref={sheet}
          {...(description ? {} : { 'aria-describedby': undefined })}
          onOpenAutoFocus={(e) => {
            onOpenAutoFocus?.(e);
            if (e.defaultPrevented) return;
            // The sheet itself takes focus (read out by its title), not the first row.
            e.preventDefault();
            const el = e.currentTarget as HTMLElement | null;
            el?.focus();
            if (!reduce && el && typeof el.animate === 'function') {
              el.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 240, easing: 'cubic-bezier(.16,1,.3,1)' });
            }
          }}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col rounded-t-[20px] bg-page px-4 pt-2 font-sans text-fg outline-none',
            settling && !reduce && 'transition-transform duration-200 ease-out',
            className,
          )}
          style={{
            paddingBottom: 'max(30px, calc(env(safe-area-inset-bottom, 0px) + 12px))',
            ...(dy ? { transform: `translateY(${dy}px)` } : {}),
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
              setSettling(true);
              setDy(0);
            }}
          >
            <span aria-hidden className="mb-2.5 h-1 w-9 self-center rounded-pill bg-rule" />
            <DialogPrimitive.Title className={cn('m-0 px-1 pb-2 text-[17px] leading-[1.3] font-medium', hideTitle && 'sr-only')}>{title}</DialogPrimitive.Title>
            {description && <DialogPrimitive.Description className="m-0 px-1 pb-2 text-small text-fg-secondary">{description}</DialogPrimitive.Description>}
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">{children}</div>
          <DialogPrimitive.Close className="sr-only">{closeLabel}</DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
