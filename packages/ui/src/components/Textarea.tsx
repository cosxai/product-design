import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Field, useField } from './Field';
import { controlFrame, controlInner } from './forms-control';

export type TextareaProps = ComponentProps<'textarea'> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  invalid?: boolean | undefined;
  /** Class for the outer frame (className goes to the <textarea>). */
  frameClassName?: string | undefined;
};

function Control({ invalid, frameClassName, className, disabled, readOnly, rows = 4, id, ...rest }: Omit<TextareaProps, 'label' | 'hint' | 'error'>) {
  const field = useField();
  const bad = Boolean(invalid || field?.invalid);
  const off = Boolean(disabled || field?.disabled);
  return (
    <div className={cn(controlFrame({ invalid: bad, disabled: off, readOnly: Boolean(readOnly) && !off }), 'h-auto items-stretch py-2', frameClassName)}>
      <textarea
        {...rest}
        id={id ?? field?.id}
        rows={rows}
        disabled={off}
        readOnly={readOnly}
        aria-invalid={bad || undefined}
        aria-describedby={cn(rest['aria-describedby'], field?.describedBy) || undefined}
        className={cn(controlInner, 'resize-y leading-[1.55]', className)}
      />
    </div>
  );
}

/** Textarea — multi-line text in the same sunk frame as Input. */
export function Textarea({ label, hint, error, required, ...rest }: TextareaProps) {
  if (label !== undefined || hint !== undefined || error !== undefined) {
    return (
      <Field label={label} hint={hint} error={error} required={required} disabled={rest.disabled} id={rest.id}>
        <Control {...rest} required={required} />
      </Field>
    );
  }
  return <Control {...rest} required={required} />;
}
