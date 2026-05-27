import { useEffect, useState, type ReactNode } from "react";
import { useTheme, Button, Tag } from "@cosxai/ui";
import type { Chrome } from "@cosxai/ui";

// One control panel for everything theming-related. Mounts the
// built-in chrome toggles, an accent-override picker, and the
// "Neon" custom-chrome demo. The topbar's chrome cycler is a
// shortcut; this page is the canonical control surface.

const ACCENT_PRESETS: { label: string; light: string; dark: string }[] = [
  { label: "Indigo (default)", light: "#534AB7", dark: "#7B72D9" },
  { label: "Emerald",          light: "#059669", dark: "#34D399" },
  { label: "Rose",             light: "#E11D48", dark: "#FB7185" },
  { label: "Amber",            light: "#D97706", dark: "#FBBF24" },
  { label: "Slate",            light: "#475569", dark: "#94A3B8" },
];

// Built-in chromes the kit ships. Single source of truth for the
// toggle UI below; adding a new chrome means appending one entry.
interface ChromeOption {
  id: Chrome;
  label: string;
  description: string;
  // Only true for the "Neon" demo so we can mark it visually as
  // a one-page custom chrome vs a kit built-in.
  custom?: boolean;
}

const BUILTIN_CHROMES: ChromeOption[] = [
  {
    id: "seamless",
    label: "Seamless",
    description:
      "Default. Borders go transparent; layering carried by background shifts. Things 3 / Linear / Raycast feel.",
  },
  {
    id: "classic",
    label: "Classic",
    description:
      "Visible card borders + subtle dividers. The safe choice — every primitive reads correctly without relying on shadows.",
  },
  {
    id: "editorial",
    label: "Editorial",
    description:
      "Print-magazine aesthetic. Cream paper, coral accent, serif headlines, hairline rules, no shadows. See /editorial for the full demo.",
  },
  {
    id: "neobrutalism",
    label: "Neobrutalism",
    description:
      "Memphis-poster meets shareware app. 2 px black borders, hard offset shadows, pastel canvas, hover-translate buttons. See /neobrutalism for the full demo.",
  },
  {
    id: "ambient",
    label: "Ambient Glass",
    description:
      "Superlist / Linear / Arc productivity feel. Translucent glass surfaces over an ambient gradient backdrop, Superbar accent on active items. See /ambient for the full demo.",
  },
  {
    id: "swiss",
    label: "Swiss",
    description:
      "Müller-Brockmann / Vignelli / Stripe-docs aesthetic. Achromatic + one saturated red accent, single neutral grotesk, no shadows, rules-only cards. See /swiss for the full demo.",
  },
  {
    id: "terminal",
    label: "Terminal",
    description:
      "Vercel v0 / charm.sh / Warp / Lazygit aesthetic. Monospace everywhere, square corners, semantic colours only, ASCII layout, dark canonical. See /terminal for the full demo.",
  },
  {
    id: "bento",
    label: "Bento Grid",
    description:
      "Apple product page aesthetic. Mixed-size cards over a neutral canvas, generous radii, soft multi-layer shadows, hover-lift cells. See /bento for the full demo.",
  },
  {
    id: "frutiger",
    label: "Frutiger Aero",
    description:
      "2004-2013 Aero / Vista / iOS 6 / Vision Pro Liquid Glass revival. Sky-blue canvas, glossy candy buttons, lime pop accent, sparkle particles, shimmer-sweep loaders. See /frutiger for the full demo.",
  },
  {
    id: "riso",
    label: "Risograph",
    description:
      "DIY print culture aesthetic — Risotto / Hato Press / indie zines. Warm paper canvas, 2-3 fluorescent inks (pink + blue + yellow), halftone dots, misregistered offset duplicates, rubber-stamp tags. See /riso for the full demo.",
  },
  {
    id: "sketch",
    label: "Hand-drawn",
    description:
      "Excalidraw / tldraw / Whimsical pen-on-paper aesthetic. Wobbly strokes, hatch fills, handwriting fonts, slight rotation on everything. Pairs especially well with AI-output UIs (signals draft, not final). See /sketch for the full demo.",
  },
];

