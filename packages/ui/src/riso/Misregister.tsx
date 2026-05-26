import type { CSSProperties, ReactNode } from "react";

// Misregistration — render text (or any child) twice, with a small
// offset between an "under" duplicate in a second ink color and the
// "top" pass in the primary ink. The signature riso effect.
//
// The under copy is set aria-hidden so screen readers don't double-
// read the content.

export interface MisregisterProps {
  children?: ReactNode;
  // Ink color of the foreground (top) pass.
  ink?: string;
  // Ink color of the misregistered duplicate. Defaults to riso pink.
  offsetInk?: string;
  // Offset of the duplicate, in px. Defaults to {x:3, y:3}.
  offsetX?: number;
  offsetY?: number;
  // Wrap in inline-block? Defaults true. Pass false for block use.
  inline?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Misregister({
  children,
  ink,
  offsetInk = "var(--ck-riso-pink, #FF48B0)",
  offsetX = 3,
  offsetY = 3,
  inline = true,
  className,
  style,
}: MisregisterProps) {
  return (
    <span
      className={className}
      style={{
        display: inline ? "inline-block" : "block",
        position: "relative",
        color: ink ?? "var(--ck-text-primary)",
        ...style,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: offsetY,
          left: offsetX,
          color: offsetInk,
          mixBlendMode: "multiply",
          pointerEvents: "none",
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </span>
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
}
