import { useMemo } from "react";
import { Kbd, useCommandSource, useCommandPalette, useDialogs } from "@cosxai/ui";

// The palette + cmd+k handler are mounted at App level. This page
// just registers some extra "Action" commands so users can see
// per-page commands joining the base nav list.

export function CommandPalettePage() {
  const { setOpen } = useCommandPalette();
  const { toast, confirm } = useDialogs();
  const pageCommands = useMemo(
    () => [
      {
        key: "demo:say-hello",
        group: "Action",
        label: "Say hello",
        sublabel: "Toast demo",
        run: ({ close }: { close: () => void }) => {
          toast({ kind: "info", message: "Hello." });
          close();
        },
      },
      {
        key: "demo:dangerous",
        group: "Action",
        label: "Pretend to delete the universe",
        sublabel: "Confirm-dialog demo",
        keywords: ["nuke", "destroy", "delete"],
        run: async ({ close }: { close: () => void }) => {
          close();
          const ok = await confirm({
            title: "Delete the universe?",
            message: "This action is irreversible.",
            confirmLabel: "Delete",
            danger: true,
          });
          if (ok) toast({ kind: "error", message: "Just kidding." });
        },
      },
    ],
    [toast, confirm],
  );
  useCommandSource("docs:palette-demo", pageCommands);

  return (
    <>
      <h1>Command palette</h1>
      <p className="docs-summary">
        Press <Kbd>Mod</Kbd>+<Kbd>K</Kbd> anywhere on the docs site
        to open it. Same registry pattern as the action bar — pages
        push commands via <code>useCommandSource()</code> and the
        palette flattens + filters them. The "Jump to" entries that
        navigate to every docs page are registered globally in
        <code>App.tsx</code>; "Action" entries (Say hello, Pretend
        to delete the universe) are registered by this page only.
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: "8px 14px",
          background: "var(--ck-accent)",
          color: "var(--ck-text-inverse)",
          border: "none",
          borderRadius: "var(--ck-radius-sm)",
          font: "500 13px/1 var(--ck-font-sans)",
          cursor: "pointer",
        }}
      >
        Open palette
      </button>

      <h2>Try this</h2>
      <ul style={{ font: "400 14px/1.7 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
        <li>Type "tok" → jumps to the Tokens page.</li>
        <li>Type "nuke" or "destroy" → finds "Pretend to delete the universe" via its keywords.</li>
        <li>Use <Kbd>↑</Kbd> <Kbd>↓</Kbd> and <Kbd>Enter</Kbd> — no mouse needed.</li>
        <li>Press <Kbd>Esc</Kbd> or click outside to close.</li>
      </ul>

      <h2>How registration works</h2>
      <pre><code>{`useCommandSource("doc-viewer:abc123", [
  {
    key: "doc:download",
    group: "Action",
    label: "Download PDF",
    hint: "D",
    keywords: ["export", "save", "pdf"],
    run: ({ close }) => {
      close();
      triggerDownload();
    },
  },
]);`}</code></pre>

      <h2>Group order</h2>
      <p>
        Pass <code>groupOrder</code> to <code>&lt;CommandPalette&gt;</code>{" "}
        to pin which groups appear first. Groups not listed there
        come last in registration order. This docs site uses{" "}
        <code>["Jump to", "Components", "Layout", "Patterns"]</code> — the
        Action group above falls to the end because it's not pinned.
      </p>

      <h2>Hotkey</h2>
      <p>
        Default is <Kbd>Mod</Kbd>+<Kbd>K</Kbd>. Change via the{" "}
        <code>hotkey</code> prop on <code>&lt;CommandProvider&gt;</code>.
        Listener is global and skips when an input is focused but
        NOT when a modal is open (palette layers on top of dialogs).
      </p>
    </>
  );
}
