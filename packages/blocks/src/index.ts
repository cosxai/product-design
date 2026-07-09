// Public API for @cosxai/blocks.
//
// Consumers (product-meta SPA, product-mesh htmlproc sidecar) should
// import from the package root:
//
//   import { Slide, BlockRenderer, BrandProvider } from "@cosxai/blocks";
//   import type { Block, BrandConfig } from "@cosxai/blocks";

export { BrandProvider, useBrand } from "./BrandProvider";
export type { BrandConfig, BrandProviderProps } from "./BrandProvider";

export { Slide } from "./Slide";
export type { SlideProps } from "./Slide";

export { Doc } from "./Doc";
export type { DocProps } from "./Doc";

export { BlockRenderer, BlockList } from "./BlockRenderer";

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
} from "./blocks";
