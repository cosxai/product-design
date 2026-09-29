import { Check, X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';
import { PulseDot } from './PulseDot';

export type Stage = {
  label: ReactNode;
  state: 'done' | 'current' | 'todo' | 'failed';
  /** Shown beside the state: "Batch 2 of 4", "Done", the failure. */
  detail?: ReactNode;
};

export type StageProgressProps = Omit<ComponentProps<'ol'>, 'children'> & {
  stages: Stage[];
  /** Accessible name of the list. */
  label?: string | undefined;
};

/**
 * StageProgress — work that moves through named stages (Documents →
 * People → Facts → Assessment → Report), not a percentage. Done stages are
 * ink with a tick, the current one pulses on the brand colour, failed is red.
 */
export function StageProgress({ stages, label, className, ...rest }: StageProgressProps) {
  return (
    <ol aria-label={label} className={cn('m-0 flex list-none flex-wrap items-center gap-x-5 gap-y-2 p-0 font-sans', className)} {...rest}>
      {stages.map((s, i) => (
        <li key={i} aria-current={s.state === 'current' ? 'step' : undefined} data-state={s.state} className="flex items-center gap-2 text-small">
          {s.state === 'done' ? (
            <span className="grid size-4 place-items-center rounded-pill bg-fg text-page">
              <Check size={10} strokeWidth={3} aria-hidden />
            </span>
          ) : s.state === 'failed' ? (
            <span className="grid size-4 place-items-center rounded-pill bg-error text-white">
              <X size={10} strokeWidth={3} aria-hidden />
            </span>
          ) : s.state === 'current' ? (
            <span className="grid size-4 place-items-center">
              <PulseDot size={9} />
            </span>
          ) : (
            <span aria-hidden className="size-4 rounded-pill border border-rule" />
          )}
          <span className={cn(s.state === 'todo' ? 'text-fg-secondary' : 'text-fg', s.state === 'current' && 'font-medium')}>{s.label}</span>
          {s.detail && <span className={cn('text-meta', s.state === 'failed' ? 'text-error-text' : 'text-fg-secondary')}>{s.detail}</span>}
        </li>
      ))}
    </ol>
  );
}