// Custom-chrome demo. Inject a <style> tag with a "neon" chrome
// variant so users can flip into it. Demonstrates the extension
// model: chrome variants are just `html[data-ck-chrome="<name>"]`
// blocks that override whichever tokens you want.
const NEON_STYLE_ID = "ck-neon-chrome-demo";
const NEON_CSS = `
html[data-ck-chrome="neon"] {
  --ck-bg-canvas:    #07080C;
  --ck-bg-sidebar:   #05060A;
  --ck-bg-surface:   #0D1018;
  --ck-bg-surface-2: #13172A;
  --ck-bg-muted:     #0B0D14;
  --ck-border-subtle: rgba(124, 58, 237, 0.18);
  --ck-border-strong: rgba(124, 58, 237, 0.32);
  --ck-text-primary:   #E9E4FF;
  --ck-text-secondary: #B0A6E0;
  --ck-text-tertiary:  #6E66A0;
  --ck-text-disabled:  #4A4570;
  --ck-text-inverse:   #07080C;
  --ck-accent: #C084FC;
  --ck-accent-muted: color-mix(in oklab, var(--ck-accent) 18%, transparent);
  --ck-accent-border: color-mix(in oklab, var(--ck-accent) 40%, transparent);
  --ck-shadow-2: 0 0 32px color-mix(in srgb, var(--ck-accent) 18%, transparent);
}`;

export function ThemingPage() {
  const { theme, setTheme, chrome, setChrome } = useTheme();

  // Inject the neon CSS once. Stays after navigation so the user
  // can keep using it from anywhere in the app.
  useEffect(() => {
    if (document.getElementById(NEON_STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = NEON_STYLE_ID;
    el.textContent = NEON_CSS;
    document.head.appendChild(el);
  }, []);

  const [showNeonSource, setShowNeonSource] = useState(false);

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
      <h1>Theming</h1>
      <p className="docs-summary">
        Two orthogonal axes — theme (light · dark) and chrome (visual
        style preset) — plus a single brand accent override. All driven
        by CSS variables so transitions cross-fade in lockstep across
        every component.
      </p>

      <Section title="Theme · light / dark">
        <p>
          Current: <code>{theme}</code>. Reads <code>prefers-color-
          scheme</code> on first load; user choice persists in
          localStorage afterward.
        </p>
        <SegmentedControl
          value={theme}
          onChange={(v) => setTheme(v as "light" | "dark")}
          options={[
            { id: "light", label: "Light" },
            { id: "dark", label: "Dark" },
          ]}
        />
      </Section>

      <Section title="Chrome · built-in">
        <p>
          Chrome is the visual style preset. Independent of the
          light/dark axis — every chrome works under both themes
          (some, like Editorial, also override the theme palette to
          their own).
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginBottom: 12,
          }}
        >
          {BUILTIN_CHROMES.map((c) => (
            <ChromeCard
              key={c.id}
              active={chrome === c.id}
              label={c.label}
              description={c.description}
              onClick={() => setChrome(c.id)}
            />
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--ck-text-tertiary)" }}>
          Setting persists in localStorage under{" "}
          <code>cosx-docs-chrome</code> (override via the{" "}
          <code>chromeStorageKey</code> prop on{" "}
          <code>&lt;ThemeProvider&gt;</code>).
        </p>
      </Section>

      <Section title="Chrome · custom (defined on this page)">
        <p>
          Chrome isn't a fixed enum — it's a string on{" "}
          <code>data-ck-chrome</code>. The "Neon" variant below is
          defined inline on this page; flipping into it doesn't
          require changing the kit.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <Button
            variant={chrome === "neon" ? "primary" : "secondary"}
            onClick={() => setChrome("neon")}
          >
            Neon (deep purple + glow)
          </Button>
          <Button variant="ghost" onClick={() => setShowNeonSource((v) => !v)}>
            {showNeonSource ? "Hide" : "Show"} source
          </Button>
          <Tag tone="accent">Custom</Tag>
        </div>
        {showNeonSource && (
          <pre style={{ marginTop: 12 }}>
            <code>{NEON_CSS.trim()}</code>
          </pre>
        )}
        <p>
          To define a new chrome in your own app:
        </p>
        <ol style={{ font: "400 14px/1.7 var(--ck-font-sans)", color: "var(--ck-text-secondary)", paddingLeft: 20 }}>
          <li>
            Drop a CSS block targeting{" "}
            <code>html[data-ck-chrome="yourname"]</code> that
            overrides whichever tokens you want.
          </li>
          <li>
            Call <code>setChrome("yourname")</code>. The kit doesn't
            care what the string is — anything not overridden falls
            back to the <code>:root</code> defaults in{" "}
            <code>tokens.css</code>.
          </li>
        </ol>
      </Section>

      <Section title="Brand accent · override">
        <p>
          Accent is the only colour primitive — every shade (hover,
          active, muted, border) derives via <code>color-mix()</code>.
          Override per-app by stamping{" "}
          <code>--ck-accent-light-override</code> /{" "}
          <code>--ck-accent-dark-override</code> on{" "}
          <code>documentElement.style</code>.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {ACCENT_PRESETS.map((p) => (
            <Button
              key={p.label}
              variant="secondary"
              onClick={() => applyAccent(p.light, p.dark)}
            >
              {p.label}
            </Button>
          ))}
          <Button variant="ghost" onClick={clearAccent}>
            Reset
          </Button>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <Button variant="primary">Primary uses accent</Button>
          <span
            className="ck-tag"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 10px",
              border: "1px solid var(--ck-accent-border)",
              background: "var(--ck-accent-muted)",
              color: "var(--ck-accent)",
              borderRadius: "var(--ck-radius-sm)",
            }}
          >
            Muted accent tag
          </span>
        </div>
        <p style={{ fontSize: 12, color: "var(--ck-text-tertiary)", marginTop: 8 }}>
          Note: under <code>chrome="editorial"</code> the accent is
          locked to coral by the chrome's CSS. Switch back to seamless
          / classic to see the override take effect.
        </p>
      </Section>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ marginBottom: 8 }}>{title}</h2>
      {children}
    </section>
  );
}

