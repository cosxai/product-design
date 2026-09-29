import * as RadioPrimitive from '@radix-ui/react-radio-group';
import { useId, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';

export type RadioOption = {
  value: string;
  label: ReactNode;
  /** A line below the label. */
  description?: ReactNode;
  disabled?: boolean | undefined;
};

export type RadioGroupProps = Omit<ComponentProps<typeof RadioPrimitive.Root>, 'value' | 'onValueChange' | 'onChange' | 'children' | 'orientation'> & {
  /** Two to five exclusive options, all visible (more: a Select). */
  options: Array<string | RadioOption>;
  value?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  /** column (default) or row. Arrow keys move between options either way. */
  direction?: 'column' | 'row' | undefined;
};

/**
 * RadioGroup — round sunk controls, an ink dot on the chosen one. Arrow
 * keys move and choose; the group is one tab stop.
 */
export function RadioGroup({ options, value, onChange, direction = 'column', disabled, className, ...rest }: RadioGroupProps) {
  const auto = useId();
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <RadioPrimitive.Root
      {...(value !== undefined && { value })}
      onValueChange={(v) => onChange?.(v)}
      disabled={disabled}
      orientation={direction === 'row' ? 'horizontal' : 'vertical'}
      className={cn('flex font-sans', direction === 'row' ? 'flex-row flex-wrap gap-[22px]' : 'flex-col gap-2.5', className)}
      {...rest}
    >
      {items.map((o) => {
        const id = `rd${auto}-${o.value}`;
        const off = Boolean(disabled || o.disabled);
        return (
          <div key={o.value} className={cn('inline-flex items-start gap-2.5', off && 'opacity-40')}>
            <RadioPrimitive.Item
              id={id}
              value={o.value}
              disabled={o.disabled}
              aria-describedby={o.description ? `${id}-desc` : undefined}
              className={cn(
                'mt-0.5 grid size-4 shrink-0 cursor-pointer place-items-center rounded-pill border border-fg-secondary bg-sunk',
                'transition-[border-color] duration-[120ms] ease-standard outline-none focus-visible:shadow-(--focus-ring)',
                'data-[state=checked]:border-fg disabled:cursor-not-allowed',
              )}
            >
              <RadioPrimitive.Indicator className="block size-2 rounded-pill bg-fg" />
            </RadioPrimitive.Item>
            <span className="flex flex-col gap-0.5">
              <label htmlFor={id} className={cn('text-small leading-[1.45] text-fg', off ? 'cursor-not-allowed' : 'cursor-pointer')}>
                {o.label}
              </label>
              {o.description && (
                <span id={`${id}-desc`} className="text-meta leading-normal text-fg-secondary">
                  {o.description}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </RadioPrimitive.Root>
  );
}
