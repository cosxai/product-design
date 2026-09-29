import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Field, useField } from './Field';
import { controlFrame, controlInner } from './forms-control';

export type InputProps = Omit<ComponentProps<'input'>, 'size' | 'prefix'> & {
  /** Label above the field; with it (or hint/error) the input renders its own Field. */
  label?: ReactNode;
  hint?: ReactNode;
  /** The error in words; sets invalid. */
  error?: ReactNode;
  /** Error state without a message of its own (the message lives elsewhere). */
  invalid?: boolean | undefined;
  /** Inside, before the text — a currency, an icon. */
  prefix?: ReactNode;
  /** Inside, after the text — a domain, a unit. */
  suffix?: ReactNode;
  /** 32 · 38 · 44 (mobile). @default "md" */
  size?: 'sm' | 'md' | 'lg' | undefined;
  /** default (sunk) · borderless (inline editing: no chrome until hover/focus). */
  variant?: 'default' | 'borderless' | undefined;
  /** Class for the outer frame (className goes to the <input>). */
  frameClassName?: string | undefined;
};

function Control({
  prefix,
  suffix,
  size,
  variant,
  invalid,
  frameClassName,
  className,
  disabled,
  readOnly,
  id,
  ...rest
}: Omit<InputProps, 'label' | 'hint' | 'error'>) {
  const field = useField();
  const bad = Boolean(invalid || field?.invalid);
  const off = Boolean(disabled || field?.disabled);
  return (
    <div className={cn(controlFrame({ size, variant, invalid: bad, disabled: off, readOnly: Boolean(readOnly) && !off }), frameClassName)}>
      {prefix && <span className="flex shrink-0 text-fg-secondary">{prefix}</span>}
      <input
        {...rest}
        id={id ?? field?.id}
        disabled={off}
        readOnly={readOnly}
        aria-invalid={bad || undefined}
        aria-describedby={cn(rest['aria-describedby'], field?.describedBy) || undefined}
        className={cn(controlInner, className)}
      />
      {suffix && <span className="flex shrink-0 text-fg-secondary">{suffix}</span>}
    </div>
  );
}

/**
 * Input — a single-line text field. Sinks to linen and takes an ink edge
 * on focus. Always labelled: pass label here, or wrap in a Field. Errors
 * say how to fix it; validate on blur.
 */
export function Input({ label, hint, error, required, ...rest }: InputProps) {
  if (label !== undefined || hint !== undefined || error !== undefined) {
    return (
      <Field label={label} hint={hint} error={error} required={required} disabled={rest.disabled} id={rest.id}>
        <Control {...rest} required={required} />
      </Field>
    );
  }
  return <Control {...rest} required={required} />;
}
