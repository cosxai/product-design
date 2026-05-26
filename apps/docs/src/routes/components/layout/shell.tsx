export function ShellPage() {
  return (
    <>
      <h1>Shell + rails</h1>
      <p className="docs-summary">
        Everything you're looking at right now — the left rail, the
        topbar, this content well — is wired through{" "}
        <code>&lt;Shell&gt;</code>. It's a thin layout host with three
        slots; each rail is a separate primitive that owns its own
        CSS var so the main column can inset itself without any
        prop drilling.
      </p>

      <h2>Composition</h2>
      <pre><code>{`<Shell
  leftRail={<LeftNavRail ... />}
  topbar={<Topbar ... />}
  rightRail={<AgentRail ... />}    // optional
  tabBar={<MobileTabBar ... />}    // optional, phone
>
  <main>{children}</main>
</Shell>`}</code></pre>

      <h2>CSS vars stamped by each rail</h2>
      <ul style={{ font: "400 14px/1.7 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
        <li><code>--ck-leftnav-width</code> — set by <code>LeftNavRail</code></li>
        <li><code>--ck-rightrail-width</code> — set by a right rail (not in kit yet)</li>
        <li><code>--ck-tabbar-height</code> — set by <code>MobileTabBar</code></li>
        <li><code>--ck-breadcrumb-height</code> — set by <code>Topbar</code></li>
      </ul>
      <p>
        Components that need to clear or align with these (floating
        action bar, sticky banners, the command palette modal) just
        read the vars. No context, no prop chains.
      </p>

      <h2>Try the collapse</h2>
      <p>
        Click <code>‹ collapse</code> at the bottom of the left rail.
        The main column slides right as <code>--ck-leftnav-width</code>{" "}
        animates from 256 → 56 px. Resize the browser below 1100 px
        and the rail force-collapses regardless of your preference
        (toggle disables and shows a tooltip).
      </p>

      <h2>LeftNavRail props</h2>
      <pre><code>{`interface LeftNavRailProps {
  brand?: ReactNode;           // top slot
  children: ReactNode;         // body (scrollable)
  footer?: ReactNode;          // bottom slot
  collapsed?: boolean;
  widthExpanded?: number;      // default 256
  widthCollapsed?: number;     // default 56
  hidden?: boolean;            // sets --ck-leftnav-width: 0
}`}</code></pre>

      <h2>useNavRailState</h2>
      <p>
        Two-layer state — user preference (localStorage) layered
        under a viewport rule. Below <code>forceCollapseBelow</code>{" "}
        (default 1100 px) the rail collapses regardless of preference.
      </p>
      <pre><code>{`const { collapsed, forcedByViewport, toggle, setCollapsed } =
  useNavRailState({
    storageKey: "myapp-leftnav-collapsed",
    forceCollapseBelow: 1100,
    defaultCollapsed: false,
  });`}</code></pre>
    </>
  );
}
