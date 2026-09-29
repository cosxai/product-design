# design.cosx.co on Astro (apps/design-next)

The COSX Design System site rebuilt as source: the Claude Design export
(`apps/design/public/*.dc.html`) was converted once by
`scripts/convert.mjs` into `src/site/*.jsx`, which is now edited by hand.
The 3.0 components on its pages are drawn by `@cosxai/ui` through
`src/dc/ds.jsx`; `src/dc/runtime.js` gives each page's logic class React
state.

- Every site page is built four times (en / zh × light / ink,
  `src/lib/variants.js`); `worker/index.ts` serves the one matching the
  visitor's `cosx-site` cookie at the page's clean URL.
- `pnpm preview` — build and serve locally on :8792 through the Worker.
- `pnpm deploy` — Worker `design-next` (the preview) until it takes over
  `design` / design.cosx.co.
- Re-running the converter overwrites `src/site/` — only before hand edits.
