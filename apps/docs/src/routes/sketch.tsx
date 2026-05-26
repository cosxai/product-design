import { useState } from "react";
import {
  Button,
  Card,
  Tag,
  Input,
  Checkbox,
  useTheme,
  useDialogs,
  RoughBox,
  StickyNote,
  RoughArrow,
  HandUnderline,
} from "@cosx/ui";

// /sketch — demo for the Hand-drawn / Sketchy chrome. Excalidraw /
// tldraw / Whimsical pen-on-paper aesthetic: wobbly lines, hatch
// fills, handwriting fonts, slight rotation on everything. Works
// under any chrome; visual language fully resolves under
// chrome = sketch.

export function SketchPage() {
  const { chrome, setChrome, theme, setTheme } = useTheme();
  const { toast } = useDialogs();
  const inSketch = chrome === "sketch";

  const [tasks, setTasks] = useState([
    { id: 1, title: "Sketch the cover ", done: true },
    { id: 2, title: "Pick the typeface ", done: true },
    { id: 3, title: "Storyboard the demo flow", done: false },
    { id: 4, title: "Get coffee ", done: false },
  ]);
  const toggle = (id: number) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  return (
    <>
      {!inSketch && (
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
            Switch into the <strong>Sketch</strong> chrome to see this
            page in handwriting + wobbly strokes.
          </span>
          <Button variant="primary" onClick={() => setChrome("sketch")}>
            Activate Sketch
          </Button>
        </div>
      )}

      <h1 style={{ marginTop: 0 }}>
        Today's <HandUnderline ink="var(--ck-sketch-pink, #E36AB0)">whiteboard</HandUnderline>.
      </h1>
      <p className="docs-summary" style={{ maxWidth: 560 }}>
        Pen-on-paper feel — wobbly strokes, hatch fills, handwritten
        type, a little tilt on everything. Anti-final by design:
        signals "this is a draft, you can edit it." Pairs especially
        well with AI-output UIs.
      </p>

      {/* Hero — sticky-note board */}
      <h2 style={{ marginTop: 56 }}>The board</h2>
      <p>
        A few sticky notes laid out on the canvas. Each has a slight
        tilt and a hand-drawn second-stroke shadow.
      </p>
      <div
        style={{
          marginTop: 24,
          marginBottom: 40,
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          alignItems: "flex-start",
          padding: 24,
        }}
      >
        <StickyNote color="yellow" tilt={-3}>
          <strong style={{ display: "block", marginBottom: 6 }}>
            ★ Idea
          </strong>
          What if the cover is folded twice and the user opens it?
        </StickyNote>
        <StickyNote color="pink" tilt={2}>
          <strong style={{ display: "block", marginBottom: 6 }}>
            !! Reminder
          </strong>
          Ship the storyboard by Friday — Mio is waiting on it.
        </StickyNote>
        <StickyNote color="green" tilt={-1.5}>
          <strong style={{ display: "block", marginBottom: 6 }}>
            ✓ Done
          </strong>
          Pitched the concept to the team. They were into it.
        </StickyNote>
        <StickyNote color="blue" tilt={3}>
          <strong style={{ display: "block", marginBottom: 6 }}>
            Sketch
          </strong>
          Try a circle motif behind the title — like a planet.
        </StickyNote>
      </div>

      {/* Connector arrows demo */}
      <h2 style={{ marginTop: 56 }}>Connectors</h2>
      <p>
        Hand-drawn arrows connect ideas. Use{" "}
        <code>&lt;RoughArrow&gt;</code> on a positioned container or
        between two <code>&lt;RoughBox&gt;</code> elements.
      </p>
      <div style={{ marginTop: 16, marginBottom: 40, position: "relative", height: 220 }}>
        <div style={{ position: "absolute", left: 20, top: 70, width: 180 }}>
          <RoughBox tilt={-1.5} fill="hatch" ink="var(--ck-sketch-blue)">
            <strong style={{ font: "600 17px/1.2 var(--ck-font-sketch-display, cursive)" }}>
              Draft
            </strong>
            <p style={{ margin: "4px 0 0", font: "500 15px/1.4 var(--ck-font-sketch-body, cursive)" }}>
              Get something out of your head.
            </p>
          </RoughBox>
        </div>
        <div style={{ position: "absolute", left: 320, top: 30, width: 180 }}>
          <RoughBox tilt={1.5} fill="hatch" ink="var(--ck-sketch-yellow)">
            <strong style={{ font: "600 17px/1.2 var(--ck-font-sketch-display, cursive)" }}>
              Review
            </strong>
            <p style={{ margin: "4px 0 0", font: "500 15px/1.4 var(--ck-font-sketch-body, cursive)" }}>
              Mark the bits to change.
            </p>
          </RoughBox>
        </div>
        <div style={{ position: "absolute", left: 320, top: 130, width: 180 }}>
          <RoughBox tilt={-1} fill="hatch" ink="var(--ck-sketch-green)">
            <strong style={{ font: "600 17px/1.2 var(--ck-font-sketch-display, cursive)" }}>
              Ship
            </strong>
            <p style={{ margin: "4px 0 0", font: "500 15px/1.4 var(--ck-font-sketch-body, cursive)" }}>
              Press the button.
            </p>
          </RoughBox>
        </div>
        <div style={{ position: "absolute", left: 200, top: 56, pointerEvents: "none" }}>
          <RoughArrow from={[0, 24]} to={[120, 0]} animated />
        </div>
        <div style={{ position: "absolute", left: 200, top: 130, pointerEvents: "none" }}>
          <RoughArrow from={[0, 12]} to={[120, 30]} animated />
        </div>
      </div>

      {/* Task list */}
      <h2 style={{ marginTop: 40 }}>Today's list</h2>
      <p>
        Checkboxes are drawn squares. Checked items get a hand-drawn
        strikethrough.
      </p>
      <Card style={{ marginTop: 16, marginBottom: 40 }}>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {tasks.map((t) => (
            <label
              key={t.id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                font:
                  "500 18px/1.3 var(--ck-font-sketch-display, \"Caveat\", cursive)",
                color: "var(--ck-text-primary)",
                cursor: "pointer",
              }}
            >
              <Checkbox checked={t.done} onChange={() => toggle(t.id)} />
              <span
                style={{
                  textDecoration: t.done ? "line-through" : "none",
                  textDecorationStyle: "wavy",
                  textDecorationThickness: 1.5,
                  textUnderlineOffset: 4,
                  opacity: t.done ? 0.6 : 1,
                }}
              >
                {t.title}
              </span>
            </label>
          ))}
        </div>
      </Card>

      {/* Buttons */}
      <h2 style={{ marginTop: 40 }}>Buttons</h2>
      <p>
        Drawn rectangles with a second-stroke shadow. Hover tilts
        slightly; active "presses into the page" by collapsing the
        shadow. Labels lean into draft copy — "Try it ↗", "Sketch a
        thought…" — rather than corporate "Submit."
      </p>
      <div style={{ display: "flex", gap: 16, marginTop: 16, marginBottom: 40, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="primary">Sketch it ↗</Button>
        <Button variant="secondary">Maybe later</Button>
        <Button variant="ghost">skip</Button>
        <Button variant="primary" disabled>Sent already</Button>
      </div>

      {/* Tag tones — under sketch they hatch-fill */}
      <h2 style={{ marginTop: 40 }}>Tags</h2>
      <p>
        Drawn ovals with a translucent hatch-fill in the marker
        color. Same Tag API, different visual language.
      </p>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", padding: "16px 0 40px", alignItems: "center" }}>
        <Tag tone="accent">Draft</Tag>
        <Tag tone="success">Ready</Tag>
        <Tag tone="warning">Heads up</Tag>
        <Tag tone="critical">Stop</Tag>
        <Tag tone="neutral">Archived</Tag>
      </div>

      {/* Inputs */}
      <h2 style={{ marginTop: 40 }}>Inputs</h2>
      <p>
        Underline-only inputs in the handwriting font. Italic
        placeholder. Focus thickens the line to 3 px.
      </p>
      <div style={{ marginTop: 16, marginBottom: 40, maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}>
        <label style={{ display: "block" }}>
          <span style={{ font: "600 15px/1.4 var(--ck-font-sketch-display, cursive)", color: "var(--ck-text-primary)" }}>
            What are you sketching?
          </span>
          <Input placeholder="a cover, a poster, a thought…" style={{ marginTop: 4, width: "100%" }} />
        </label>
        <label style={{ display: "block" }}>
          <span style={{ font: "600 15px/1.4 var(--ck-font-sketch-display, cursive)", color: "var(--ck-text-primary)" }}>
            Tags
          </span>
          <Input placeholder="zine, music, friday-night" style={{ marginTop: 4, width: "100%" }} />
        </label>
      </div>

      {/* RoughBox showcase */}
      <h2 style={{ marginTop: 40 }}>Rough boxes</h2>
      <p>
        The drawn-rectangle primitive. Fills include <code>paper</code>,{" "}
        <code>hatch</code> (diagonal marker strokes), and{" "}
        <code>marker</code> (translucent flood). Use as a building
        block when <code>Card</code> isn't enough — e.g. a callout
        embedded inside a longer page.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginTop: 16, marginBottom: 40 }}>
        <RoughBox fill="paper" tilt={-1}>
          <strong style={{ font: "600 18px/1.2 var(--ck-font-sketch-display, cursive)" }}>
            Paper
          </strong>
          <p style={{ margin: "4px 0 0", font: "500 15px/1.4 var(--ck-font-sketch-body, cursive)" }}>
            The default. A drawn rectangle on the canvas.
          </p>
        </RoughBox>
        <RoughBox fill="hatch" ink="var(--ck-sketch-pink)" tilt={1}>
          <strong style={{ font: "600 18px/1.2 var(--ck-font-sketch-display, cursive)" }}>
            Hatch
          </strong>
          <p style={{ margin: "4px 0 0", font: "500 15px/1.4 var(--ck-font-sketch-body, cursive)" }}>
            Diagonal marker strokes fill the inside.
          </p>
        </RoughBox>
        <RoughBox fill="marker" ink="var(--ck-sketch-green)" tilt={-0.5}>
          <strong style={{ font: "600 18px/1.2 var(--ck-font-sketch-display, cursive)" }}>
            Marker
          </strong>
          <p style={{ margin: "4px 0 0", font: "500 15px/1.4 var(--ck-font-sketch-body, cursive)" }}>
            A flat translucent flood of marker color.
          </p>
        </RoughBox>
      </div>

      {/* Empty state */}
      <h2 style={{ marginTop: 40 }}>Empty state</h2>
      <Card style={{ marginTop: 12, marginBottom: 40 }}>
        <div style={{ padding: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center" }}>
          <svg width="160" height="120" viewBox="0 0 160 120" aria-hidden>
            <g fill="none" stroke="var(--ck-text-primary)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              {/* Sun */}
              <circle cx="120" cy="28" r="14" />
              <path d="M120 6 v6 M120 44 v6 M142 28 h-6 M98 28 h6 M134 14 l-4 4 M106 14 l4 4 M134 42 l-4 -4 M106 42 l4 -4" />
              {/* Hills */}
              <path d="M0 100 Q 30 65, 60 95 T 120 88 T 160 100" />
              <path d="M0 110 H 160" />
              {/* A figure looking up */}
              <circle cx="50" cy="72" r="6" />
              <path d="M50 78 v18 M50 88 l-8 6 M50 88 l8 6 M50 96 l-6 12 M50 96 l6 12" />
            </g>
          </svg>
          <h3 style={{ margin: 0, font: "700 26px/1.2 var(--ck-font-sketch-display, cursive)", color: "var(--ck-text-primary)" }}>
            Nothing on the board yet.
          </h3>
          <p style={{ margin: 0, font: "500 16px/1.5 var(--ck-font-sketch-body, cursive)", color: "var(--ck-text-secondary)", maxWidth: 380 }}>
            Start with a sticky note. Or a sketch. Or a question
            you don't know the answer to.
          </p>
          <Button variant="primary">Add the first one ↗</Button>
        </div>
      </Card>

      {/* Toast launchers */}
      <h2 style={{ marginTop: 40 }}>Toasts &amp; modals</h2>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, marginBottom: 40 }}>
        <Button
          variant="primary"
          onClick={() => toast({ message: "Sketch saved to the board ✓", kind: "success" })}
        >
          Save sketch
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ message: "Heads up — Mio left a comment.", kind: "info" })}
        >
          Pretend comment
        </Button>
      </div>

      {/* Chrome switch */}
      <h2 style={{ marginTop: 48 }}>Switch chrome</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
        {(["sketch", "riso", "frutiger", "bento", "seamless", "classic", "editorial", "neobrutalism", "ambient", "swiss", "terminal"] as const).map((c) => (
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
