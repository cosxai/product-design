import {
  Button,
  Card,
  Tag,
  useTheme,
  Folio,
  PlateMarker,
  RunningMarginalia,
  RomanSection,
  EditorialSpotlight,
} from "@cosx/ui";

// /editorial — full demo of the Editorial Collage chrome.
//
// The page itself works in any chrome (the token system is just
// CSS variables flipping in lockstep), but the visual brief — cream
// paper, serif headlines, hairlines, plate numbering — only "reads"
// once chrome = editorial. The button at the top forces editorial
// for visiting visitors so they don't have to find the toggle.

export function EditorialPage() {
  const { chrome, setChrome, theme, setTheme } = useTheme();
  const inEditorial = chrome === "editorial";

  return (
    <>
      {inEditorial && <RunningMarginalia text="AGENTS × LOCAL-FIRST × AGENTS" />}
      {inEditorial && (
        <RunningMarginalia text="STUDIES IN FORM × PERCEPTION" side="right" />
      )}

      {!inEditorial && (
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
            Switch into the <strong>Editorial</strong> chrome to see this page
            in its native skin.
          </span>
          <Button variant="primary" onClick={() => setChrome("editorial")}>
            Activate Editorial
          </Button>
        </div>
      )}

      {/* Folio bar above the page title. */}
      {inEditorial && (
        <Folio
          left={[
            "OD / 2026",
            "VOL. 01",
            "ISSUE N° 26",
            "FILES UNDER DESIGN · INTELLIGENCE",
            "APACHE-2.0",
          ]}
          right="001 / 008"
        />
      )}

      <h1>
        Editorial <em>Collage</em>.
        <span style={{ color: "var(--ck-accent)" }}>.</span>
      </h1>
      <p className="docs-summary">
        A third chrome variant — print-magazine / art-quarterly
        aesthetic. Cream paper, coral accent, serif headlines, no
        shadows, hairline dividers. Same components, different
        skin — every primitive in the kit auto-restyles when
        <code> data-ck-chrome="editorial" </code>is set on
        <code>&lt;html&gt;</code>.
      </p>

      <RomanSection
        n={1}
        eyebrow="Adding a chrome"
        title="How this works"
      />

      <p>
        Editorial is just <code>html[data-ck-chrome="editorial"]</code>
        overriding the token block plus a small CSS file that
        restyles button shape + card hairlines. The kit's primitives
        don't know about editorial specifically — they read tokens
        like <code>--ck-font-display</code> and <code>--ck-accent</code>
        which the chrome flips.
      </p>

      <pre><code>{`/* tokens.css */
html[data-ck-chrome="editorial"] {
  --ck-bg-canvas: #ECE6D6;   /* cream paper */
  --ck-accent:    #E96E50;   /* coral */
  --ck-font-display: var(--ck-font-serif);  /* serif headlines */
  --ck-shadow-1: none;       /* hairlines do the layering */
  /* ... rest of the palette */
}

/* chrome-editorial.css */
html[data-ck-chrome="editorial"] .ck-btn {
  border-radius: 9999px;     /* fully rounded pill */
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow: none;
}
html[data-ck-chrome="editorial"] .ck-card {
  border: 1px solid var(--ck-border-subtle);
  box-shadow: none;
}`}</code></pre>

      <RomanSection
        n={2}
        eyebrow="Editorial primitives"
        title={
          <>
            New <em>components</em> that ship with the chrome
          </>
        }
      />

      <h3 style={{ marginTop: 0, fontSize: 16 }}>Folio bar</h3>
      <p>
        Hairline-bounded strip of metadata across the top of a
        page or section. Left side carries the issue / section /
        plate identifiers; right side is usually the page number.
      </p>
      <Folio
        left={[
          "SECTION · COMPONENTS",
          "CROSSREF · EDITORIAL",
          "PLATE 02",
        ]}
        right="04 / 132"
      />

      <h3 style={{ fontSize: 16 }}>PlateMarker</h3>
      <p>
        Tiny "N° 0X" numeral that sits in the top-left of cards
        and stat blocks. Use to give widgets an editorial index.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { n: 1, label: "SKILLS · SHIPPABLE", value: 132 },
          { n: 2, label: "EDITIONS · LIVE", value: 26 },
          { n: 3, label: "CONTRIBUTORS", value: 8 },
        ].map((s) => (
          <Card key={s.n}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <PlateMarker n={s.n} />
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--ck-accent)",
                }}
              />
            </div>
            <div
              style={{
                font: "500 48px/1 var(--ck-font-display)",
                color: "var(--ck-text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                font: "500 10px/1 var(--ck-font-sans)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ck-text-tertiary)",
              }}
            >
              {s.label}
            </div>
          </Card>
        ))}
      </div>

      <h3 style={{ fontSize: 16 }}>RomanSection</h3>
      <p>
        Oversized italic Roman numeral + section title above a
        hairline rule. The headers in this page are using it.
      </p>

      <h3 style={{ fontSize: 16 }}>RunningMarginalia</h3>
      <p>
        Vertical tracked-uppercase tagline in the far gutters.
        Decoration, not nav. Currently rendering on this page
        (resize wide to see).
      </p>

      <RomanSection
        n={3}
        eyebrow="Same components"
        title="Auto-restyled by the chrome"
      />

      <p>The kit's own primitives just flip — no per-page work needed.</p>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <Button variant="primary">Read the issue</Button>
        <Button variant="secondary">Subscribe</Button>
        <Tag tone="accent" filled>New</Tag>
        <Tag tone="warning">Volume 01</Tag>
      </div>

      <p
        style={{
          font: "400 12px/1.4 var(--ck-font-mono)",
          color: "var(--ck-text-tertiary)",
          letterSpacing: "0.02em",
        }}
      >
        52.5200° N · 13.4050° E ·{" "}
        <span style={{ color: "var(--ck-accent)" }}>
          XX / 132 · VIEW FULL LIBRARY →
        </span>
      </p>

      <RomanSection
        n={4}
        eyebrow="Brief's spotlight section"
        title={
          <>
            Inverted <em>cream-on-dark</em>
          </>
        }
      />

      <p>
        The brief calls for occasional "spotlight" sections — dark
        canvas with cream-paper cards floating on top. The kit's
        global <code>dark</code> theme stays sensible (charcoal
        canvas + cream ink) for legibility; this inversion is
        opt-in per section via <code>&lt;EditorialSpotlight&gt;</code>.
        It rebinds the token vars on its own subtree so cards stay
        cream + their internal text flips back to dark ink, without
        leaking into the surrounding page.
      </p>

      <EditorialSpotlight>
        <div style={{ marginBottom: 16, font: "500 10px/1 var(--ck-font-sans)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          — Spotlight · N° 04
        </div>
        <h3 style={{ font: "500 32px/1.1 var(--ck-font-display)", margin: "0 0 16px", color: "#F4EFE0" }}>
          Studies in <em>form</em>.
          <span style={{ color: "var(--ck-accent)" }}>.</span>
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {[
            { n: 1, label: "PERCEPTION · 2026", value: 47 },
            { n: 2, label: "COMPOSITION", value: 19 },
            { n: 3, label: "PROOFED", value: 132 },
          ].map((s) => (
            <Card key={s.n}>
              <PlateMarker n={s.n} />
              <div
                style={{
                  font: "500 40px/1 var(--ck-font-display)",
                  letterSpacing: "-0.02em",
                  margin: "8px 0 4px",
                }}
              >
                {s.value}
              </div>
              <div className="ck-tag">{s.label}</div>
            </Card>
          ))}
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <Button variant="primary">Read the spread</Button>
          <Button variant="secondary">Skip ahead</Button>
        </div>
      </EditorialSpotlight>

      <RomanSection
        n={5}
        eyebrow="Custom chrome HOWTO"
        title={
          <>
            Make your <em>own</em>
          </>
        }
      />

      <p>
        Editorial isn't special — it's a CSS file. Same pattern works
        for any "design language" you want to layer on top of the
        kit. Drop a block into your stylesheet and you have a third
        (fourth, fifth) chrome:
      </p>

      <pre><code>{`/* my-app/src/styles/chrome-brutalist.css */
html[data-ck-chrome="brutalist"] {
  --ck-bg-canvas: #FFFF00;
  --ck-text-primary: #000000;
  --ck-accent: #FF0000;
  --ck-radius-xs: 0;
  --ck-radius-sm: 0;
  --ck-radius-md: 0;
  --ck-font-sans: "Courier New", monospace;
}
html[data-ck-chrome="brutalist"] .ck-btn {
  border: 2px solid #000;
  border-radius: 0;
  box-shadow: 4px 4px 0 #000;
}`}</code></pre>

      <p style={{ font: "400 14px/1.6 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
        Then call <code>setChrome("brutalist")</code> from anywhere.
        The kit's <code>Chrome</code> type accepts any string so
        TypeScript stops complaining about unknown variants.
      </p>

      <div style={{ marginTop: 40, display: "flex", gap: 8, alignItems: "center" }}>
        <Button
          variant={chrome === "editorial" ? "primary" : "secondary"}
          onClick={() => setChrome("editorial")}
        >
          Editorial
        </Button>
        <Button
          variant={chrome === "seamless" ? "primary" : "secondary"}
          onClick={() => setChrome("seamless")}
        >
          Seamless
        </Button>
        <Button
          variant={chrome === "classic" ? "primary" : "secondary"}
          onClick={() => setChrome("classic")}
        >
          Classic
        </Button>
        <span style={{ flex: 1 }} />
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          Flip theme · {theme}
        </Button>
      </div>
    </>
  );
}
