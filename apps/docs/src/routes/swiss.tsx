import { Button, Card, Tag, useTheme } from "@cosx/ui";

// /swiss — demo for the Swiss / International Typographic chrome.
// The page itself works under any chrome, but the visual language
// only fully reads once chrome = swiss. Numbered sections, tight
// asymmetric grid, oversized headlines, achromatic palette + a
// single red accent.

export function SwissPage() {
  const { chrome, setChrome, theme, setTheme } = useTheme();
  const inSwiss = chrome === "swiss";

  return (
    <>
      {!inSwiss && (
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
            Switch into the <strong>Swiss</strong> chrome to see this
            page in its native skin.
          </span>
          <Button variant="primary" onClick={() => setChrome("swiss")}>
            Activate Swiss
          </Button>
        </div>
      )}

      {/* Folio strip — section number + date in mono. ISO format
          per the brief; never American "Jan 5 2026". */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          paddingBottom: 16,
          borderBottom: "1px solid var(--ck-border-subtle)",
          marginBottom: 40,
          font: "500 11px/1 var(--ck-font-mono)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--ck-text-secondary)",
        }}
      >
        <span>Section 1.0 — Foundations</span>
        <span>2026-05-26</span>
      </div>

      <SectionNumber n="1.0" />
      <h1
        style={{
          fontSize: "clamp(48px, 7vw, 88px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 0.95,
          margin: "0 0 24px",
          maxWidth: "10ch",
        }}
      >
        Type is enough.
      </h1>
      <p
        style={{
          font: "400 17px/1.5 var(--ck-font-sans)",
          color: "var(--ck-text-secondary)",
          maxWidth: "60ch",
          marginBottom: 24,
        }}
      >
        Swiss / International Typographic Style emerged in 1950s
        Zürich and Basel, was carried by Vignelli and the New York
        School, and today reads as the visual language of trust —
        documentation, finance, public infrastructure. Restraint
        does the heavy lifting.
      </p>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--ck-border-subtle)",
          margin: "48px 0",
        }}
      />

      <SectionNumber n="1.1" />
      <h2 style={{ marginTop: 0 }}>Hierarchy by scale and weight.</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
          gap: 48,
          margin: "32px 0",
        }}
      >
        <div>
          <Label>Anchor column</Label>
          <p style={{ font: "400 15px/1.55 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
            Asymmetric balance: headlines anchor to one column,
            body text to another. Never centred.
          </p>
        </div>
        <div>
          <Label>Body column</Label>
          <p style={{ font: "400 15px/1.55 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
            Hierarchy is achieved by scale and weight — never by
            colour or decoration. There is no display face; the
            same neutral grotesk runs from 88 px down to 12 px,
            shifting only weight, size, and tracking.
          </p>
          <p style={{ font: "400 15px/1.55 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
            Empty space is a component. If a section feels too
            empty, it's probably right.
          </p>
        </div>
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--ck-border-subtle)",
          margin: "48px 0",
        }}
      />

      <SectionNumber n="1.2" />
      <h2>Components disappear into rules.</h2>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", margin: "24px 0 40px" }}>
        <Stat label="Total visits" value="1,328,409" />
        <Stat label="Active users" value="48,127" />
        <Stat label="Conversion" value="2.4%" />
        <Stat label="Avg revenue" value="$214" />
      </div>

      {/* Table — horizontal rules only. */}
      <Label>Fig. 03 — Performance, week of 2026-05-19</Label>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 12,
          font: "400 14px/1.5 var(--ck-font-sans)",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid var(--ck-text-primary)" }}>
            <th style={swissThStyle}>Source</th>
            <th style={swissThStyle}>Visits</th>
            <th style={swissThStyle}>Conversion</th>
            <th style={swissThStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {[
            { src: "Direct", visits: 248_410, conv: "3.1%", state: "stable" },
            { src: "Search", visits: 312_847, conv: "2.7%", state: "stable" },
            { src: "Referral", visits: 88_293, conv: "4.2%", state: "up" },
            { src: "Social", visits: 47_104, conv: "1.1%", state: "down" },
          ].map((r) => (
            <tr key={r.src} style={{ borderBottom: "1px solid var(--ck-border-subtle)" }}>
              <td style={swissTdStyle}>{r.src}</td>
              <td style={{ ...swissTdStyle, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {r.visits.toLocaleString()}
              </td>
              <td style={{ ...swissTdStyle, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {r.conv}
              </td>
              <td style={swissTdStyle}>
                <Tag tone={r.state === "down" ? "critical" : r.state === "up" ? "success" : "neutral"}>
                  {r.state}
                </Tag>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--ck-border-subtle)",
          margin: "48px 0",
        }}
      />

      <SectionNumber n="1.3" />
      <h2>Buttons, inputs, dividers.</h2>

      <Label>Buttons</Label>
      <div style={{ display: "flex", gap: 12, marginBottom: 32, marginTop: 8 }}>
        <Button variant="primary">Save</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="ghost">Discard</Button>
      </div>

      <Label>Form (bottom-border-only inputs)</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 12, marginBottom: 32 }}>
        <div>
          <label
            style={{
              display: "block",
              font: "500 11px/1 var(--ck-font-sans)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--ck-text-secondary)",
              marginBottom: 8,
            }}
          >
            Name
          </label>
          <input
            className="ck-input"
            placeholder="Helvetica Neue"
            style={{
              height: 34,
              padding: 0,
              width: "100%",
              font: "400 14px/1.4 var(--ck-font-sans)",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              font: "500 11px/1 var(--ck-font-sans)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--ck-text-secondary)",
              marginBottom: 8,
            }}
          >
            Designer
          </label>
          <input
            className="ck-input"
            placeholder="Max Miedinger, 1957"
            style={{
              height: 34,
              padding: 0,
              width: "100%",
              font: "400 14px/1.4 var(--ck-font-sans)",
            }}
          />
        </div>
      </div>

      <Label>Tags as dot + text</Label>
      <div style={{ display: "flex", gap: 24, marginTop: 8, marginBottom: 32 }}>
        <Tag tone="neutral">Live</Tag>
        <Tag tone="success">Shipped</Tag>
        <Tag tone="warning">Pending</Tag>
        <Tag tone="critical">Critical</Tag>
        <Tag tone="accent">Active</Tag>
      </div>

      <Label>Card — rules-only sectioning</Label>
      <Card
        header={<strong style={{ font: "600 16px/1.3 var(--ck-font-sans)" }}>Stripe-style documentation card</strong>}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary">Save</Button>
          </div>
        }
        style={{ marginTop: 8 }}
      >
        <p style={{ margin: 0, font: "400 15px/1.55 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
          Cards under Swiss chrome lose their borders, fill, and
          shadow. Only top and bottom hairline rules remain. The
          card&apos;s job is to section content, not to be a
          container.
        </p>
      </Card>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--ck-border-subtle)",
          margin: "48px 0",
        }}
      />

      <SectionNumber n="1.4" />
      <h2>Footnotes.</h2>
      <p style={{ font: "400 15px/1.55 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
        Information has rank<sup style={{ font: "500 11px/1 var(--ck-font-sans)", color: "var(--ck-accent)" }}>1</sup>.
        Hierarchy is visible. Every element is exactly where the grid says it should be.
      </p>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--ck-text-primary)",
          margin: "16px 0 8px",
        }}
      />
      <p
        style={{
          font: "400 12px/1.4 var(--ck-font-sans)",
          color: "var(--ck-text-secondary)",
          margin: 0,
        }}
      >
        <sup style={{ color: "var(--ck-accent)", marginRight: 4 }}>1</sup>
        Müller-Brockmann, Josef. <em>Grid Systems in Graphic Design</em>.
        Niggli, Zürich, 1981.
      </p>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--ck-border-subtle)",
          margin: "48px 0 24px",
        }}
      />

      <h2>Chrome switch.</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
        {(["swiss", "seamless", "classic", "editorial", "neobrutalism", "ambient"] as const).map((c) => (
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
          Flip theme — {theme}
        </Button>
      </div>

      {/* Page-number footer in mono, very small. */}
      <div
        style={{
          marginTop: 80,
          paddingTop: 16,
          borderTop: "1px solid var(--ck-border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          font: "500 10px/1 var(--ck-font-mono)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--ck-text-tertiary)",
        }}
      >
        <span>@cosx/ui — Swiss / international typographic</span>
        <span>01 / 01</span>
      </div>
    </>
  );
}

// ---------- Local helpers ----------

function SectionNumber({ n }: { n: string }) {
  return (
    <div
      style={{
        font: "500 13px/1 var(--ck-font-mono)",
        letterSpacing: "0.04em",
        color: "var(--ck-accent)",
        marginBottom: 12,
      }}
    >
      {n}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        font: "500 11px/1 var(--ck-font-sans)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--ck-text-secondary)",
        marginBottom: 4,
      }}
    >
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ minWidth: 160 }}>
      <div
        style={{
          font: "600 36px/1 var(--ck-font-sans)",
          letterSpacing: "-0.02em",
          color: "var(--ck-text-primary)",
          fontVariantNumeric: "tabular-nums",
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div
        style={{
          font: "500 11px/1 var(--ck-font-sans)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--ck-text-secondary)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

const swissThStyle: React.CSSProperties = {
  font: "600 12px/1 var(--ck-font-sans)",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--ck-text-secondary)",
  textAlign: "left",
  padding: "10px 0",
};

const swissTdStyle: React.CSSProperties = {
  padding: "10px 0",
  color: "var(--ck-text-primary)",
};
