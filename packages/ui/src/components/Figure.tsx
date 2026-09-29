import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';

export type FigureProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** The number. */
  value: ReactNode;
  /** What it counts. */
  label: ReactNode;
  qualifier?: ReactNode;
  /** Where it comes from — every figure is sourced or it is removed. */
  source?: ReactNode;
  /** px size of the number. @default 64 */
  size?: number | undefined;
};

/** Figure — the stat treatment: a large tabular number, a short yellow rule, the label. */
export function Figure({ value, label, qualifier, source, size = 64, className, ...rest }: FigureProps) {
  return (
    <div className={cn('flex flex-col items-start font-sans text-fg', className)} {...rest}>
      <div className="leading-none font-bold tracking-figure tabular-nums" style={{ fontSize: size }}>
        {value}
      </div>
      <div aria-hidden className="mt-3.5 mb-3 h-1 w-10 rounded-[2px] bg-yellow-accent" />
      <div className="text-[12.5px] font-medium text-fg-secondary">{label}</div>
      {qualifier && <div className="mt-1.5 max-w-[28ch] text-small leading-normal text-fg-secondary">{qualifier}</div>}
      {source && <div className="mt-2 text-meta text-fg-secondary">{source}</div>}
    </div>
  );
}
