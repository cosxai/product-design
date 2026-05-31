# ActionBar trailing slot

**Branch**: `feature/actionbar-trailing-slot`
**Created**: 2026-05-31
**Status**: Completed

## Overview

Adds `slot?: 'leading' | 'trailing'` to `ActionBarItem`. Trailing items
render after a flex spacer that pins them to the right edge of the bar
regardless of registration order. Default `'leading'` preserves
existing behavior — purely additive, no migration needed.

Driven by `product-meta` needing a stable visual home for the SWR
sync-status indicator (a system-level state widget) that participates
in the same bar as page-level items but shouldn't be shuffled around
when new page items register.

## Implementation Plan

### Phase 1: Design
- [x] API surface — `slot?: 'leading' | 'trailing'`, default `leading`
- [x] Export `ActionBarItemSlot` type
- [x] No breaking change

### Phase 2: Implementation
- [x] `packages/ui/src/actionbar/types.ts` — add field + export new type
- [x] `packages/ui/src/actionbar/ActionBar.tsx` — partition items by slot
  before `buildEntries`, render with a flex spacer between leading
  and trailing groups; extract `renderEntry` helper to keep both
  branches DRY
- [x] `packages/ui/src/actionbar/index.ts` — export `ActionBarItemSlot`

### Phase 3: Validate
- [x] `pnpm --filter @cosxai/ui typecheck`
- [x] `pnpm typecheck` (workspace)
- [x] Visual review — apps/docs ActionBar demo: trailing slot
  demonstrated with a "Synced" status dot

### Phase 4: Release
- [x] Bump `packages/ui/package.json` → 0.3.0 (minor — new feature)
- [x] CHANGELOG entry under 0.3.0
- [ ] Tag `ui-v0.3.0` + push
- [ ] CI publishes via Trusted Publishing
- [ ] Bump `@metaroom/web` dep, implement consumer

## Technical Decisions

### Why slot field on the item, not at the registry / provider level?

Items are owned by the page that registers them; the page is also the
right party to decide leading vs trailing. Adding the field at the
item level keeps the API one-shape and avoids needing a second
registration call.

### Group folding stays slot-local

`buildEntries` runs once per slot. A category split across slots
(items with the same `category` but different `slot`) won't fold into
one group — they'll render as two separate groups, one per side. This
is intentional: collapsing across a spacer would defeat the purpose
of the trailing anchor. If a real use case ever needs that, it would
be a separate feature (and a more complex spec).

### Category-collision in expansion keys

Each slot calls `buildEntries` independently, which assigns
`expansionKey = 'group:${cat}'`. If a category exists in BOTH slots,
those keys collide. Today this is unreachable because we don't ship a
trailing item with a category, but a guard would harden it for
future. Left as-is for 0.3.0; revisit if a real consumer needs it.

### No CSS class changes

The implementation uses inline `flex: '1 1 auto'` on the spacer span.
We could have introduced a `.ck-actionbar-spacer` class for stylable
overrides, but spacers aren't a thing consumers should restyle. Kept
minimal.

## Consumers affected

- `product-meta`: will bump to `^0.3.0` and switch the SWR
  `SyncStatusIndicator` from a TopBar pill to a trailing-slot
  ActionBar item, making it visible on dash routes (currently
  pill-less because dash doesn't mount AppShell).
