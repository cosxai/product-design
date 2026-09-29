import { cn } from '../lib/cn';

export type SpinnerProps = { size?: number | undefined; className?: string | undefined; label?: string | undefined };

/** Spinner — a thin ring in currentColor. Still (a static arc) when the
 *  user asks for reduced motion. Decorative unless labelled. */
export function Spinner({ size = 14, className, label }: SpinnerProps) {
  return (
    <span
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        'inline-block shrink-0 rounded-pill border-[1.5px] border-current border-r-transparent motion-safe:animate-spin',
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
