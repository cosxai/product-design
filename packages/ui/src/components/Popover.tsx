import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';

/** Popover root: `open` / `onOpenChange`, or uncontrolled with PopoverTrigger. */
export const Popover = PopoverPrimitive.Root;
/** The element that opens it (asChild onto a Button or IconButton). Focus returns here on close. */
export const PopoverTrigger = PopoverPrimitive.Trigger;
/** Positions the content against something other than the trigger (a row, a caret). */
export const PopoverAnchor = PopoverPrimitive.Anchor;
/** Closes the popover (asChild onto a Done button). */
export const PopoverClose = PopoverPrimitive.Close;

export type PopoverContentProps = ComponentProps<typeof PopoverPrimitive.Content> & {
  /** Keep it in the tree without a portal (inside a dialog that must contain it). @default false */
  inline?: boolean | undefined;
};

/**
 * PopoverContent — a small non-modal panel next to its trigger: the files of
 * a conversation, a workspace switcher, the account card (Metaroom Agent).
 * Page colour, 14px corners, a hairline edge; no shadow (3.0 has none).
 * Renders in a portal and flips to stay in view (placement auto, Radix
 * Popover); Esc and an outside click close it and focus returns to the
 * trigger.
 *
 * Compose with: PopoverTrigger asChild onto an IconButton / AppRail slot;
 * Menu for a list of actions instead (it brings arrow-key navigation).
 */
export function PopoverContent({ className, sideOffset = 6, collisionPadding = 8, align = 'start', inline = false, ...rest }: PopoverContentProps) {
  const content = (
    <PopoverPrimitive.Content
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      align={align}
      className={cn(
        'z-[60] w-[320px] max-w-[calc(100vw-16px)] overflow-y-auto rounded-[14px] border border-rule bg-page p-2 font-sans text-ui text-fg outline-none',
        'max-h-(--radix-popover-content-available-height)',
        className,
      )}
      {...rest}
    />
  );
  return inline ? content : <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>;
}
