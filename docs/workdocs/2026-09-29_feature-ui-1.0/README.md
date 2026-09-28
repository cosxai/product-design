# Feature: @cosxai/ui 1.0 — the COSX Design System 3.0 in React

**Branch**: `main` (owner instruction: direct). 0.x maintenance: branch `ui-0.x`.
**Created**: 2026-09-29
**Status**: In Progress

## Overview
Rebuild `@cosxai/ui` as the implementation of COSX Design System 3.0
(design.cosx.co). Tailwind v4 + Radix. The Claude Design projects are the
design source: "COSX Design System 3.0" (tokens, 22 component sources with
types and usage notes) and "MetaRoom 设计系统重做" (the site: 42 pages of
variants, states and usage; the MetaRoom component spec; page prototypes).
Each component is checked against its design.cosx.co page.

## Decisions (owner, 2026-09-29)
- Package name stays `@cosxai/ui`, major bump. 0.x on `ui-0.x`, dist-tag `v0`; alphas under `next`.
- Icons: Lucide. Ink (dark) mode in the first release. Complete status = grey/ink dot (spec as is). Product name (MetaRoom vs COSX) only affects copy.
- 0.x presets (editorial, neobrutalism, riso, sketch, terminal, …) are not carried over.
- Agent conversation components go to a separate `@cosxai/chat`.
- Interaction details the spec does not state follow Radix defaults and WAI-ARIA; differences from the spec are listed for design review.

## Plan

### Stage 0 — foundations (1.0.0-alpha.0)
- [x] publish-ui: dist-tag by version (prerelease → next, 0.x → v0, 1.x → latest)
- [x] apps/docs (ui.cosx.co) on the published 0.25.0, not the workspace package
- [x] branch `ui-0.x`
- [x] 3.0 tokens unchanged in `src/tokens/`; self-hosted fonts; `styles.css`
- [x] Tailwind v4 `theme.css`; test that theme names never contradict tokens; real Tailwind build check
- [x] `cn()`
- [ ] publish 1.0.0-alpha.0 (tag `ui-v1.0.0-alpha.0`) and verify dist-tags

### Stage 1 — the 22 primitives (alpha.1…)
Logo, Icon, IconButton, MetaLabel, Marker, Figure, Button, Badge, Tag, Card ·
Field, Input, Textarea, Select, Checkbox, Radio, Switch · Tabs · Dialog,
Toast, Tooltip · Table. Plus a ThemeProvider (system / light / ink).
Per component: types, behaviour tests (Testing Library), axe, screenshots
light + ink × en + zh compared with its design.cosx.co page.
Select / Popover / Menu / Tooltip: `placement="auto"` (spec proposal).

### Stage 2 — product patterns (MetaRoom spec P0)
Action bar, upload, file card + list row, folder tree, list toolbar,
breadcrumb, status badges, page states, side panel, command palette.

### Stage 3 — `@cosxai/chat`
Craft's conversation components restyled to "Agent conversation".

### Stage 4 — design.cosx.co on Astro
Static pages, view transitions, interactive examples as islands on the
real components; preview URL until parity with the 42 exported pages,
then switch. After the switch, design changes are ported from Claude
Design by hand (the export sync retires).

### Stage 5 — product-meta adopts 1.0
Replace craft's `packages/ui` primitives; desktop dmg + web checked.

## Notes
- 3.0 variable names overlap Tailwind namespaces (`--radius-md`,
  `--ease-out`, `--font-sans`) and one prefix means different things
  (`--text-primary` is a colour in 3.0, `--text-*` a size in Tailwind).
  The theme reuses a 3.0 name only with the same value, and names sizes
  meta/small/ui/body/… — enforced by `theme.test.ts` (it caught
  `--font-cjk` meaning Noto-only in 3.0 on the first run).
- Tokens keep blue/green status colours for legacy surfaces; the theme
  exposes only attention (yellow) and error (red), per the spec.
