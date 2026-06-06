import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

// Styled text input with optional label + error + helper text.
// Three states: idle / focused / invalid. Focus ring + invalid border
// both via :focus-visible / aria-invalid CSS — no JS branching.
//
// Optional `prefix` / `suffix` slots render INSIDE the bordered
// field, separated from the input by a subtle hairline divider.
// Common patterns:
//   <Input prefix="https://"  …/>   →  `https://[ acme        ]`
//   <Input suffix=".cosx.dev" …/>   →  `[ acme        ].cosx.dev`
// Both can be set together. Prefer plain strings; ReactNode is
// supported (e.g. icons) but inherits the muted helper colour.

// We Omit "size" (HTMLInputElement's number-of-visible-chars attr;
// conflicts with our absent layout-size prop and is rarely needed in
// CSS-styled inputs) AND "prefix" (HTML's RDFa metadata attr —
// taking that prop name here lets us expose an addon slot with the
// most intuitive name; consumers needing the rare RDFa attr can
// drop down to a native <input>).
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: ReactNode;
  helper?: ReactNode;
  // Validation error message. When set, the input renders an
  // invalid border + colour and the helper slot is replaced by
  // the error text.
  error?: string | null;
  // Width preset — full, fixed, or auto (default full).
  fit?: "full" | "auto";
  // Inline addons rendered inside the bordered field. Use for
  // protocol prefixes ("https://"), domain suffixes (".cosx.dev"),
  // currency symbols, unit labels, search icons, etc.
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const ADDON_STYLE = {
  display: "inline-flex",
  alignItems: "center",
  padding: "0 12px",
  font: "400 13px/1 var(--ck-font-mono, var(--ck-font-sans))",
  color: "var(--ck-text-secondary)",
  // `--ck-bg-muted` is the canonical "slightly recessed slab"
  // background — gives the addon visible separation from the input
  // (`--ck-bg-surface`) without needing a hard divider line. The
  // bg shift carries across all chromes; tokens.css defines a
  // muted tone per chrome (light + dark).
  background: "var(--ck-bg-muted)",
  whiteSpace: "nowrap" as const,
  userSelect: "none" as const,
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helper, error, fit = "full", prefix, suffix, className, id, style, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hasAddon = prefix != null || suffix != null;

  // Border / radius live on the WRAPPER when there's an addon so the
  // addon + input share one continuous frame. Otherwise the input
  // itself carries the border (preserves the prior visual contract).
  const fieldBorder = `1px solid ${error ? "var(--ck-critical)" : "var(--ck-border-strong)"}`;
  const fieldRadius = "var(--ck-radius-sm)";

  const inputEl = (
    <input
      ref={ref}
      id={inputId}
      aria-invalid={error ? true : undefined}
      aria-describedby={(helper || error) ? `${inputId}-helper` : undefined}
      {...rest}
      className={cn("ck-input", hasAddon ? "ck-input--with-addon" : undefined)}
      style={{
        flex: hasAddon ? "1 1 auto" : undefined,
        minWidth: 0,
        height: hasAddon ? "100%" : 36,
        padding: "0 12px",
        font: "400 13px/1 var(--ck-font-sans)",
        background: "var(--ck-bg-surface)",
        color: "var(--ck-text-primary)",
        border: hasAddon ? "none" : fieldBorder,
        borderRadius: hasAddon ? 0 : fieldRadius,
        outline: "none",
        transition: "border-color var(--ck-dur-fast) var(--ck-ease)",
        ...(style ?? {}),
      }}
    />
  );

  return (
    <div
      className={cn("ck-input-field", className)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: fit === "full" ? "100%" : undefined,
        // minWidth: 0 lets a parent flex container shrink this
        // wrapper past the inner addon-wrap's nowrap suffix content.
        // Without it, a long suffix (e.g. ".meta.test.cosx.dev")
        // sets a min-content floor that pushes the form wider than
        // its mobile viewport. Per-page CSS workarounds in consumer
        // apps only cover their own scope; fixing it at the primitive
        // catches every page.
        minWidth: 0,
      }}
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
      {hasAddon ? (
        <div
          className="ck-input-addon-wrap"
          style={{
            display: "flex",
            alignItems: "stretch",
            height: 36,
            background: "var(--ck-bg-surface)",
            border: fieldBorder,
            borderRadius: fieldRadius,
            overflow: "hidden",
          }}
        >
          {prefix != null && (
            <span className="ck-input-addon ck-input-addon--prefix" style={ADDON_STYLE}>
              {prefix}
            </span>
          )}
          {inputEl}
          {suffix != null && (
            <span className="ck-input-addon ck-input-addon--suffix" style={ADDON_STYLE}>
              {suffix}
            </span>
          )}
        </div>
      ) : (
        inputEl
      )}
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
