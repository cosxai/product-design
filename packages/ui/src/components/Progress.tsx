import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { useLoop } from './status-motion';

export type ProgressSegment = 'done' | 'current' | 'failed' | 'todo';

export type ProgressProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Accessible name ("Uploading Cap table.xlsx"). */
  label: string;
  /** Determinate: how far. Leave undefined (and no segments) for indeterminate. */
  value?: number | undefined;
  /** @default 100 */
  max?: number | undefined;
  /** Segmented: one entry per step — done ink, current the brand colour, failed red. */
  segments?: ProgressSegment[] | undefined;
  /** Always-visible progress text: "1.2 of 3.4 MB", "Preparing download", "Batch 3 of 5". */
  text?: ReactNode;
  /** Announced once when it ends. */
  status?: 'active' | 'done' | 'failed' | undefined;
  /** Words for the announcements. */
  labels?: { done?: string; failed?: string } | undefined;
};

/** 0, 25, 50, 75 or 100 — screen readers hear these steps, not every tick. */
export function progressStep(value: number, max: number): number {
  if (max <= 0) return 0;
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return Math.floor(pct / 25) * 25;
}

const SEGMENT = { done: 'bg-fg', current: 'bg-brand-mark', failed: 'bg-error', todo: 'bg-well' };

/**
 * Progress — one component, three forms: determinate, indeterminate,
 * segmented. The text is always shown; screen readers hear 25% steps and
 * the ending (done or failed), never every tick.
 */
export function Progress({ label, value, max = 100, segments, text, status = 'active', labels, className, ...rest }: ProgressProps) {
  const determinate = value !== undefined && !segments;
  const step = determinate ? progressStep(value, max) : null;
  const [announce, setAnnounce] = useState('');
  const lastStep = useRef<number | null>(null);
  const lastStatus = useRef(status);

  useEffect(() => {
    if (status !== lastStatus.current) {
      lastStatus.current = status;
      if (status === 'done') setAnnounce(`${label}: ${labels?.done ?? 'done'}`);
      if (status === 'failed') setAnnounce(`${label}: ${labels?.failed ?? 'failed'}`);
      return;
    }
    if (step === null || step === lastStep.current) return;
    const first = lastStep.current === null;
    lastStep.current = step;
    if (!first) setAnnounce(`${label}: ${step}%`);
  }, [step, status, label, labels?.done, labels?.failed]);

  const bar = useRef<HTMLDivElement | null>(null);
  useLoop(bar, [{ transform: 'translateX(-100%)' }, { transform: 'translateX(250%)' }], { duration: 1400, easing: 'cubic-bezier(.2,0,.2,1)' }, value === undefined && !segments);

  const aria =
    determinate
      ? { 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-valuenow': Math.min(max, Math.max(0, value)) }
      : segments
        ? { 'aria-valuemin': 0, 'aria-valuemax': segments.length, 'aria-valuenow': segments.filter((s) => s === 'done').length }
        : {};

  return (
    <div className={cn('flex flex-col gap-1.5 font-sans', className)} {...rest}>
      <div role="progressbar" aria-label={label} {...aria} aria-valuetext={typeof text === 'string' ? text : undefined} className="relative">
        {segments ? (
          <div className="flex gap-1">
            {segments.map((s, i) => (
              <span key={i} data-segment={s} className={cn('h-1 flex-1 rounded-pill', SEGMENT[s])} />
            ))}
          </div>
        ) : (
          <div className={cn('h-1 overflow-hidden rounded-pill bg-well', status === 'failed' && 'bg-error-wash')}>
            {determinate ? (
              <div
                className={cn('h-full rounded-pill transition-[width] duration-[180ms] ease-standard', status === 'failed' ? 'bg-error' : 'bg-brand-mark')}
                style={{ width: `${Math.min(100, Math.max(0, (value / max) * 100))}%` }}
              />
            ) : (
              <div ref={bar} className="h-full w-2/5 rounded-pill bg-brand-mark" />
            )}
          </div>
        )}
      </div>
      {text !== undefined && <div className="text-meta font-medium text-fg-secondary tabular-nums">{text}</div>}
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </div>
  );
}
