# Feature: CommandItem disabled

**Branch**: `feature/command-item-disabled`
**Created**: 2026-07-28
**Status**: Completed (awaiting release tag)

## Overview

A "coming soon" teaser in the ⌘K palette needs to render but not be
selectable. The kit had no disabled state, so a dimmed-looking item was
still keyboard-selectable and — worse — got the default highlight (index
0). Add a real `disabled?: boolean` to `CommandItem`.

## Change

`packages/ui/src/command/`:
- `types.ts` — `disabled?: boolean | undefined` on `CommandItem`.
- `CommandPalette.tsx`:
  - Derive `selIdx` (effective selection): when the raw `selectedIdx`
    points at a disabled or out-of-range row, fall back to the first
    enabled row. So a disabled item is never highlighted and the default
    lands on the first real result.
  - Arrow keys use `stepEnabled` (wraps, skips disabled). Enter no-ops on
    a disabled row. Mouse hover/click ignored on disabled rows.
  - Disabled rows render dimmed (tertiary colour, 0.6 opacity, default
    cursor) + `aria-disabled`.
  - Helpers `firstEnabled` / `stepEnabled`.

Docs: "Disabled items" section. CHANGELOG + version 0.19.0 → **0.20.0**.

## Validation

- `pnpm typecheck` (ui + docs) green. No test harness in this repo yet.

## Release

Bumped to 0.20.0. Publish: `git tag ui-v0.20.0 && git push origin main
--tags`. Then product-meta bumps `@cosxai/ui` → `^0.20.0` and sets
`disabled: true` on the palette's "Agent" teaser.

## Consumers affected

product-meta — the ⌘K "Agent (Coming soon)" item.
