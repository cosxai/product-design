import { useState } from "react";
import {
  Button,
  Card,
  Tag,
  Input,
  Checkbox,
  useTheme,
  useDialogs,
  GlossyOrb,
  SkyBackdrop,
} from "@cosx/ui";

// /frutiger — demo for the Frutiger Aero / Glossy Revival chrome.
// Sky-blue canvas, glossy candy buttons, glass cards, lime pop
// accent, sparkle particles, shimmer-sweep loaders. The page
// works under any chrome; visual language fully resolves only
// when chrome = frutiger.

export function FrutigerPage() {
  const { chrome, setChrome, theme, setTheme } = useTheme();
  const { toast } = useDialogs();
  const inFrutiger = chrome === "frutiger";

  const [bright, setBright] = useState(true);
  const [autoSync, setAutoSync] = useState(false);
  const [progress] = useState(72);

  return (
    <>
      {!inFrutiger && (
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
            Switch into the <strong>Frutiger Aero</strong> chrome to see this
            page on its sky canvas with the glossy candy primitives.
          </span>
          <Button variant="primary" onClick={() => setChrome("frutiger")}>
            Activate Frutiger Aero
          </Button>
        </div>
      )}

      <h1 style={{ marginTop: 0 }}>Frutiger Aero</h1>
      <p className="docs-summary">
        Sky-blue canvas, glossy candy buttons, glass plates, lime
        pop accent, sparkle particles. The optimistic 2004-2013
        aesthetic, revived. Sincerely pretty — don't ironise.
      </p>

      {/* Hero — sparkle-laden sky card with a glossy orb */}
      <SkyBackdrop
        style={{
          borderRadius: 22,
          marginTop: 24,
          marginBottom: 40,
          minHeight: 320,
          padding: 32,
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,50,120,0.18), 0 12px 40px rgba(0,100,200,0.28)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 460 }}>
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 999,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 50%), linear-gradient(180deg, #DCFF66 0%, #C6FF00 100%)",
                color: "#2A3A00",
                font: "600 12px/1 var(--ck-font-sans)",
                border: "1px solid rgba(120, 160, 0, 0.5)",
                textShadow: "0 1px 0 rgba(255,255,255,0.5)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(80,120,0,0.2), 0 2px 6px rgba(120,200,0,0.3)",
              }}
            >
              ✦ New
            </span>
            <h1
              style={{
                margin: "16px 0 8px",
                font: "700 44px/1.05 var(--ck-font-sans)",
                color: "#0E1A6B",
                letterSpacing: "-0.01em",
                textShadow:
                  "0 1px 0 rgba(255,255,255,0.85), 0 2px 6px rgba(0,100,200,0.22)",
              }}
            >
              The future is friendly.
            </h1>
            <p
              style={{
                margin: 0,
                font: "400 16px/1.55 var(--ck-font-sans)",
                color: "rgba(14, 26, 107, 0.78)",
              }}
            >
              Plan trips, share memories, sync your music — all on a
              calm blue sky. Polished plastic, sincerely pretty.
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button variant="primary" className="ck-frutiger-shimmer">
                Get started
              </Button>
              <Button variant="secondary">Tour the features</Button>
            </div>
          </div>
          <GlossyOrb size={170} tone="aqua" />
        </div>
      </SkyBackdrop>

      {/* Buttons row — every variant + state */}
      <h2 style={{ marginTop: 40 }}>Buttons</h2>
      <p>
        Two-layer gradient (aqua base + white gloss top half), 1px
        white highlight along the top edge, soft blue outer glow on
        hover. The signature element.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 8, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="primary">Continue</Button>
        <Button variant="primary" className="ck-frutiger-shimmer">
          ✦ Shimmer sweep
        </Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="ghost">Learn more</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>

      {/* Glassy cards */}
      <h2 style={{ marginTop: 40 }}>Glass cards</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginTop: 16,
          marginBottom: 40,
        }}
      >
        <Card>
          <div style={{ padding: 20 }}>
            <GlossyOrb size={56} tone="aqua" static />
            <h3 style={{ margin: "14px 0 6px", font: "600 18px/1.2 var(--ck-font-sans)", color: "var(--ck-text-primary)" }}>
              iCloud · Photos
            </h3>
            <p style={{ margin: "0 0 12px", font: "400 13px/1.5 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
              4,812 memories, synced across all your devices.
            </p>
            <Tag tone="accent">Up to date</Tag>
          </div>
        </Card>
        <Card>
          <div style={{ padding: 20 }}>
            <GlossyOrb size={56} tone="lime" static />
            <h3 style={{ margin: "14px 0 6px", font: "600 18px/1.2 var(--ck-font-sans)", color: "var(--ck-text-primary)" }}>
              Garden plan
            </h3>
            <p style={{ margin: "0 0 12px", font: "400 13px/1.5 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
              Three new sprouts since yesterday. Water at 6 PM.
            </p>
            <Tag tone="success">Growing</Tag>
          </div>
        </Card>
        <Card>
          <div style={{ padding: 20 }}>
            <GlossyOrb size={56} tone="amber" static />
            <h3 style={{ margin: "14px 0 6px", font: "600 18px/1.2 var(--ck-font-sans)", color: "var(--ck-text-primary)" }}>
              Travel · Bali
            </h3>
            <p style={{ margin: "0 0 12px", font: "400 13px/1.5 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
              Departure in 12 days. Pack the snorkel.
            </p>
            <Tag tone="warning">Soon</Tag>
          </div>
        </Card>
      </div>

      {/* Inputs + controls */}
      <h2 style={{ marginTop: 40 }}>Inputs &amp; controls</h2>
      <Card>
        <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label style={{ display: "block", gridColumn: "1 / -1" }}>
            <span style={{ font: "500 13px/1.4 var(--ck-font-sans)", color: "var(--ck-text-primary)" }}>
              Email
            </span>
            <Input
              type="email"
              placeholder="ada@example.com"
              defaultValue="ada@example.com"
              style={{ marginTop: 6, width: "100%" }}
            />
          </label>
          <label style={{ display: "block" }}>
            <span style={{ font: "500 13px/1.4 var(--ck-font-sans)", color: "var(--ck-text-primary)" }}>
              Backup region
            </span>
            <Input defaultValue="eu-west-1" style={{ marginTop: 6, width: "100%" }} />
          </label>
          <label style={{ display: "block" }}>
            <span style={{ font: "500 13px/1.4 var(--ck-font-sans)", color: "var(--ck-text-primary)" }}>
              Music quality
            </span>
            <Input defaultValue="Lossless · 24-bit" style={{ marginTop: 6, width: "100%" }} />
          </label>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 24, marginTop: 8 }}>
            <Checkbox checked={bright} onChange={setBright} label="Use bright theme" />
            <Checkbox checked={autoSync} onChange={setAutoSync} label="Auto-sync over Wi-Fi" />
          </div>
        </div>
      </Card>

      {/* Progress + shimmer */}
      <h2 style={{ marginTop: 40 }}>Progress &amp; shimmer</h2>
      <p>
        Inset groove + gradient fill + a diagonal shimmer sweep that
        animates across the fill every few seconds (the canonical
        Aero progress bar).
      </p>
      <div style={{ marginTop: 12, marginBottom: 40 }}>
        <div
          style={{
            width: "100%",
            height: 22,
            borderRadius: 999,
            background:
              "linear-gradient(180deg, rgba(0,50,120,0.12) 0%, rgba(255,255,255,0.5) 100%)",
            border: "1px solid rgba(0,60,140,0.18)",
            boxShadow:
              "inset 0 2px 4px rgba(0,50,120,0.18), 0 1px 0 rgba(255,255,255,0.85)",
            padding: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="ck-frutiger-shimmer"
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: 999,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 50%), linear-gradient(180deg, #4FC3F7 0%, #0288D1 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,50,120,0.2)",
            }}
          />
        </div>
        <div style={{ marginTop: 8, font: "500 12px/1 var(--ck-font-mono)", color: "var(--ck-text-secondary)" }}>
          Syncing 1,284 of 1,789 items · {progress}%
        </div>
      </div>

      {/* Toggle + tags */}
      <h2 style={{ marginTop: 40 }}>Tone tags</h2>
      <p>
        Glossy pill tags. Each tone gets its own gradient — accent
        aqua, lime green for go/new, amber for "heads up," red for
        critical.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12, marginBottom: 40 }}>
        <Tag tone="accent">Synced</Tag>
        <Tag tone="success">New</Tag>
        <Tag tone="warning">Heads up</Tag>
        <Tag tone="critical">Action needed</Tag>
        <Tag tone="neutral">Idle</Tag>
      </div>

      {/* Toast + dialog launchers */}
      <h2 style={{ marginTop: 40 }}>Modal &amp; toast</h2>
      <p>
        Modals are heavier glass (16 px backdrop blur + brighter
        top highlight). Toasts slide in from the top right as glossy
        pills.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 12, marginBottom: 40, flexWrap: "wrap" }}>
        <Button variant="primary" onClick={() => toast({ message: "iCloud synced — 4,812 photos uploaded.", kind: "success" })}>
          Fire a toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ message: "12 days until your Bali trip!", kind: "info" })}
        >
          Travel reminder
        </Button>
      </div>

      {/* Empty state with orb */}
      <h2 style={{ marginTop: 40 }}>Empty state</h2>
      <Card style={{ marginTop: 12, marginBottom: 40 }}>
        <div style={{ padding: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <GlossyOrb size={120} tone="rose" />
          <h3 style={{ margin: 0, font: "600 22px/1.2 var(--ck-font-sans)", color: "var(--ck-text-primary)" }}>
            Nothing here yet
          </h3>
          <p style={{ margin: 0, font: "400 14px/1.5 var(--ck-font-sans)", color: "var(--ck-text-secondary)", textAlign: "center", maxWidth: 360 }}>
            Drop a photo, a note, or a sketch — your first memory
            will live here forever, sparkling on the cloud.
          </p>
          <Button variant="primary">Add something</Button>
        </div>
      </Card>

      {/* Chrome switch */}
      <h2 style={{ marginTop: 48 }}>Switch chrome</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
        {(["frutiger", "bento", "seamless", "classic", "editorial", "neobrutalism", "ambient", "swiss", "terminal"] as const).map((c) => (
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
