import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';
import { PulseDot } from './PulseDot';

/** synced (quiet) · syncing (pulsing brand dot) · error (red) · paused / off (grey ring). */
export type SyncState = 'synced' | 'syncing' | 'error' | 'paused' | 'off';

function Dot({ state }: { state: SyncState }) {
  if (state === 'syncing') return <PulseDot size={8} />;
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block size-2 shrink-0 rounded-pill',
        state === 'error' && 'bg-error',
        state === 'synced' && 'bg-fg-secondary',
        (state === 'paused' || state === 'off') && 'border border-fg-secondary',
      )}
    />
  );
}

export type SyncStatusProps = Omit<ComponentProps<'div'>, 'children'> & {
  state: SyncState;
  /** The wording, always present: "In sync", "Sync error", "Importing 2 batches". */
  children: ReactNode;
  /** Secondary detail: "Updated just now", "attempt 3". */
  detail?: ReactNode;
  /** One action, e.g. Retry. */
  action?: ReactNode;
  /** Dot only (the global indicator); the wording stays for screen readers and on hover. */
  compact?: boolean | undefined;
};

/**
 * SyncStatus — the global sync dot and the per-source sync lines ("Retrying
 * after an error · attempt 3", "Paused by Wei Li", "Last synced 4 minutes
 * ago"). Colour is never the only signal: the wording is always there.
 */
export function SyncStatus({ state, children, detail, action, compact = false, className, title, ...rest }: SyncStatusProps) {
  return (
    <div
      role="status"
      data-state={state}
      title={compact ? (title ?? (typeof children === 'string' ? children : undefined)) : title}
      className={cn('inline-flex items-center gap-2 font-sans text-small', state === 'error' ? 'text-error-text' : 'text-fg', className)}
      {...rest}
    >
      <Dot state={state} />
      <span className={compact ? 'sr-only' : undefined}>{children}</span>
      {detail && <span className={cn('text-meta text-fg-secondary', compact && 'sr-only')}>{detail}</span>}
      {action && !compact && <span className="ml-1">{action}</span>}
    </div>
  );
}
