import { useMemo, useState } from "react";
import {
  Kbd,
  useActionBarItems,
  useActionBarStatusDot,
  useDialogs,
  useKeyboardHotkey,
} from "@cosxai/ui";

// Live action-bar demo page. Items registered here appear in the
// bar at the bottom of the screen for as long as this page is
// mounted. Three groups + a few solo items show off:
//   - flat solo items (Comment, Translate, Present)
//   - group expansion (Share → child sub-menu: New share / Copy URL / Forward)
//   - active-child styling (Manage → with one child marked active)
//   - keyboard hotkeys with conflict guards

export function ActionBarPage() {
  const { toast } = useDialogs();
  const [commentMode, setCommentMode] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [editing, setEditing] = useState(false);
  const items = useMemo(
    () => [
      // ----- Solo items -----
      {
        key: "comment",
        label: "Comment",
        active: commentMode,
        hint: "C",
        icon: <Dot />,
        onClick: () => setCommentMode((v) => !v),
      },
      {
        key: "translate",
        label: translating ? "Original" : "Translate",
        active: translating,
        hint: "T",
        icon: <Dot />,
        onClick: () => setTranslating((v) => !v),
      },
      // ----- "Share" group (3 items → folds into one group head) -----
      {
        key: "share-new",
        category: "share",
        label: "New share",
        icon: <Dot />,
        onClick: () => toast({ kind: "info", message: "New share dialog (pretend)." }),
      },
      {
        key: "share-copy",
        category: "share",
        label: "Copy URL",
        icon: <Dot />,
        onClick: () => toast({ kind: "success", message: "URL copied." }),
      },
      {
        key: "share-forward",
        category: "share",
        label: "Forward",
        icon: <Dot />,
        onClick: () => toast({ kind: "info", message: "Forward share (pretend)." }),
      },
      // ----- "View" group (2 items, one active) — head shows
      // primary variant because a child is active -----
      {
        key: "view-stats",
        category: "view",
        label: "Stats",
        icon: <Dot />,
        active: editing,
        onClick: () => setEditing((v) => !v),
        // Keep the group open after toggling so the user can flip
        // between modes without re-opening. Demonstrates the
        // `keepGroupOpenOnClick` opt-in.
        keepGroupOpenOnClick: true,
      },
      {
        key: "view-grid",
        category: "view",
        label: "Grid",
        icon: <Dot />,
        onClick: () => toast({ kind: "info", message: "Grid view (pretend)." }),
      },
      // ----- Solo at the end -----
      {
        key: "present",
        label: "Present",
        hint: "P",
        icon: <Dot />,
        onClick: () => toast({ kind: "info", message: "Pretend present mode toggled." }),
      },
      // ----- Trailing slot — pins to the right edge regardless of
      // registration order. Use for *page* actions that should sit
      // at the right (e.g. "Save", "Preview"); system status
      // affordances belong on the bar-intrinsic statusDot slot
      // instead (see below). -----
      {
        key: "preview",
        label: "Preview",
        title: "Preview (system status — pinned to the right via slot: 'trailing')",
        icon: <Dot />,
        slot: "trailing" as const,
        onClick: () =>
          toast({ kind: "info", message: "Trailing item — pretend preview action." }),
      },
    ],
    [commentMode, translating, editing, toast],
  );
  useActionBarItems("docs:action-bar-demo", items);

  // Bar-intrinsic status dot — mirrors the left-edge drag grip.
  // Sits at the far right, after any trailing items. The colour
  // tells the visitor the system is healthy without competing with
  // the page actions; the title surfaces detail on hover; the
  // click is wired here to demo, but consumers in the wild typically
  // open a popover anchored elsewhere.
  useActionBarStatusDot({
    color: "var(--ck-status-success, #16a34a)",
    title: "All good — synced",
    onClick: () =>
      toast({ kind: "success", message: "Status dot clicked — pretend popover." }),
  });

  useKeyboardHotkey("c", () => setCommentMode((v) => !v));
  useKeyboardHotkey("t", () => setTranslating((v) => !v));
  useKeyboardHotkey("p", () =>
    toast({ kind: "info", message: "Present via hotkey" }),
  );

  return (
    <>
      <h1>Action bar</h1>
      <p className="docs-summary">
        Floating, registry-driven button bar. Pages push items into{" "}
        <code>useActionBarItems()</code>; the bar groups, displays,
        and animates. Look at the bottom of the screen — the items
        below are all registered live by this page.
      </p>

      <h2>Try the features</h2>
      <ul style={{ font: "400 14px/1.7 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
        <li>
          <strong>Drag</strong> — grab the six-dot grip on the left edge
          and drop the bar anywhere. Position persists to localStorage.
        </li>
        <li>
          <strong>Double-click the grip</strong> — resets to the default
          centred position (also clears the saved position).
        </li>
        <li>
          <strong>Group expansion</strong> — "Share" (3 items) collapses
          into one expandable head. Click → children slide in with the
          chevron rotating 180°. ESC or clicking outside closes.
        </li>
        <li>
          <strong>Active-child styling</strong> — toggle the "Stats" item
          inside "View" → the View group head turns primary (full
          accent) because a child is in an active mode.
        </li>
        <li>
          <strong>keepGroupOpenOnClick</strong> — Stats keeps the View
          group open after clicking so you can flip modes rapidly.
        </li>
        <li>
          <strong>Responsive labels</strong> — narrow the window below
          768 px. Labels disappear, icons + tooltips remain.
        </li>
        <li>
          <strong>Phone collapse</strong> — at phone width, the grip
          becomes a collapse button. Tap to collapse → the bar shrinks
          to a left-edge peek tab. Tap the tab to expand. State
          persists.
        </li>
        <li>
          <strong>Hotkeys</strong> — <Kbd>C</Kbd>, <Kbd>T</Kbd>, <Kbd>P</Kbd>.
          Try them inside the input below — they're suppressed (focus
          guard).
        </li>
        <li>
          <strong>Trailing slot</strong> — the "Preview" item is
          registered with <code>slot: "trailing"</code>. It's pinned to
          the right edge via a flex spacer and stays there even though
          it was registered AFTER the other items. Use this for page
          actions you want anchored right (Preview, Save, …).
        </li>
        <li>
          <strong>Status dot</strong> — the small green dot at the far
          right is bar-intrinsic chrome (not a registry item),
          registered via <code>useActionBarStatusDot()</code>. It
          mirrors the left-edge drag grip — left says "grab this",
          right says "here's how the system is". Hover for the title,
          click to fire the consumer's handler.
        </li>
      </ul>

      <h2>Live state</h2>
      <div
        style={{
          padding: 16,
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
          borderRadius: "var(--ck-radius-md)",
          marginBottom: 16,
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
          font: "400 13px/1 var(--ck-font-sans)",
          color: "var(--ck-text-secondary)",
        }}
      >
        <span>Comment: <strong>{commentMode ? "on" : "off"}</strong></span>
        <span>Translating: <strong>{translating ? "yes" : "no"}</strong></span>
        <span>Editing: <strong>{editing ? "yes" : "no"}</strong></span>
      </div>
      <input
        placeholder="Focus me and try C / T / P — they're suppressed in inputs"
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "8px 12px",
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-strong)",
          borderRadius: "var(--ck-radius-sm)",
          color: "var(--ck-text-primary)",
          font: "400 13px/1.4 var(--ck-font-sans)",
        }}
      />

      <h2>API</h2>
      <pre><code>{`// 1. Declare your category catalog at the provider
<ActionBarProvider
  categories={{
    share:  { label: "Share",  icon: <ShareIcon /> },
    manage: { label: "Manage", icon: <ManageIcon /> },
  }}
>
  <App />
  <ActionBar />        {/* mount once near the bottom */}
</ActionBarProvider>

// 2. Pages push items
useActionBarItems("doc-viewer:abc123", [
  {
    key: "comment",
    label: "Comment",
    icon: <CommentIcon />,
    hint: "C",
    active: commentMode,
    onClick: () => setCommentMode(v => !v),
  },
  {
    key: "share-new", category: "share",     // groups
    label: "New share", icon: <ShareIcon />,
    onClick: openShareModal,
  },
  // ... more items
]);

// 3. Wire shortcuts separately (the bar shows the hint;
//    conflict guards live in the hook)
useKeyboardHotkey("c", () => setCommentMode(v => !v));`}</code></pre>

      <h2>Bar options</h2>
      <pre><code>{`<ActionBar
  draggable={true}            // desktop drag-to-reposition (default true)
  collapsibleOnPhone={true}   // phone collapse handle (default true)
  storageKey="myapp-actionbar"// localStorage namespace
/>`}</code></pre>

      <h2>Active state, primary, and "soft" variants</h2>
      <p>
        Items get the <code>primary</code> visual when their{" "}
        <code>active</code> prop is true. Group heads get{" "}
        <code>primary</code> when any of their children is active —
        the "mode is on" cue wins over the "menu is open" cue. When a
        head is open but no child is active, the head shifts to{" "}
        <code>soft</code> (accent text inside a muted-accent wrapper
        pill).
      </p>
    </>
  );
}

function Dot() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "currentColor",
        opacity: 0.5,
      }}
    />
  );
}

