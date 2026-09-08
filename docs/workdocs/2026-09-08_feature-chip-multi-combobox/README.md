# Feature: Chip + MultiCombobox (kit 0.24.0)

**Branch**: `feature/chip-multi-combobox`
**Created**: 2026-09-08
**Status**: In Progress (PR open, awaiting review)

## Overview

product-meta's group public links ("one link, N recipients") need a
multi-value recipient input: an async-search box that turns each pick
or free-entry email into a removable chip, with an inline editor for
chips that still need a display name. The kit has `Combobox` (single
value, parent-owned commit) but no chip and no multi-value wrapper.

This release adds the primitives, upstreams the one pnpm patch meta
carries against the kit (`LeftNavRail.footerTop`), and ships as
`@cosxai/ui` 0.24.0.

## Scope

1. `Combobox` — additive `clearOnCommit?: boolean` (after `onCommit`
   fires, reset the input to "" and close the dropdown instead of
   echoing the committed text; default false) + `forwardRef<ComboboxHandle>`
   with `ComboboxHandle = { focus(); clear() }`. No other refactor.
2. New `Chip` primitive — pill, `--ck-bg-muted` background, 13px sans,
   tones neutral / accent / warning / critical, `selected` / `disabled`,
   optional click (label becomes a button) and remove (× button).
   Root `<span class="ck-chip" data-ck-chip data-tone data-selected
   data-disabled>`. NOT `ck-tag` (that is the uppercase mono status
   label). No per-chrome CSS in 0.24.0 — `data-ck-chip` is the hook.
3. New `MultiCombobox` — `Combobox` (clearOnCommit, committed=null) +
   `<ul role="list">` of chips + optional inline editor for the
   `editing` entry + `hint` line. Backspace in the EMPTY embedded input
   removes the last entry (not from the editor). Paste / comma splitting
   is the consumer's job inside `onCommit`.
4. `LeftNavRail.footerTop` — the three additive hunks from
   product-meta's `patches/@cosxai__ui.patch`, verbatim.
5. Exports, docs route `components/multi-combobox`, CHANGELOG, version.

## Implementation Plan

### Phase 1: Design
- [x] Confirm API surface (approved plan `greedy-sparking-steele`)
- [x] Identify peer components affected: `Combobox` (additive only),
      `LeftNavRail` (additive prop)

### Phase 2: Implementation
- [x] `Combobox.tsx` — `clearOnCommit` + `ComboboxHandle` via forwardRef
- [x] `Chip.tsx`
- [x] `MultiCombobox.tsx`
- [x] `LeftNavRail.tsx` — `footerTop`
- [x] `primitives/index.ts` exports (umbrella already `export *`)
- [x] Docs route `apps/docs/src/routes/components/multi-combobox.tsx`
      + `main.tsx` / `DocsSidebar.tsx` / `App.tsx` wiring
- [x] `CHANGELOG.md` 0.24.0 + `package.json` 0.24.0

### Phase 3: Validate
- [x] `pnpm --filter @cosxai/ui typecheck`
- [x] `pnpm typecheck` (workspace) + `pnpm build` (docs)
- [x] Browser smoke of the docs demo (Playwright against `vite preview`):
      option pick clears the input and closes the dropdown; free-entry
      email → warning chip + editor; Backspace inside the editor removes
      nothing; Enter in the editor confirms and returns focus to the
      search input; duplicate → rejected + `clear()`; pasted list → two
      chips, editor on the first nameless; Escape drops the nameless
      entry; Backspace in the empty input removes the last chip, with
      text it does not; chip click → `data-selected`; × removes. No
      console errors.

### Phase 4: Release (owner, after merge)
- [ ] `release(ui): v0.24.0` commit + tag `ui-v0.24.0` + push tags
- [ ] `npm view @cosxai/ui version` → 0.24.0
- [ ] product-meta: bump `@cosxai/ui ^0.24.0`, drop
      `pnpm.patchedDependencies` + `patches/@cosxai__ui.patch`

## Testids exposed by MultiCombobox (`testid` prop, default `multi-combobox`)

| testid | element |
|---|---|
| `${testid}` | wrapper div |
| `${testid}-combobox-input` | embedded Combobox input |
| `${testid}-combobox-dropdown` | embedded Combobox dropdown |
| `${testid}-combobox-free-entry` | embedded Combobox free-entry row |
| `${testid}-entries` | `<ul role="list">` |
| `${testid}-entry-${key}` | Chip root for entry `key` |
| `${testid}-editor` | wrapper around `renderEntryEditor(entry)` |

## Consumers affected

product-meta — `RecipientListPicker` (new) builds on `MultiCombobox`;
`AppShell` drops the local `footerTop` patch. `CustomerPicker` and the
existing single-value `Combobox` consumers are unaffected (additive).

## Notes / deviations

- No deviation from the plan's API. The docs demo's `allowFreeEntry`
  accepts a comma / semicolon / whitespace separated list and splits
  it in `onCommit` — this is the consumer pattern the plan describes
  (the gate sees the whole raw string), not a kit prop.
- `MultiCombobox` always renders the `-entries` `<ul>` (empty when
  there are no entries, zero top margin) so tests can assert on a
  stable node; the editor wrapper and hint render only when present.
- The Backspace guard identifies the embedded Combobox input by DOM
  containment (a wrapper div around `<Combobox>`), not by testid, so
  the consumer's editor input is excluded regardless of its testid.
- Follow-ups (not in 0.24.0): per-chrome CSS for `[data-ck-chip]`;
  Combobox dropdown a11y (`role="listbox"`); Enter preferring the
  highlighted result over a typed free entry.
