// Public API for @cosxai/blocks.
//
// Consumers (product-meta SPA, product-mesh htmlproc sidecar) should
// import from the package root:
//
//   import { Slide, BlockRenderer, BrandProvider } from "@cosxai/blocks";
//   import type { Block, BrandConfig } from "@cosxai/blocks";

// Node ESM requires explicit `.js` extensions on relative imports —
// the compiled output would fail with ERR_MODULE_NOT_FOUND otherwise.
// TS resolves `.js` back to `.ts` at compile time; Vite / esbuild
// bundlers also handle the `.js` suffix in source imports fine.

export { BrandProvider, useBrand } from "./BrandProvider.js";
export type { BrandConfig, BrandProviderProps } from "./BrandProvider.js";

export { Slide } from "./Slide.js";
export type { SlideProps } from "./Slide.js";

export { Doc } from "./Doc.js";
export type { DocProps } from "./Doc.js";

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
