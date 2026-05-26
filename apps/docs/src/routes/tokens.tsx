import { useEffect, useState } from "react";

// Tokens page — reflects the live computed values from :root so it
// re-renders correctly under any theme/chrome combo without a
// hard-coded copy of the values. Read-only window into what
// tokens.css currently resolves to.

interface TokenGroup {
  heading: string;
  vars: string[];
  // When true, render a color swatch (else value-only).
  swatch?: boolean;
}

const GROUPS: TokenGroup[] = [
  {
    heading: "Backgrounds",
    swatch: true,
    vars: [
      "--ck-bg-canvas",
      "--ck-bg-surface",
      "--ck-bg-surface-2",
      "--ck-bg-muted",
      "--ck-bg-sidebar",
    ],
  },
  {
    heading: "Text",
    swatch: true,
    vars: [
      "--ck-text-primary",
      "--ck-text-secondary",
      "--ck-text-tertiary",
      "--ck-text-disabled",
      "--ck-text-inverse",
    ],
  },
  {
    heading: "Borders",
    swatch: true,
    vars: ["--ck-border-subtle", "--ck-border-strong", "--ck-border-focus"],
  },
  {
    heading: "Accent (derived from --ck-accent)",
    swatch: true,
    vars: [
      "--ck-accent",
      "--ck-accent-hover",
      "--ck-accent-active",
      "--ck-accent-muted",
      "--ck-accent-border",
    ],
  },
  {
    heading: "Status",
    swatch: true,
    vars: [
      "--ck-success",
      "--ck-success-muted",
      "--ck-warning",
      "--ck-warning-muted",
      "--ck-critical",
      "--ck-critical-muted",
    ],
  },
  {
    heading: "Radii",
    vars: [
      "--ck-radius-xs",
      "--ck-radius-sm",
      "--ck-radius-md",
      "--ck-radius-lg",
      "--ck-radius-xl",
    ],
  },
  {
    heading: "Motion",
    vars: ["--ck-ease", "--ck-dur-fast", "--ck-dur-page"],
  },
  {
    heading: "Mono type sizes",
    vars: ["--ck-mono-tag-size", "--ck-mono-xs-size", "--ck-mono-sm-size", "--ck-mono-md-size"],
  },
  {
    heading: "Layout",
    vars: [
      "--ck-leftnav-width",
      "--ck-rightrail-width",
      "--ck-tabbar-height",
      "--ck-breadcrumb-height",
    ],
  },
];

function useComputedStyles(vars: readonly string[]): Record<string, string> {
  // Re-read on theme/chrome changes by observing the data attribute
  // on <html>. MutationObserver beats polling and avoids prop-drilling
  // theme state into this page. `vars` is intentionally NOT a dep — the
  // observer attaches once per mount and reads whatever the current
  // vars list contains via the closure. Re-reading on every var-array
  // identity change would tear down + re-create the observer on every
  // render which can race with React's batching under StrictMode.
  const [snapshot, setSnapshot] = useState<Record<string, string>>({});
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const out: Record<string, string> = {};
      for (const v of vars) out[v] = cs.getPropertyValue(v).trim();
      setSnapshot(out);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-ck-theme", "data-ck-chrome", "style"],
    });
    return () => mo.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return snapshot;
}

export function TokensPage() {
  const allVars = GROUPS.flatMap((g) => g.vars);
  const values = useComputedStyles(allVars);
  return (
    <>
      <h1>Tokens</h1>
      <p className="docs-summary">
        Live snapshot of every CSS variable defined in{" "}
        <code>tokens.css</code>. Toggles in the topbar mutate{" "}
        <code>data-ck-theme</code> / <code>data-ck-chrome</code> on{" "}
        <code>&lt;html&gt;</code>; the swatches below re-read{" "}
        <code>getComputedStyle()</code> on the change.
      </p>

      {GROUPS.map((g) => (
        <section key={g.heading}>
          <div className="docs-token-group">{g.heading}</div>
          <div className="docs-tokens">
            {g.vars.map((v) => (
              <div key={v} className="docs-token-row">
                {g.swatch ? (
                  <div
                    className="docs-token-row__swatch"
                    style={{ background: `var(${v})` }}
                  />
                ) : (
                  <div />
                )}
                <code className="docs-token-row__name">{v}</code>
                <code className="docs-token-row__value">
                  {values[v] || <span style={{ opacity: 0.5 }}>—</span>}
                </code>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
