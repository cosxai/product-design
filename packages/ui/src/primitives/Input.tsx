import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

// Styled text input with optional label + error + helper text.
// Three states: idle / focused / invalid. Focus ring + invalid border
// both via :focus-visible / aria-invalid CSS — no JS branching.

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  helper?: ReactNode;
  // Validation error message. When set, the input renders an
  // invalid border + colour and the helper slot is replaced by
  // the error text.
  error?: string | null;
  // Width preset — full, fixed, or auto (default full).
  fit?: "full" | "auto";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helper, error, fit = "full", className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div
      className={cn("ck-input-field", className)}
      style={{ display: "flex", flexDirection: "column", gap: 6, width: fit === "full" ? "100%" : undefined }}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="ck-eyebrow"
          style={{ color: "var(--ck-text-secondary)" }}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={(helper || error) ? `${inputId}-helper` : undefined}
        {...rest}
        className="ck-input"
        style={{
          height: 34,
          padding: "0 12px",
          font: "400 13px/1 var(--ck-font-sans)",
          background: "var(--ck-bg-surface)",
          color: "var(--ck-text-primary)",
          border: `1px solid ${error ? "var(--ck-critical)" : "var(--ck-border-strong)"}`,
          borderRadius: "var(--ck-radius-sm)",
          outline: "none",
          transition: "border-color var(--ck-dur-fast) var(--ck-ease)",
        }}
      />
      {(helper || error) && (
        <div
          id={`${inputId}-helper`}
          style={{
            font: "400 11px/1.4 var(--ck-font-sans)",
            color: error ? "var(--ck-critical)" : "var(--ck-text-tertiary)",
          }}
        >
          {error ?? helper}
        </div>
      )}
    </div>
  );
});
