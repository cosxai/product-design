import { useState } from "react";
import {
  Button,
  Card,
  Tag,
  Checkbox,
  useTheme,
  useDialogs,
  CommandInput,
  SuperbarStrip,
  AmbientBackdrop,
} from "@cosxai/ui";

// /ambient — demo for the Ambient Glass chrome. Calm, glass-y,
// dark-first productivity feel inspired by Superlist / Linear /
// Arc. The page works under any chrome; the visual language
// only fully resolves when chrome = ambient (translucent
// surfaces need the ambient mesh behind them to blur).

export function AmbientPage() {
  const { chrome, setChrome, theme, setTheme } = useTheme();
  const { toast } = useDialogs();
  const inAmbient = chrome === "ambient";

  const [tasks, setTasks] = useState([
    { id: 1, title: "Production planning — June", done: false },
    { id: 2, title: "Reply to Marie about the brief", done: false },
    { id: 3, title: "Sketch hero layout — second pass", done: true },
    { id: 4, title: "Lunch with the team @ Maido", done: false },
  ]);
  const toggle = (id: number) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  return (
    <>
      {!inAmbient && (
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
            Switch into the <strong>Ambient Glass</strong> chrome for
            this page in its native skin.
          </span>
          <Button variant="primary" onClick={() => setChrome("ambient")}>
            Activate Ambient
          </Button>
        </div>
      )}

      <h1 style={{ fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
        Ambient Glass.
      </h1>
      <p className="docs-summary">
        Translucent glass surfaces over an ambient mesh backdrop.
        Calm motion, generous padding, one signature gradient — the{" "}
        <em>Superbar</em> — used as a thin accent on active
        elements. Dark-first, but light mode is fully equal.
      </p>

      <SuperbarStrip />

      <h2 style={{ marginTop: 32 }}>The Superbar — single signature gradient</h2>
      <p>
        Used as a hairline divider, the active sidebar / list item's
        right-edge strip (3 px wide), the underline of an active
        tab, the progress-bar fill — sparingly. Never as a button
        fill, never as a large area.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        <SuperbarStrip thickness={1} />
        <SuperbarStrip thickness={2} />
        <SuperbarStrip thickness={4} />
      </div>
      <pre><code>{`<SuperbarStrip thickness={1} />   /* divider */
<SuperbarStrip thickness={2} />   /* tab underline */
<SuperbarStrip thickness={4} />   /* progress bar */`}</code></pre>

      <h2>Glass cards</h2>
      <p>
        Cards under ambient chrome get translucent fill + 1 px
        hairline border + backdrop-filter blur. There's nothing to
        blur if the page bg is flat — the ambient mesh on
        <code>body</code> is what makes the glass effect work.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Active tasks", value: 12, accent: "Today" },
          { label: "Drafts in flight", value: 4, accent: "This week" },
          { label: "Avg cycle time", value: "2.4d", accent: "−18%" },
        ].map((s) => (
          <Card key={s.label}>
            <div
              style={{
                font: "500 13px/1 var(--ck-font-sans)",
                color: "var(--ck-text-secondary)",
                marginBottom: 12,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                font: "700 36px/1 var(--ck-font-sans)",
                letterSpacing: "-0.02em",
                color: "var(--ck-text-primary)",
                marginBottom: 6,
              }}
            >
              {s.value}
            </div>
            <Tag tone="accent">{s.accent}</Tag>
          </Card>
        ))}
      </div>

      <h2>List with active selection</h2>
      <p>
        Single-line rows. Hover gets a soft elevated tint;{" "}
        <strong>active</strong> selection adds the Superbar right-
        edge strip — the same accent that lives in the sidebar.
        Checkboxes use a rounded square with a soft fill.
      </p>
      <Card>
        {tasks.map((t, i) => (
          <div
            key={t.id}
            data-ck-navitem
            data-active={i === 0 ? "true" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              borderTop:
                i === 0 ? "none" : "1px solid var(--ck-border-subtle)",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => toggle(t.id)}
          >
            <Checkbox checked={t.done} onChange={() => toggle(t.id)} />
            <span
              style={{
                flex: 1,
                font: "500 14px/1.4 var(--ck-font-sans)",
                color: t.done ? "var(--ck-text-tertiary)" : "var(--ck-text-primary)",
                textDecoration: t.done ? "line-through" : "none",
              }}
            >
              {t.title}
            </span>
            <span
              style={{
                font: "400 12px/1 var(--ck-font-mono)",
                color: "var(--ck-text-tertiary)",
              }}
            >
              {i === 0 ? "Today" : i === 3 ? "13:00" : ""}
            </span>
          </div>
        ))}
      </Card>

      <h2 style={{ marginTop: 40 }}>The command input — signature element</h2>
      <p>
        Floating pill, heavily blurred, gradient avatar on the
        left, Superbar divider above. Always available at the
        bottom of the page; the most distinctive moment in the
        whole design language. Submit fires the callback you pass.
      </p>
      <div style={{ margin: "32px 0", padding: "16px 0" }}>
        <CommandInput
          placeholder="Ask anything about today…"
          onSubmit={(v) => toast({ kind: "info", message: `You said: "${v}"` })}
        />
      </div>
      <pre><code>{`<CommandInput
  placeholder="Ask anything about today…"
  onSubmit={(v) => doStuff(v)}
/>`}</code></pre>

      <h2>AmbientBackdrop — standalone</h2>
      <p>
        When chrome isn't ambient but you want a single section to
        have the mesh look — a hero banner, a preview region —
        wrap it in <code>&lt;AmbientBackdrop&gt;</code>. The
        ambient chrome applies its mesh on <code>body</code>
        automatically so you don't usually need this.
      </p>
      <AmbientBackdrop noise variant="dark" style={{ padding: 32, borderRadius: 16, marginBottom: 24 }}>
        <div
          style={{
            font: "700 28px/1.1 var(--ck-font-sans)",
            letterSpacing: "-0.01em",
            color: "#F5F5F7",
            marginBottom: 8,
          }}
        >
          A pocket of weather.
        </div>
        <div style={{ font: "400 14px/1.5 var(--ck-font-sans)", color: "rgba(245,245,247,0.7)" }}>
          Drop ambient anywhere you want a calm, premium pocket. The
          1.5% noise overlay keeps the gradient from looking
          synthetic.
        </div>
      </AmbientBackdrop>

      <h2>Chrome switch</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
        {(["ambient", "seamless", "classic", "editorial", "neobrutalism"] as const).map((c) => (
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
          Flip theme · {theme}
        </Button>
      </div>

      <h2 style={{ marginTop: 40 }}>Build your own ambient variant</h2>
      <p>
        The ambient mesh, glass treatment, and Superbar are all
        token + CSS rules in <code>chrome-ambient.css</code>. Same
        pattern as editorial / neobrutalism — drop a CSS block
        under your own <code>html[data-ck-chrome="…"]</code>
        selector and you've got a new chrome.
      </p>
      <pre><code>{`html[data-ck-chrome="myglass"] {
  --ck-bg-canvas:
    radial-gradient(at 20% 30%, #4a2865 0%, transparent 50%),
    radial-gradient(at 80% 60%, #2a1845 0%, transparent 50%),
    #1A1525;
  --ck-bg-surface: rgba(255,255,255,0.05);
  --ck-superbar: linear-gradient(90deg,
    #FF7AA2, #B66EFF, #5DA8FF);
  --ck-blur-window: blur(24px) saturate(140%);
}

html[data-ck-chrome="myglass"] [data-ck-leftnav] {
  background: var(--ck-bg-surface);
  backdrop-filter: var(--ck-blur-window);
}`}</code></pre>
    </>
  );
}
