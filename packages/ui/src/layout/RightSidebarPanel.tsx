import type { ReactNode, CSSProperties } from "react";

// Floating right-side panel. Used for ephemeral side surfaces —
// comments, signing management, review-link list, etc. Unlike the
// always-on AgentRail-style right rail, this is summoned by user
// action and dismissed via the close button or Esc.
//
// Sticks below the topbar (reads --ck-breadcrumb-height), max-height
// leaves room for any bottom-fixed UI (--ck-tabbar-height).
// Caller owns the open/close state.

export interface RightSidebarPanelProps {
  open: boolean;
  onClose: () => void;
  // Required — small uppercase eyebrow above the title slot.
  eyebrow: string;
  title?: ReactNode;
  // Right-side header slot (e.g. filter dropdown). Sits beside the
  // close button.
  headerExtras?: ReactNode;
  children: ReactNode;
  // px. Default 320.
  width?: number;
  // px offset from viewport edges. Default 12.
  edgeOffset?: number;
  className?: string;
}

export function RightSidebarPanel({
  open,
  onClose,
  eyebrow,
  title,
  headerExtras,
  children,
  width = 320,
  edgeOffset = 12,
  className,
}: RightSidebarPanelProps) {
  if (!open) return null;
  const topOffset = `calc(var(--ck-breadcrumb-height, 64px) + ${edgeOffset}px)`;
  const bottomOffset = `calc(var(--ck-tabbar-height, 0px) + ${edgeOffset}px)`;
  return (
    <aside
      role="complementary"
      className={className}
      style={
        {
          position: "fixed",
          top: topOffset,
          right: edgeOffset,
          width,
          maxHeight: `calc(100vh - ${topOffset} - ${bottomOffset})`,
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
          borderRadius: "var(--ck-radius-md)",
          boxShadow: "var(--ck-shadow-2)",
          display: "flex",
          flexDirection: "column",
          zIndex: 60,
          fontFamily: "var(--ck-font-sans)",
        } as CSSProperties
      }
    >
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid var(--ck-border-subtle)",
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="ck-eyebrow" style={{ marginBottom: title ? 4 : 0 }}>
            {eyebrow}
          </div>
          {title && (
            <div
              style={{
                font: "500 14px/1.3 var(--ck-font-sans)",
                color: "var(--ck-text-primary)",
              }}
            >
              {title}
            </div>
          )}
        </div>
        {headerExtras}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            border: "none",
            background: "transparent",
            color: "var(--ck-text-tertiary)",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 2,
            marginLeft: 4,
          }}
        >
          ×
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>{children}</div>
    </aside>
  );
}
