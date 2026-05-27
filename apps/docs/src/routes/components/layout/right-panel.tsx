import { useState } from "react";
import { Button, RightSidebarPanel } from "@cosxai/ui";

export function RightPanelPage() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <h1>RightSidebarPanel</h1>
      <p className="docs-summary">
        Floating right-side panel — for summoned surfaces like a
        comments list, signing-management drawer, or filter sidebar.
        Sticks below the topbar via <code>--ck-breadcrumb-height</code>,
        bottom clears <code>--ck-tabbar-height</code>. Caller owns the
        open / close state.
      </p>

      <Button variant="primary" onClick={() => setOpen(true)}>
        Open panel
      </Button>

      <RightSidebarPanel
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="Demo · Sidebar"
        title="A summoned right-side panel"
      >
        <div style={{ padding: 16 }}>
          <p style={{ margin: "0 0 12px", color: "var(--ck-text-secondary)", fontSize: 13 }}>
            This panel is fixed-positioned. Resize the window — it
            stays clear of the topbar above and the tab bar below
            (when one is mounted) by reading the kit's layout CSS
            vars. No prop drilling.
          </p>
          <p style={{ margin: 0, color: "var(--ck-text-tertiary)", fontSize: 12 }}>
            Body content scrolls when it overflows the available
            height.
          </p>
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} style={{ margin: "12px 0 0", color: "var(--ck-text-tertiary)", fontSize: 12 }}>
              Filler line {i + 1}
            </p>
          ))}
        </div>
      </RightSidebarPanel>
    </>
  );
}
