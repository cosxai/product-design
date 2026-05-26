import type { CSSProperties, ReactNode } from "react";

// Drop-in section backdrop. The frutiger chrome already paints the
// page with a sky gradient — this component is for opt-in moments
// inside other chromes (a hero banner under chrome="classic", a
// preview area in the theming page) without flipping the whole app.

export interface SkyBackdropProps {
  children?: ReactNode;
  // Add the floating sparkle particles. Defaults to true.
  sparkles?: boolean;
  // Add soft white cumulus blobs near the bottom. Defaults to true.
  clouds?: boolean;
  // Variant: dusk swaps the gradient for indigo→lavender→pink.
  variant?: "day" | "dusk";
  className?: string;
  style?: CSSProperties;
}

const DAY_BG = "linear-gradient(180deg, #87CEEB 0%, #B3E5FC 45%, #E1F5FE 100%)";
const DUSK_BG = "linear-gradient(180deg, #2E2280 0%, #6A4C93 40%, #F4A6CD 80%, #FFD8B1 100%)";

export function SkyBackdrop({
  children,
  sparkles = true,
  clouds = true,
  variant = "day",
  className,
  style,
}: SkyBackdropProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        background: variant === "dusk" ? DUSK_BG : DAY_BG,
        ...style,
      }}
    >
      {clouds && <Clouds variant={variant} />}
      {sparkles && <Sparkles />}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

function Clouds({ variant }: { variant: "day" | "dusk" }) {
  const tint = variant === "dusk" ? "rgba(255, 220, 230, 0.5)" : "rgba(255, 255, 255, 0.6)";
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(ellipse 280px 80px at 14% 78%, ${tint} 0%, transparent 70%),
          radial-gradient(ellipse 360px 90px at 72% 86%, ${tint} 0%, transparent 70%),
          radial-gradient(ellipse 200px 60px at 50% 92%, ${tint} 0%, transparent 70%)
        `,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

function Sparkles() {
  // 14 deterministic positions — random feels jittery on reload.
  const dots = [
    { x: 8, y: 22, s: 3, o: 0.85 },
    { x: 18, y: 12, s: 2, o: 0.65 },
    { x: 31, y: 32, s: 4, o: 0.9 },
    { x: 44, y: 18, s: 2, o: 0.55 },
    { x: 56, y: 42, s: 3, o: 0.7 },
    { x: 68, y: 14, s: 2, o: 0.6 },
    { x: 76, y: 30, s: 5, o: 0.8 },
    { x: 88, y: 24, s: 2, o: 0.55 },
    { x: 22, y: 56, s: 3, o: 0.55 },
    { x: 38, y: 64, s: 2, o: 0.5 },
    { x: 60, y: 60, s: 4, o: 0.7 },
    { x: 82, y: 50, s: 2, o: 0.55 },
    { x: 12, y: 42, s: 2, o: 0.5 },
    { x: 50, y: 28, s: 2, o: 0.7 },
  ];
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {dots.map((d, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.s,
            height: d.s,
            borderRadius: "50%",
            background: "#FFFFFF",
            opacity: d.o,
            boxShadow: `0 0 ${d.s * 4}px ${d.s * 1.5}px rgba(255, 255, 255, ${d.o * 0.55})`,
          }}
        />
      ))}
    </div>
  );
}
