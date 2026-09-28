# apps/design — design.cosx.co

The COSX Design System site. The pages are the Claude Design export
(project "MetaRoom 设计系统重做", folder `site/`, built on the
"COSX Design System 3.0" project), served unchanged.

| Path | What |
|---|---|
| `public/` | synced export: pages at the root, `_ds/`, `assets/`, `vendor/` (React, ReactDOM, Babel for the page runtime) + `static/` |
| `static/` | our own files copied into `public/`: favicon, terms of use |
| `src/index.ts` | Worker: clean URLs (`/button`, old `Button.dc.html` navigations 301 to them), title / icon / copyright on every page, `/terms` |
| `src/pages.json` | page list, written by the sync |
| `scripts/sync.mjs` | pulls a new export into `public/` |

## Update the site after a design change

1. Export the Claude Design project and unpack it.
2. `pnpm --filter @cosxai/design-site sync "<export dir>"`
3. Check locally: `pnpm --filter @cosxai/design-site dev` → http://localhost:8787
4. Commit `public/` + `src/pages.json`; push to main. Workers Builds deploys.

The sync edits nothing but the runtime's CDN URLs (→ `/vendor/`, verified
against the SRI hashes in `support.js`). Change the design in Claude
Design, not in `public/` — the next sync overwrites it.

Worker `design` (the old showcase Worker was renamed `ui-docs` on
2026-09-29; ui.cosx.co stays on it until @cosxai/ui 1.0).
