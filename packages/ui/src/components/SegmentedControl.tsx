import * as RadioPrimitive from '@radix-ui/react-radio-group';
import { useRef, useState, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { definedAria } from './inputs-aria';
import { Tooltip } from './Tooltip';
import { GlideIndicator, useGlide } from './useGlide';

export type Segment = {
  value: string;
  label: ReactNode;
  /** Unavailable; say why (shown on hover and focus, and read out). */
  disabled?: boolean | undefined;
  reason?: string | undefined;
};

export type SegmentedControlProps = {
  segments: Segment[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  /** Accessible name when there is no visible label. */
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  /**
   * md — 44px, 14px labels (the phone's Recent · Starred · All, Docs Mobile
   * Home); compact — 34px, 13px (desktop panels); sm — 32px, 12px (beside a
   * small field). @default "md"
   */
  size?: 'md' | 'compact' | 'sm' | undefined;
  className?: string | undefined;
};

/**
 * SegmentedControl — two to five mutually exclusive views or modes, side
 * by side in equal widths on a sunk track (give it `w-full` to fill the
 * row). Radio semantics: one tab stop, arrows move and choose. The selected
 * segment sits on the brand field (--brand-field), one shared block that
 * stretches across to the new segment and closes in (useGlide, §07c; a
 * jump under reduced motion). A disabled segment explains why.
 */
export function SegmentedControl({ segments, value, defaultValue, onChange, size = 'md', className, ...aria }: SegmentedControlProps) {
  const [own, setOwn] = useState(defaultValue ?? segments.find((s) => !s.disabled)?.value);
  const current = value ?? own;
  const root = useRef<HTMLDivElement | null>(null);
  const glide = useGlide(root, current, { axis: 'x' });

  return (
    <RadioPrimitive.Root
      ref={root}
      value={current ?? ''}
      onValueChange={(v) => {
        if (value === undefined) setOwn(v);
        onChange?.(v);
      }}
      orientation="horizontal"
      loop
      {...definedAria(aria)}
      className={cn(
        'relative isolate inline-grid auto-cols-fr grid-flow-col gap-0.5 bg-sunk p-[3px] font-sans',
        size === 'md' ? 'rounded-[12px]' : 'rounded-[10px]',
        className,
      )}
    >
      <GlideIndicator glide={glide} />
      {segments.map((s) => {
        const on = s.value === current;
        const item = (
          <RadioPrimitive.Item
            key={s.value}
            value={s.value}
            disabled={s.disabled}
            data-glide-key={s.value}
            className={cn(
              'inline-flex w-full cursor-pointer items-center justify-center gap-1.5 px-3 font-medium whitespace-nowrap text-fg outline-none',
              'transition-colors duration-[120ms] ease-standard focus-visible:shadow-(--focus-ring)',
              'data-[state=checked]:text-ink disabled:cursor-not-allowed disabled:opacity-40',
              on && !glide.active && 'bg-brand-field',
              size === 'md' ? 'h-[38px] rounded-[9px] text-[14px]' : size === 'compact' ? 'h-7 rounded-[7px] text-[13px]' : 'h-[26px] rounded-[7px] text-meta',
            )}
          >
            {s.label}
            {s.disabled && s.reason && <span className="sr-only">, {s.reason}</span>}
          </RadioPrimitive.Item>
        );
        return s.disabled && s.reason ? (
          <Tooltip key={s.value} content={s.reason}>
            <span className="inline-flex" tabIndex={-1}>
              {item}
            </span>
          </Tooltip>
        ) : (
          item
        );
      })}
    </RadioPrimitive.Root>
  );
}
