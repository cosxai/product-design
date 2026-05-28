import { Outlet, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Shell, ActionBar, CommandPalette, useCommandSource } from "@cosxai/ui";
import { DocsSidebar } from "./components/DocsSidebar";
import { DocsTopbar } from "./components/DocsTopbar";
import { DocsOnThisPage } from "./components/DocsOnThisPage";

// Layout route. Wraps every page in the kit's <Shell>, mounts the
// floating <ActionBar> and the <CommandPalette>. Docs-wide commands
// (jump-to-page entries) are registered here as a source — every
// route gets cmd+k navigation for free.

export function App() {
  const navigate = useNavigate();
  // Static jump-to-page list — keeps the docs site navigable via
  // keyboard alone. Page-specific commands get registered by
  // individual route components on top of this base.
  const navCommands = useMemo(
    () => [
      { key: "nav:overview", group: "Jump to", label: "Overview", run: ({ close }: { close: () => void }) => { navigate("/"); close(); } },
      { key: "nav:install", group: "Jump to", label: "Installation", run: ({ close }: { close: () => void }) => { navigate("/installation"); close(); } },
      { key: "nav:theming", group: "Jump to", label: "Theming", run: ({ close }: { close: () => void }) => { navigate("/theming"); close(); } },
      { key: "nav:tokens", group: "Jump to", label: "Tokens", run: ({ close }: { close: () => void }) => { navigate("/tokens"); close(); } },
      { key: "nav:button", group: "Components", label: "Button", run: ({ close }: { close: () => void }) => { navigate("/components/button"); close(); } },
      { key: "nav:primitives", group: "Components", label: "All primitives", run: ({ close }: { close: () => void }) => { navigate("/components/primitives"); close(); } },
      { key: "nav:bonus", group: "Components", label: "Tooltip / PageHeader / time", run: ({ close }: { close: () => void }) => { navigate("/components/bonus"); close(); } },
      { key: "nav:dialogs", group: "Patterns", label: "Dialogs + Modal", run: ({ close }: { close: () => void }) => { navigate("/components/dialogs"); close(); } },
      { key: "nav:shell", group: "Layout", label: "Shell + rails", run: ({ close }: { close: () => void }) => { navigate("/components/layout/shell"); close(); } },
      { key: "nav:crumb", group: "Layout", label: "Breadcrumb", run: ({ close }: { close: () => void }) => { navigate("/components/layout/breadcrumb"); close(); } },
      { key: "nav:right", group: "Layout", label: "RightSidebarPanel", run: ({ close }: { close: () => void }) => { navigate("/components/layout/right-panel"); close(); } },
      { key: "nav:banner", group: "Layout", label: "StickyBanner", run: ({ close }: { close: () => void }) => { navigate("/components/layout/sticky-banner"); close(); } },
      { key: "nav:actionbar", group: "Patterns", label: "Action bar", run: ({ close }: { close: () => void }) => { navigate("/components/action-bar"); close(); } },
      { key: "nav:palette", group: "Patterns", label: "Command palette", run: ({ close }: { close: () => void }) => { navigate("/components/command-palette"); close(); } },
      { key: "nav:pwa", group: "Advanced", label: "PWA setup", run: ({ close }: { close: () => void }) => { navigate("/pwa"); close(); } },
      { key: "nav:editorial", group: "Advanced", label: "Editorial chrome", run: ({ close }: { close: () => void }) => { navigate("/editorial"); close(); } },
      { key: "nav:neobrut", group: "Advanced", label: "Neobrutalism chrome", run: ({ close }: { close: () => void }) => { navigate("/neobrutalism"); close(); } },
      { key: "nav:ambient", group: "Advanced", label: "Ambient Glass chrome", run: ({ close }: { close: () => void }) => { navigate("/ambient"); close(); } },
      { key: "nav:swiss", group: "Advanced", label: "Swiss chrome", run: ({ close }: { close: () => void }) => { navigate("/swiss"); close(); } },
      { key: "nav:terminal", group: "Advanced", label: "Terminal chrome", run: ({ close }: { close: () => void }) => { navigate("/terminal"); close(); } },
      { key: "nav:bento", group: "Advanced", label: "Bento Grid chrome", run: ({ close }: { close: () => void }) => { navigate("/bento"); close(); } },
      { key: "nav:riso", group: "Advanced", label: "Risograph chrome", run: ({ close }: { close: () => void }) => { navigate("/riso"); close(); } },
      { key: "nav:sketch", group: "Advanced", label: "Hand-drawn chrome", run: ({ close }: { close: () => void }) => { navigate("/sketch"); close(); } },
    ],
    [navigate],
  );
  useCommandSource("docs:nav", navCommands);

  return (
    <Shell leftRail={<DocsSidebar />} topbar={<DocsTopbar />}>
      <div className="docs-shell">
        <main className="docs-main">
          <Outlet />
        </main>
        <DocsOnThisPage />
      </div>
      <ActionBar />
      <CommandPalette groupOrder={["Jump to", "Components", "Layout", "Patterns", "Advanced"]} />
    </Shell>
  );
}
