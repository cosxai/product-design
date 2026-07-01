import { cn } from "../lib/cn";

// Custom-styled radio — accent-bordered circle that becomes filled
// accent + white dot when checked. Paired with Checkbox: same
// disabled/label/suffix contract, same 16px hit target size. Use
// this anywhere you'd reach for a `<input type="radio">` — the
// native control renders as the OS accent (blue on macOS by
// default) which doesn't respect --ck-accent per workspace, and the
// unstyled defaults look inconsistent alongside our Checkbox.
//
// Radio is a single option in a group; the caller owns the group's
// selection state and passes `checked` + `onChange` per option.
// Radios with the same `name` still get the browser's native "one
// selected at a time" behaviour if you need form-post semantics; we
// forward it to a hidden native input so aria-pressed on the visual
// button doesn't drift from the actual form value.

export interface RadioProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
  /**
   * Native radio-group name. Optional but recommended: browsers
   * enforce "only one checked at a time" for same-name radios, so
   * passing a shared name is a belt-and-braces guard against a
   * stale onChange handler leaving two visually-checked radios.
   */
  name?: string;
  /**
   * Value that lands in the form-post payload when this radio is
   * checked. Only meaningful when `name` is also set.
   */
  value?: string;
  className?: string;
}

export function Radio({
  checked,
  onChange,
  label,
  suffix,
  disabled,
  name,
  value,
  className,
}: RadioProps) {
  return (
    <label
      className={cn("ck-radio", className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        font: "400 13px/1 var(--ck-font-sans)",
        color: "var(--ck-text-secondary)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        userSelect: "none",
      }}
    >
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && !checked && onChange(true)}
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "1.5px solid var(--ck-accent)",
          background: "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          cursor: disabled ? "not-allowed" : "pointer",
          flexShrink: 0,
        }}
      >
        {checked && (
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--ck-accent)",
              display: "inline-block",
            }}
          />
        )}
      </button>
      {/* Hidden native input keeps the browser's same-name enforcement
          + lets consumers use the surrounding <form> for post payload. */}
      {name && (
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        />
      )}
      {label}
      {suffix && (
        <span style={{ color: "var(--ck-text-tertiary)" }}>{suffix}</span>
      )}
    </label>
  );
}
