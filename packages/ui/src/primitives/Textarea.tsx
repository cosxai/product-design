import { forwardRef, useId, type TextareaHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

// Same shape as Input — label + helper + error — for multiline.

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  helper?: ReactNode;
  error?: string | null;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, helper, error, className, id, ...rest }, ref) {
    const autoId = useId();
    const tid = id ?? autoId;
    return (
      <div
        className={cn("ck-textarea-field", className)}
        style={{ display: "flex", flexDirection: "column", gap: 6 }}
      >
        {label && (
          <label
            htmlFor={tid}
            className="ck-eyebrow"
            style={{ color: "var(--ck-text-secondary)" }}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={tid}
          aria-invalid={error ? true : undefined}
          {...rest}
          className="ck-textarea"
          style={{
            minHeight: 80,
            padding: "8px 12px",
            font: "400 13px/1.5 var(--ck-font-sans)",
            background: "var(--ck-bg-surface)",
            color: "var(--ck-text-primary)",
            border: `1px solid ${error ? "var(--ck-critical)" : "var(--ck-border-strong)"}`,
            borderRadius: "var(--ck-radius-sm)",
            outline: "none",
            resize: "vertical",
            transition: "border-color var(--ck-dur-fast) var(--ck-ease)",
          }}
        />
        {(helper || error) && (
          <div
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
  },
);
