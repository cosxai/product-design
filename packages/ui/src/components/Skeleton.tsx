import { useEffect, useRef, useState, type ComponentProps } from 'react';

import { cn } from '../lib/cn';
import { useLoop } from './status-motion';

export type SkeletonProps = ComponentProps<'div'>;

/** Skeleton — a sunk placeholder block that breathes slowly (still under reduced motion). */
export function Skeleton({ className, ...rest }: SkeletonProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useLoop(ref, [{ opacity: 1 }, { opacity: 0.55 }, { opacity: 1 }], { duration: 1600, easing: 'ease-in-out' });
  return <div ref={ref} aria-hidden className={cn('rounded-sm bg-well', className)} {...rest} />;
}

type Busy = { label?: string | undefined; className?: string | undefined };

/** A list of rows loading. */
export function SkeletonList({ rows = 6, label = 'Loading', className }: Busy & { rows?: number | undefined }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={cn('flex flex-col', className)}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-rule-soft py-3">
          <Skeleton className="size-8 rounded-md" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-2.5 w-1/4" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/** A grid of cards loading. */
export function SkeletonCards({ count = 6, label = 'Loading', className }: Busy & { count?: number | undefined }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={cn('grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4', className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-lg border border-rule p-3">
          <Skeleton className="aspect-[4/3] w-full rounded-md" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export type SkeletonViewerProps = Busy & {
  /** What the wait is called as it gets longer. @default Opening… then, after 3 s, Rendering page 1… */
  messages?: { after: number; text: string }[] | undefined;
};

/** A document opening: a page placeholder whose wording changes on long waits. */
export function SkeletonViewer({ messages = [{ after: 0, text: 'Opening…' }, { after: 3000, text: 'Rendering page 1…' }], className }: SkeletonViewerProps) {
  const sorted = [...messages].sort((a, b) => a.after - b.after);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timers = sorted.slice(1).map((m, i) => setTimeout(() => setIndex(i + 1), m.after));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sorted)]);
  const text = sorted[index]?.text ?? '';
  return (
    <div role="status" aria-busy="true" className={cn('flex flex-col items-center gap-4 rounded-lg bg-sunk p-8', className)}>
      <Skeleton className="aspect-[1/1.3] w-full max-w-[360px] rounded-md bg-page" />
      <span aria-live="polite" className="text-meta font-medium text-fg-secondary">
        {text}
      </span>
    </div>
  );
}
