import type { CSSProperties, ReactNode } from "react";

// A drawn rectangle — used to wrap any content in a "sketched"
// container. CSS-only: asymmetric border-radius + 2px ink stroke
// + offset second stroke shadow. Pair with `tilt` and an optional
// `fill` (transparent | hatch | marker color) for emphasis.
//
// Why a primitive: this is the canonical "drawn rectangle" pattern
// — buttons, cards, sticky notes, tool tips all inherit from it.
// Wrapping it once keeps the wobble math + tilt presets DRY.

export interface RoughBoxProps {
  children?: ReactNode;
  // Tilt in degrees. Defaults to a small -1.
  tilt?: number;
  // Fill style. Defaults to "paper". "hatch" lays down diagonal
  // marker strokes; "marker" floods a translucent marker color.
  fill?: "paper" | "hatch" | "marker" | "transparent";
  // Marker color when fill="hatch" or fill="marker". Accepts any
  // CSS color, including the --ck-sketch-* vars.
  ink?: string;
  // Override radius. Defaults to a chrome-aware asymmetric value.
  radius?: string;
  // Drawing thickness, in px. Defaults to 2.
  stroke?: number;
  // Padding inside the box. Defaults to 16.
  padding?: number | string;
  // Set to true to skip the offset second-stroke shadow.
  flat?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function RoughBox({
  children,
  tilt = -1,
  fill = "paper",
  ink = "var(--ck-sketch-yellow, #F2C94C)",
  radius = "10px 14px 12px 16px / 14px 10px 16px 12px",
  stroke = 2,
  padding = 16,
  flat = false,
  className,
  style,
}: RoughBoxProps) {
  const inkColor = "var(--ck-text-primary, #1A1A1A)";
  let background: string;
  if (fill === "hatch") {
    background = `repeating-linear-gradient(45deg, ${ink} 0 3px, transparent 3px 9px), var(--ck-bg-surface, #FFFEF9)`;
  } else if (fill === "marker") {
    background = `color-mix(in oklab, ${ink} 22%, transparent), var(--ck-bg-surface, #FFFEF9)`;
  } else if (fill === "transparent") {
    background = "transparent";
  } else {
    background = "var(--ck-bg-surface, #FFFEF9)";
  }
  return (
    <div
      className={className}
      style={{
        background,
        border: `${stroke}px solid ${inkColor}`,
        borderRadius: radius,
        boxShadow: flat ? "none" : `3px 4px 0 ${inkColor}`,
        padding,
        transform: `rotate(${tilt}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
