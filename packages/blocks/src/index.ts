// Public API for @cosxai/blocks.
//
// Consumers (product-meta SPA, product-mesh htmlproc sidecar) should
// import from the package root:
//
//   import { BlockRenderer, BlockList } from "@cosxai/blocks";
//   import type { Block, DocStyle } from "@cosxai/blocks";
//
// Since 0.5.0 the package ships ONLY the block content language
// (schemas + BlockRenderer / BlockList + per-type views). The
// Slide / Doc page shells and BrandProvider that used to live here
// were viewer chrome — they belong to the consumer (product-meta
// owns a PageShell component; htmlproc inlines its own minimal
// frame).
//
// v0.7.0 breaking release — DocStyle is now NESTED per sub-part
// (mirrors INTERNAL_DEFAULTS structure) instead of a flat root
// override. INTERNAL_DEFAULTS carries STRUCTURAL props only;
// appearance (fontFamily, colors, spacing, borders) MUST come from
// docStyle. product-mesh populates it from persisted draft_style /
// commit.style JSONB, seeded by template_seeds.go's editorial bank
// at doc creation. Cascade per sub-part:
//   block.style (root only) > docStyle[type][subKey] > INTERNAL_DEFAULTS[type][subKey]
// See styles.ts for the resolver + defaults bank.

// Node ESM requires explicit `.js` extensions on relative imports —
// the compiled output would fail with ERR_MODULE_NOT_FOUND otherwise.
// TS resolves `.js` back to `.ts` at compile time; Vite / esbuild
// bundlers also handle the `.js` suffix in source imports fine.

export { BlockRenderer, BlockList } from "./BlockRenderer.js";
export type { BlockRendererProps, BlockListProps } from "./BlockRenderer.js";

export {
  INTERNAL_DEFAULTS,
  alignStyle,
  resolveStyle,
  stripBlacklisted,
} from "./styles.js";
export type {
  BlockStyle,
  DocStyle,
  HeadingBank,
  ProseBank,
  DividerBank,
  FooterNoteBank,
  CalloutBank,
  BulletListBank,
  ImageBank,
  TwoColumnBank,
  CardGridBank,
  StatGridBank,
  TimelineBank,
  TableBank,
  DocSectionBank,
  DocFieldTableBank,
  DocInputBank,
  DocTextareaBank,
  DocCheckboxBank,
  DocSignatureBank,
  CustomHtmlBank,
} from "./styles.js";

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

// v0.8.0 · signing cascade utilities.
export {
  resolveRecipientIndex,
  nextCascadeContext,
  isRecipientAware,
} from "./recipient-cascade.js";
export type {
  RecipientAwareBlock,
  CascadeContext,
} from "./recipient-cascade.js";
