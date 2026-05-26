import type { ReactNode, CSSProperties } from "react";
import { cn } from "../lib/cn";

export interface CardProps {
  // Eyebrow + title bar at the top. Pass any nodes; common pattern
  // is <span className="ck-eyebrow">...</span> + <h3>...</h3>.
  header?: ReactNode;
  // Right-aligned actions next to the header (e.g. action buttons).
  headerActions?: ReactNode;
  // Bottom strip (typically buttons or meta info).
  footer?: ReactNode;
  children?: ReactNode;
  // Disable the default body padding (when the children manage
  // their own — e.g. a list with full-bleed rows).
  noPad?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Card({
  header,
  headerActions,
  footer,
  children,
  noPad,
  className,
  style,
}: CardProps) {
  return (
    <section className={cn("ck-card", className)} style={style}>
      {(header || headerActions) && (
        <header className="ck-card__head">
          <div style={{ flex: 1, minWidth: 0 }}>{header}</div>
          {headerActions}
        </header>
      )}
      <div className={noPad ? undefined : "ck-card__body"}>{children}</div>
      {footer && <footer className="ck-card__foot">{footer}</footer>}
    </section>
  );
}
