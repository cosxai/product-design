# Component: MentionCombobox composer highlight

**Branch**: `feature/mention-combobox-highlight`
**Created**: 2026-07-01
**Status**: Completed

## Overview

Adds an optional `mentionNames` prop to the `@cosxai/ui` MentionCombobox primitive so consumers can highlight already-inserted mention tokens as tinted chips WHILE the user is still typing. Because the primitive owns the textarea styling, it can render a mirrored overlay that matches box-for-box — which the product-meta wrapper couldn't do without pixel-perfect style duplication (that attempt landed and reverted 2026-07-01, see meta commits 1ac452e / 63db991).

## API

```tsx
<MentionCombobox<T>
  value={value}
  onChange={setValue}
  loadCandidates={loadCandidates}
  getItemKey={...}
  getInsertionText={...}
  renderItem={...}
  ariaLabel="Comment body"
  mentionNames={picks.map((p) => p.name)}   // NEW — enables highlight
/>
```

When `mentionNames` is provided and non-empty:
- A mirrored `<div>` overlay renders behind the textarea with the same padding / font / border / min-height.
- The textarea's own glyph rendering is hidden (`color: transparent`) but `caret-color` keeps the cursor visible.
- Scroll sync: textarea's `onScroll` updates the overlay's `scrollTop`.
- Overlay walks the value string, splits by `@Name` tokens where Name matches an entry in `mentionNames` (longest-first), and wraps each match in an accent-tinted `<span>`.

When `mentionNames` is omitted or empty, the primitive renders exactly as before — no overlay, no transparent-text hack.

## Design decisions

- **Prop shape**: an array of names (not a regex, not a general-purpose token matcher) because the composer already has the picked candidate list; letting consumers derive `mentionNames` from their existing state is the shortest path. General-purpose overlay support can come later if a use case appears.
- **Layering**: textarea is on top (z-index: 1), overlay is behind (z-index: 0). Textarea has transparent background + transparent color so the overlay's styled content shows through. Caret is drawn by the focused textarea on top.
- **`resize: vertical` compatibility**: overlay uses `inset: 0` inside the existing `position: relative` container; it stretches with the textarea when the user drags to resize.

## Implementation Plan

### Phase 1: Design
- [x] Confirm API surface (`mentionNames?: readonly string[]`)
- [x] Confirm layering (textarea on top with transparent glyphs; overlay behind provides visible background)

### Phase 2: Implementation
- [x] Extend `MentionComboboxProps<T>` with `mentionNames?: readonly string[]`
- [x] Add mirrored overlay renderer + `splitByMentionNames` helper
- [x] Textarea inline style switches to transparent-glyph variant when overlay is on
- [x] Scroll sync via `onScroll` handler

### Phase 3: Validate
- [x] `pnpm --filter @cosxai/ui typecheck`
- [x] Manual visual review in `apps/docs`
- [x] Check product-meta consumers can drop the wrapper-level backspace CSS-class dance

### Phase 4: Release
- [x] Bump `packages/ui/package.json` → 0.7.0
- [x] Tag `ui-v0.7.0` + push
- [x] Verify npm registry updated
- [x] Update product-meta to consume 0.7.0 + delete the reverted overlay hack
