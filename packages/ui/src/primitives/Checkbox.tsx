import { cn } from "../lib/cn";

// Custom-styled checkbox — accent-bordered square that becomes filled
// accent + white tick when checked. The native <input type="checkbox">
// renders as a giant white card on dark backgrounds in most browsers,
// which is exactly the bug that prompted this primitive in the parent
// project. Use this anywhere you'd reach for a checkbox.

export interface CheckboxProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  suffix,
  disabled,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn("ck-checkbox", className)}
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
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: "1.5px solid var(--ck-accent)",
          background: checked ? "var(--ck-accent)" : "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          cursor: disabled ? "not-allowed" : "pointer",
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M2.5 6.5L5 9L9.5 3.5"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      {label}
      {suffix && (
        <span style={{ color: "var(--ck-text-tertiary)" }}>{suffix}</span>
      )}
    </label>
  );
}
