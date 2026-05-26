import type { CSSProperties } from "react";

// Thin gradient strip — the Superbar pattern reusable as a
// horizontal divider, a tab underline, or a progress bar fill.
// 1-2 px tall by default; override via `thickness`.

export interface SuperbarStripProps {
  // px height. Default 1 (hairline divider).
  thickness?: number;
  // CSS width — defaults to 100%.
  width?: string | number;
  className?: string;
  style?: CSSProperties;
}

export function SuperbarStrip({
  thickness = 1,
  width = "100%",
  className,
  style,
}: SuperbarStripProps) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        width,
        height: thickness,
        background: "var(--ck-superbar)",
        borderRadius: thickness >= 2 ? thickness / 2 : 0,
        opacity: 0.85,
        ...style,
      }}
    />
  );
}
