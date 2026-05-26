import type { CSSProperties } from "react";

// Pure CSS 3D glass orb — the "Aero" / Vista / iOS 6 marble.
// Layered radial gradients: deep accent base, top white highlight,
// bottom internal reflection, soft outer glow. Drop it anywhere
// you want a hero / empty-state decoration.

export interface GlossyOrbProps {
  size?: number;
  // Tint of the orb. Defaults to aqua (Aero blue). Pass any color.
  tone?: "aqua" | "lime" | "rose" | "amber";
  // Disable the slow rotation animation.
  static?: boolean;
  className?: string;
  style?: CSSProperties;
}

const TONES: Record<NonNullable<GlossyOrbProps["tone"]>, { base: string; deep: string; glow: string }> = {
  aqua:  { base: "#4FC3F7", deep: "#01579B", glow: "rgba(79, 195, 247, 0.55)" },
  lime:  { base: "#DCFF66", deep: "#7CB342", glow: "rgba(198, 255, 0, 0.55)" },
  rose:  { base: "#F48FB1", deep: "#AD1457", glow: "rgba(244, 143, 177, 0.55)" },
  amber: { base: "#FFCA28", deep: "#E65100", glow: "rgba(255, 152, 0, 0.55)" },
};

export function GlossyOrb({
  size = 96,
  tone = "aqua",
  static: noSpin,
  className,
  style,
}: GlossyOrbProps) {
  const t = TONES[tone];
  return (
    <div
      className={className}
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        position: "relative",
        background: `
          radial-gradient(circle at 50% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.0) 32%),
          radial-gradient(circle at 50% 95%, ${t.base} 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, ${t.base} 0%, ${t.deep} 100%)
        `,
        boxShadow: `
          0 ${size * 0.12}px ${size * 0.28}px ${t.glow},
          inset 0 ${size * 0.08}px ${size * 0.12}px rgba(255, 255, 255, 0.55),
          inset 0 -${size * 0.08}px ${size * 0.16}px rgba(0, 0, 0, 0.22)
        `,
        animation: noSpin ? undefined : "ck-frutiger-orb-spin 18s linear infinite",
        ...style,
      }}
    >
      {/* Specular highlight — small bright cap top-left */}
      <span
        style={{
          position: "absolute",
          top: size * 0.1,
          left: size * 0.22,
          width: size * 0.36,
          height: size * 0.22,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
      <style>{`
        @keyframes ck-frutiger-orb-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-ck-glossy-orb] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
