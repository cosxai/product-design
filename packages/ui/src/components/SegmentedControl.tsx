import * as RadioPrimitive from '@radix-ui/react-radio-group';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { definedAria } from './inputs-aria';
import { Tooltip } from './Tooltip';

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
  /** 32 · 38. @default "md" */
  size?: 'sm' | 'md' | undefined;
  className?: string | undefined;
};

/**
 * SegmentedControl — two to five mutually exclusive views or modes, side
 * by side. Radio semantics: one tab stop, arrows move and choose. The
 * selected segment sits on the brand colour and the marker glides to it
 * (still, with reduced motion). A disabled segment explains why.
 */
export function SegmentedControl({ segments, value, defaultValue, onChange, size = 'md', className, ...aria }: SegmentedControlProps) {
  const [own, setOwn] = useState(defaultValue ?? segments.find((s) => !s.disabled)?.value);
  const current = value ?? own;
  const root = useRef<HTMLDivElement | null>(null);
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const el = root.current?.querySelector<HTMLElement>('[data-state="checked"]');
    setMarker(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [current, segments]);

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
      className={cn('relative inline-flex rounded-md border border-rule bg-sunk p-[3px] font-sans', className)}
    >
      {marker && (
        <span
          aria-hidden
          className="absolute top-[3px] bottom-[3px] rounded-sm bg-brand-field motion-safe:transition-[left,width] motion-safe:duration-[320ms] motion-safe:ease-out"
          style={{ left: marker.left, width: marker.width }}
        />
      )}
      {segments.map((s) => {
        const item = (
          <RadioPrimitive.Item
            key={s.value}
            value={s.value}
            disabled={s.disabled}
            className={cn(
              'relative z-[1] inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-3 font-medium whitespace-nowrap text-fg-secondary outline-none',
              'transition-colors duration-[120ms] ease-standard hover:text-fg focus-visible:shadow-(--focus-ring)',
              'data-[state=checked]:text-ink disabled:cursor-not-allowed disabled:opacity-40',
              size === 'sm' ? 'h-[24px] text-meta' : 'h-[30px] text-[13px]',
            )}
          >
            {s.label}
            {s.disabled && s.reason && <span className="sr-only">, {s.reason}</span>}
          </RadioPrimitive.Item>
        );
        return s.disabled && s.reason ? (
          <Tooltip key={s.value} content={s.reason}>
            <span className="relative z-[1] inline-flex" tabIndex={-1}>
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
