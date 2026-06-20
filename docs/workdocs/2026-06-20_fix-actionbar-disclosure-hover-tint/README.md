# Fix: ActionBar disclosure-group child hover uses accent tint

**Branch**: `fix/actionbar-disclosure-hover-tint`
**Created**: 2026-06-20
**Status**: In Progress
**Release**: `@cosxai/ui@0.4.5`

## Overview

When an `ActionBarMenuGroup` is open, its wrapper `<div>` is painted
`var(--ck-accent-muted)` — a translucent accent pill that extends
across the head button + its disclosure children. Hovering a child
button (e.g. `New folder`, `Upload PDF`) currently paints
`var(--ck-bg-muted)` (neutral gray) on top of that accent pill, which
reads as a hue collision. Reported on product-meta's `/documents`
page where the editorial chrome (coral accent) makes the mismatch
most obvious.

## Plan

### Phase 1: Design

- [x] Confirm the offending rule lives in `packages/ui/src/styles/index.css:185`.
- [x] Confirm chrome-specific files (`chrome-*.css`) don't already
      override hover on a per-group basis.
- [x] Choose tint approach: scope a `color-mix(in oklab,
      var(--ck-accent) 18%, transparent)` overlay only when the
      child sits inside an open group — keep standalone hover
      gray (correct for standalone buttons sitting on app bg).

### Phase 2: Implementation

- [x] `ActionBarMenuGroup.tsx` stamps a class `ck-actionbar-group--open`
      on its wrapper while `isOpen === true`. Wrapper keeps its
      inline `--ck-accent-muted` background — only the class is new.
- [x] `index.css` adds a scoped rule
      `.ck-actionbar-group--open .ck-actionbar-btn:hover:not(...)`
      that paints the accent-blended overlay. Specificity beats the
      base rule but is intentionally below `.ck-actionbar-btn--primary`
      (excluded via `:not()`) so primary children retain their solid
      fill on hover.
- [x] Bump `packages/ui/package.json` 0.4.4 → 0.4.5.
- [x] Add CHANGELOG entry.

### Phase 3: Validate

- [ ] `pnpm --filter @cosxai/ui typecheck` green.
- [ ] Workspace typecheck green (docs app uses ActionBar).
- [ ] Manual visual: open `/documents` consumer with editorial chrome
      after npm publish + product-meta dep bump.

### Phase 4: Release

- [ ] Commit `release(ui): v0.4.5`.
- [ ] Tag `ui-v0.4.5` + push tags.
- [ ] `.github/workflows/publish-ui.yml` fires Trusted Publishing
      → npm registry updated.
- [ ] Notify product-meta: bump dep, no regen required (no API surface change).

## Visual reference

Before (PR #28 testing env screenshot, editorial chrome):
- `[CREATE ‹]` head — coral wrapper
- `[ NEW FOLDER ]` child hover — gray fill on coral wrapper → muddy

After:
- Same coral wrapper
- Child hover — coral overlay deeper than the wrapper → reads as
  "hover" without changing hue.

## Consumers affected

- product-meta `DocumentListPage` (the page that surfaced this).
  Bump `@cosxai/ui` 0.4.4 → 0.4.5 in `package.json` after publish.
  No code change.

## Design rationale

Why a class on the wrapper, not a prop drilled into `ActionBarButton`:

- The Open / Closed concept lives on the GROUP. Children don't know
  they're inside a group. Threading an `inOpenGroup` prop through
  every `ActionBarButton` instance would leak group context into a
  primitive that's also used standalone (top-level items, trailing
  slot). A wrapper-side class lets CSS scope the override exactly
  where it belongs without touching the leaf component's API.

Why 18% as the blend percentage:

- `--ck-accent-muted` ranges 8–14% across the in-the-box chromes
  (base 8, ambient 12, editorial 14, riso/sketch similar). 18% sits
  one step deeper than every preset's wrapper bg so hover always
  reads as "darker" without going saturated. Neobrutalism's muted
  is 30%, so its hover will paint lighter than wrapper — that's
  acceptable until someone hits it; neobrutalism wasn't in the
  consumer set for M2.
