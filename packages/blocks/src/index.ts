// Public API for @cosxai/blocks.
//
// Consumers (product-meta SPA, product-mesh htmlproc sidecar) should
// import from the package root:
//
//   import { BlockRenderer, BlockList } from "@cosxai/blocks";
//   import type { Block } from "@cosxai/blocks";
//
// Since 0.5.0 the package ships ONLY the block content language
// (schemas + BlockRenderer / BlockList + per-type views). The
// Slide / Doc page shells and BrandProvider that used to live here
// were viewer chrome — they belong to the consumer (product-meta
// owns a PageShell component; htmlproc inlines its own minimal
// frame). See CHANGELOG for the 0.5.0 migration notes.

// Node ESM requires explicit `.js` extensions on relative imports —
// the compiled output would fail with ERR_MODULE_NOT_FOUND otherwise.
// TS resolves `.js` back to `.ts` at compile time; Vite / esbuild
// bundlers also handle the `.js` suffix in source imports fine.

export { BlockRenderer, BlockList } from "./BlockRenderer.js";

export type {
  Block,
  HeadingBlock,
  ProseBlock,
  BulletListBlock,
  CalloutBlock,
  TwoColumnBlock,
  CardGridBlock,
  StatGridBlock,
  TimelineBlock,
  TableBlock,
  ImageBlock,
  DividerBlock,
  FooterNoteBlock,
  DocSectionBlock,
  DocFieldTableBlock,
  DocSignatureBlock,
  DocInputBlock,
  DocTextareaBlock,
  DocCheckboxBlock,
  CustomHtmlBlock,
  SlideDecorationBlock,
  DocPageContent,
} from "./blocks.js";
