# Component: ActionBarModeHandle + useActionBarMode

**Branch**: `feature/actionbar-mode-handle`
**Created**: 2026-07-08
**Status**: Completed
**Release**: `@cosxai/ui@0.9.0`
**Consumer**: product-mesh M4.5 (block_doc viewer's admin peek-out)

## Overview

Top-edge peek-out affordance for the floating ActionBar. A slim
44×6 pill sits ~4px above the bar's top edge at rest; grows to
68×24 on hover / focus revealing a label; click flips the active
mode which swaps the bar's item set (via useActionBarItems atomic
source key change).

Ships as two primitives so consumers can compose them however they
need:

- **`ActionBarModeHandle`** — presentational floating button. Pure
  view + onClick. Consumer places it wherever they want and gates
  visibility on their permission bit.
- **`useActionBarMode`** — state + item-registration hook. Manages
  the mode key, optionally persists to localStorage, and registers
  the active mode's items into the ActionBar registry.

Both compose freely (nothing forces you to use them together, though
that's the common shape).

## Design decisions

| Decision | Choice | Rationale |
|---|---|---|
| Positioning | fixed, centred, above ActionBar | Matches ActionBar's default centred bottom placement; the 4px overlap makes the handle look tethered |
| Hover animation | spring easing (0.34, 1.56, 0.64, 1) | Kit's canonical spring — mirrors `ck-actionbar-enter` |
| Visibility gate | consumer prop (`visible`) | Kit doesn't own the capability model; consumer wires their own auth check |
| Persistence | localStorage via optional `storageKey` | Sticky mode = better UX; opt-in so tests can skip |
| Multi-mode | cycle + explicit setMode | Common 2-mode case gets `toggle`; 3-mode case uses `setMode` directly |

## Implementation notes

- Handle uses inline style + CSS custom properties (`--ck-actionbar-handle-w/h`) so the animation works without a global stylesheet — kit's shadcn-style distribution means we can't ask consumers to `import "@cosxai/ui/actionbar.css"`.
- Hover / focus expansion is symmetric: both pointer users and keyboard users see the label reveal.
- Aria label + title both set to the same string; screen readers hear it, hover users see it.
- The mode key IS the ActionBar registry's source key. Switching modes atomically unregisters the previous set (useActionBarItems' cleanup runs when the `sourceKey` argument changes) — no flash of empty ActionBar between modes.
- Idempotent: passing the same mode + items twice is a no-op (useActionBarItems dedupes by item identity).

## API surface

```tsx
// One-liner using both primitives:
const { mode, toggle } = useActionBarMode({
  modes: {
    viewer: viewerItems,   // ActionBarItem[] — MUST be useMemo'd
    manage: manageItems,
  },
  defaultMode: "viewer",
  storageKey: "doc-viewer-mode",  // optional
});

return (
  <>
    <ActionBar />
    <ActionBarModeHandle
      visible={capabilities.manage}
      label={mode === "viewer" ? "Switch to manage" : "Back to viewer"}
      onClick={toggle}
    />
  </>
);
```

## Verification

- [x] `pnpm --filter @cosxai/ui typecheck` — clean
- [x] Manual smoke via docs app (peek visible; hover animates; click swaps items)
- [x] Consumer-side: product-mesh Phase G-I will exercise it in the block_doc viewer

## Release

- Version: 0.8.4 → 0.9.0 (minor, additive)
- Tag: `ui-v0.9.0` — triggers `.github/workflows/publish-ui.yml`
- Consumer bump: product-meta needs `@cosxai/ui@^0.9.0` in its Phase G-I work

## Files

- `packages/ui/src/actionbar/ActionBarModeHandle.tsx`
- `packages/ui/src/actionbar/useActionBarMode.ts`
- `packages/ui/src/actionbar/index.ts` — added exports
- `packages/ui/CHANGELOG.md` — 0.9.0 entry
- `packages/ui/package.json` — 0.9.0 bump
