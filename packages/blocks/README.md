# @cosxai/blocks

Block-based content renderer. Ships the pure-JSX components that
render block-based structured content (slide decks + A4 docs today,
markdown / html-page later) plus the discriminated-union block schema
they consume.

## Why this package exists

The renderer is consumed by two independent parties:

1. **product-meta SPA** — for interactive viewing / draft preview /
   history browse.
2. **product-mesh htmlproc sidecar** — for server-side thumbnail
   rendering (via `renderToString` → puppeteer → PNG) when a new
   commit lands.

Both consumers pull the same version-pinned rendering code from npm so
the thumbnail and the on-screen viewer stay pixel-consistent. Neither
consumer depends on the other; both depend on this neutral library.

## What's in it

- `Slide` — 16:9 artboard chrome (`1024 × 576`) with brand-logo header
  and slide-index counter.
- `Doc` — A4 page chrome (`794 × 1123`) with brand-logo header, title,
  page counter, and confidential footer.
- `BlockRenderer` / `BlockList` — dispatches a `Block` (or `Block[]`)
  to the right view component; supports 20 block types (heading,
  prose, callout, bullet-list, table, image, timeline, card-grid,
  stat-grid, two-column, doc-section, doc-field-table, custom-html,
  signing placeholders, …).
- `BrandProvider` / `useBrand` — React context carrying per-workspace
  brand config (logo URL, confidential-footer copy, accent CSS var).
  M4.5 ships hardcoded defaults; M6 wires workspace config.
- `Block` union + subtypes — TS discriminated union for the content
  JSON.

## Naming

The package covers slide decks AND A4 docs (and future block-based
layouts — markdown, html-page). The mesh entity kind is
`kind='block_doc'` for historical reasons, but the rendering surface
here is not doc-only — Slide vs Doc chrome is driven by the
document's `metadata.layout` field, and both live in this one library
so they share the block schema, renderer, and brand tokens.

## Design constraints

- **Pure JSX**. No `SWR`, no `react-router`, no `@cosxai/ui`, no auth /
  fetch. Every block view is deterministic given props.
- **Server-side sanitised HTML**. Blocks with `html: string` fields
  (prose, callout, table cells, custom-html, …) trust the value —
  sanitisation happens on the mesh write path.
- **`renderMode` opt-in**. `Slide` and `Doc` normally use
  `ResizeObserver` to scale the artboard to the container. Pass
  `renderMode` to skip the observer and render at native design DIP
  (`1024×576` / `794×1123`) — used by the htmlproc sidecar so
  puppeteer clips deterministically.

## Public API

```ts
import {
  Slide, Doc,
  BlockRenderer, BlockList,
  BrandProvider, useBrand,
  type Block, type DocPageContent, type BrandConfig,
} from "@cosxai/blocks";
```

## Consumers

- `product-meta` — imports for `BlockDocViewer` etc.
- `product-mesh/cmd/htmlproc` — imports in Node.js sidecar for
  `renderToString` + puppeteer.

## Distribution

Ships **source TS**. Consumers' bundlers (Vite for SPA, esbuild /
Node.js for the sidecar) resolve TS via their own toolchain. No build
step here — mirror the `@cosxai/ui` shadcn-style pattern.
