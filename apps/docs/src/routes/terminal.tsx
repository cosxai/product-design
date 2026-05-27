import {
  Button,
  Card,
  Tag,
  useTheme,
  BrailleSpinner,
  AsciiBox,
} from "@cosx/ui";

// /terminal — demo for the Terminal / Monospace Maximalist chrome.
// The page works under any chrome; the visual language only fully
// reads once chrome = terminal (mono everywhere, square corners,
// semantic colour states, ASCII layout elements).

export function TerminalPage() {
  const { chrome, setChrome, theme, setTheme } = useTheme();
  const inTerminal = chrome === "terminal";

  return (
    <>
      {!inTerminal && (
        <div
          style={{
            padding: 12,
            background: "var(--ck-accent-muted)",
            border: "1px solid var(--ck-accent-border)",
            borderRadius: "var(--ck-radius-md)",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
            justifyContent: "space-between",
          }}
        >
          <span style={{ font: "400 13px/1.4 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
            Switch into the <strong>Terminal</strong> chrome to see this
            page in its native skin.
          </span>
          <Button variant="primary" onClick={() => setChrome("terminal")}>
            Activate Terminal
          </Button>
        </div>
      )}

      <div
        style={{
          font: "500 12px/1 var(--ck-font-mono)",
          color: "var(--ck-text-tertiary)",
          marginBottom: 16,
        }}
      >
        2026-05-26T19:44:17Z &nbsp; · &nbsp; commit a3f2c81 &nbsp; · &nbsp; user@cosx
      </div>

      <h1 style={{ marginTop: 0 }}>
        <span style={{ color: "var(--ck-term-green, var(--ck-accent))" }}>$ </span>
        project status
      </h1>
      <p className="docs-summary">
        Monospace everywhere, square corners, 1 px borders, status
        as a coloured dot inside brackets. Semantic colours only —
        green = ok, amber = pending, red = failed, blue = info.
      </p>

      {/* ASCII box section */}
      <h2 style={{ marginTop: 40 }}>── services ──────────</h2>
      <AsciiBox title="status" style={{ marginTop: 16 }} maskBg="var(--ck-bg-canvas)">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            font: "400 13px/1.6 var(--ck-font-mono)",
          }}
        >
          <thead>
            <tr>
              <th style={termTh}>NAME</th>
              <th style={termTh}>REGION</th>
              <th style={termTh}>STATUS</th>
              <th style={{ ...termTh, textAlign: "right" }}>UPTIME</th>
            </tr>
          </thead>
          <tbody>
            <ServiceRow name="api-edge" region="us-east-1" status="running" uptime="99.94%" />
            <ServiceRow name="worker-eu" region="eu-west-1" status="running" uptime="99.21%" />
            <ServiceRow name="ingest" region="ap-south-1" status="degraded" uptime="93.12%" />
            <ServiceRow name="batch" region="us-east-1" status="failed" uptime="—" />
            <ServiceRow name="scheduler" region="us-east-1" status="pending" uptime="—" />
          </tbody>
        </table>
      </AsciiBox>

      {/* Tags */}
      <h2 style={{ marginTop: 40 }}>── status badges ──────</h2>
      <p>
        Tags render as bracketed text under terminal chrome — no
        pill, no fill. Tone drives the dot + label colour.
      </p>
      <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
        <Tag tone="success">running</Tag>
        <Tag tone="warning">pending</Tag>
        <Tag tone="critical">failed</Tag>
        <Tag tone="accent">building</Tag>
        <Tag tone="neutral">idle</Tag>
      </div>

      {/* Spinner */}
      <h2>── live tasks ─────────</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          font: "400 14px/1.6 var(--ck-font-mono)",
          marginTop: 8,
          marginBottom: 32,
        }}
      >
        <div>
          <BrailleSpinner /> &nbsp;{" "}
          <span style={{ color: "var(--ck-term-amber)" }}>compile</span>
          &nbsp; building <code>cosx/ingest</code>… &nbsp;
          <span style={{ color: "var(--ck-text-tertiary)" }}>(2.3s)</span>
        </div>
        <div>
          <span style={{ color: "var(--ck-term-green)" }}>✓</span> &nbsp;{" "}
          <span style={{ color: "var(--ck-term-green)" }}>deploy</span>
          &nbsp; rolled out <code>cosx/web</code> to 4 regions &nbsp;
          <span style={{ color: "var(--ck-text-tertiary)" }}>(3.2s)</span>
        </div>
        <div>
          <span style={{ color: "var(--ck-term-red)" }}>×</span> &nbsp;{" "}
          <span style={{ color: "var(--ck-term-red)" }}>migrate</span>
          &nbsp; <code>0042_user_schema</code> failed &nbsp;
          <span style={{ color: "var(--ck-text-tertiary)" }}>(0.8s)</span>
        </div>
        <div>
          <BrailleSpinner intervalMs={120} /> &nbsp;{" "}
          <span style={{ color: "var(--ck-term-blue)" }}>watch</span>
          &nbsp; tailing <code>~/logs/prod.log</code>
        </div>
      </div>

      {/* Diff */}
      <h2>── diff ─────────────</h2>
      <pre
        style={{
          font: "400 13px/1.55 var(--ck-font-mono)",
          padding: 16,
          margin: "8px 0 32px",
        }}
      >
        <div style={{ color: "var(--ck-text-tertiary)" }}>diff --git a/SKILL.md b/SKILL.md</div>
        <div style={{ color: "var(--ck-text-tertiary)" }}>@@ -1,4 +1,5 @@</div>
        <div>{"  # cosx · style brief"}</div>
        <div style={{ color: "var(--ck-term-red)" }}>{"- A monospace-first interface."}</div>
        <div style={{ color: "var(--ck-term-green)" }}>{"+ A CLI-companion aesthetic for the web."}</div>
        <div style={{ color: "var(--ck-term-green)" }}>{"+ Monospace everywhere. Dark by default."}</div>
        <div>{"  ASCII box drawing as real layout elements."}</div>
      </pre>

      {/* Buttons */}
      <h2>── actions ──────────</h2>
      <div style={{ display: "flex", gap: 12, margin: "8px 0 32px", flexWrap: "wrap" }}>
        <Button variant="primary">[Run ⏎]</Button>
        <Button variant="secondary">[Cancel ⎋]</Button>
        <Button variant="ghost">help</Button>
      </div>

      {/* Tree sidebar example */}
      <h2>── filesystem ───────</h2>
      <pre
        style={{
          font: "400 13px/1.55 var(--ck-font-mono)",
          padding: 16,
          margin: "8px 0 32px",
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
        }}
      >
{`~/projects/cosx
├── product-design/
│   ├── packages/
│   │   └── ui/
│   │       ├── src/
│   │       │   ├── primitives/
│   │       │   ├── layout/
│   │       │   ├── terminal/
│   │       │   └── styles/
│   │       └── package.json
│   └── apps/
│       └── docs/
└── deck-kit/`}
      </pre>

      {/* Sparkline */}
      <h2>── requests/min ─────</h2>
      <Card style={{ marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <div
            style={{
              font: "600 36px/1 var(--ck-font-mono)",
              color: "var(--ck-text-primary)",
            }}
          >
            12,847
          </div>
          <span style={{ color: "var(--ck-term-green)", fontFamily: "var(--ck-font-mono)" }}>
            ▁▂▃▅▇▆▄▃▂▁▂▃▅▇█▇▅▄▃▂▁▂▃▅▇█
          </span>
          <Tag tone="success">+18.4%</Tag>
        </div>
      </Card>

      {/* Hex / ID example */}
      <h2 style={{ marginTop: 40 }}>── records ──────────</h2>
      <Card>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            font: "400 13px/1.6 var(--ck-font-mono)",
          }}
        >
          <thead>
            <tr>
              <th style={termTh}>ID</th>
              <th style={termTh}>OWNER</th>
              <th style={termTh}>PATH</th>
              <th style={{ ...termTh, textAlign: "right" }}>SIZE</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "a3f2c81", owner: "ben@cosx", path: "~/projects/cosx/SKILL.md", size: "8.4 kB" },
              { id: "1d8e0fa", owner: "ada@cosx", path: "~/projects/cosx/product-design/", size: "—" },
              { id: "9c2b4e6", owner: "ada@cosx", path: "~/projects/cosx/deck-kit/", size: "—" },
            ].map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid var(--ck-border-subtle)" }}>
                <td style={{ padding: "8px 0", color: "var(--ck-term-blue)" }}>{r.id}</td>
                <td style={{ padding: "8px 0", color: "var(--ck-text-primary)" }}>{r.owner}</td>
                <td style={{ padding: "8px 0", color: "var(--ck-text-secondary)" }}>{r.path}</td>
                <td style={{ padding: "8px 0", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {r.size}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Chrome switch */}
      <h2 style={{ marginTop: 48 }}>── chrome ───────────</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
        {(["terminal", "swiss", "seamless", "classic", "editorial", "neobrutalism", "ambient"] as const).map((c) => (
          <Button
            key={c}
            variant={chrome === c ? "primary" : "secondary"}
            onClick={() => setChrome(c)}
          >
            {c}
          </Button>
        ))}
        <span style={{ flex: 1 }} />
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          theme = {theme}
        </Button>
      </div>
    </>
  );
}

function ServiceRow({
  name,
  region,
  status,
  uptime,
}: {
  name: string;
  region: string;
  status: "running" | "degraded" | "failed" | "pending";
  uptime: string;
}) {
  const tone =
    status === "running"
      ? "success"
      : status === "degraded"
        ? "warning"
        : status === "failed"
          ? "critical"
          : "accent";
  return (
    <tr style={{ borderTop: "1px solid var(--ck-border-subtle)" }}>
      <td style={termTd}>{name}</td>
      <td style={{ ...termTd, color: "var(--ck-text-secondary)" }}>{region}</td>
      <td style={termTd}>
        <Tag tone={tone as never}>{status}</Tag>
      </td>
      <td style={{ ...termTd, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{uptime}</td>
    </tr>
  );
}

const termTh: React.CSSProperties = {
  font: "500 11px/1 var(--ck-font-mono)",
  letterSpacing: 0,
  color: "var(--ck-text-tertiary)",
  textAlign: "left",
  padding: "10px 0",
  borderBottom: "1px solid var(--ck-border-strong)",
};

const termTd: React.CSSProperties = {
  padding: "8px 0",
  color: "var(--ck-text-primary)",
};
