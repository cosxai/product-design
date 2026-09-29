import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Field, useField } from './Field';
import { controlFrame } from './forms-control';

export type CopyFieldProps = {
  /** The text shown and copied: a share link, a token. */
  value: string;
  label?: ReactNode;
  hint?: ReactNode;
  /** @default "Copy" */
  copyLabel?: string | undefined;
  /** @default "Copied" */
  copiedLabel?: string | undefined;
  /** Shown when the clipboard refuses and the text is selected instead. @default "Press ⌘C to copy" (Ctrl+C off the Mac) */
  manualHint?: ReactNode;
  /** ms the confirmation stays. @default 1600 */
  copiedFor?: number | undefined;
  onCopied?: ((value: string) => void) | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  id?: string | undefined;
  className?: string | undefined;
};

const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/**
 * CopyField — a read-only value with a copy button. The confirmation stays
 * in place; if copying fails the text is selected and the hint says how to
 * copy it by hand.
 */
export function CopyField({ label, hint, ...rest }: CopyFieldProps) {
  const [manual, setManual] = useState(false);
  const shown = manual ? (rest.manualHint ?? (isMac() ? 'Press ⌘C to copy' : 'Press Ctrl+C to copy')) : hint;
  if (label !== undefined || shown !== undefined) {
    return (
      <Field label={label} hint={shown} id={rest.id}>
        <Control {...rest} onManual={setManual} />
      </Field>
    );
  }
  return <Control {...rest} onManual={setManual} />;
}

function Control({
  value,
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
  copiedFor = 1600,
  onCopied,
  size,
  id,
  className,
  onManual,
}: Omit<CopyFieldProps, 'label' | 'hint' | 'manualHint'> & { onManual: (on: boolean) => void }) {
  const field = useField();
  const [copied, setCopied] = useState(false);
  const input = useRef<HTMLInputElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const selectAll = () => {
    input.current?.focus();
    input.current?.select();
  };
  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('no clipboard');
      await navigator.clipboard.writeText(value);
      onManual(false);
      setCopied(true);
      onCopied?.(value);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), copiedFor);
    } catch {
      selectAll();
      onManual(true);
    }
  };

  return (
    <div className={cn(controlFrame({ size, readOnly: true }), 'pr-1', className)}>
      <input
        ref={input}
        id={id ?? field?.id}
        readOnly
        value={value}
        onFocus={(e) => e.currentTarget.select()}
        aria-describedby={field?.describedBy}
        className="min-w-0 flex-1 truncate border-none bg-transparent p-0 font-sans text-inherit outline-none"
      />
      <button
        type="button"
        onClick={() => void copy()}
        className="inline-flex h-[calc(100%-8px)] shrink-0 cursor-pointer items-center gap-1.5 rounded-sm bg-page px-2.5 text-meta font-semibold text-fg outline-none hover:bg-well focus-visible:shadow-(--focus-ring)"
      >
        {copied ? <Check size={13} strokeWidth={2} aria-hidden /> : <Copy size={13} aria-hidden />}
        <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
      </button>
    </div>
  );
}
