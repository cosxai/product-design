# Component: Agent module shell (AppRail, BottomTabs, BottomSheet, Popover, Avatar, MetaAvatar)

**Branch**: `main` (direct, per Ben)
**Created**: 2026-10-01
**Status**: Completed

## Overview
What the new COSX app's Agent module needs from the kit, taken from the
Claude Design project "MetaRoom 设计系统重做/metaroom-app": `Metaroom
Agent.dc.html` (desktop rail, phone tab bar and sheets), `Notifications`,
`Metaroom Account`, `meta-avatar.js` / `Meta Avatar.dc.html`.

- @cosxai/ui 1.0.0-alpha.11: `Popover` (+ Trigger, Content, Anchor, Close),
  `Avatar`, `BottomSheet`, `BottomTabs`, `AppRail` (+ `AppRailSlot`).
- @cosxai/chat 1.0.0-alpha.2: `MetaAvatar` (React port of `<meta-avatar>`);
  `AgentAvatar` deprecated.

## Decisions
- Selected fills use `bg-brand-field`, counts and dots `bg-brand-mark`
  (brand.css), so a workspace colour injects. The prototype's literal
  `#FFD166` / `#FFE3A0` are not used.
- Popover keeps the kit's no-shadow rule (hairline on the page colour); the
  prototype's floating shadow is not carried over.
- Disabled rail / tab items stay focusable (`aria-disabled`) so a press can
  explain; the "Coming soon" wording is the caller's (`disabledHint`,
  `onDisabledSelect`).
- MetaAvatar reads `--brand-field` (and `--brand-mark` for the cheeks,
  `--status-error` for the error dot) from the element; any CSS colour is
  accepted, an unparsable one leaves the COSX yellow. Reduced motion draws
  one still frame per state change and runs no animation loop.

## Validate
- [x] `pnpm typecheck` workspace
- [x] vitest: ui 178 · chat 47 (behaviour + axe)
- [x] Playground screenshots: `?c=app-shell` (ui), `?c=meta-avatar` (chat)
- [ ] product-meta: bump both deps and replace the hand-built rail / tabs
