import type { ReactNode } from "react";

// Top chrome strip. Three slots — left (crumbs / brand / back arrow),
// center (page-specific affordance like a tab switcher), right
// (actions). Height is exposed as --ck-breadcrumb-height (default
// 64 px) so the right-side panel, command palette, and other fixed-
// position UI can offset themselves correctly.

export interface TopbarProps {
  // Usually <Breadcrumb /> on desktop, page title on mobile.
  left?: ReactNode;
  // Optional centred slot. Hidden if not supplied.
  center?: ReactNode;
  // Right cluster — theme toggle, profile chip, etc.
  right?: ReactNode;
  // Height in px. Default 64. Stamps --ck-breadcrumb-height so
  // sticky elements below can align.
  height?: number;
  className?: string;
}

export function Topbar({
  left,
  center,
  right,
  height = 64,
  className,
}: TopbarProps) {
  return (
    <header
      data-ck-topbar
      className={className}
      style={
        {
          height,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "var(--ck-bg-surface)",
          borderBottom: "1px solid var(--ck-border-subtle)",
          ["--ck-breadcrumb-height" as string]: `${height}px`,
        } as React.CSSProperties
      }
    >
      <div style={{ flex: "1 1 auto", minWidth: 0 }}>{left}</div>
      {center && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {center}
        </div>
      )}
      {right && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "none" }}>
          {right}
        </div>
      )}
    </header>
  );
}
