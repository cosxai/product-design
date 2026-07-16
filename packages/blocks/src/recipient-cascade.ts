// recipient-cascade — resolve the effective recipientIndex for a
// signing-form block (v0.8.0).
//
// Bilateral signing assigns each SignatureBlock / DocInputBlock /
// DocTextareaBlock to a specific signer party via a numeric
// `recipientIndex`. Authors can also set `recipientIndex` on a
// DocSectionBlock; nested blocks inherit that section's value when
// they don't carry one themselves.
//
// Cascade (highest priority first):
//   1. block.recipientIndex          — explicit on the leaf block
//   2. enclosingDocSection.recipientIndex  — inherited from the
//                                            immediate parent section
//                                            (nested doc-sections
//                                            inherit their nearest
//                                            ancestor's value)
//   3. defaultRecipientIndex arg     — caller-supplied fallback
//                                      (SignDocumentPage passes 0 for
//                                      NDA flow · management sidebar
//                                      passes the party being edited
//                                      for the assignments preview)
//
// The bake-in middleware (product-mesh) MUST implement the same
// cascade before matching a block to a signer's baked* fields.
// Keeping the resolver in this package so both server (via htmlproc
// consumption of @cosxai/blocks) and client (SPA) call the same code.
//
// Design note: doc-checkbox is intentionally NOT in the cascade
// today. Checkboxes are treated as owner-side form defaults; if we
// later ship "recipient-scoped checkboxes" (per-signer consent
// boxes), extend `SigningFormBlock` to include DocCheckboxBlock and
// grow the union.

import type { Block, DocSectionBlock } from "./blocks.js";

/**
 * Union of blocks that may carry a `recipientIndex`.
 *
 * DocSignatureBlock, DocInputBlock, DocTextareaBlock all have the
 * field on their leaf shape. DocSectionBlock has it as the cascade
 * source. Anything else falls out of the resolver's scope.
 */
export type RecipientAwareBlock = Extract<
  Block,
  { type: "doc-signature" | "doc-input" | "doc-textarea" | "doc-section" }
>;

/**
 * Walk-down context: the recipientIndex to propagate into a subtree
 * when child blocks don't carry their own. Root callers pass `null`
 * (no inherited context); DocSectionView passes its own resolved
 * value to its children walker.
 */
export type CascadeContext = number | null;

/**
 * Resolve a leaf block's effective recipientIndex from the cascade.
 * Returns `null` when NONE of the three layers set a value — the
 * caller decides whether that means "readable by everyone" (share
 * viewer) or "unassigned party — refuse to render" (signing surface).
 */
export function resolveRecipientIndex(
  block: RecipientAwareBlock,
  parentContext: CascadeContext,
  defaultRecipientIndex?: number,
): number | null {
  // Leaf-level explicit assignment wins.
  if (typeof block.recipientIndex === "number") {
    return block.recipientIndex;
  }
  // Inherit from parent doc-section walk context.
  if (parentContext !== null) {
    return parentContext;
  }
  // Caller-supplied fallback.
  if (typeof defaultRecipientIndex === "number") {
    return defaultRecipientIndex;
  }
  return null;
}

/**
 * Push a doc-section's own recipientIndex onto the cascade context
 * for its children. Sections without a recipientIndex inherit their
 * parent context unchanged.
 */
export function nextCascadeContext(
  section: DocSectionBlock,
  parentContext: CascadeContext,
): CascadeContext {
  if (typeof section.recipientIndex === "number") {
    return section.recipientIndex;
  }
  return parentContext;
}

/**
 * Test whether a block type participates in the recipient cascade.
 * Handy for tree walkers that want to skip non-signing branches.
 */
export function isRecipientAware(block: Block): block is RecipientAwareBlock {
  return (
    block.type === "doc-signature" ||
    block.type === "doc-input" ||
    block.type === "doc-textarea" ||
    block.type === "doc-section"
  );
}
