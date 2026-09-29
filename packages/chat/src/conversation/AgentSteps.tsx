import { Spinner, cn } from '@cosxai/ui';
import { Check, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useId, useState, type ComponentProps, type ReactNode } from 'react';

export type AgentStepState = 'done' | 'running' | 'failed' | 'pending';

export type AgentStep = {
  id: string;
  /** Searched contacts in Harbour Series A */
  label: ReactNode;
  /** A count or detail in grey: 24 found · pages 14–15. */
  detail?: ReactNode;
  /** @default "done" */
  state?: AgentStepState | undefined;
  /** failed: why, under the row. */
  error?: ReactNode;
};

export type AgentStepsLabels = {
  /** The collapsed line once finished. @default "Worked for 14 s · 4 steps" */
  worked: (seconds: number | undefined, steps: number) => string;
  /** The collapsed line while running. @default "Working for 6 s · 2 steps" */
  working: (seconds: number | undefined, steps: number) => string;
  /** Screen-reader state of each row. */
  states: Record<AgentStepState, string>;
};

const plural = (n: number) => `${n} ${n === 1 ? 'step' : 'steps'}`;
const LABELS: AgentStepsLabels = {
  worked: (s, n) => (s === undefined ? plural(n) : `Worked for ${s} s · ${plural(n)}`),
  working: (s, n) => (s === undefined ? `Working · ${plural(n)}` : `Working for ${s} s · ${plural(n)}`),
  states: { done: 'Done', running: 'Running', failed: 'Failed', pending: 'Waiting' },
};

export type AgentStepsProps = Omit<ComponentProps<'div'>, 'children'> & {
  steps: AgentStep[];
  /** Time spent, in seconds. */
  seconds?: number | undefined;
  /** Controlled expansion. */
  open?: boolean | undefined;
  /** @default false — steps start collapsed */
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  labels?: Partial<AgentStepsLabels> | undefined;
};

function StepIcon({ state }: { state: AgentStepState }) {
  if (state === 'running') return <Spinner size={14} />;
  if (state === 'pending') return <span className="size-3.5 rounded-pill border border-rule" />;
  return (
    <span className={cn('grid size-3.5 place-items-center rounded-pill', state === 'failed' ? 'bg-error text-white' : 'bg-fg text-page')}>
      {state === 'failed' ? <X size={9} strokeWidth={3} /> : <Check size={9} strokeWidth={3} />}
    </span>
  );
}

/**
 * AgentSteps — what the Agent did, above its answer. Collapsed to one line
 * of time and steps; expanding lists each step with its count or detail.
 * While running the current step shows; failed steps stay shown.
 */
export function AgentSteps({ steps, seconds, open: openProp, defaultOpen = false, onOpenChange, labels: labelsProp, className, ...rest }: AgentStepsProps) {
  const labels = { ...LABELS, ...labelsProp };
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp ?? inner;
  const listId = useId();
  const running = steps.some((s) => s.state === 'running');
  const shown = open ? steps : steps.filter((s) => s.state === 'running' || s.state === 'failed');

  const toggle = () => {
    if (openProp === undefined) setInner(!open);
    onOpenChange?.(!open);
  };

  return (
    <div className={cn('flex flex-col items-start gap-2.5', className)} {...rest}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={toggle}
        className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-sm bg-sunk px-2 text-meta font-medium text-fg outline-none hover:bg-well focus-visible:shadow-(--focus-ring)"
      >
        {open ? <ChevronDown size={13} strokeWidth={2} aria-hidden /> : <ChevronRight size={13} strokeWidth={2} aria-hidden />}
        {(running ? labels.working : labels.worked)(seconds, steps.length)}
      </button>
      <ul id={listId} hidden={shown.length === 0} className="m-0 ml-[3px] flex list-none flex-col gap-2 border-l border-rule p-0 py-0.5 pl-3">
        {shown.map((s) => {
          const state = s.state ?? 'done';
          return (
            <li key={s.id} className="flex flex-col gap-1">
              <div className="flex items-start gap-2.5 text-small leading-[1.4]">
                <span className="mt-[2px] grid size-3.5 shrink-0 place-items-center" aria-hidden>
                  <StepIcon state={state} />
                </span>
                <span className="sr-only">{labels.states[state]}: </span>
                <span className={cn('min-w-0', state === 'pending' ? 'text-fg-secondary' : 'text-fg')}>
                  {s.label}
                  {s.detail != null && <span className="ml-2 text-fg-secondary">{s.detail}</span>}
                </span>
              </div>
              {state === 'failed' && s.error != null && <div className="pl-6 text-meta leading-[1.45] text-error-text">{s.error}</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
