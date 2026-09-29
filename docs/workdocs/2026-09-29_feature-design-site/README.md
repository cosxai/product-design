# Feature: design.cosx.co (COSX Design System 3.0 site)

**Branch**: `main` (owner instruction: direct)
**Created**: 2026-09-29
**Status**: In Progress

## Overview
Publish the Claude Design "COSX Design System 3.0" site (the `site/`
folder of the "Metaroom 设计系统重做" export) at design.cosx.co,
unchanged, as stage 1. Stage 2 (later): `@cosxai/ui` 1.0 rebuilt on the
3.0 foundations (Tailwind + Radix), and the site's examples rendered
with the real components.

## Plan
- [x] Rename the old showcase Workers `design` → `ui-docs`, `design-stag` → `ui-docs-stag` (ui.cosx.co unchanged)
- [x] `apps/design`: sync script, Worker (clean URLs, title/icon/copyright, /terms), terms of use
- [x] Local check through the Worker: routes, 301 from old file URLs, partial fetches, screenshots
- [ ] First deploy (`wrangler deploy`) → Worker `design` + custom domain design.cosx.co
- [ ] Connect Workers Builds (root `apps/design`, deploy `npx wrangler deploy`)
- [x] Contact address: hello@cosx.co

## Decisions
- Public, © COSINE X LIMITED, all rights reserved; terms list third-party material (fonts, Lucide, React, Babel, Claude Design runtime).
- ui.cosx.co stays on 0.x docs until 1.0 (legacy meta + cycle still use 0.x).
- React/ReactDOM/Babel served from the site (`/vendor/`, SRI-verified); fonts (Google Fonts) and Lucide (jsDelivr) stay external for now.

## Notes
- Workers' clock reads the epoch outside a request — the copyright year is built per request.
- `html_handling: none`: the runtime fetches partials by file name (`Site Header.dc.html`); default handling would redirect `.html` URLs.
- The export's layout is not responsive (fixed sidebar) — a design-side item, not changed here.
