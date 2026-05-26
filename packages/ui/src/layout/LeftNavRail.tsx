import { useEffect, type ReactNode, type CSSProperties } from "react";

// Fixed-left vertical nav rail. Three slots — brand (top), children
// (the nav body, scrollable), footer (avatar / collapse toggle).
//
// Owns the CSS var --ck-leftnav-width. Page content reads this var
// to inset itself, so layouts react to the rail width changing
// without prop-drilling.
//
// Stateless visually: collapsed is a boolean prop. State management
// lives in useNavRailState(), which the parent owns; this keeps the
// component pure and testable.

export interface LeftNavRailProps {
  brand?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  // Expanded / collapsed widths in px. Defaults 256 / 56.
  widthExpanded?: number;
  widthCollapsed?: number;
  className?: string;
  // Hide entirely (e.g. on phone). When true, sets --ck-leftnav-width: 0.
  hidden?: boolean;
}

export function LeftNavRail({
  brand,
  children,
  footer,
  collapsed = false,
  widthExpanded = 256,
  widthCollapsed = 56,
  className,
  hidden = false,
}: LeftNavRailProps) {
  const width = hidden ? 0 : collapsed ? widthCollapsed : widthExpanded;

  // Stamp --ck-leftnav-width on documentElement so page-level
  // layouts (Shell's marginLeft, fixed AgentRail, ActionBar's right
  // inset) can read it without a context.
  useEffect(() => {
    document.documentElement.style.setProperty("--ck-leftnav-width", `${width}px`);
    return () => {
      // On unmount, clear to 0 so consumers without a rail don't inherit
      // a stale inset.
      document.documentElement.style.setProperty("--ck-leftnav-width", "0px");
    };
  }, [width]);

  if (hidden) return null;

  return (
    <aside
      data-ck-leftnav
      className={className}
      style={
        {
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width,
          // Default to --ck-bg-surface so the rail blends seamlessly
          // with the topbar + cards. Consumers wanting a tinted rail
          // override via --ck-bg-sidebar in their own stylesheet or
          // pass a className that sets background.
          background: "var(--ck-bg-surface)",
          borderRight: "1px solid var(--ck-border-subtle)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--ck-font-sans)",
          color: "var(--ck-text-primary)",
          transition: "width var(--ck-dur-fast) var(--ck-ease), background-color 200ms var(--ck-ease)",
          zIndex: 30,
        } as CSSProperties
      }
    >
      {brand && (
        <div
          style={{
            // Match the topbar's height (Topbar stamps
            // --ck-breadcrumb-height; default 64 px). Logo +
            // crumbs sit on the same horizontal axis and the
            // brand-area bottom rule aligns with the topbar's
            // bottom rule — no per-app tuning.
            height: "var(--ck-breadcrumb-height, 64px)",
            padding: collapsed ? "0 4px" : "0 12px",
            display: "flex",
            alignItems: "center",
            // Logo is brand mark, not nav item — centre it in both
            // collapsed and expanded states so the visual anchor stays
            // put across the width transition. Matches the centred
            // favicon position when the rail is collapsed.
            justifyContent: "center",
            borderBottom: "1px solid var(--ck-border-subtle)",
            transition: "padding var(--ck-dur-fast) var(--ck-ease)",
            flexShrink: 0,
          }}
        >
          {brand}
        </div>
      )}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: collapsed ? "8px 4px" : "12px 8px",
        }}
      >
        {children}
      </div>
      {footer && (
        <div
          style={{
            padding: collapsed ? "8px 4px" : "12px 8px",
            borderTop: "1px solid var(--ck-border-subtle)",
          }}
        >
          {footer}
        </div>
      )}
    </aside>
  );
}
