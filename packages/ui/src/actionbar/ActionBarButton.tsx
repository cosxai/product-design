import type { ReactNode, CSSProperties } from "react";
import { cn } from "../lib/cn";

// Single button inside the action bar — used both for top-level
// items and for entries inside expanded group menus.
//
// Three visual variants:
//   - ghost   → default. Transparent bg, neutral text. Active
//               state promotes to accent muted bg.
//   - primary → solid accent fill, white text. For items whose
//               "this mode is on" signal should beat the "this
//               group is open" signal (e.g. an editing-mode toggle
//               nested in a Manage group, while Manage is open).
//   - soft    → transparent bg, accent-coloured text. Used for
//               open group HEADS where the wrapper supplies a
//               muted-accent bg; the head just needs the
//               foreground to read as accent.

export interface ActionBarButtonProps {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  title?: string;
  variant?: "ghost" | "primary" | "soft";
  disabled?: boolean;
  hint?: string;
  // Optional chevron — used by group heads to signal disclosure.
  chevron?: "right";
  // 180° rotation when true (▸ becomes ◂ — reads as "close").
  chevronRotated?: boolean;
  // Hide label below md viewport (768 px). Default true.
  responsiveLabel?: boolean;
  style?: CSSProperties;
}

export function ActionBarButton({
  icon,
  label,
  onClick,
  active,
  title,
  variant = "ghost",
  disabled,
  hint,
  chevron,
  chevronRotated,
  responsiveLabel = true,
  style,
}: ActionBarButtonProps) {
  const isPrimary = active || variant === "primary";
  const isSoft = !isPrimary && variant === "soft";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title ?? label}
      className={cn(
        "ck-actionbar-btn",
        isPrimary && "ck-actionbar-btn--primary",
        !isPrimary && "ck-actionbar-btn--ghost",
      )}
      style={{
        ...(isSoft ? { color: "var(--ck-accent)" } : undefined),
        ...style,
      }}
    >
      {icon}
      <span className={responsiveLabel ? "ck-actionbar-label" : undefined}>
        {label}
      </span>
      {hint && (
        <span
          style={{
            color: isPrimary ? "rgba(255,255,255,0.7)" : "var(--ck-text-tertiary)",
            font: "500 11px/1 var(--ck-font-mono)",
            marginLeft: 4,
          }}
        >
          {hint}
        </span>
      )}
      {chevron && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            flexShrink: 0,
            opacity: 0.7,
            transform: chevronRotated ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 220ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <polyline points="9 6 15 12 9 18" />
        </svg>
      )}
    </button>
  );
}
