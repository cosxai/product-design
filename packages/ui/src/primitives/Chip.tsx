import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

import { cn } from "../lib/cn";

/**
 * Chip — a compact pill representing one selected value (a recipient,
 * a filter, a tag the user picked). Exists so multi-value inputs
 * (MultiCombobox) and token lists share one removable-item shape
 * instead of each product hand-rolling a "name ×" span.
 *
 * Distinct from `Tag` (uppercase mono STATUS label — "PENDING",
 * "LIVE"): a Chip is sentence-case body text (13px sans), a pill on a
 * muted slab, and is interactive — optional `onClick` turns the label
 * into a button (e.g. "edit this entry"), optional `onRemove` adds
 * the × button.
 *
 * Tones: `neutral` (default), `accent`, `warning` (e.g. "needs a
 * name"), `critical`. `selected` outlines the chip in the accent
 * colour (e.g. the entry currently being edited). `disabled` dims the
 * chip and disables both buttons.
 *
 * Compose with: MultiCombobox (entry row), filter bars, recipient
 * lists on detail pages.
 *
 * Visual: see docs/components/multi-combobox.
 *
 * Forwards ref to the root <span>. Spreads `...rest` onto it so
 * consumers can pass data-* / aria-* / title / style. Chrome presets
 * can restyle via the `[data-ck-chip]` / `data-tone` / `data-selected`
 * hooks — 0.24.0 ships no per-chrome CSS for it.
 */

export type ChipTone = "neutral" | "accent" | "warning" | "critical";

export type ChipProps = Omit<HTMLAttributes<HTMLSpanElement>, "onClick"> & {
  children: ReactNode;
  tone?: ChipTone | undefined;
  // Outline the chip in the accent colour (e.g. "being edited").
  selected?: boolean | undefined;
  // Dim + disable both the label button and the remove button.
  disabled?: boolean | undefined;
  // When set, the label renders as a <button> (e.g. click-to-edit).
  onClick?: (() => void) | undefined;
  // When set, a × button renders after the label.
  onRemove?: (() => void) | undefined;
  // aria-label for the × button. Default "Remove".
  removeLabel?: string | undefined;
  className?: string | undefined;
};

const TONE_FG: Record<ChipTone, string> = {
  neutral: "var(--ck-text-primary, #111)",
  accent: "var(--ck-accent, #4f46e5)",
  warning: "var(--ck-warning, #D97706)",
  critical: "var(--ck-critical, #DC2626)",
};
const TONE_BG: Record<ChipTone, string> = {
  neutral: "var(--ck-bg-muted, #E5E8EE)",
  accent: "var(--ck-accent-muted, rgba(79, 70, 229, 0.08))",
  warning: "var(--ck-warning-muted, #FEF3E7)",
  critical: "var(--ck-critical-muted, #FCEAEA)",
};
const TONE_BORDER: Record<ChipTone, string> = {
  neutral: "var(--ck-border-subtle, #DDE0E6)",
  accent: "var(--ck-accent-border, rgba(79, 70, 229, 0.35))",
  warning: "color-mix(in oklab, var(--ck-warning, #D97706) 35%, transparent)",
  critical: "color-mix(in oklab, var(--ck-critical, #DC2626) 35%, transparent)",
};

// Label text styles — shared by the <span> and <button> renderings so
// the chip looks identical whether or not it is clickable.
const LABEL_STYLE: CSSProperties = {
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  font: "inherit",
  color: "inherit",
  background: "none",
  border: "none",
  padding: 0,
  margin: 0,
  textAlign: "left",
};

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  {
    children,
    tone = "neutral",
    selected = false,
    disabled = false,
    onClick,
    onRemove,
    removeLabel,
    className,
    style,
    ...rest
  },
  ref,
) {
  const clickable = !!onClick && !disabled;
  // Chip buttons act on click but must NOT take focus on mousedown:
  // when a host has an inline editor open for another chip, the
  // editor's blur (commit + unmount) would otherwise run before this
  // click lands and the click is lost. Keyboard focus via Tab is
  // unaffected.
  const keepFocus = (e: MouseEvent<HTMLButtonElement>): void => e.preventDefault();
  return (
    <span
      ref={ref}
      className={cn("ck-chip", className)}
      data-ck-chip
      data-tone={tone}
      data-selected={selected ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        maxWidth: "100%",
        boxSizing: "border-box",
        padding: onRemove ? "3px 6px 3px 10px" : "3px 10px",
        borderRadius: 999,
        background: TONE_BG[tone],
        border: `1px solid ${selected ? "var(--ck-accent, #4f46e5)" : TONE_BORDER[tone]}`,
        boxShadow: selected ? "0 0 0 2px var(--ck-accent-muted, rgba(79, 70, 229, 0.12))" : "none",
        font: "500 13px/1.3 var(--ck-font-sans, system-ui, sans-serif)",
        color: TONE_FG[tone],
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "default" : undefined,
        transition: "border-color var(--ck-dur-fast, 120ms) var(--ck-ease, ease)",
        ...style,
      }}
      {...rest}
    >
      {onClick ? (
        <button
          type="button"
          className="ck-chip-label"
          onMouseDown={keepFocus}
          onClick={onClick}
          disabled={disabled}
          style={{ ...LABEL_STYLE, cursor: clickable ? "pointer" : "default" }}
        >
          {children}
        </button>
      ) : (
        <span className="ck-chip-label" style={LABEL_STYLE}>
          {children}
        </span>
      )}
      {onRemove ? (
        <button
          type="button"
          className="ck-chip-remove"
          aria-label={removeLabel ?? "Remove"}
          onMouseDown={keepFocus}
          onClick={onRemove}
          disabled={disabled}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 16,
            height: 16,
            flexShrink: 0,
            padding: 0,
            margin: 0,
            border: "none",
            borderRadius: 999,
            background: "none",
            color: "inherit",
            opacity: 0.7,
            font: "inherit",
            fontSize: 14,
            lineHeight: 1,
            cursor: disabled ? "default" : "pointer",
          }}
        >
          ×
        </button>
      ) : null}
    </span>
  );
});