interface SegmentedControlProps {
  value: string;
  onChange: (next: string) => void;
  options: { id: string; label: string }[];
}

function SegmentedControl({ value, onChange, options }: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      style={{
        display: "inline-flex",
        gap: 4,
        padding: 4,
        background: "var(--ck-bg-muted)",
        borderRadius: 999,
      }}
    >
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border: "none",
              background: active ? "var(--ck-bg-surface)" : "transparent",
              color: active ? "var(--ck-text-primary)" : "var(--ck-text-secondary)",
              font: "500 12px/1 var(--ck-font-sans)",
              cursor: "pointer",
              transition: "background var(--ck-dur-fast) var(--ck-ease), color var(--ck-dur-fast) var(--ck-ease)",
              boxShadow: active ? "var(--ck-shadow-1)" : "none",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ChromeCard({
  active,
  label,
  description,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        textAlign: "left",
        padding: 16,
        background: active ? "var(--ck-accent-muted)" : "var(--ck-bg-surface)",
        border: `1px solid ${active ? "var(--ck-accent-border)" : "var(--ck-border-subtle)"}`,
        borderRadius: "var(--ck-radius-md)",
        cursor: "pointer",
        transition: "background var(--ck-dur-fast) var(--ck-ease), border-color var(--ck-dur-fast) var(--ck-ease)",
        fontFamily: "var(--ck-font-sans)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            font: "500 14px/1.3 var(--ck-font-sans)",
            color: active ? "var(--ck-accent)" : "var(--ck-text-primary)",
          }}
        >
          {label}
        </span>
        {active && <Tag tone="accent">Active</Tag>}
      </div>
      <p
        style={{
          margin: 0,
          font: "400 12px/1.5 var(--ck-font-sans)",
          color: "var(--ck-text-tertiary)",
        }}
      >
        {description}
      </p>
    </button>
  );
}
