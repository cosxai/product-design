import { Button, Tag, useTheme, BentoGrid, BentoCell } from "@cosx/ui";

// /bento — demo for the Bento Grid chrome. Apple product page
// aesthetic: mixed-size cards arranged on a 12-column grid,
// generous radii, soft multi-layer shadows, hover-lift cells.
// The grid + cell primitives are chrome-agnostic — the visual
// signature (radii / shadows / palette) lights up under
// chrome = bento.

export function BentoPage() {
  const { chrome, setChrome, theme, setTheme } = useTheme();
  const inBento = chrome === "bento";

  return (
    <>
      {!inBento && (
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
            Switch into the <strong>Bento Grid</strong> chrome to see
            this page with its native radii, shadows, and palette.
          </span>
          <Button variant="primary" onClick={() => setChrome("bento")}>
            Activate Bento
          </Button>
        </div>
      )}

      <h1 style={{ marginTop: 0 }}>Bento Grid</h1>
      <p className="docs-summary">
        Apple product-page aesthetic. A 12-column grid where each
        cell picks its own span and archetype — stat, feature,
        media, chart, quote, CTA. Soft multi-layer shadows,
        generous radii, hover-lift on interactive cells.
      </p>

      {/* Hero bento — the canonical layout */}
      <h2 style={{ marginTop: 40 }}>Hero — mixed archetypes</h2>
      <p>
        Six archetypes on one grid. The wide media cell uses a
        gradient background; stat cells span 3 columns; the
        chart spans 6 across 2 rows.
      </p>
      <BentoGrid cols={12} gap={16} rowMinHeight={140} style={{ marginTop: 16, marginBottom: 40 }}>
        {/* 1. Feature — wide gradient hero */}
        <BentoCell
          colSpan={8}
          rowSpan={2}
          interactive
          background="var(--ck-bento-grad-2, linear-gradient(135deg, #60A5FA, #A78BFA))"
          color="#FFFFFF"
          padding={28}
          style={{ justifyContent: "space-between" }}
        >
          <InversePill style={{ alignSelf: "flex-start" }}>New</InversePill>
          <div>
            <h3
              style={{
                margin: 0,
                font: "600 32px/1.1 var(--ck-font-sans)",
                letterSpacing: "-0.025em",
                color: "#FFFFFF",
              }}
            >
              Pro plan,<br />now with AI&nbsp;agents.
            </h3>
            <p style={{ margin: "12px 0 0", font: "400 15px/1.5 var(--ck-font-sans)", opacity: 0.85, color: "#FFFFFF" }}>
              Twelve hand-picked agents that draft, review, and
              ship the busywork. Yours from May 26.
            </p>
          </div>
        </BentoCell>

        {/* 2. Stat — tall single column */}
        <BentoCell colSpan={4} rowSpan={1} interactive>
          <div style={{ font: "400 12px/1 var(--ck-font-mono)", color: "var(--ck-text-tertiary)", letterSpacing: 0.5, textTransform: "uppercase" }}>
            Monthly active
          </div>
          <div
            style={{
              font: "600 44px/1 var(--ck-font-sans)",
              letterSpacing: "-0.025em",
              color: "var(--ck-text-primary)",
              marginTop: "auto",
            }}
          >
            128,492
          </div>
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
            <Tag tone="success">+18.4%</Tag>
            <span style={{ font: "400 12px/1.4 var(--ck-font-sans)", color: "var(--ck-text-tertiary)" }}>
              vs last 30d
            </span>
          </div>
        </BentoCell>

        {/* 3. Quote — single row */}
        <BentoCell colSpan={4} rowSpan={1} interactive>
          <div style={{ font: "400 32px/1 var(--ck-font-serif, Georgia, serif)", color: "var(--ck-accent)", marginBottom: 4 }}>
            "
          </div>
          <p style={{ margin: 0, font: "500 14px/1.55 var(--ck-font-sans)", color: "var(--ck-text-primary)" }}>
            Replaced four tools in one week. The team noticed
            within a day.
          </p>
          <div style={{ marginTop: "auto", font: "400 12px/1.3 var(--ck-font-sans)", color: "var(--ck-text-tertiary)" }}>
            Sara K. · Head of Ops, Atlas
          </div>
        </BentoCell>
      </BentoGrid>

      {/* Second row — stat trio + chart + CTA */}
      <h2 style={{ marginTop: 40 }}>Stat trio + chart + CTA</h2>
      <BentoGrid cols={12} gap={16} rowMinHeight={120} style={{ marginTop: 16, marginBottom: 40 }}>
        <StatCell label="Open rate" value="68.2%" tone="success" delta="+4.1" />
        <StatCell label="Reply rate" value="11.7%" tone="accent" delta="+0.8" />
        <StatCell label="Bounce" value="0.42%" tone="warning" delta="−0.05" />

        {/* Chart — sparkline */}
        <BentoCell colSpan={6} rowSpan={2} interactive>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div>
              <div style={{ font: "400 12px/1 var(--ck-font-mono)", color: "var(--ck-text-tertiary)", letterSpacing: 0.5, textTransform: "uppercase" }}>
                Revenue · last 30 days
              </div>
              <div style={{ font: "600 32px/1.1 var(--ck-font-sans)", letterSpacing: "-0.02em", color: "var(--ck-text-primary)", marginTop: 8 }}>
                £41,820
              </div>
            </div>
            <Tag tone="success">+22.6%</Tag>
          </div>
          <div style={{ flex: 1, position: "relative", marginTop: 16, minHeight: 100 }}>
            <Sparkline />
          </div>
        </BentoCell>

        {/* CTA cell */}
        <BentoCell
          colSpan={6}
          rowSpan={2}
          interactive
          background="var(--ck-bento-grad-3, linear-gradient(135deg, #34D399, #06B6D4))"
          color="#FFFFFF"
          padding={28}
          style={{ justifyContent: "space-between" }}
        >
          <div>
            <InversePill>Limited</InversePill>
            <h3
              style={{
                margin: "12px 0 0",
                font: "600 26px/1.15 var(--ck-font-sans)",
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
              }}
            >
              Annual billing<br />— save 20%.
            </h3>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Button
              variant="secondary"
              style={{
                background: "#FFFFFF",
                color: "#0A7A4A",
                borderColor: "transparent",
              }}
              onClick={() => setChrome("bento")}
            >
              Upgrade · £49 / mo
            </Button>
            <span style={{ font: "400 12px/1.3 var(--ck-font-sans)", color: "rgba(255,255,255,0.85)" }}>
              billed annually
            </span>
          </div>
        </BentoCell>
      </BentoGrid>

      {/* Media + feature + pill row */}
      <h2 style={{ marginTop: 40 }}>Media + small features</h2>
      <BentoGrid cols={12} gap={16} rowMinHeight={140} style={{ marginTop: 16, marginBottom: 40 }}>
        {/* Wide media cell — gradient w/ "device" mock */}
        <BentoCell
          colSpan={7}
          rowSpan={2}
          interactive
          background="var(--ck-bento-grad-1, linear-gradient(135deg, #FF6B9D, #C026D3))"
          color="#FFFFFF"
          padding={0}
          style={{ alignItems: "stretch" }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: "auto 28px 28px 28px",
                height: "70%",
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.32)",
                borderRadius: 14,
                backdropFilter: "blur(12px)",
              }}
            />
            <div style={{ padding: 28, position: "relative", color: "#FFFFFF", maxWidth: "70%" }}>
              <InversePill>v3.2</InversePill>
              <h3 style={{ margin: "10px 0 6px", font: "600 24px/1.1 var(--ck-font-sans)", letterSpacing: "-0.02em" }}>
                A canvas that thinks with you.
              </h3>
              <p style={{ margin: 0, font: "400 13px/1.5 var(--ck-font-sans)", opacity: 0.9 }}>
                Drag, dictate, diagram. Every move stays in sync.
              </p>
            </div>
          </div>
        </BentoCell>

        {/* Small features */}
        <BentoCell colSpan={5} rowSpan={1} interactive>
          <div style={{ alignSelf: "flex-start" }}>
            <Tag tone="accent">Privacy</Tag>
          </div>
          <h3 style={{ margin: "10px 0 0", font: "600 18px/1.2 var(--ck-font-sans)", letterSpacing: "-0.015em", color: "var(--ck-text-primary)" }}>
            End-to-end, by default.
          </h3>
          <p style={{ margin: "6px 0 0", font: "400 13px/1.5 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
            Your team's data never crosses our datacenter.
          </p>
        </BentoCell>

        <BentoCell colSpan={5} rowSpan={1} interactive>
          <div style={{ alignSelf: "flex-start" }}>
            <Tag tone="success">Speed</Tag>
          </div>
          <h3 style={{ margin: "10px 0 0", font: "600 18px/1.2 var(--ck-font-sans)", letterSpacing: "-0.015em", color: "var(--ck-text-primary)" }}>
            42 ms median, p99.
          </h3>
          <p style={{ margin: "6px 0 0", font: "400 13px/1.5 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
            From your keystroke to our edge — guaranteed.
          </p>
        </BentoCell>
      </BentoGrid>

      {/* Pill row of micro stats */}
      <h2 style={{ marginTop: 40 }}>Compact stats row</h2>
      <BentoGrid cols={12} gap={16} rowMinHeight={100} style={{ marginTop: 16, marginBottom: 40 }}>
        <MicroStat label="Uptime" value="99.99%" />
        <MicroStat label="Regions" value="14" />
        <MicroStat label="SOC 2" value="Type II" />
        <MicroStat label="Customers" value="2.4k+" />
      </BentoGrid>

      {/* API */}
      <h2 style={{ marginTop: 40 }}>API</h2>
      <p>
        Two primitives — <code>&lt;BentoGrid&gt;</code> (the 12-column
        wrapper) and <code>&lt;BentoCell&gt;</code> (with{" "}
        <code>colSpan</code>, <code>rowSpan</code>, optional{" "}
        <code>interactive</code> for hover-lift, and override props
        for background / color / padding when you want a gradient
        cell). Works under any chrome — the bento chrome lights up
        the canonical look (22 px radius, multi-layer shadow,
        hover-lift transition).
      </p>
      <pre style={{ marginTop: 16, marginBottom: 32 }}>
        <code>{`<BentoGrid cols={12} gap={16}>
  <BentoCell colSpan={8} rowSpan={2} interactive
             background="var(--ck-bento-grad-2)" color="#FFFFFF">
    {/* feature */}
  </BentoCell>
  <BentoCell colSpan={4}>{/* stat */}</BentoCell>
  <BentoCell colSpan={4}>{/* stat */}</BentoCell>
</BentoGrid>`}</code>
      </pre>

      {/* Chrome switch */}
      <h2 style={{ marginTop: 48 }}>Switch chrome</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
        {(["bento", "seamless", "classic", "editorial", "neobrutalism", "ambient", "swiss", "terminal"] as const).map((c) => (
          <Button
            key={c}
            variant={chrome === c ? "primary" : "secondary"}
            onClick={() => setChrome(c)}
          >
            {c}
          </Button>
        ))}
        <span style={{ flex: 1 }} />
        <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          theme = {theme}
        </Button>
      </div>
    </>
  );
}

function InversePill({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.18)",
        color: "#FFFFFF",
        font: "500 12px/1 var(--ck-font-sans)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function StatCell({
  label,
  value,
  tone,
  delta,
}: {
  label: string;
  value: string;
  tone: "accent" | "success" | "warning" | "critical";
  delta: string;
}) {
  return (
    <BentoCell colSpan={2} rowSpan={1} interactive>
      <div style={{ font: "400 11px/1 var(--ck-font-mono)", color: "var(--ck-text-tertiary)", letterSpacing: 0.5, textTransform: "uppercase" }}>
        {label}
      </div>
      <div
        style={{
          font: "600 28px/1 var(--ck-font-sans)",
          letterSpacing: "-0.02em",
          color: "var(--ck-text-primary)",
          marginTop: "auto",
        }}
      >
        {value}
      </div>
      <div style={{ marginTop: 4 }}>
        <Tag tone={tone}>{delta}</Tag>
      </div>
    </BentoCell>
  );
}

function MicroStat({ label, value }: { label: string; value: string }) {
  return (
    <BentoCell colSpan={3} rowSpan={1} interactive>
      <div style={{ font: "400 11px/1 var(--ck-font-mono)", color: "var(--ck-text-tertiary)", letterSpacing: 0.5, textTransform: "uppercase" }}>
        {label}
      </div>
      <div
        style={{
          font: "600 24px/1 var(--ck-font-sans)",
          letterSpacing: "-0.02em",
          color: "var(--ck-text-primary)",
          marginTop: "auto",
        }}
      >
        {value}
      </div>
    </BentoCell>
  );
}

function Sparkline() {
  // Inline SVG — deliberate to avoid pulling a chart library into
  // the kit for one demo. Hardcoded points + a soft fill under.
  const points = [
    8, 12, 9, 14, 11, 18, 16, 22, 19, 26, 24, 30, 28, 34, 31, 40, 38, 46, 42,
  ];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 600;
  const h = 100;
  const stepX = w / (points.length - 1);
  const norm = (v: number) => h - ((v - min) / (max - min)) * (h - 8) - 4;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX},${norm(p)}`).join(" ");
  const area = `${path} L ${w},${h} L 0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="bento-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ck-accent)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--ck-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#bento-spark)" />
      <path d={path} fill="none" stroke="var(--ck-accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
