# design.cosx.co (apps/design)

The COSX Design System site: Astro, static, each page one React island.
Worker `design` (COSX account) on design.cosx.co.

The pages began as the Claude Design export, converted once by
`scripts/convert.mjs` into `src/site/*.jsx`; they are now edited by hand
(design changes from Claude Design are ported by hand). The 3.0
components on the pages are drawn by `@cosxai/ui` through `src/dc/ds.jsx`;
`src/dc/runtime.js` gives each page's logic class React state.

- Every site page is built four times (en / zh × light / ink,
  `src/lib/variants.js`); `worker/index.ts` serves the one matching the
  visitor's `cosx-site` cookie at the page's clean URL, and redirects the
  export's old `.dc.html` URLs.
- `pnpm --filter @cosxai/design-site preview` — build and serve through the Worker on :8792.
- `pnpm --filter @cosxai/design-site deploy` — build and deploy to design.cosx.co.
- Rollback: `wrangler rollback` (Cloudflare keeps earlier versions).
