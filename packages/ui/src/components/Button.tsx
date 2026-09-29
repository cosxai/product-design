import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { Check } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'yellow' | 'ink' | 'danger';
export type ButtonGround = 'paper' | 'yellow' | 'ink';
/** idle → busy (spinner, width locked, clicks ignored) → done (confirmed in place) → idle. */
export type ButtonState = 'idle' | 'busy' | 'done';

const button = cva(
  [
    'relative inline-flex items-center justify-center gap-2 whitespace-nowrap select-none',
    'rounded-md border border-transparent font-sans font-semibold leading-none',
    'transition-[background-color,border-color,color] duration-[120ms] ease-standard',
    'cursor-pointer outline-none focus-visible:shadow-(--focus-ring)',
    'disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:opacity-40',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-3.5 text-[13px]',
        md: 'h-[38px] px-[18px] text-ui',
        lg: 'h-11 px-6 text-[16px]',
      },
      variant: { primary: '', secondary: 'bg-transparent', ghost: 'bg-transparent', yellow: 'bg-yellow text-ink hover:bg-yellow-hover', ink: 'bg-ink text-linen hover:bg-ink-raised ink:border-inv-rule ink:bg-ink-raised ink:hover:border-linen', danger: 'bg-error text-white hover:bg-error-text' },
      ground: { auto: '', paper: '', yellow: '', ink: '' },
    },
    compoundVariants: [
      // Primary: ink on paper and on the yellow; the yellow on ink (and in ink mode).
      { variant: 'primary', ground: 'auto', class: 'bg-ink text-linen hover:bg-ink-raised ink:bg-yellow-accent ink:text-ink ink:hover:bg-yellow-accent-hover' },
      { variant: 'primary', ground: ['paper', 'yellow'], class: 'bg-ink text-linen hover:bg-ink-raised' },
      { variant: 'primary', ground: 'ink', class: 'bg-yellow-accent text-ink hover:bg-yellow-accent-hover' },
      // Secondary: a hairline that turns ink on hover.
      { variant: 'secondary', ground: 'auto', class: 'text-fg border-[rgba(17,17,17,.18)] hover:border-fg ink:border-rule' },
      { variant: 'secondary', ground: ['paper', 'yellow'], class: 'text-ink border-[rgba(17,17,17,.18)] hover:border-ink' },
      { variant: 'secondary', ground: 'ink', class: 'text-linen border-inv-rule hover:border-linen' },
      // Ghost (subtle): text only; hover deepens one step.
      { variant: 'ghost', ground: 'auto', class: 'text-fg hover:bg-hover' },
      { variant: 'ghost', ground: ['paper', 'yellow'], class: 'text-ink hover:bg-[rgba(17,17,17,.05)]' },
      { variant: 'ghost', ground: 'ink', class: 'text-linen hover:bg-ink-raised' },
      // Focus ring follows the ground.
      { ground: 'yellow', class: 'focus-visible:shadow-[0_0_0_3px_var(--yellow),0_0_0_5px_var(--ink)]' },
      { ground: 'ink', class: 'focus-visible:shadow-[0_0_0_3px_var(--ink),0_0_0_5px_var(--yellow)]' },
    ],
    defaultVariants: { size: 'md', variant: 'primary', ground: 'auto' },
  },
);

export type ButtonProps = Omit<ComponentProps<'button'>, 'disabled'> & {
  /** primary (one per view) · secondary · ghost (subtle: cancel, secondary links) · yellow (inline attention) · ink · danger (destructive, inside a confirming dialog). @default "primary" */
  variant?: ButtonVariant | undefined;
  /** Height 32 · 38 · 44 (the product control heights). @default "md" */
  size?: 'sm' | 'md' | 'lg' | undefined;
  /** The surface underneath; sets the primary colour and the focus ring. Unset: paper, flipping to ink in ink mode. */
  ground?: ButtonGround | undefined;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Shortcut hint at the end of the button (⇧S, Esc). */
  shortcut?: string | undefined;
  /** A count at the end (Comments 12). Hidden at zero, 99+ above 99. */
  count?: number | undefined;
  /** Async state: busy locks the width and shows a spinner; done confirms in place. See useButtonAction. */
  state?: ButtonState | undefined;
  /** Label shown while state="done". @default the children */
  doneLabel?: ReactNode;
  disabled?: boolean | undefined;
  /** Why it is unavailable. Keeps the button focusable (aria-disabled) so the reason can be read and shown. */
  disabledReason?: string | undefined;
  /** Render the child (a link) with the button's look. Async state is not applied. */
  asChild?: boolean | undefined;
};

export function formatCount(n: number): string | null {
  if (!n || n <= 0) return null;
  return n > 99 ? '99+' : String(n);
}

/**
 * Button — one button for every action. Contrast is ink's job: the primary
 * is ink on paper and on the yellow, the yellow on ink. One primary per
 * view. Async results stay in the button: busy (width locked, repeat clicks
 * ignored), done (confirmed in place); a failure is explained beside it.
 * Hover deepens one step — no lift, no scale, no shadow.
 */
export function Button({
  variant,
  size,
  ground,
  iconLeft,
  iconRight,
  shortcut,
  count,
  state = 'idle',
  doneLabel,
  disabled,
  disabledReason,
  asChild,
  className,
  children,
  onClick,
  style,
  ref,
  ...rest
}: ButtonProps) {
  const inner = useRef<HTMLButtonElement | null>(null);
  const [lockedWidth, setLockedWidth] = useState<number | null>(null);

  // Lock the idle width so busy / done never resize the button.
  useLayoutEffect(() => {
    if (state === 'idle') setLockedWidth(null);
    else if (lockedWidth === null && inner.current) setLockedWidth(inner.current.getBoundingClientRect().width);
  }, [state, lockedWidth]);

  const classes = cn(button({ variant, size, ground: ground ?? 'auto' }), className);
  if (asChild) {
    return (
      <Slot className={classes} {...(rest as object)}>
        {children}
      </Slot>
    );
  }

  const busy = state === 'busy';
  const blocked = Boolean(disabledReason) && disabled;
  const shownCount = count === undefined ? null : formatCount(count);
  const setRefs = (el: HTMLButtonElement | null) => {
    inner.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  return (
    <button
      type="button"
      {...rest}
      ref={setRefs}
      className={classes}
      style={lockedWidth ? { ...style, width: lockedWidth } : style}
      disabled={disabled && !disabledReason ? true : undefined}
      aria-disabled={blocked || busy ? true : undefined}
      aria-busy={busy || undefined}
      title={blocked ? disabledReason : rest.title}
      onClick={(e) => {
        if (blocked || busy || state === 'done') {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
    >
      {busy ? (
        <Spinner />
      ) : state === 'done' ? (
        <>
          <Check size={14} strokeWidth={2} aria-hidden />
          {doneLabel ?? children}
        </>
      ) : (
        <>
          {iconLeft}
          {children}
          {iconRight}
          {shownCount && <span className="font-medium tabular-nums opacity-70">{shownCount}</span>}
          {shortcut && (
            <kbd className="ml-0.5 font-sans text-[12px] font-medium opacity-60" aria-hidden>
              {shortcut}
            </kbd>
          )}
        </>
      )}
      {busy && <span className="sr-only">{children}</span>}
    </button>
  );
}
