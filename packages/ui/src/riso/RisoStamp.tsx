import type { CSSProperties, ReactNode } from "react";

// Hand-stamped label — slightly rotated, bordered, with an offset
// ink block "shadow." The riso equivalent of a Tag but louder.
// Use for "NEW", "LIMITED", "ED. 01", "OUT NOW" annotations
// layered over photos / hero blocks.

export interface RisoStampProps {
  children?: ReactNode;
  // Ink color of the stamp face. Defaults to pink.
  ink?: "pink" | "blue" | "yellow" | "orange" | "teal" | "violet" | "red" | "green";
  // Ink color of the offset block behind. Defaults to ink-black.
  offset?: "pink" | "blue" | "yellow" | "orange" | "teal" | "violet" | "red" | "green" | "ink";
  // Rotation in degrees. Defaults to -4.
  rotate?: number;
  // Larger / smaller sizing presets.
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
}

const INKS: Record<string, string> = {
  pink:   "var(--ck-riso-pink, #FF48B0)",
  blue:   "var(--ck-riso-blue, #3D5AFE)",
  yellow: "var(--ck-riso-yellow, #FFE100)",
  orange: "var(--ck-riso-orange, #FF6F3C)",
  teal:   "var(--ck-riso-teal, #00A99D)",
  violet: "var(--ck-riso-violet, #765BA7)",
  red:    "var(--ck-riso-red, #F02D2D)",
  green:  "var(--ck-riso-green, #00A95C)",
  ink:    "var(--ck-text-primary, #1A1A1A)",
};

const SIZES = {
  sm: { font: 10, padX: 6, padY: 3, offset: 2 },
  md: { font: 12, padX: 10, padY: 5, offset: 3 },
  lg: { font: 16, padX: 14, padY: 7, offset: 4 },
} as const;

export function RisoStamp({
  children,
  ink = "pink",
  offset = "ink",
  rotate = -4,
  size = "md",
  className,
  style,
}: RisoStampProps) {
  const inkColor = INKS[ink] ?? INKS.pink;
  const offsetColor = INKS[offset] ?? INKS.ink;
  const s = SIZES[size];
  // Yellow / lime ink reads better with dark text.
  const lightOnDark = ink === "yellow" || ink === "orange" || ink === "green" || ink === "pink";
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        background: inkColor,
        color: lightOnDark ? "#1A1A1A" : "#F8F1DE",
        border: "2px solid #1A1A1A",
        borderRadius: 4,
        padding: `${s.padY}px ${s.padX}px`,
        font: `800 ${s.font}px/1 "Helvetica Neue", "Inter", system-ui, sans-serif`,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        boxShadow: `${s.offset}px ${s.offset}px 0 ${offsetColor}`,
        transform: `rotate(${rotate}deg)`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
