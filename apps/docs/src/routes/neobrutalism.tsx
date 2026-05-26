import {
  Button,
  Card,
  Tag,
  Input,
  Checkbox,
  ToggleSwitch,
  Marquee,
  Sticker,
  useTheme,
} from "@cosx/ui";
import { useState } from "react";

// /neobrutalism — demo for the neobrutalism chrome. Same pattern
// as /editorial: page works under any chrome, but the visual
// language only "reads" once chrome = neobrutalism. Top button
// forces the chrome for visitors so they don't have to find the
// toggle.

const ACCENTS = [
  { label: "Blue", light: "#88AAEE", dark: "#A3B8EC" },
  { label: "Lime", light: "#A3E636", dark: "#B5EA5C" },
  { label: "Orange", light: "#FFA07A", dark: "#FFB89A" },
  { label: "Violet", light: "#A388EE", dark: "#B8A3F0" },
  { label: "Pink", light: "#FF6B9D", dark: "#FF8BB3" },
  { label: "Yellow", light: "#FFDC58", dark: "#FFE584" },
  { label: "Teal", light: "#7DDCCB", dark: "#9CE5D8" },
];

export function NeobrutalismPage() {
  const { chrome, setChrome, theme, setTheme } = useTheme();
  const inNeobrut = chrome === "neobrutalism";
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(true);
  const [toggle, setToggle] = useState(false);

  const applyAccent = (light: string, dark: string) => {
    document.documentElement.style.setProperty("--ck-accent-light-override", light);
    document.documentElement.style.setProperty("--ck-accent-dark-override", dark);
  };
  const clearAccent = () => {
    document.documentElement.style.removeProperty("--ck-accent-light-override");
    document.documentElement.style.removeProperty("--ck-accent-dark-override");
  };

  return (
    <>
      {!inNeobrut && (
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
            Switch into the <strong>Neobrutalism</strong> chrome to see this page in its native skin.
          </span>
          <Button variant="primary" onClick={() => setChrome("neobrutalism")}>
            Activate Neobrutalism
          </Button>
        </div>
      )}

      <div style={{ position: "relative" }}>
        <h1>
          Neobrutalism.
        </h1>
        {inNeobrut && (
          <div style={{ position: "absolute", top: -8, right: 0 }}>
            <Sticker tone="warning" rotate={12}>
              New!
            </Sticker>
          </div>
        )}
      </div>

      <p className="docs-summary">
        Memphis-poster meets shareware app. 2 px pure-black borders,
        hard offset shadows (no blur), pastel canvas, saturated
        accent. Buttons translate toward their shadow on hover — the
        signature interaction.
      </p>

      <Marquee text="NEOBRUTALISM × COSX/UI" />

      <h2 style={{ marginTop: 40 }}>Buttons — hover to feel the push</h2>
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          padding: 24,
          background: "var(--ck-bg-surface)",
          border: inNeobrut ? "2px solid var(--neobrut-ink, #000)" : "1px solid var(--ck-border-subtle)",
          borderRadius: 5,
          marginBottom: 24,
        }}
      >
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>
      <p>
        On hover the button translates <code>2px, 2px</code> toward
        the shadow and the shadow shrinks to <code>2px 2px 0</code>.
        On active it fully merges — <code>0 0 0</code>, the element
        sits flush on the page. Reads as a physical click.
      </p>

      <h2>Pick your hero accent</h2>
      <p>
        Neobrutalism wants <em>one</em> saturated accent per app.
        Commit. The brief approves blue (default), lime, orange,
        violet, pink, yellow, and teal.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {ACCENTS.map((a) => (
          <Button
            key={a.label}
            variant="secondary"
            onClick={() => applyAccent(a.light, a.dark)}
            style={{
              background: a.light,
              color: "#000",
            }}
          >
            {a.label}
          </Button>
        ))}
        <Button variant="ghost" onClick={clearAccent}>
          Reset
        </Button>
      </div>

      <h2>Cards, inputs, controls</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Tag tone="accent">USERS</Tag>
            <Tag tone="success">+12</Tag>
          </div>
          <div
            style={{
              font: "800 48px/1 var(--ck-font-display)",
              letterSpacing: "-0.03em",
              color: "var(--ck-text-primary)",
            }}
          >
            1,329
          </div>
        </Card>
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Tag tone="accent">SHIPPED</Tag>
            <Tag tone="warning">v2.0</Tag>
          </div>
          <div
            style={{
              font: "800 48px/1 var(--ck-font-display)",
              letterSpacing: "-0.03em",
              color: "var(--ck-text-primary)",
            }}
          >
            47
          </div>
        </Card>
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Tag tone="accent">REVENUE</Tag>
            <Tag tone="critical">-3%</Tag>
          </div>
          <div
            style={{
              font: "800 48px/1 var(--ck-font-display)",
              letterSpacing: "-0.03em",
              color: "var(--ck-text-primary)",
            }}
          >
            $24K
          </div>
        </Card>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Input
          label="Workspace name"
          placeholder="e.g. Internal Tools"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "center", paddingTop: 22 }}>
          <Checkbox checked={checked} onChange={setChecked} label="Enable shipping mode" />
          <ToggleSwitch
            checked={toggle}
            onChange={setToggle}
            label="Public visibility"
          />
        </div>
      </div>

      <h2>Stickers</h2>
      <p>
        Rotated badges pin to corners of featured cards or banners.
        Filled, bordered, slight tilt — like a real sticker stuck on
        a page. Pick from <code>accent</code> / <code>warning</code> /
        <code> success</code> / <code>critical</code>, or pass a raw
        hex.
      </p>
      <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
        <Sticker tone="warning">v2.0</Sticker>
        <Sticker tone="accent" rotate={6}>New!</Sticker>
        <Sticker tone="success" rotate={-12}>SHIPPED</Sticker>
        <Sticker tone="critical" rotate={3}>Hot!</Sticker>
        <Sticker tone="#A3E636" size={96}>Free</Sticker>
      </div>

      <h2>Marquees</h2>
      <p>The signature section divider — looping chunky text strip.</p>
      <Marquee text="MOVE FAST × BREAK BORDERS × MOVE FAST" />
      <div style={{ height: 12 }} />
      <Marquee text="LIMITED EDITION × LIMITED EDITION × LIMITED EDITION" variant="inverted" />
      <div style={{ height: 12 }} />
      <Marquee text="DASHBOARD VOL.1" speed={40} skew={-1} />

      <h2>Chrome switch</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
        <Button
          variant={chrome === "neobrutalism" ? "primary" : "secondary"}
          onClick={() => setChrome("neobrutalism")}
        >
          Neobrutalism
        </Button>
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
