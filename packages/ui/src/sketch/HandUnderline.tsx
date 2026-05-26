import type { CSSProperties, ReactNode } from "react";

// Wraps a string of text with a hand-drawn underline. The
// underline is a CSS-only wobble using the same SVG-filter trick
// the chrome uses on hr / .ck-card head strokes. Falls back to a
// solid 2px line in browsers that ignore the data-URL filter.

export interface HandUnderlineProps {
  children?: ReactNode;
  // Underline color. Defaults to the current text color.
  ink?: string;
  // Thickness in px. Defaults to 2.
  thickness?: number;
  className?: string;
  style?: CSSProperties;
}

export function HandUnderline({
  children,
  ink = "currentColor",
  thickness = 2,
  className,
  style,
}: HandUnderlineProps) {
  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        paddingBottom: 2,
        ...style,
      }}
    >
      {children}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -1,
          height: thickness,
          background: ink,
          borderRadius: thickness,
          filter: "var(--ck-sketch-wobble)",
          opacity: 0.85,
          pointerEvents: "none",
        }}
      />
    </span>
  );
}
