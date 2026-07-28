# Feature: CommandPalette onQueryChange (async command sources)

**Branch**: `feature/command-palette-onquerychange`
**Created**: 2026-07-28
**Status**: Completed (awaiting release tag)

## Overview

`<CommandPalette>` owns its query in local `useState` and exposes it
nowhere — so a consumer can't drive an ASYNC command source (type →
debounce → fetch → show results) because it never learns what was typed.
This blocked product-meta's global document search (⌘K → search docs via
`/v1/document-pages`).

Add an optional, backward-compatible `onQueryChange?: (query: string) =>
void` prop.

## Change

`packages/ui/src/command/CommandPalette.tsx`:
- New prop `onQueryChange?: ((query: string) => void) | undefined`.
- Fires on the input `onChange` (every keystroke) and on the
  reset-to-empty when the palette opens (so an async source clears stale
  results on reopen).
- The open-reset call goes through a `useRef` of the latest callback, so
  an inline consumer callback doesn't re-run the open effect (which would
  clear the query on every render).
- Omit the prop → palette behaves exactly as before (static items only).

Docs: `apps/docs/src/routes/components/command-palette.tsx` — new "Async
sources" section. CHANGELOG + version bump 0.18.2 → **0.19.0**.

## Validation

- `pnpm typecheck` (ui + docs) green.
- No test harness in this repo yet (rules: vitest is M2+); typecheck is
  the gate.

## Release

Bumped to 0.19.0 on this branch. To publish (Ben's release flow):
`git tag ui-v0.19.0 && git push origin main --tags` → publish-ui.yml.
Then product-meta bumps its `@cosxai/ui` dep 0.18.1 → 0.19.0 and wires
the global search (separate branch, blocked on this release).

## Consumers affected

product-meta — consumes `onQueryChange` for global document search in
ShellCommands. Its branch is ready but can't build until 0.19.0 is
published + consumed.
