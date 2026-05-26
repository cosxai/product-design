import { Link } from "react-router-dom";
import { Button, Card, Kbd, Tag } from "@cosx/ui";

export function OverviewPage() {
  return (
    <>
      <h1>@cosx/ui</h1>
      <p className="docs-summary">
        A portable, shadcn-style component kit extracted from a
        working product. Tokens, layout shell, dialogs, floating
        action bar, command palette, and PWA scaffolding — opinionated
        where the choice affects feel, neutral where it doesn't.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
        <Link to="/installation">
          <Button variant="primary">Get started</Button>
        </Link>
        <Link to="/components/primitives">
          <Button variant="secondary">Browse primitives</Button>
        </Link>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--ck-text-tertiary)",
            fontSize: 13,
          }}
        >
          or press <Kbd>Mod</Kbd>+<Kbd>K</Kbd>
        </span>
      </div>

      <h2>What's in</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
          marginBottom: 32,
        }}
      >
        <FeatureCard
          to="/tokens"
          eyebrow="Tokens"
          title="Design system in CSS vars"
          body="Light · dark · seamless chrome on two orthogonal axes. Define custom chrome variants by adding one block to your stylesheet."
        />
        <FeatureCard
          to="/components/layout/shell"
          eyebrow="Layout"
          title="Shell + rails"
          body="Composable layout host with left nav rail, breadcrumb topbar, mobile tab bar — all wiring through CSS vars, no prop drilling."
        />
        <FeatureCard
          to="/components/primitives"
          eyebrow="Primitives"
          title="9 foundation components"
          body="Button, Card, Tag, CountBadge, Kbd, Avatar, Input, Textarea, Checkbox, ToggleSwitch — token-driven, themed."
        />
        <FeatureCard
          to="/components/dialogs"
          eyebrow="Patterns"
          title="Modal + Dialogs API"
          body="useDialogs() gives Promise-based confirm / prompt / toast. Modal primitive for everything beyond those three."
        />
        <FeatureCard
          to="/components/action-bar"
          eyebrow="Patterns"
          title="Floating action bar"
          body="Registry-driven button bar. Pages push items, the bar groups + renders. Keyboard hotkeys with the standard conflict guards."
          tag="Differentiator"
        />
        <FeatureCard
          to="/components/command-palette"
          eyebrow="Patterns"
          title="Command palette (⌘K)"
          body="Same registry pattern as the action bar. Fuzzy filter, arrow nav, grouped results, portal modal."
          tag="Differentiator"
        />
        <FeatureCard
          to="/pwa"
          eyebrow="Advanced"
          title="PWA scaffolding"
          body="Install prompt banner, service-worker helper, manifest template. Wire up vite-plugin-pwa with our guide."
        />
        <FeatureCard
          to="/theming"
          eyebrow="Brand"
          title="Live accent override"
          body="Single brand colour stamped on documentElement.style — every shade derives via color-mix()."
        />
      </div>

      <h2>What it dogfoods</h2>
      <p>
        Everything you see on this page is built from the kit. The
        sidebar is <code>&lt;LeftNavRail&gt;</code>. The topbar is{" "}
        <code>&lt;Topbar&gt;</code> + <code>&lt;Breadcrumb&gt;</code>.
        The theme toggle uses <code>useTheme()</code>. Press{" "}
        <Kbd>Mod</Kbd>+<Kbd>K</Kbd> to summon the kit's own command
        palette wired against the docs route list. If a primitive
        breaks, the docs site notices first.
      </p>

      <h2>Status</h2>
      <p>
        <Tag tone="success" filled>
          v0 — usable
        </Tag>{" "}
        All seven build phases shipped. Internal-only; will graduate
        to its own repo. Lift-out plan in the workspace README.
      </p>
    </>
  );
}

function FeatureCard({
  to,
  eyebrow,
  title,
  body,
  tag,
}: {
  to: string;
  eyebrow: string;
  title: string;
  body: string;
  tag?: string;
}) {
  return (
    <Link to={to}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span className="ck-eyebrow">{eyebrow}</span>
          {tag && <Tag tone="accent">{tag}</Tag>}
        </div>
        <div
          style={{
            font: "500 14px/1.3 var(--ck-font-sans)",
            color: "var(--ck-text-primary)",
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div
          style={{
            font: "400 12px/1.5 var(--ck-font-sans)",
            color: "var(--ck-text-tertiary)",
          }}
        >
          {body}
        </div>
      </Card>
    </Link>
  );
}
