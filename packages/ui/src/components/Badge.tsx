import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';

export type BadgeStatus = 'neutral' | 'attention' | 'error' | 'progress' | 'complete';
export type BadgeAppearance = 'fill' | 'outline' | 'dot';

const DEFAULT_APPEARANCE: Record<BadgeStatus, BadgeAppearance> = {
  attention: 'fill',
  error: 'fill',
  progress: 'outline',
  complete: 'dot',
  neutral: 'dot',
};
const STATUSES = new Set<string>(Object.keys(DEFAULT_APPEARANCE));

export type BadgeProps = Omit<ComponentProps<'span'>, 'children'> & {
  /** The state. Unknown values fall back to neutral. @default "neutral" */
  status?: BadgeStatus | (string & {}) | undefined;
  /** fill · outline · dot. Defaults by status; change it only to match density in a column. */
  appearance?: BadgeAppearance | undefined;
  /** Dot density for rows: only the dot shows; the wording stays for screen readers and appears on hover. */
  compact?: boolean | undefined;
  /** The wording — always present: name the state (Awaiting you), not the action. */
  children: ReactNode;
};

/**
 * Badge — product status in yellow, ink and one red. Shape carries urgency:
 * a fill needs a person (attention: brand fill, ink text; error: the red),
 * an outline is under way (progress), a dot is a known state (complete:
 * ink dot, neutral: grey dot). Colour is never the only signal.
 * Product UI only — never on brand, marketing or decks.
 */
export function Badge({ status = 'neutral', appearance, compact = false, className, children, title, ...rest }: BadgeProps) {
  const s = (STATUSES.has(status) ? status : 'neutral') as BadgeStatus;
  const mode = compact ? 'dot' : (appearance ?? DEFAULT_APPEARANCE[s]);
  const base = 'inline-flex items-center gap-[7px] whitespace-nowrap rounded-sm text-meta leading-none font-semibold';

  if (mode === 'fill') {
    const fill = s === 'error' ? 'bg-error text-white' : s === 'attention' ? 'bg-brand-mark text-ink' : 'bg-fg text-page';
    return (
      <span data-status={s} className={cn(base, 'px-2 py-[5px]', fill, className)} title={title} {...rest}>
        {children}
      </span>
    );
  }
  if (mode === 'outline') {
    return (
      <span data-status={s} className={cn(base, 'border border-fg px-[7px] py-1 text-fg', className)} title={title} {...rest}>
        {children}
      </span>
    );
  }
  const dot =
    s === 'error' ? 'bg-error' : s === 'attention' ? 'bg-brand-mark' : s === 'complete' || s === 'progress' ? 'bg-fg' : 'bg-fg-secondary';
  return (
    <span
      data-status={s}
      className={cn(base, 'text-fg-secondary', className)}
      title={compact ? (title ?? (typeof children === 'string' ? children : undefined)) : title}
      {...rest}
    >
      <span aria-hidden className={cn('size-[9px] shrink-0 rounded-pill', dot)} />
      <span className={compact ? 'sr-only' : undefined}>{children}</span>
    </span>
  );
}
