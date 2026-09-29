import { X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';

export type TagProps = Omit<ComponentProps<'span'>, 'children'> & {
  children: ReactNode;
  /** Shows a remove button. */
  onRemove?: (() => void) | undefined;
  /** Accessible name of the remove button. @default "Remove" */
  removeLabel?: string | undefined;
};

/** Tag — quiet metadata on linen: format, origin, category, permission.
 *  Attributes are tags, never status colours (that is Badge). */
export function Tag({ children, onRemove, removeLabel = 'Remove', className, ...rest }: TagProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-md border border-rule-soft bg-sunk px-[7px] py-[3px] text-meta leading-[1.3] text-fg-secondary', className)}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="-mr-0.5 inline-grid cursor-pointer place-items-center rounded-xs text-fg-secondary outline-none hover:text-fg focus-visible:shadow-(--focus-ring)"
        >
          <X size={12} strokeWidth={2} aria-hidden />
        </button>
      )}
    </span>
  );
}
