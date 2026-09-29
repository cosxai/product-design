import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';

export type CheckboxProps = Omit<ComponentProps<typeof CheckboxPrimitive.Root>, 'checked' | 'onCheckedChange' | 'onChange' | 'children'> & {
  /** true · false · "indeterminate" (some children selected). */
  checked?: boolean | 'indeterminate' | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  /** The label; clicking it toggles too. */
  label?: ReactNode;
  /** A line below the label — say why when disabled. */
  description?: ReactNode;
  /** Class for the whole row (className goes to the box). */
  rowClassName?: string | undefined;
};

/**
 * Checkbox — a choice in a form that applies on Save or Send (a setting
 * that applies at once is a Switch). Sunk box, ink when checked; the mixed
 * state means some children are selected. The whole row toggles.
 */
export function Checkbox({ checked, onChange, label, description, disabled, id, className, rowClassName, ...rest }: CheckboxProps) {
  const auto = useId();
  const boxId = id ?? `cb${auto}`;
  const descId = description ? `${boxId}-desc` : undefined;
  const box = (
    <CheckboxPrimitive.Root
      id={boxId}
      {...(checked !== undefined && { checked })}
      onCheckedChange={(v) => onChange?.(v === true)}
      disabled={disabled}
      aria-describedby={descId}
      className={cn(
        'peer mt-0.5 grid size-4 shrink-0 cursor-pointer place-items-center rounded-xs border border-fg-secondary bg-sunk text-page',
        'transition-[background-color,border-color] duration-[120ms] ease-standard outline-none focus-visible:shadow-(--focus-ring)',
        'data-[state=checked]:border-fg data-[state=checked]:bg-fg data-[state=indeterminate]:border-fg data-[state=indeterminate]:bg-fg',
        'disabled:cursor-not-allowed',
        className,
      )}
      {...rest}
    >
      <CheckboxPrimitive.Indicator className="grid place-items-center">
        {checked === 'indeterminate' ? <Minus size={11} strokeWidth={2.5} aria-hidden /> : <Check size={11} strokeWidth={2.5} aria-hidden />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
  if (!label && !description) return box;
  return (
    <div className={cn('inline-flex items-start gap-2.5 font-sans', disabled && 'opacity-40', rowClassName)}>
      {box}
      <span className="flex flex-col gap-0.5">
        {label && (
          <label htmlFor={boxId} className={cn('text-small leading-[1.45] text-fg', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
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
