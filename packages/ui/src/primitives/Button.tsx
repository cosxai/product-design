import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * Button — primitive interactive element. Variants `primary`
 * (filled) / `secondary` (outlined) / `ghost` (transparent) /
 * `icon` (square 32×32).
 *
 * The `loading` prop is the canonical way to show that an async
 * action triggered by the button is in flight. When true:
 *
 *   - a small ring spinner renders before the children (inherits
 *     `currentColor` so it reads on every variant),
 *   - the button is `disabled` natively so clicks are dropped,
 *   - `aria-busy="true"` is set for AT consumers.
 *
 * `loading` and `disabled` are distinct states. `disabled` says
 * "you can't take this action right now" (form invalid, no
 * selection, etc.). `loading` says "we're already taking this
 * action — wait". Callers typically wire both:
 *
 *     <Button disabled={!name.trim()} loading={submitting}>
 *       {submitting ? "Saving…" : "Save"}
 *     </Button>
 *
 * Visual: see docs/components/button.
 *
 * Forwards ref to the underlying <button>. Spreads `...rest` so
 * consumers can pass data-* / aria-* / className.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant | undefined;
  /**
   * When true, the button renders a leading spinner, sets
   * `aria-busy="true"`, and becomes natively `disabled` so click
   * handlers no longer fire. Use this for any async submit so the
   * user sees the click landed AND can't double-fire the action.
   */
  loading?: boolean | undefined;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", className, children, loading, disabled, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        {...rest}
        className={cn("ck-btn", `ck-btn--${variant}`, className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        data-loading={loading || undefined}
      >
        {loading ? (
          <span className="ck-btn-spinner" aria-hidden="true" />
        ) : null}
        {children}
      </button>
    );
  },
);
