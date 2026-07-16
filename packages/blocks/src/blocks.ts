// Block schema for content-as-data documents. Discriminated-union
// TypeScript types consumed by BlockRenderer (this package) and by
// the mesh document/sanitize.go server-side allowlist (Go mirror
// enforcing the same schema on writes).
//
// Adding a block type requires changes in three places:
//   - packages/blocks/src/blocks.ts (this file)          — TS type
//   - packages/blocks/src/BlockRenderer.tsx              — TS view
//   - product-mesh internal/document/.../sanitize.go     — Go validator
//
// The Go validator MUST match this file. If they drift, malformed
// content sneaks through the write path and blows up on render.
//
// Since v0.6.0 every block optionally carries `style?: BlockStyle`
// — a CSS override applied to the block's primary/root element via
// the cascade `block.style > docStyle[type] > package defaults`.
// See styles.ts for the resolver + the internal defaults bank.

import type { BlockStyle } from "./styles.js";

export type Block =
  | HeadingBlock
  | ProseBlock
  | BulletListBlock
  | CalloutBlock
  | TwoColumnBlock
  | CardGridBlock
  | StatGridBlock
  | TimelineBlock
  | TableBlock
  | ImageBlock
  | DividerBlock
  | FooterNoteBlock
  | DocSectionBlock
  | DocFieldTableBlock
  | DocSignatureBlock
  | DocInputBlock
  | DocTextareaBlock
  | DocCheckboxBlock
  | CustomHtmlBlock
  | SlideDecorationBlock;

interface BaseBlock {
  // Stable id; rendered as data-block-id="<id>" on the block root.
  // Used for editor selection and (eventually) block-anchored comments.
  id: string;
  // Per-block style override — highest-priority layer in the cascade
  // (see styles.ts `resolveStyle`). Applies to the block's primary
  // element (h1/h2/h3 for headings, <p> for prose, <ul> for
  // bullet-list, outer wrapper for structural blocks, etc.). At
  // v0.6.0 sub-part overrides (heading eyebrow, bullet marker,
  // table cell tones) are NOT user-customisable — they stay on the
  // package defaults; growing the API is a v0.7.0 extension.
  style?: BlockStyle;
}

// Common blocks -----------------------------------------------------------

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  level: 1 | 2 | 3;
  text: string;
  eyebrow?: string;
}

export interface ProseBlock extends BaseBlock {
  type: "prose";
  // Sanitised inline HTML: <em>, <strong>, <a href>, <br>, <span class>.
  html: string;
  // Skip the default vertical margin (my-3). Use inside doc-field-table
  // valueBlocks where each cell already has padding, or anywhere the
  // surrounding container provides its own spacing.
  tight?: boolean;
  // Signing consent marker (v0.8.0). When set, the signing service
  // uses this block's HTML as the consent text presented at commit
  // time + snapshots it onto `signing_sessions.consent_text_snapshot`
  // for audit. A template with `requires_nda=true` MUST contain at
  // least one block with `consentRole='signing-consent'` for the NDA
  // template picker to accept it. Non-signing renders ignore this
  // marker entirely.
  consentRole?: "signing-consent";
}

export interface BulletListBlock extends BaseBlock {
  type: "bullet-list";
  items: { html: string }[];
  variant?: "dot" | "check" | "arrow";
}

export interface CalloutBlock extends BaseBlock {
  type: "callout";
  tone: "info" | "accent" | "muted";
  html: string;
  // Signing consent marker (v0.8.0). See ProseBlock.consentRole for
  // semantics — same field mirrored so authors can pick either block
  // shape for consent copy.
  consentRole?: "signing-consent";
}

export interface TwoColumnBlock extends BaseBlock {
  type: "two-column";
  left: Block[];
  right: Block[];
  // Right column width. Prefer a CSS length string ("280px", "20rem",
  // "30%") — applied via inline style, portable across consumers.
  // Tailwind class fragments ("w-[280px]") are still accepted for
  // backward compat but discouraged since arbitrary-value classes
  // may be dropped by static class extraction in downstream builds.
  rightWidth?: string;
}

export interface CardGridBlock extends BaseBlock {
  type: "card-grid";
  cols: 2 | 3 | 4;
  cards: { title: string; body?: string; foot?: string; image?: string }[];
}

export interface StatGridBlock extends BaseBlock {
  type: "stat-grid";
  stats: { value: string; label: string }[];
  variant?: "side-bar" | "row";
}

export interface TimelineBlock extends BaseBlock {
  type: "timeline";
  orientation: "horizontal" | "vertical";
  steps: { num?: string; eyebrow?: string; title: string; body?: string; output?: string }[];
}

export interface TableBlock extends BaseBlock {
  type: "table";
  columns: {
    id: string;
    header: string;
    align?: "left" | "center" | "right";
    widthFr?: number;
    tone?: "muted" | "accent";
  }[];
  rows: {
    cells: Record<string, string>;
    emphasis?: Record<string, "lead" | "normal" | "muted">;
  }[];
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  src: string;
  alt: string;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
}

