import { Check, Lock } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';

export type StepState = 'done' | 'current' | 'upcoming' | 'blocked';

export type Step = {
  title: ReactNode;
  state: StepState;
  /** The second line: "Done 22 Sep", "Current step", "Blocked · opens at the Term sheet stage". */
  detail?: ReactNode;
};

export type StepsProps = Omit<ComponentProps<'ol'>, 'children'> & {
  steps: Step[];
  /** Read out for each state (the marker shows it visually). */
  stateLabels?: Partial<Record<StepState, string>> | undefined;
};

const STATE_LABELS: Record<StepState, string> = { done: 'Done', current: 'Current step', upcoming: 'Not started', blocked: 'Blocked' };

/**
 * Steps — a path in four states: done (ink tick), current (brand disc,
 * aria-current="step"), upcoming (outlined number), blocked (lock, with the
 * reason in the detail line).
 */
export function Steps({ steps, stateLabels, className, ...rest }: StepsProps) {
  const said = { ...STATE_LABELS, ...stateLabels };
  return (
    <ol className={cn('m-0 flex list-none flex-col p-0', className)} {...rest}>
      {steps.map((s, i) => (
        <li key={i} aria-current={s.state === 'current' ? 'step' : undefined} className="relative flex gap-3 pb-4 last:pb-0">
          {i < steps.length - 1 && <span aria-hidden className="absolute top-6 bottom-0 left-[11px] w-px bg-rule" />}
          <span
            aria-hidden
            className={cn(
              'relative z-[1] grid size-[22px] shrink-0 place-items-center rounded-pill text-[11px] font-semibold tabular-nums',
              s.state === 'done' && 'bg-fg text-page',
              s.state === 'current' && 'bg-brand-mark text-ink',
              s.state === 'upcoming' && 'border border-rule bg-page text-fg-secondary',
              s.state === 'blocked' && 'bg-sunk text-fg-secondary',
            )}
          >
            {s.state === 'done' ? <Check size={12} strokeWidth={2.5} /> : s.state === 'blocked' ? <Lock size={11} strokeWidth={2} /> : i + 1}
          </span>
          <div className="flex min-w-0 flex-col pt-0.5">
            <span className={cn('text-ui font-medium', s.state === 'upcoming' || s.state === 'blocked' ? 'text-fg-secondary' : 'text-fg')}>
              {s.title}
              <span className="sr-only">, {said[s.state]}</span>
            </span>
            {s.detail && <span className="text-meta text-fg-secondary">{s.detail}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}
