import { cn } from "../lib/cn";

// iOS-style track + knob toggle. Off-state track uses
// --ck-text-secondary (not --ck-border-subtle which is near-invisible
// on dark backgrounds — same lesson learned in the parent project).
// Knob is fixed white so it reads on either accent or gray track.

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  suffix,
  disabled,
  className,
}: ToggleSwitchProps) {
  return (
    <label
      className={cn("ck-toggle", className)}
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
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          position: "relative",
          width: 34,
          height: 20,
          borderRadius: 999,
          border: "1px solid var(--ck-text-tertiary)",
          background: checked ? "var(--ck-accent)" : "var(--ck-text-secondary)",
          padding: 0,
          cursor: disabled ? "not-allowed" : "pointer",
          flexShrink: 0,
          transition: "background var(--ck-dur-fast) var(--ck-ease)",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 16 : 2,
            width: 14,
            height: 14,
            background: "#FFFFFF",
            borderRadius: "50%",
            boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
            transition: "left var(--ck-dur-fast) var(--ck-ease)",
          }}
        />
      </button>
      {label}
      {suffix && (
        <span style={{ color: "var(--ck-text-tertiary)" }}>{suffix}</span>
      )}
    </label>
  );
}
