import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { useField } from './Field';

export type CodeInputProps = {
  /** Number of cells. @default 6 */
  length?: number | undefined;
  value?: string | undefined;
  onChange?: ((code: string) => void) | undefined;
  /** Called once every cell is filled — typing the last digit or pasting the whole code. */
  onComplete?: ((code: string) => void) | undefined;
  /** Digits only (default) or letters and digits. */
  mode?: 'numeric' | 'alphanumeric' | undefined;
  invalid?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Seconds until the code can be sent again; the countdown runs here. */
  resendIn?: number | undefined;
  onResend?: (() => void) | undefined;
  /** @default (s) => `Resend in ${s} s` */
  formatCountdown?: ((seconds: number) => ReactNode) | undefined;
  /** @default "Send a new code" */
  resendLabel?: string | undefined;
  /** Name of the group for screen readers when there is no Field label. @default "Verification code" */
  'aria-label'?: string | undefined;
  className?: string | undefined;
};

/**
 * CodeInput — one cell per character of a one-time code. Typing moves on,
 * Backspace moves back, arrows move; pasting the whole code fills every
 * cell and completes. The first cell carries autocomplete=one-time-code
 * so phones offer the code from the message.
 */
export function CodeInput({
  length = 6,
  value,
  onChange,
  onComplete,
  mode = 'numeric',
  invalid,
  disabled,
  resendIn,
  onResend,
  formatCountdown = (s) => `Resend in ${s} s`,
  resendLabel = 'Send a new code',
  'aria-label': ariaLabel = 'Verification code',
  className,
}: CodeInputProps) {
  const field = useField();
  const [own, setOwn] = useState('');
  const code = (value ?? own).slice(0, length);
  const cells = useRef<Array<HTMLInputElement | null>>([]);
  const allowed = mode === 'numeric' ? /\d/ : /[a-z0-9]/i;
  const bad = Boolean(invalid || field?.invalid);
  const off = Boolean(disabled || field?.disabled);

  const [left, setLeft] = useState(resendIn ?? 0);
  useEffect(() => setLeft(resendIn ?? 0), [resendIn]);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const set = (next: string) => {
    const clean = next.slice(0, length);
    if (value === undefined) setOwn(clean);
    onChange?.(clean);
    if (clean.length === length && !clean.includes(' ')) onComplete?.(clean);
  };
  const focus = (i: number) => cells.current[Math.max(0, Math.min(length - 1, i))]?.focus();
  const chars = Array.from({ length }, (_, i) => code[i] ?? '');

  const put = (i: number, raw: string) => {
    const typed = [...raw].filter((c) => allowed.test(c)).map((c) => c.toUpperCase());
    if (!typed.length) return;
    const next = [...chars];
    typed.forEach((c, k) => {
      if (i + k < length) next[i + k] = c;
    });
    // Empty cells are a space inside; the value has no trailing spaces.
    set(next.map((c) => c || ' ').join('').trimEnd());
    focus(i + typed.length);
  };

  return (
    <div className={cn('flex flex-col gap-2 font-sans', className)}>
      <div role="group" aria-label={field?.labelId ? undefined : ariaLabel} aria-labelledby={field?.labelId} className="flex gap-2">
        {chars.map((c, i) => (
          <input
            key={i}
            ref={(el) => {
              cells.current[i] = el;
            }}
            id={i === 0 ? field?.id : undefined}
            value={c.trim()}
            inputMode={mode === 'numeric' ? 'numeric' : 'text'}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={length}
            disabled={off}
            aria-label={`${i + 1} of ${length}`}
            aria-invalid={bad || undefined}
            aria-describedby={field?.describedBy}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => put(i, e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
              put(0, e.clipboardData.getData('text'));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                e.preventDefault();
                const next = [...chars];
                const at = c.trim() ? i : i - 1;
                if (at < 0) return;
                next[at] = ' ';
                set(next.map((ch) => ch || ' ').join('').trimEnd());
                focus(at);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                focus(i - 1);
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                focus(i + 1);
              }
            }}
            className={cn(
              'h-[52px] w-11 rounded-md border bg-sunk text-center font-sans text-[20px] font-medium text-fg tabular-nums outline-none',
              'transition-[border-color] duration-[120ms] ease-standard focus:border-fg focus:shadow-(--focus-ring)',
              // Every cell shows its edge, like Input; the focused one darkens
              bad ? 'border-error bg-error-wash focus:border-error' : 'border-rule',
              off && 'cursor-not-allowed border-rule-soft bg-well text-fg-secondary',
            )}
          />
        ))}
      </div>
      {resendIn !== undefined && (
        <div className="text-meta text-fg-secondary" aria-live="polite">
          {left > 0 ? (
            formatCountdown(left)
          ) : (
            <button type="button" onClick={onResend} className="cursor-pointer rounded-xs font-medium text-fg underline underline-offset-3 outline-none focus-visible:shadow-(--focus-ring)">
              {resendLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
