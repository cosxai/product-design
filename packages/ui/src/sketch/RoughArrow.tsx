import type { CSSProperties } from "react";

// Inline SVG hand-drawn arrow. Used between elements on a canvas
// to indicate connection / flow, or as an annotation pointer.
// The path is hand-tuned to feel drawn, not generated — small
// kinks, asymmetric arrowhead. Stroke color + width controllable.
//
// The arrow draws on via stroke-dasharray animation on mount when
// `animated` is true.

export interface RoughArrowProps {
  // Endpoints in px (relative to the SVG's own coordinate space).
  from?: [number, number];
  to?: [number, number];
  // Stroke color. Defaults to ink.
  ink?: string;
  // Stroke thickness. Defaults to 2.
  thickness?: number;
  // Curve amount — 0 is a straight wobble, 1 is a strong arc.
  curve?: number;
  // Animate the draw-on. Defaults to false (instant).
  animated?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

export function RoughArrow({
  from = [10, 40],
  to = [220, 40],
  ink = "var(--ck-text-primary, #1A1A1A)",
  thickness = 2,
  curve = 0.4,
  animated = false,
  width = 240,
  height = 80,
  className,
  style,
}: RoughArrowProps) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  // Perpendicular for the control offsets — produces a gentle arc.
  const px = -dy / len;
  const py = dx / len;
  // Two control points with tiny irregular wobble.
  const cx1 = x1 + dx * 0.3 + px * len * curve * 0.4;
  const cy1 = y1 + dy * 0.3 + py * len * curve * 0.4;
  const cx2 = x1 + dx * 0.7 + px * len * curve * 0.5 + 2;
  const cy2 = y1 + dy * 0.7 + py * len * curve * 0.5 - 1;

  const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

  // Arrowhead — two strokes meeting at (x2,y2). Length and angle
  // pre-computed from the (cx2 → x2) direction.
  const ahLen = 14;
  const angle = Math.atan2(y2 - cy2, x2 - cx2);
  const aOpen = 0.45;
  const ax1 = x2 - Math.cos(angle - aOpen) * ahLen;
  const ay1 = y2 - Math.sin(angle - aOpen) * ahLen;
  const ax2 = x2 - Math.cos(angle + aOpen) * ahLen;
  const ay2 = y2 - Math.sin(angle + aOpen) * ahLen;

  // Pen-press effect — slightly thicker stroke at start/end via
  // overlaid short paths. Keeps SVG light, no shaders.
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${typeof width === "number" ? width : 240} ${typeof height === "number" ? height : 80}`}
      style={{ overflow: "visible", display: "block", ...style }}
      aria-hidden
    >
      <g
        fill="none"
        stroke={ink}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={thickness}
      >
        <path d={path} className={animated ? "ck-sketch-drawon" : undefined} style={animated ? { ["--ck-sketch-len" as never]: len + 30 } : undefined} />
        <path d={`M ${x2} ${y2} L ${ax1} ${ay1}`} />
        <path d={`M ${x2} ${y2} L ${ax2} ${ay2}`} />
      </g>
    </svg>
  );
}
