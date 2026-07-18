import { cn } from "../lib/cn";

// SegmentedControl — a horizontal set of mutually-exclusive options
// rendered as one pill-shaped track with a raised "active" segment.
// Use it where the choice swaps the content below it (mode switch,
// filter scope), i.e. wherever a pair of radio buttons would be
// semantically right but visually too quiet. For true page-level
// navigation reach for router links instead; for on/off state use
// ToggleSwitch.
//
// The caller owns the selection: pass `value` + `onChange`, one
// option per segment. Per-option `disabled` renders the segment
// non-interactive with a hint via `title` (a disabled option should
// tell the user why — pass `disabledHint`).
//
// Semantics are a radiogroup (not tabs): arrow keys move selection
// directly, matching native radio behaviour, and screen readers
// announce "x of y" positioning for free.

export interface SegmentedControlOption<V extends string = string> {
  value: V;
  label: React.ReactNode;
  disabled?: boolean;
  /** Shown as the native tooltip on a disabled segment — say WHY. */
  disabledHint?: string;
  "data-testid"?: string;
}

export interface SegmentedControlProps<V extends string = string> {
  value: V;
  onChange: (next: V) => void;
  options: SegmentedControlOption<V>[];
  /** Disables the whole control (per-option disabled still applies). */
  disabled?: boolean;
  /** "full" stretches the track and gives segments equal width. */
  fit?: "auto" | "full";
  "aria-label"?: string;
  className?: string;
  "data-testid"?: string;
}

export function SegmentedControl<V extends string = string>({
  value,
  onChange,
  options,
  disabled,
  fit = "auto",
  "aria-label": ariaLabel,
  className,
  "data-testid": testId,
}: SegmentedControlProps<V>) {
  // Arrow keys move selection to the nearest enabled neighbour,
  // wrapping — the native radio-group keyboard model.
  const move = (from: number, step: 1 | -1) => {
    for (let i = 1; i <= options.length; i++) {
      const next = options[(from + step * i + options.length * i) % options.length];
      if (next && !next.disabled) {
        onChange(next.value);
        return;
      }
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("ck-segmented", className)}
      data-testid={testId}
      style={{
        display: fit === "full" ? "flex" : "inline-flex",
        alignItems: "stretch",
        gap: 2,
        padding: 2,
        borderRadius: 8,
        border: "1px solid var(--ck-border-subtle)",
        background: "var(--ck-bg-muted)",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        const optDisabled = disabled || opt.disabled;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={optDisabled}
            title={opt.disabled ? opt.disabledHint : undefined}
            data-testid={opt["data-testid"]}
            // Roving tabindex: the group is one tab stop; arrows walk it.
            tabIndex={selected ? 0 : -1}
            onClick={() => !optDisabled && !selected && onChange(opt.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                move(i, 1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                move(i, -1);
              }
            }}
            style={{
              flex: fit === "full" ? 1 : undefined,
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid transparent",
              font: `500 13px/1.2 var(--ck-font-sans)`,
              color: selected
                ? "var(--ck-text-primary)"
                : "var(--ck-text-secondary)",
              background: selected ? "var(--ck-bg-surface)" : "transparent",
              boxShadow: selected ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
              borderColor: selected ? "var(--ck-border-subtle)" : "transparent",
              cursor: optDisabled ? "not-allowed" : "pointer",
              opacity: opt.disabled && !disabled ? 0.45 : 1,
              whiteSpace: "nowrap",
              transition: "background 120ms ease, color 120ms ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
