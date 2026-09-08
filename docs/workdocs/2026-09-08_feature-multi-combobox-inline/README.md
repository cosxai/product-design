# Feature: MultiCombobox inline layout + Chip focus fix (kit 0.25.0)

**Branch**: `feature/multi-combobox-inline`
**Created**: 2026-09-08
**Status**: In Progress (PR open, awaiting review)

## Overview

Owner feedback on product-meta's `RecipientListPicker` (built on
0.24.0's `MultiCombobox`):

1. Clicking a chip while another chip's inline editor is open blurs
   the editor first (its `onBlur` commits + unmounts it) and the click
   is lost — a second click is needed. Chip buttons must not steal
   focus on mousedown.
2. The stacked "field, then chips underneath" layout reads as two
   controls. Wanted: a mail-client "To" field — chips INSIDE one
   field, the search input continuing after the last chip.

## Scope

- `Chip`: `onMouseDown={e => e.preventDefault()}` on `.ck-chip-label`
  and `.ck-chip-remove`; `onClick` stays the action.
- `Input`: additive `bare?: boolean` — just the `<input class="ck-input
  ck-input--bare">`, no wrapper / label / helper / error decoration, no
  field chrome (CSS rule with boosted specificity so chrome presets'
  `!important` input rules don't re-add borders).
- `Combobox`: additive `bare?: boolean` (passes `bare` to Input, root
  `position: static` + `flex: 1 1 140px; minWidth: 140px` so the
  dropdown anchors to the host's field) and `inputId?: string` (so a
  host-drawn label can `htmlFor` the input).
- `MultiCombobox`: additive `layout?: 'stacked' | 'inline'` (default
  `stacked`, 0.24.0 behaviour unchanged). `inline` renders the label
  as an eyebrow, then one `.ck-multi-combobox-field` container
  (Input-like chrome, `position: relative`, `:focus-within` ring) with
  the `-entries` list and the bare Combobox inside; editor + hint stay
  below. Invalid state in inline mode: CSS `:has([aria-invalid])` turns
  the field border critical and reveals the `invalidHint` line.
- Docs page: inline demo next to the stacked one; props table row.
- CHANGELOG 0.25.0; `package.json` → 0.25.0.

## Implementation Plan

### Phase 2: Implementation
- [x] `Chip.tsx` mousedown fix
- [x] `Input.tsx` `bare` + CSS
- [x] `Combobox.tsx` `bare` + `inputId`
- [x] `MultiCombobox.tsx` `layout`
- [x] `styles/index.css` rules (`ck-input--bare`, `ck-multi-combobox-field`)
- [x] Docs page + CHANGELOG + version

### Phase 3: Validate
- [x] `pnpm --filter @cosxai/ui typecheck` + `pnpm typecheck` + `pnpm build`
- [x] Playwright smoke against `vite preview` — 23 checks: stacked
      0.24.0 flows unchanged; inline: chips + input inside the field,
      bare input has no chrome, eyebrow label `htmlFor` → input id,
      input follows the last chip (wraps when it does not fit),
      empty-area click focuses the input, `:focus-within` ring is
      `--ck-accent`, dropdown spans the field, pick / Backspace-on-empty
      work, invalid text on blur → critical border + revealed hint;
      focus fix: with an editor open, ONE click on another chip's label
      moves editing there and ONE click on another chip's × removes it,
      mousedown on chip buttons never moves focus. No console errors.

### Phase 4: Release (owner, after merge)
- [ ] `release(ui): v0.25.0` + tag `ui-v0.25.0` + `npm view`
- [ ] product-meta bumps `^0.25.0`, `RecipientListPicker` passes `layout="inline"`

## Notes / deviations

- **Invalid state in inline mode (addition)**: bare Combobox renders no
  error text, which would have made "blurred with non-committable text"
  invisible in inline mode. Kept `aria-invalid` on the bare input and
  added CSS-only reactions on the host frame:
  `.ck-multi-combobox-field:has(.ck-input[aria-invalid="true"])` →
  critical border, and a sibling `.ck-multi-combobox-invalid-hint`
  (hidden by default, revealed by the same `:has()` + `+` selector)
  carrying `invalidHint` (or Combobox's default). No JS state sharing.
- **`inputId` / `inputDescribedBy` on Combobox (addition)**: needed so the host-drawn eyebrow
  label can `htmlFor` the input; otherwise the label would be
  unassociated in inline mode.
- **Bare CSS specificity**: chrome presets restyle `.ck-input` with
  `!important` at up to (0,5,1); `.ck-input.ck-input--bare:not(#\#)`
  out-ranks them. The inline frame itself has no per-chrome styling
  yet (looks like the default kit input in every chrome) — follow-up
  alongside `[data-ck-chip]`.
- **Inline DOM (after Copilot review on PR #15)**: no `display:
  contents` anywhere (VoiceOver can drop list semantics). The frame is
  a `position: relative` `<div class="ck-multi-combobox-field"
  data-testid="-field">` wrapping the `<ul data-testid="-entries">`,
  which is the flex-wrap row: chips as `<li>`s plus a last `<li
  role="presentation">` (`flex: 1 1 140px`) holding the bare Combobox
  (its root is `position: static`, so the dropdown anchors to the
  frame). Both testids survive. Backspace scoping uses a callback ref on
  that `<li>` (a `<div>` in stacked mode). The frame's mousedown also
  treats the `<ul>` as "empty area" so clicking between chips focuses
  the input.
- **Review fixes**: `Input` spreads `...rest` before its `error`-derived
  `aria-invalid` / `aria-describedby` (both branches; consumer
  `aria-describedby` is merged, not replaced). `Combobox` gains
  `inputDescribedBy`; MultiCombobox sets it to the inline invalid
  hint's id.
- **Blur-timer guard (found by the smoke)**: Combobox's `handleBlur`
  runs 150 ms later and set `focused=false` even if the input had been
  re-focused meanwhile — Tab out then click the inline frame within
  150 ms left the list unable to open. The timer now returns early when
  the input is `document.activeElement`.
- **Ref plumbing**: MultiCombobox now holds the Combobox handle in an
  internal ref (for the frame's empty-area click → focus) and
  re-exposes it via `useImperativeHandle`; consumer-visible handle is
  unchanged.
- Stacked output is unchanged: same DOM, same styles, same testids.
