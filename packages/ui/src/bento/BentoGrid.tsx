import type { CSSProperties, ReactNode } from "react";

// 12-column CSS grid wrapper. Cells set their own colSpan/rowSpan
// via <BentoCell>. The grid clamps span values to the column count
// so a 4-wide cell inside an 8-col grid won't overflow.

export interface BentoGridProps {
  children?: ReactNode;
  // Column count. Defaults to 12. Pass 6 / 8 for tighter sections.
  cols?: number;
  // Gap between cells. Defaults to 16px.
  gap?: number;
  // Minimum row height. Cells span discrete rows of this height.
  rowMinHeight?: number;
  className?: string;
  style?: CSSProperties;
}

export function BentoGrid({
  children,
  cols = 12,
  gap = 16,
  rowMinHeight = 120,
  className,
  style,
}: BentoGridProps) {
  return (
    <div
      data-ck-bento-grid=""
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridAutoRows: `minmax(${rowMinHeight}px, auto)`,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
