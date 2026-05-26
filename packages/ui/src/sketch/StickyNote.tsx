import type { CSSProperties, ReactNode } from "react";

// Yellow / pink / green sticky note with a tiny rotation, hand-
// drawn second-stroke shadow, and handwriting-leaning font.
// Useful for callouts, empty-state captions, toasts.

export interface StickyNoteProps {
  children?: ReactNode;
  color?: "yellow" | "pink" | "green" | "blue" | "orange";
  // Rotation in degrees. Defaults to a small alternating tilt.
  tilt?: number;
  width?: number | string;
  className?: string;
  style?: CSSProperties;
}

const COLORS: Record<NonNullable<StickyNoteProps["color"]>, string> = {
  yellow: "#FFF3B0",
  pink:   "#FFD1E3",
  green:  "#D6F0DC",
  blue:   "#D6E8FF",
  orange: "#FFE0C7",
};

export function StickyNote({
  children,
  color = "yellow",
  tilt = -2,
  width = 220,
  className,
  style,
}: StickyNoteProps) {
  return (
    <div
      className={className}
      style={{
        background: COLORS[color],
        width,
        minHeight: 120,
        padding: "18px 18px 22px",
        border: "1.5px solid rgba(26,26,26,0.5)",
        borderRadius: "4px 8px 5px 9px / 6px 4px 9px 5px",
        boxShadow:
          "3px 4px 0 rgba(26,26,26,0.85), 6px 10px 18px rgba(0,0,0,0.08)",
        transform: `rotate(${tilt}deg)`,
        font:
          "500 17px/1.45 \"Caveat\", \"Patrick Hand\", \"Kalam\", \"Comic Sans MS\", cursive",
        color: "#1A1A1A",
        position: "relative",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
