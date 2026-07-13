# Release: @cosxai/blocks v0.7.0 — appearance out of package

**Branch**: `release/blocks-v0.7.0`
**Created**: 2026-07-13
**Status**: In Progress

## Overview

Breaking release. v0.7.0 strips APPEARANCE (fontFamily, colors,
spacing, borders, dimensional theme values) from `INTERNAL_DEFAULTS`
and extends `DocStyle` from a flat root override to a nested shape
mirroring `INTERNAL_DEFAULTS`'s per-sub-part structure. Appearance now
lives in the doc's own data (`documents.draft_style` +
`document_commits.style` JSONB in product-mesh), populated by
`template_seeds.go`'s editorial bank and backfilled by mesh
migration 000042.

Why: v0.6.x kept appearance in `INTERNAL_DEFAULTS`, so a future
package version tweak silently re-rendered every historical doc. Ben's
principle: **content is a self-contained snapshot**. Package changes
must NOT affect the visual of already-published docs.

## Changes

### `packages/blocks/src/styles.ts`

- **`DocStyle` shape**: flat `{ [type]: CSSProperties }` → nested
  `{ [type]: SubBank }` where each `SubBank` mirrors the sub-part
  structure of the corresponding `INTERNAL_DEFAULTS` block type.
  Example: `docStyle.heading["level-1"] = { fontFamily: "..." }`,
  `docStyle.callout.tones.accent = { borderLeftColor: "..." }`.
- **New exports**: `HeadingBank`, `ProseBank`, `DividerBank`,
  `FooterNoteBank`, `CalloutBank`, `BulletListBank`, `ImageBank`,
  `TwoColumnBank`, `CardGridBank`, `StatGridBank`, `TimelineBank`,
  `TableBank`, `DocSectionBank`, `DocFieldTableBank`, `DocInputBank`,
  `DocTextareaBank`, `DocCheckboxBank`, `DocSignatureBank`,
  `CustomHtmlBank`.
- **`INTERNAL_DEFAULTS` stripped**: only structural keys remain
  (`display`, `listStyleType`, `flexDirection`, `alignItems`,
  `justifyContent`, `flex`, `overflowX`, `borderCollapse`, layout
  `width: 100%` where semantic, `marginLeft: auto` for align).
- **Removed constants**: `SERIF_DISPLAY`, `SANS_BODY`, `ACCENT`,
  `ACCENT_BG_8`, `ACCENT_BG_10`, `Z_50`..`Z_900`, `EMERALD_600` —
  all deleted (values live in mesh's `template_seeds.go` now).
- `resolveStyle` signature unchanged; still merges 3 layers with
  blacklist stripping.

### `packages/blocks/src/BlockRenderer.tsx`

- Every sub-part call site rewritten to look up the nested
  `docStyle[type][subKey]` and pass to `resolveStyle`. `block.style`
  applies only to the outermost DOM node of each block; sub-parts
  omit it (e.g. eyebrow above heading, marker inside bullet).
- `CalloutView` composes `base + tones[tone]` at both package and
  doc layers, then applies `block.style` on the root.
- `BulletListView` resolves markers via `bulletBank?.markers?.[variant]`.
- `CardGridView`, `StatGridView`, `TimelineView`, `TableView`,
  `DocSectionView`, `DocFieldTableView`: every previously-static
  sub-part style now merges the docStyle sub-part before render.
- `CustomHtmlView` now accepts `docStyle` (was `undefined` in
  v0.6.x); root gets nested lookup + block.style layer.

### `packages/blocks/src/index.ts`

- Re-exports all new sub-bank types.
- File-header comment updated to describe v0.7.0 semantics.

### `packages/blocks/package.json`

- Version: `0.6.1 → 0.7.0`.
- Description updated.

### `packages/blocks/README.md`

- New "Styling model (v0.7.0)" section explaining the cascade,
  structural-only `INTERNAL_DEFAULTS`, and how mesh populates
  `docStyle` from persisted JSONB.

## Consumer impact

- **product-mesh** — needs htmlproc pin bump `0.6.1 → 0.7.0` after
  publish. Mesh's own PR (product-mesh#130, "editorial style bank in
  template seed") should merge first so backfilled `commit.style` is
  ready before v0.7.0 renderers stop supplying appearance fallback.
- **product-meta** — needs `web/package.json` pin bump
  `^0.6.1 → ^0.7.0`. No code change needed (existing
  `<BlockRenderer docStyle={pages.style}>` wiring passes through the
  nested shape unchanged).

## Rollout order

1. product-mesh#130 merges → migration 000042 backfills
   `draft_style` + `commit.style` for all existing rows. In this
   window v0.6.1 packages still provide appearance fallback, and
   backfilled bank + fallback both flow; docStyle wins → no visual
   change.
2. product-design v0.7.0 tag pushed → Trusted Publishing → npm.
3. product-mesh htmlproc pin bump PR → merge → `build-htmlproc.yml`
   auto-rebuilds image with v0.7.0 (no appearance fallback).
   Rendered output now sources appearance from backfilled bank
   only → visually identical (byte-for-byte editorial values).
4. product-meta pin bump PR → merge → Cloudflare Workers Builds
   auto-deploys.

## Verification

- [x] `pnpm typecheck` clean
- [x] `pnpm build` clean
- [ ] After deploy: viewer smoke on old block_doc + PDF download.
      Compare with pre-v0.7.0 snapshot; visual diff should be zero
      because backfilled bank = v0.6.1 INTERNAL_DEFAULTS byte-for-byte.
- [ ] "Break test": manually PATCH a doc `draft_style = {}` via API
      → viewer should render unstyled (proves fallback is gone).

## Publish flow

```bash
git checkout release/blocks-v0.7.0
git tag blocks-v0.7.0
git push origin release/blocks-v0.7.0 --tags
# publish-blocks.yml (Trusted Publishing) fires on tag push
# Verify: npm view @cosxai/blocks version → 0.7.0
```
