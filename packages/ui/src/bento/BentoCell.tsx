import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

// One cell inside a <BentoGrid>. Spans configurable column + row
// counts; surface styling matches the chrome (22px radius +
// soft multi-layer shadow under bento). `interactive` enables the
// hover-lift signature animation defined in chrome-bento.css.

export interface BentoCellProps {
  children?: ReactNode;
  colSpan?: number;
  rowSpan?: number;
  // Override the cell's background. Useful for media + gradient
  // cells. Defaults to var(--ck-bg-surface).
  background?: string;
  // Override text color (for high-contrast gradient cells).
  color?: string;
  // Padding inside the cell. Defaults to 20px.
  padding?: number | string;
  // Apply the hover-lift effect. Defaults to false.
  interactive?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
  style?: CSSProperties;
}

export function BentoCell({
  children,
  colSpan = 1,
  rowSpan = 1,
  background,
  color,
  padding = 20,
  interactive = false,
  onClick,
  className,
  style,
}: BentoCellProps) {
  return (
    <div
      data-ck-bento-cell=""
      data-interactive={interactive ? "true" : undefined}
      onClick={onClick}
      className={className}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
        background: background ?? "var(--ck-bg-surface)",
        color,
        border: "1px solid var(--ck-border-subtle)",
        borderRadius: "var(--ck-radius-lg, 22px)",
        boxShadow: "var(--ck-shadow-2)",
        padding,
        overflow: "hidden",
        position: "relative",
        cursor: onClick ? "pointer" : undefined,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
