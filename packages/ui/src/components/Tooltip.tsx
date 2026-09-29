import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ReactElement, ReactNode } from 'react';

import { cn } from '../lib/cn';

/** Shares the open delay across tooltips (moving between them is instant). Optional: each Tooltip brings one. */
export const TooltipProvider = TooltipPrimitive.Provider;

export type TooltipProps = {
  /** The hint. Never the only way to reach information — a disabled reason also goes in the page or aria. */
  content: ReactNode;
  /** One focusable element (a button, a link). */
  children: ReactElement;
  /** Preferred side; flips to fit (placement auto). @default "top" */
  side?: 'top' | 'bottom' | 'left' | 'right' | undefined;
  align?: 'start' | 'center' | 'end' | undefined;
  /** ms before it opens on hover; on keyboard focus it opens at once. @default 300 */
  delay?: number | undefined;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  className?: string | undefined;
};

/**
 * Tooltip — an ink chip with linen text; no shadow. Opens on hover and on
 * keyboard focus, closes on Esc; flips to stay in view (Radix Tooltip).
 * On an ink page it inverts to linen.
 */
export function Tooltip({ content, children, side = 'top', align = 'center', delay = 300, open, defaultOpen, onOpenChange, className }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delay}>
      <TooltipPrimitive.Root
        {...(open !== undefined ? { open } : {})}
        {...(defaultOpen !== undefined ? { defaultOpen } : {})}
        {...(onOpenChange ? { onOpenChange } : {})}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={6}
            collisionPadding={8}
            className={cn(
              'z-[70] max-w-[260px] rounded-md bg-ink px-[9px] py-[5px] font-sans text-meta leading-[1.4] text-linen',
              'ink:bg-linen ink:text-ink',
              className,
            )}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
