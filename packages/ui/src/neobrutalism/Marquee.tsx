import type { CSSProperties } from "react";

// Looping marquee strip — the signature neobrutalism section
// divider. "NEOBRUTALISM · NEOBRUTALISM · NEOBRUTALISM…" in
// chunky 800-weight type, scrolling horizontally. Decoration,
// not nav.
//
// Pure CSS animation — no rAF loops, no JS. The repeated text
// inside is doubled so when the first set scrolls past the edge,
// the second is already in position to seamlessly continue.

export interface MarqueeProps {
  text: string;
  // Pixels per second. Default 60 — comfortable reading speed.
  speed?: number;
  // Visual variant. "default" = accent background; "inverted" =
  // pure black background with white text.
  variant?: "default" | "inverted";
  // px height. Default 56.
  height?: number;
  // Slight skew angle (deg). Default 0; try -2 for a punk feel.
  skew?: number;
  className?: string;
  style?: CSSProperties;
}

export function Marquee({
  text,
  speed = 60,
  variant = "default",
  height = 56,
  skew = 0,
  className,
  style,
}: MarqueeProps) {
  // Each phrase is ~80 px wide for a typical 20-char fragment;
  // 10 copies gives ~800 px content — wide enough that the loop
  // is always seamless on any viewport. Real measurement happens
  // visually; for now the count + duration combo just need to be
  // multiples that produce a continuous loop.
  const phrases = new Array(10).fill(text).join("  •  ");
  const duration = `${(phrases.length * 8) / speed}s`;

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        height,
        background:
          variant === "inverted" ? "#000000" : "var(--ck-accent, #88AAEE)",
        color: variant === "inverted" ? "#FFFFFF" : "#000000",
        border: "2px solid var(--neobrut-ink, #000)",
        borderRadius: 4,
        transform: skew ? `skewY(${skew}deg)` : undefined,
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          gap: 40,
          whiteSpace: "nowrap",
          font: "800 22px/1 var(--ck-font-display, var(--ck-font-sans))",
          letterSpacing: "0.04em",
          animation: `ck-neobrut-marquee ${duration} linear infinite`,
          willChange: "transform",
        }}
      >
        {/* Doubled for seamless loop. CSS animation translates by
            -50% so the second copy moves into the first's position. */}
        <span>{phrases}</span>
        <span aria-hidden>{phrases}</span>
      </div>
    </div>
  );
}
