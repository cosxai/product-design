import * as SwitchPrimitive from '@radix-ui/react-switch';
import { useId, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';

export type SwitchProps = Omit<ComponentProps<typeof SwitchPrimitive.Root>, 'checked' | 'onCheckedChange' | 'onChange' | 'children'> & {
  checked?: boolean | undefined;
  /** Called when flipped — the setting applies at once. */
  onChange?: ((checked: boolean) => void) | undefined;
  /** Name the setting ("Require two-step verification"), never the action. */
  label?: ReactNode;
  description?: ReactNode;
  /** Class for the whole row (className goes to the track). */
  rowClassName?: string | undefined;
};

/**
 * Switch — one setting that applies at once (a form choice is a
 * Checkbox). Pill track: chrome when off, ink when on (linen in ink
 * mode); the knob has no shadow. role="switch" with aria-checked.
 */
export function Switch({ checked, onChange, label, description, disabled, id, className, rowClassName, ...rest }: SwitchProps) {
  const auto = useId();
  const switchId = id ?? `sw${auto}`;
  const descId = description ? `${switchId}-desc` : undefined;
  const track = (
    <SwitchPrimitive.Root
      id={switchId}
      {...(checked !== undefined && { checked })}
      onCheckedChange={(v) => onChange?.(v)}
      disabled={disabled}
      aria-describedby={descId}
      className={cn(
        'relative inline-flex h-5 w-[34px] shrink-0 cursor-pointer items-center rounded-pill border border-rule bg-chrome p-0',
        'transition-[background-color,border-color] duration-[120ms] ease-standard outline-none focus-visible:shadow-(--focus-ring)',
        'data-[state=checked]:border-fg data-[state=checked]:bg-fg disabled:cursor-not-allowed',
        className,
      )}
      {...rest}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'block size-3.5 translate-x-[2px] rounded-pill bg-paper transition-transform duration-[120ms] ease-standard',
          'data-[state=checked]:translate-x-[16px] data-[state=checked]:bg-page',
        )}
      />
    </SwitchPrimitive.Root>
  );
  if (!label && !description) return track;
  return (
    <div className={cn('inline-flex items-center gap-2.5 font-sans', description && 'items-start', disabled && 'opacity-40', rowClassName)}>
      {track}
      <span className="flex flex-col gap-0.5">
        {label && (
          <label htmlFor={switchId} className={cn('text-small leading-[1.45] text-fg', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
            {label}
          </label>
        )}
        {description && (
          <span id={descId} className="text-meta leading-normal text-fg-secondary">
            {description}
          </span>
        )}
      </span>
    </div>
  );
}
