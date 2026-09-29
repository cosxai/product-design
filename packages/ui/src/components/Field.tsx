import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';

export type FieldContextValue = {
  /** id for the control; the label points at it. */
  id: string;
  /** id of the visible label, when there is one. */
  labelId: string | undefined;
  /** id of the hint / error line, for aria-describedby. */
  describedBy: string | undefined;
  invalid: boolean;
  disabled: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

/** The surrounding Field, if any — controls take their id and aria from it. */
export function useField(): FieldContextValue | null {
  return useContext(FieldContext);
}

export type FieldProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Always visible. The placeholder shows an example; it never replaces the label. */
  label?: ReactNode;
  /** A helper line below the control. */
  hint?: ReactNode;
  /** The error, in words that say how to fix it. Replaces the hint and marks the control invalid. */
  error?: ReactNode;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Use this id for the control instead of a generated one. */
  id?: string | undefined;
  children: ReactNode;
};

/**
 * Field — label, hint and error around one control. The label is tied to
 * the control; the hint or error is its aria-describedby; an error sets
 * aria-invalid. Error is wording in the one red, never colour alone.
 */
export function Field({ label, hint, error, required = false, disabled = false, id, className, children, ...rest }: FieldProps) {
  const auto = useId();
  const controlId = id ?? `f${auto}`;
  const noteId = `${controlId}-note`;
  const note = error ?? hint;
  const value: FieldContextValue = { id: controlId, labelId: label ? `${controlId}-label` : undefined, describedBy: note ? noteId : undefined, invalid: Boolean(error), disabled };
  return (
    <FieldContext.Provider value={value}>
      <div className={cn('flex flex-col gap-[7px] font-sans', className)} {...rest}>
        {label && (
          <label id={`${controlId}-label`} htmlFor={controlId} className={cn('text-meta font-medium text-fg-secondary', disabled && 'opacity-40')}>
            {label}
            {required && <span> · required</span>}
          </label>
        )}
        {children}
        {note && (
          <span id={noteId} className={cn('text-meta leading-normal', error ? 'text-error-text ink:text-error' : 'text-fg-secondary')}>
            {note}
          </span>
        )}
      </div>
    </FieldContext.Provider>
  );
}
