import { useRef, type ComponentProps } from 'react';

import { cn } from '../lib/cn';
import { useLoop } from './status-motion';

export type PulseDotProps = Omit<ComponentProps<'span'>, 'children'> & {
  /** Pulse (background work or an agent running). Off: a still dot. @default true */
  active?: boolean | undefined;
  /** px. @default 9 */
  size?: number | undefined;
  /** Accessible text ("Agent running"). Without it the dot is decorative. */
  label?: string | undefined;
};

/** PulseDot — a slowly pulsing brand dot while work runs; a still brand
 *  dot under reduced motion. */
export function PulseDot({ active = true, size = 9, label, className, style, ...rest }: PulseDotProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  useLoop(ref, [{ opacity: 1 }, { opacity: 0.35 }, { opacity: 1 }], { duration: 2400, easing: 'ease-in-out' }, active);
  return (
    <span
      ref={ref}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('inline-block shrink-0 rounded-pill bg-brand-mark', className)}
      style={{ width: size, height: size, ...style }}
      {...rest}
    />
  );
}