export interface FooterNoteBlock extends BaseBlock {
  type: "footer-note";
  html: string;
}

// A4 doc blocks ------------------------------------------------------------

export interface DocSectionBlock extends BaseBlock {
  type: "doc-section";
  num?: string;
  title: string;
  children: Block[];
  // Bilateral-signing assignment. When set, children that don't carry
  // their own recipientIndex inherit this one. Drives which party can
  // edit which signature/input block on the signing form. undefined =
  // renders to everyone (non-signing docs).
  recipientIndex?: number;
}

export interface DocFieldTableBlock extends BaseBlock {
  type: "doc-field-table";
  rows: { label: string; valueBlocks: Block[] }[];
  labelWidth?: string;
}

export interface DocSignatureBlock extends BaseBlock {
  type: "doc-signature";
  parties: { label: string; subtext?: string }[];
  // Bilateral-signing assignment. Overrides parent doc-section's
  // recipientIndex when both are set. undefined = inherit from parent.
  recipientIndex?: number;
  // Server-side bake-in fields. Populated only on read when the doc is
  // fetched with a signing-session query. Never persisted via the
  // sanitiser write path. When bakedSignaturePng is set, the view
  // renders the actual signature image + signer name + date instead of
  // the empty "sign here" placement pill.
  bakedSignaturePng?: string;
  bakedSignerName?: string;
  bakedSignedAt?: string;
  bakedSignerEmail?: string;
  // v0.8.0 · signing session bake-in extensions.
  // Consent snapshot — the exact text of the consent block the signer
  // agreed to at the moment of signing. Rendered under the signature
  // in baked mode as a quiet footnote for audit trail visibility.
  bakedConsentTextSnapshot?: string;
  // DocuSeal certification link — post-finalize, mesh writes the URL
  // of the audit-log PDF. Baked view surfaces a small badge linking
  // to it so the reader can verify the certificate.
  bakedDocuSealCertificateUrl?: string;
}

export interface DocInputBlock extends BaseBlock {
  type: "doc-input";
  fieldId: string;
  placeholder: string;
  inline?: boolean;
  widthClass?: string;
  required?: boolean;
  // Signing-time auto-fill. When set, the input renders disabled
  // during fill, and the signing worker writes the corresponding value
  // into the printed contract at capture time.
  //
  //   signing-date   → ISO YYYY-MM-DD on sign click (UTC)
  //   signer-name    → recipient profile name || display name || email
  //   signer-email   → invitation email
  //   signer-title   → admin-side title hint on the signing session
  autoFill?: "signing-date" | "signer-name" | "signer-email" | "signer-title";
  recipientIndex?: number;
  // Server-side bake-in. See DocSignatureBlock.bakedSignaturePng for
  // the lifecycle. When set, DocInputView renders the value as plain
  // text rather than an editable input.
  bakedValue?: string;
}

export interface DocTextareaBlock extends BaseBlock {
  type: "doc-textarea";
  fieldId: string;
  placeholder: string;
  rows?: number;
  required?: boolean;
  // v0.9.0 · autoFill added for parity with DocInputBlock. Same enum,
  // same server-side resolution semantics — when set, the textarea
  // renders disabled during fill and the signing worker writes the
  // value at capture time.
  autoFill?: "signing-date" | "signer-name" | "signer-email" | "signer-title";
  // v0.8.0 · bilateral signing assignment. Same cascade as
  // DocSignatureBlock / DocInputBlock (block > enclosing doc-section
  // > default). Unset means the field is filled by whichever party's
  // filling context the SPA is in.
  recipientIndex?: number;
  bakedValue?: string;
}

export interface DocCheckboxBlock extends BaseBlock {
  type: "doc-checkbox";
  fieldId: string;
  label: string;
  required?: boolean;
  // v0.9.0 · bilateral signing assignment. Same cascade as the other
  // signable blocks (block > enclosing doc-section > default).
  // Without this, checkboxes in a bilateral doc rendered interactive
  // for whoever was currently signing regardless of intended
  // ownership — the resolution check `'recipientIndex' in block`
  // was always false for checkbox.
  recipientIndex?: number;
  // v0.9.0 · server-side bake-in for the checked state (true/false).
  // Mirrors DocInputBlock.bakedValue lifecycle.
  bakedValue?: boolean;
}

// Escape hatch -------------------------------------------------------------

export interface CustomHtmlBlock extends BaseBlock {
  type: "custom-html";
  html: string;
  // Optional CSS, server-side prefix-scoped to [data-block-custom-id="<id>"].
  css?: string;
}

// Slide decoration ---------------------------------------------------------
//
// Page-level decorative element that doesn't fit the prose-style block
// model (canvas-based animation, full-bleed background). Renders into
// the page's positioning context so the content blocks layer above.
export interface SlideDecorationBlock extends BaseBlock {
  type: "slide-decoration";
  kind: "wave";
}

// Page + doc content -------------------------------------------------------

/** What lives in a page's `content` JSON — schema-versioned envelope. */
export interface DocPageContent {
  schemaVersion: 1;
  blocks: Block[];
}
