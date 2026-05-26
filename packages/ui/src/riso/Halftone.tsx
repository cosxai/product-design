import type { CSSProperties, ReactNode } from "react";

// Halftone-tinted image / fill block. Renders a solid ink-color
// background with a halftone dot pattern overlay; if `src` is
// provided, the image sits underneath in `mix-blend-mode: multiply`
// for a duotone-on-paper feel.
//
// Use for hero blocks, empty-state illustrations, photo treatments.

export interface HalftoneProps {
  children?: ReactNode;
  // Optional image source. The image is duotoned via blend modes.
  src?: string;
  alt?: string;
  // Ink color of the dot fill. Defaults to riso pink.
  ink?: string;
  // Dot size in px. Defaults to 1.6.
  dotSize?: number;
  // Dot grid spacing in px. Defaults to 7.
  dotSpacing?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

export function Halftone({
  children,
  src,
  alt = "",
  ink = "var(--ck-riso-pink, #FF48B0)",
  dotSize = 1.6,
  dotSpacing = 7,
  width = "100%",
  height = 200,
  className,
  style,
}: HalftoneProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width,
        height,
        background: ink,
        overflow: "hidden",
        borderRadius: 4,
        ...style,
      }}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "multiply",
            filter: "grayscale(1) contrast(1.15)",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, rgba(26,26,26,0.85) ${dotSize}px, transparent ${dotSize + 0.2}px)`,
          backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
          mixBlendMode: "multiply",
          opacity: 0.55,
        }}
      />
      {children && (
        <div style={{ position: "relative", zIndex: 2, color: "#1A1A1A" }}>{children}</div>
      )}
    </div>
  );
}
