import type { ReactNode } from "react";

// Section header inside <LeftNavRail>. Mono uppercase eyebrow above
// a group of <NavItem>s. Hides its own label in collapsed mode —
// icons are self-explanatory at 56 px and the cluster delimiters
// become visual noise.

export interface NavSectionProps {
  label: string;
  collapsed?: boolean;
  children: ReactNode;
}

export function NavSection({ label, collapsed, children }: NavSectionProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {!collapsed && (
        <div
          className="ck-tag"
          style={{
            padding: "0 12px",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: collapsed ? 4 : 1,
          alignItems: collapsed ? "center" : "stretch",
        }}
      >
        {children}
      </div>
    </div>
  );
}
