import type { ReactNode, CSSProperties } from "react";

// Bordered block with an ASCII-style title cut into the top
// border — `╭─ logs ──╮`. Implementation uses a regular CSS
// border + an absolutely-positioned title that masks a slice of
// the border with the page background.
//
// Looks best under terminal chrome but works under any —
// consumers can use it as a "labelled block" anywhere.

export interface AsciiBoxProps {
  // Title text shown cut into the top border.
  title?: string;
  children: ReactNode;
  // px padding inside the body. Default 14.
  padding?: number;
  // Background colour to use for the title mask. Defaults to
  // the surrounding canvas. Override to match a parent surface
  // (e.g. when the box sits on a card).
  maskBg?: string;
  className?: string;
  style?: CSSProperties;
}

export function AsciiBox({
  title,
  children,
  padding = 14,
  maskBg = "var(--ck-bg-canvas)",
  className,
  style,
}: AsciiBoxProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        border: "1px solid var(--ck-border-subtle)",
        borderRadius: 2,
        padding,
        fontFamily: "var(--ck-font-mono)",
        ...style,
      }}
    >
      {title && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: -8,
            left: 12,
            padding: "0 6px",
            background: maskBg,
            color: "var(--ck-text-secondary)",
            font: "500 11px/1 var(--ck-font-mono)",
            letterSpacing: 0,
          }}
        >
          ─ {title} ─
        </span>
      )}
      {children}
    </div>
  );
}
