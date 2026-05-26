import { useState } from "react";
import {
  Button,
  Card,
  Tag,
  Input,
  useTheme,
  useDialogs,
  RisoStamp,
  Misregister,
  Halftone,
} from "@cosx/ui";

// /riso — demo for the Risograph / Zine Print chrome. DIY print
// culture as a digital aesthetic: paper canvas, 2-3 fluorescent
// inks, halftone dots, ink-offset duplicates instead of soft
// shadows. The page works under any chrome; the visual language
// only fully resolves under chrome = riso.

export function RisoPage() {
  const { chrome, setChrome, theme, setTheme } = useTheme();
  const { toast } = useDialogs();
  const inRiso = chrome === "riso";

  const [tracks] = useState([
    { n: "01", title: "Late Night Print", artist: "Mio Hayashi",   dur: "3:42", tone: "pink" },
    { n: "02", title: "Ink and Coffee",    artist: "Studio Mals",   dur: "4:18", tone: "blue" },
    { n: "03", title: "Folded Twice",      artist: "Hato Press",    dur: "2:55", tone: "yellow" },
    { n: "04", title: "Edition of 200",    artist: "Risotto",       dur: "5:11", tone: "orange" },
  ] as const);

  return (
    <>
      {!inRiso && (
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
            Switch into the <strong>Risograph</strong> chrome to see this
            page on warm paper with the halftone dots, ink offset
            duplicates, and stamp-style tags.
          </span>
          <Button variant="primary" onClick={() => setChrome("riso")}>
            Activate Risograph
          </Button>
        </div>
      )}

      {/* Print-metadata strip — the "ED. 01 / RISO / 2026 / 02 INKS" line */}
      <div
        style={{
          font: "700 11px/1 \"Courier Prime\", \"Courier New\", monospace",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--ck-text-tertiary)",
          marginBottom: 16,
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <span>ED. 01</span>
        <span>RISO</span>
        <span>2026</span>
        <span>03 INKS · PINK · BLUE · YELLOW</span>
        <span>FOR INTERNAL USE</span>
      </div>

      {/* Hero — large display headline with misregistered offset */}
      <h1
        style={{
          marginTop: 0,
          font: "900 84px/0.92 var(--ck-font-sans)",
          letterSpacing: "-0.02em",
        }}
      >
        <Misregister
          ink="var(--ck-text-primary)"
          offsetInk="var(--ck-riso-pink, #FF48B0)"
          offsetX={4}
          offsetY={4}
        >
          ZINE
        </Misregister>{" "}
        <Misregister
          ink="var(--ck-text-primary)"
          offsetInk="var(--ck-riso-blue, #3D5AFE)"
          offsetX={-4}
          offsetY={4}
        >
          NIGHT.
        </Misregister>
      </h1>
      <p className="docs-summary" style={{ maxWidth: 560 }}>
        Paper canvas, 2-3 fluorescent inks, halftone dots,
        misregistered duplicates. The visual language of indie
        publishing, art schools, club nights, and small presses.
        Anti-glossy by design.
      </p>

      <div style={{ marginTop: 24, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <Button variant="primary">RSVP</Button>
        <Button variant="secondary">See the lineup</Button>
        <RisoStamp ink="yellow" offset="ink" rotate={-6}>OUT NOW</RisoStamp>
        <RisoStamp ink="blue" offset="pink" rotate={3} size="sm">LIMITED · 200</RisoStamp>
      </div>

      {/* Halftone hero — a wide ink block with halftone dots */}
      <h2 style={{ marginTop: 56 }}>HALFTONE PLATE</h2>
      <p>
        Solid ink colour + a halftone dot pattern overlay. Used for
        photo treatments, hero blocks, empty-state illustrations.
        Drop a <code>src</code> on <code>&lt;Halftone&gt;</code> to
        duotone an image; omit it for a pure ink fill.
      </p>
      <div style={{ marginTop: 16, marginBottom: 40, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <Halftone ink="var(--ck-riso-pink)" dotSpacing={6} height={220}>
          <div style={{ padding: 16, height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <span style={{ font: "800 14px/1 sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Side&nbsp;A
            </span>
            <RisoStamp ink="yellow" offset="ink" size="sm" rotate={4}>★ 04</RisoStamp>
          </div>
        </Halftone>
        <Halftone ink="var(--ck-riso-blue)" dotSpacing={5} height={220}>
          <div style={{ padding: 16, height: "100%", display: "flex", alignItems: "flex-end", color: "#F8F1DE" }}>
            <span style={{ font: "800 14px/1 sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Side&nbsp;B
            </span>
          </div>
        </Halftone>
        <Halftone ink="var(--ck-riso-yellow)" dotSpacing={8} height={220}>
          <div style={{ padding: 16, height: "100%", display: "flex", alignItems: "flex-end" }}>
            <span style={{ font: "800 14px/1 sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Bonus
            </span>
          </div>
        </Halftone>
      </div>

      {/* Stamps */}
      <h2 style={{ marginTop: 40 }}>STAMPS</h2>
      <p>
        Rubber-stamp annotations. Rotated, bordered, with an offset
        ink "shadow." Layer them over photos, headlines, or as
        louder Tags.
      </p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", padding: "16px 0 32px", alignItems: "center" }}>
        <RisoStamp ink="pink">★ NEW</RisoStamp>
        <RisoStamp ink="blue" offset="pink">DRAFT</RisoStamp>
        <RisoStamp ink="yellow" offset="ink">LIMITED</RisoStamp>
        <RisoStamp ink="orange" offset="ink">OUT NOW</RisoStamp>
        <RisoStamp ink="red" offset="ink">SOLD OUT</RisoStamp>
        <RisoStamp ink="teal" offset="pink">PRESS</RisoStamp>
        <RisoStamp ink="violet" offset="yellow">ED. 01</RisoStamp>
        <RisoStamp ink="pink" size="lg" offset="blue" rotate={-2}>★ FEATURE</RisoStamp>
      </div>

      {/* Tag tones — under riso these become rubber-stamp tags */}
      <h2 style={{ marginTop: 40 }}>TAG TONES</h2>
      <p>
        Under riso chrome, Tags inherit the stamp look. Same API,
        different visual language.
      </p>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", padding: "16px 0 32px", alignItems: "center" }}>
        <Tag tone="accent">SHIPPING</Tag>
        <Tag tone="success">DELIVERED</Tag>
        <Tag tone="warning">DELAY</Tag>
        <Tag tone="critical">CANCELLED</Tag>
        <Tag tone="neutral">ARCHIVED</Tag>
      </div>

      {/* Cards — printed program zine */}
      <h2 style={{ marginTop: 40 }}>SIDE A · TRACKLIST</h2>
      <p>
        Cards become paper plates with an offset ink-block "shadow"
        in pink (the canonical riso first colour). Rows use dashed
        dividers, never solid lines.
      </p>
      <Card style={{ marginTop: 16 }}>
        <div style={{ padding: 0 }}>
          {tracks.map((t, i) => (
            <div
              key={t.n}
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1fr 1fr 60px 80px",
                gap: 16,
                alignItems: "center",
                padding: "14px 20px",
                borderTop: i === 0 ? "none" : "2px dashed var(--ck-border-subtle)",
              }}
            >
              <span style={{ font: "800 18px/1 \"Courier Prime\", \"Courier New\", monospace", color: "var(--ck-text-tertiary)" }}>
                {t.n}
              </span>
              <span style={{ font: "700 16px/1.2 sans-serif", color: "var(--ck-text-primary)" }}>
                {t.title}
              </span>
              <span style={{ font: "400 14px/1.2 sans-serif", color: "var(--ck-text-secondary)" }}>
                {t.artist}
              </span>
              <span style={{ font: "500 13px/1 \"Courier Prime\", \"Courier New\", monospace", color: "var(--ck-text-tertiary)" }}>
                {t.dur}
              </span>
              <span style={{ textAlign: "right" }}>
                <RisoStamp ink={t.tone} size="sm" rotate={-3}>
                  ★ PLAY
                </RisoStamp>
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Buttons row */}
      <h2 style={{ marginTop: 48 }}>BUTTONS</h2>
      <p>
        Flat ink fill, 2 px black border, offset solid-block shadow
        in a second ink. Hover: shadow snaps shorter. Active: shadow
        collapses to zero (the button "presses into the paper").
      </p>
      <div style={{ display: "flex", gap: 18, marginTop: 12, marginBottom: 40, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="primary">RSVP</Button>
        <Button variant="secondary">Maybe</Button>
        <Button variant="ghost">Skip</Button>
        <Button variant="primary" disabled>Sold out</Button>
      </div>

      {/* Inputs */}
      <h2 style={{ marginTop: 40 }}>INPUTS</h2>
      <p>
        Underline-only inputs, 2 px ink line, italic placeholder.
        Focus: underline becomes the accent ink.
      </p>
      <div style={{ marginTop: 12, marginBottom: 40, maxWidth: 360 }}>
        <label style={{ display: "block", marginBottom: 14 }}>
          <span style={{ font: "700 11px/1 sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ck-text-primary)" }}>
            Name
          </span>
          <Input placeholder="your name" style={{ marginTop: 4, width: "100%" }} />
        </label>
        <label style={{ display: "block" }}>
          <span style={{ font: "700 11px/1 sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ck-text-primary)" }}>
            Email
          </span>
          <Input placeholder="hello@example.com" style={{ marginTop: 4, width: "100%" }} />
        </label>
      </div>

      {/* Empty state */}
      <h2 style={{ marginTop: 40 }}>EMPTY STATE</h2>
      <Card style={{ marginTop: 12, marginBottom: 40 }}>
        <div style={{ padding: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center" }}>
          <Halftone
            ink="var(--ck-riso-pink)"
            dotSpacing={5}
            width={140}
            height={140}
            style={{ borderRadius: "50%", border: "2px solid var(--ck-text-primary)" }}
          />
          <h3 style={{ margin: 0, font: "800 26px/1.1 sans-serif", color: "var(--ck-text-primary)" }}>
            No prints yet.
          </h3>
          <p style={{ margin: 0, font: "400 14px/1.5 sans-serif", color: "var(--ck-text-secondary)", maxWidth: 380 }}>
            Drop a master sheet to start your first run. Two inks
            recommended — pink and blue print beautifully together.
          </p>
          <Button variant="primary">UPLOAD A MASTER</Button>
        </div>
      </Card>

      {/* Toast launcher */}
      <h2 style={{ marginTop: 40 }}>TOASTS &amp; MODALS</h2>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, marginBottom: 40 }}>
        <Button
          variant="primary"
          onClick={() => toast({ message: "ED. 01 just hit the press!", kind: "success" })}
        >
          Fire a toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ message: "Heads up — ink running low on station 2.", kind: "info" })}
        >
          Notice
        </Button>
      </div>

      {/* Chrome switch */}
      <h2 style={{ marginTop: 48 }}>SWITCH CHROME</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
        {(["riso", "frutiger", "bento", "seamless", "classic", "editorial", "neobrutalism", "ambient", "swiss", "terminal"] as const).map((c) => (
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
