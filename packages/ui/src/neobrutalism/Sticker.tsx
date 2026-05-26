import type { ReactNode, CSSProperties } from "react";

// Rotated badge — "NEW!", "FREE!", "v2.0!" style. Sits in the
// corner of featured cards or banners. Filled with an accent
// colour, thick border, hard shadow, slight tilt to read as a
// physical sticker pinned on the page.

export interface StickerProps {
  children: ReactNode;
  // Tilt angle in degrees. Default -8 (slight left lean —
  // pleasing eye-tilt without going crazy).
  rotate?: number;
  // Fill tone. "accent" / "warning" / "success" / "critical"
  // pick from token palette; pass a hex string to override.
  tone?: "accent" | "warning" | "success" | "critical" | string;
  // px diameter — sticker is square so width == height.
  size?: number;
  className?: string;
  style?: CSSProperties;
}

function toneToBg(tone: NonNullable<StickerProps["tone"]>) {
  switch (tone) {
    case "accent":
      return "var(--ck-accent, #88AAEE)";
    case "warning":
      return "var(--ck-warning, #FFD23F)";
    case "success":
      return "var(--ck-success, #A3E636)";
    case "critical":
      return "var(--ck-critical, #FF6B6B)";
    default:
      return tone;
  }
}

export function Sticker({
  children,
  rotate = -8,
  tone = "warning",
  size = 80,
  className,
  style,
}: StickerProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: size,
        height: size,
        padding: 6,
        background: toneToBg(tone),
        color: "#000",
        border: "2px solid var(--neobrut-ink, #000)",
        borderRadius: "50%",
        boxShadow: "3px 3px 0 0 var(--neobrut-ink, #000)",
        transform: `rotate(${rotate}deg)`,
        font: "800 14px/1.1 var(--ck-font-display, var(--ck-font-sans))",
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
