import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';
import { IconButton } from './IconButton';

/** Dialog root: `open` / `onOpenChange` (or uncontrolled with DialogTrigger). */
export const Dialog = DialogPrimitive.Root;
/** The element that opens it (asChild onto a Button). Focus returns here on close. */
export const DialogTrigger = DialogPrimitive.Trigger;
/** Closes the dialog (asChild onto the Cancel button). */
export const DialogClose = DialogPrimitive.Close;

const WIDTH = { sm: 'sm:max-w-[400px]', md: 'sm:max-w-[520px]', lg: 'sm:max-w-[640px]' } as const;

const MOBILE = {
  // Confirmations stay centred.
  center: 'max-sm:left-4 max-sm:right-4 max-sm:top-1/2 max-sm:-translate-y-1/2 max-sm:rounded-lg',
  // Long forms push in full screen.
  page: 'max-sm:inset-0 max-sm:max-h-none max-sm:rounded-none max-sm:border-0',
  // Light choices become a bottom sheet.
  sheet: 'max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-t-lg max-sm:rounded-b-none max-sm:border-b-0',
} as const;

export type DialogContentProps = Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title'> & {
  /** A question or an action: "Revoke this share?" — the primary repeats its verb. Labels the dialog. */
  title: ReactNode;
  /** A line above the title. */
  eyebrow?: ReactNode;
  /** The consequence, read out with the title ("Anna loses access now."). */
  description?: ReactNode;
  /** Actions, bottom right: secondary left, primary right. A destructive primary is Button variant="danger". */
  footer?: ReactNode;
  /** sm 400 (confirm) · md 520 (form, up to five fields) · lg 640. @default "md" */
  size?: keyof typeof WIDTH | undefined;
  /** How it shows on phones: center (confirmations) · page (long forms) · sheet (light choices). @default "center" */
  mobile?: keyof typeof MOBILE | undefined;
  /** Accessible name of the close button. @default "Close" */
  closeLabel?: string | undefined;
  hideClose?: boolean | undefined;
};

/**
 * DialogContent — something that interrupts the task and needs an answer.
 * Page colour lifted by the scrim; 16px corners; no shadow. Focus moves in,
 * is trapped, and returns to the trigger; Esc closes only the top layer
 * (Radix Dialog). Otherwise prefer a side panel, an inline expansion or a
 * toast.
 */
export function DialogContent({
  title,
  eyebrow,
  description,
  footer,
  size = 'md',
  mobile = 'center',
  closeLabel = 'Close',
  hideClose = false,
  className,
  children,
  onOpenAutoFocus,
  ...rest
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-scrim" />
      <DialogPrimitive.Content
        /* Radix links the Description itself; without one, opt out so no
           dangling reference (and no warning) remains. */
        {...(description ? {} : { 'aria-describedby': undefined })}
        /* Focus the dialog itself on open (read out by its title), not the
           close button: no ring before the person has done anything. Tab
           then reaches the controls; focus stays trapped. */
        onOpenAutoFocus={(e) => {
          onOpenAutoFocus?.(e);
          if (e.defaultPrevented) return;
          e.preventDefault();
          (e.currentTarget as HTMLElement | null)?.focus();
        }}
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-48px)] w-[calc(100%-48px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden',
          'rounded-lg border border-rule bg-page font-sans text-fg outline-none',
          WIDTH[size],
          MOBILE[mobile],
          mobile !== 'center' && 'max-sm:translate-x-0 max-sm:translate-y-0 max-sm:w-auto max-sm:top-auto max-sm:left-0',
          mobile === 'page' && 'max-sm:top-0',
          className,
        )}
        {...rest}
      >
        <div className="flex items-start gap-4 px-7 pt-6">
          <div className="min-w-0 flex-1">
            {eyebrow && <div className="mb-2.5 text-meta font-medium text-fg-secondary">{eyebrow}</div>}
            <DialogPrimitive.Title className="m-0 text-[21px] leading-[1.2] font-medium tracking-heading">{title}</DialogPrimitive.Title>
          </div>
          {!hideClose && (
            <DialogPrimitive.Close asChild>
              <IconButton icon={X} label={closeLabel} size="sm" className="-mt-1 -mr-2" />
            </DialogPrimitive.Close>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-7 pt-3.5 pb-6 text-small leading-relaxed text-fg-secondary">
          {description && <DialogPrimitive.Description className="m-0">{description}</DialogPrimitive.Description>}
          {children && <div className={description ? 'mt-3' : undefined}>{children}</div>}
        </div>
        {footer && <div className="flex justify-end gap-2.5 border-t border-rule bg-sunk px-7 py-4 max-sm:flex-col-reverse">{footer}</div>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
