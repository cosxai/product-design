import type { CSSProperties, ReactNode } from "react";

// Standalone ambient-mesh backdrop primitive. The ambient chrome
// applies its mesh on `body` automatically, so consumers don't
// usually need this. Use it when you want an ambient look INSIDE
// a single section (a hero banner, a preview region) without
// flipping the whole app's chrome.

export interface AmbientBackdropProps {
  children?: ReactNode;
  // Use light variant tints instead of dark. Default auto-detects
  // via prefers-color-scheme.
  variant?: "dark" | "light";
  // Hide the noise overlay. Default false.
  noise?: boolean;
  className?: string;
  style?: CSSProperties;
}

const DARK_BG = `
  radial-gradient(ellipse at 18% 22%, #3A2A66 0%, transparent 55%),
  radial-gradient(ellipse at 82% 70%, #2A1E50 0%, transparent 52%),
  radial-gradient(ellipse at 50% 110%, #4A2870 0%, transparent 50%),
  #1A1525
`;

const LIGHT_BG = `
  radial-gradient(ellipse at 20% 24%, #FCEFE5 0%, transparent 55%),
  radial-gradient(ellipse at 78% 70%, #EFEAF8 0%, transparent 52%),
  radial-gradient(ellipse at 50% 110%, #FFE8DC 0%, transparent 50%),
  #F6F4F0
`;

export function AmbientBackdrop({
  children,
  variant,
  noise,
  className,
  style,
}: AmbientBackdropProps) {
  // Auto-pick from prefers-color-scheme when not explicit. SSR-
  // safe: defaults to dark, the canonical Superlist look.
  const isDark =
    variant === "dark" ||
    (variant === undefined &&
      (typeof window === "undefined" ||
        window.matchMedia?.("(prefers-color-scheme: dark)").matches));
  return (
    <div
      className={className}
      style={{
        position: "relative",
        background: isDark ? DARK_BG : LIGHT_BG,
        ...style,
      }}
    >
      {noise && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.025,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
            mixBlendMode: "overlay",
          }}
        />
      )}
      {children}
    </div>
  );
}
