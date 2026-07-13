// Style primitives for the data-driven block renderer.
//
// Design:
//   1. Every block type has an entry in `INTERNAL_DEFAULTS` — the
//      shipped-with-the-package style for that block's editorial
//      visual language. This is what makes a doc with zero style
//      data look correct (matches the pre-v0.6.0 Tailwind visual).
//   2. A doc can override defaults via `docStyle[blockType]` at
//      render time (BlockList / BlockRenderer prop).
//   3. A single block can override BOTH via `block.style`.
//
// Cascade (highest → lowest):
//   block.style > docStyle[block.type] > INTERNAL_DEFAULTS[block.type]
//
// The user-facing style API (block.style + docStyle[type]) is a
// FLAT React.CSSProperties object that applies to the block's
// PRIMARY / ROOT element. Blocks with multiple visual sub-parts
// (heading has an eyebrow above the heading element; bullet-list
// has per-item markers; table has cell tones) keep their sub-part
// styles baked into INTERNAL_DEFAULTS and NOT user-customisable
// at v0.6.0. Growing the API to support sub-part overrides is a
// straightforward v0.7.0 extension: keys like
// `docStyle.heading.eyebrow` would layer above the internal
// defaults for the eyebrow sub-part.
//
// Blacklist:
//   `resolveStyle` strips a small set of CSS properties that could
//   break the consumer's layout (position: fixed / absolute would
//   escape the block flow; transform on an ancestor breaks
//   position:fixed descendants like product-meta's DocumentWatermark
//   portal). If a user writes `{ position: 'fixed' }` in their
//   block.style, the property is silently dropped at render time.

import type { CSSProperties } from "react";

/**
 * User-facing style for a block or block-type override.
 *
 * A subset of React.CSSProperties in intent (see BLACKLIST) — TS
 * doesn't narrow to the subset, but resolveStyle strips disallowed
 * properties at render time. Consumers writing invalid values just
 * see them silently ignored.
 */
export type BlockStyle = CSSProperties;

/**
 * A doc-level style map: block type → override style.
 *
 * Keys match the discriminated-union `type` field on each Block.
 * Unknown keys are ignored (forward-compat with new block types).
 */
export type DocStyle = { [blockType: string]: BlockStyle };

// ──────────────────────────────────────────────────────────────────
// Blacklist — CSS properties resolveStyle strips.
//
// Rationale:
//   - position / positioning props (top/right/bottom/left/inset):
//     inline-flow blocks must not escape their container. Fixed /
//     absolute on a block would collide with consumer chrome (page
//     shell, watermark overlay).
//   - transform / filter: on an ancestor, these change the
//     containing block for position:fixed descendants → break
//     DocumentWatermark portal (see product-meta styles/index.css
//     comment ~line 98-106 which flags this exact trap).
//   - z-index: block-level z-index would trap them under / above
//     consumer overlays unpredictably.
//   - display: 'contents': too easy to erase the block's DOM
//     structure and break data-block-id anchoring for comments.
// ──────────────────────────────────────────────────────────────────
const BLACKLIST_PROPS = new Set<string>([
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "inset",
  "insetBlock",
  "insetInline",
  "insetBlockStart",
  "insetBlockEnd",
  "insetInlineStart",
  "insetInlineEnd",
  "transform",
  "filter",
  "backdropFilter",
  "zIndex",
]);

/**
 * Strip blacklisted CSS properties from a style object. Called by
 * resolveStyle before merging. Kept public for testing (and for
 * consumers who want to sanitise style data before persisting to
 * their doc storage).
 */
export function stripBlacklisted(style: CSSProperties | undefined): CSSProperties {
  if (!style) return {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(style)) {
    if (BLACKLIST_PROPS.has(k)) continue;
    // display: 'contents' specifically dropped (see rationale above);
    // other display values pass through.
    if (k === "display" && v === "contents") continue;
    out[k] = v;
  }
  return out as CSSProperties;
}

/**
 * Merge cascade: block.style > docStyle[type] > packageDefault.
 * Later entries win. Blacklisted properties are stripped from user
 * layers (docStyle + block.style) — package defaults are trusted.
 *
 * @param packageDefault — INTERNAL_DEFAULTS sub-style (e.g.
 *   INTERNAL_DEFAULTS.prose.body). NOT stripped.
 * @param docLayer — docStyle[block.type] (or undefined). Stripped.
 * @param blockLayer — block.style (or undefined). Stripped.
 */
export function resolveStyle(
  packageDefault: CSSProperties,
  docLayer: CSSProperties | undefined,
  blockLayer: CSSProperties | undefined,
): CSSProperties {
  return {
    ...packageDefault,
    ...stripBlacklisted(docLayer),
    ...stripBlacklisted(blockLayer),
  };
}

// ──────────────────────────────────────────────────────────────────
// INTERNAL_DEFAULTS — per-block-type style bank.
//
// Sub-key convention (block-specific):
//   root       — the block's root element style
//   body       — text-heavy element style (prose, callout body)
//   heading-N  — per-level heading text
//   eyebrow    — small-caps label above heading / stat
//   marker-*   — bullet-list per-variant marker
//   tone-*     — callout / table cell tone variant
//   emphasis-* — table cell emphasis variant
//   cell-*     — table cell base
//
// Values translated from the pre-v0.6.0 Tailwind classNames in
// BlockRenderer.tsx. Any drift is a visual regression — see
// BlockRenderer.test.tsx for the pin.
// ──────────────────────────────────────────────────────────────────

const ACCENT = "var(--ck-accent, #4f46e5)";
const ACCENT_BG_8 = "color-mix(in oklab, var(--ck-accent, #4f46e5) 8%, transparent)";
const ACCENT_BG_10 = "color-mix(in oklab, var(--ck-accent, #4f46e5) 10%, transparent)";

// Zinc palette (Tailwind zinc-*).
const Z_50 = "#fafafa";
const Z_100 = "#f4f4f5";
const Z_200 = "#e4e4e7";
const Z_300 = "#d4d4d8";
const Z_400 = "#a1a1aa";
const Z_500 = "#71717a";
const Z_600 = "#52525b";
const Z_700 = "#3f3f46";
const Z_800 = "#27272a";
const Z_900 = "#18181b";
const EMERALD_600 = "#059669";

// Reusable eyebrow — 9px uppercase caps used above headings and
// stat rows.
const EYEBROW: CSSProperties = {
  fontSize: "9px",
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  color: Z_500,
  marginBottom: "0.25rem",
  marginTop: 0,
};

const HEADING_1: CSSProperties = {
  fontSize: "24px",
  fontWeight: 300,
  letterSpacing: "-0.025em",
  lineHeight: 1.25,
  marginTop: "0.5rem",
  marginBottom: "0.75rem",
};

const HEADING_2: CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "-0.025em",
  lineHeight: 1.375,
  marginTop: "0.75rem",
  marginBottom: "0.5rem",
};

const HEADING_3: CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: Z_700,
  marginTop: "0.75rem",
  marginBottom: "0.25rem",
};

const PROSE_BODY: CSSProperties = {
  fontSize: "10.5px",
  lineHeight: 1.625,
  color: Z_800,
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

const PROSE_BODY_TIGHT: CSSProperties = {
  fontSize: "10.5px",
  lineHeight: 1.625,
  color: Z_800,
};

const DIVIDER_ROOT: CSSProperties = {
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  border: "0",
  borderTopWidth: "1px",
  borderTopStyle: "solid",
  borderTopColor: Z_200,
};

const FOOTER_NOTE_ROOT: CSSProperties = {
  fontSize: "9px",
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  color: Z_500,
  marginTop: "1rem",
};

const CALLOUT_BASE: CSSProperties = {
  fontSize: "10.5px",
  lineHeight: 1.625,
  color: Z_800,
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  paddingLeft: "0.75rem",
  paddingRight: "0.75rem",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  borderLeftWidth: "2px",
  borderLeftStyle: "solid",
};

const CALLOUT_TONES: Record<"info" | "accent" | "muted", CSSProperties> = {
  accent: {
    borderLeftColor: ACCENT,
    background: ACCENT_BG_8,
  },
  muted: {
    borderLeftColor: Z_300,
    background: Z_50,
  },
  info: {
    borderLeftColor: Z_400,
    background: Z_50,
  },
};

const BULLET_LIST_ROOT: CSSProperties = {
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  fontSize: "10.5px",
  lineHeight: 1.625,
  color: Z_800,
  listStyle: "none",
  paddingLeft: 0,
};

const BULLET_LIST_ITEM: CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "flex-start",
  marginTop: "0.375rem", // Tailwind space-y-1.5 = 0.375rem gap between items
  marginBottom: 0,
};

// First bullet item has no top margin (space-y-* only applies to
// siblings, not the first).
const BULLET_LIST_ITEM_FIRST: CSSProperties = {
  ...BULLET_LIST_ITEM,
  marginTop: 0,
};

const BULLET_MARKERS: Record<"dot" | "check" | "arrow", CSSProperties> = {
  dot: { color: Z_400, marginTop: "2px" },
  check: { color: EMERALD_600, marginTop: "1px" },
  arrow: { color: ACCENT, marginTop: "1px" },
};

const IMAGE_BASE: CSSProperties = {
  display: "block",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

const IMAGE_ALIGN: Record<"left" | "center" | "right", CSSProperties> = {
  left: {},
  center: { marginLeft: "auto", marginRight: "auto" },
  right: { marginLeft: "auto" },
};

const TWO_COLUMN_ROOT: CSSProperties = {
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  display: "flex",
  gap: "1rem",
};

const TWO_COLUMN_LEFT: CSSProperties = { flex: 1 };
const TWO_COLUMN_RIGHT_FLEX: CSSProperties = { flex: 1 };

const CARD_GRID_ROOT: CSSProperties = {
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  display: "grid",
  gap: "0.75rem",
};

const CARD: CSSProperties = {
  borderRadius: "0.25rem",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: Z_200,
  background: "#ffffff",
  padding: "0.75rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
};

const CARD_IMAGE: CSSProperties = {
  width: "100%",
  marginBottom: "0.25rem",
};

const CARD_TITLE: CSSProperties = {
  fontSize: "12px",
  fontWeight: 600,
  color: Z_900,
  margin: 0,
};

const CARD_BODY: CSSProperties = {
  fontSize: "10px",
  lineHeight: 1.625,
  color: Z_700,
  margin: 0,
};

const CARD_FOOT: CSSProperties = {
  fontSize: "9px",
  color: Z_500,
  marginTop: "0.25rem",
  marginBottom: 0,
};

const STAT_GRID_ROOT: CSSProperties = {
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  display: "grid",
  gap: "1rem",
};

const STAT_CELL: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.125rem",
};

const STAT_LABEL: CSSProperties = {
  fontSize: "9px",
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  color: Z_500,
  margin: 0,
};

const STAT_VALUE: CSSProperties = {
  fontSize: "24px",
  fontWeight: 600,
  color: Z_900,
  lineHeight: 1,
  margin: 0,
};

const TIMELINE_VERTICAL: CSSProperties = {
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  listStyle: "none",
  paddingLeft: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

const TIMELINE_HORIZONTAL: CSSProperties = {
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  listStyle: "none",
  paddingLeft: 0,
  display: "flex",
  gap: "0.75rem",
  overflowX: "auto",
};

const TIMELINE_STEP_VERTICAL: CSSProperties = {
  display: "flex",
  gap: "0.75rem",
  alignItems: "flex-start",
};

const TIMELINE_STEP_HORIZONTAL: CSSProperties = {
  flex: 1,
  minWidth: "140px",
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
};

const TIMELINE_DOT: CSSProperties = {
  marginTop: "6px",
  height: "0.5rem",
  width: "0.5rem",
  borderRadius: "9999px",
  background: ACCENT,
  flex: "none",
};

const TIMELINE_STEP_NUM: CSSProperties = {
  fontSize: "9px",
  color: Z_500,
  margin: 0,
};

const TIMELINE_STEP_EYEBROW: CSSProperties = {
  fontSize: "9px",
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  color: Z_500,
  margin: 0,
};

const TIMELINE_STEP_TITLE: CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  color: Z_900,
  margin: 0,
};

const TIMELINE_STEP_BODY: CSSProperties = {
  fontSize: "10.5px",
  lineHeight: 1.625,
  color: Z_700,
  marginTop: "0.25rem",
  marginBottom: 0,
};

const TIMELINE_STEP_OUTPUT: CSSProperties = {
  fontSize: "9px",
  color: Z_500,
  marginTop: "0.25rem",
  marginBottom: 0,
};

const TABLE_WRAPPER: CSSProperties = {
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  overflowX: "auto",
};

const TABLE_ROOT: CSSProperties = {
  width: "100%",
  fontSize: "10px",
  borderCollapse: "collapse",
};

const TABLE_CELL_BASE: CSSProperties = {
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: Z_200,
  paddingLeft: "0.5rem",
  paddingRight: "0.5rem",
  paddingTop: "0.25rem",
  paddingBottom: "0.25rem",
};

const TABLE_TH_BASE: CSSProperties = {
  ...TABLE_CELL_BASE,
  fontWeight: 600,
  color: Z_800,
};

const TABLE_TONES: Record<"muted" | "accent" | "default", CSSProperties> = {
  accent: { background: ACCENT_BG_10 },
  muted: { background: Z_100 },
  default: { background: Z_50 },
};

const TABLE_TD_EMPHASIS: Record<"lead" | "normal" | "muted", CSSProperties> = {
  lead: { fontWeight: 600, color: Z_900 },
  normal: { color: Z_800 },
  muted: { color: Z_500 },
};

const TABLE_TD_BASE: CSSProperties = {
  ...TABLE_CELL_BASE,
  verticalAlign: "top",
};

const DOC_SECTION_ROOT: CSSProperties = {
  marginTop: "1rem",
  marginBottom: "1rem",
};

const DOC_SECTION_HEADER: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: "0.5rem",
  marginBottom: "0.5rem",
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderBottomColor: Z_300,
  paddingBottom: "0.25rem",
};

const DOC_SECTION_NUM: CSSProperties = {
  fontSize: "10px",
  fontWeight: 600,
  color: Z_600,
};

const DOC_SECTION_TITLE: CSSProperties = {
  fontSize: "12px",
  fontWeight: 600,
  color: Z_900,
  letterSpacing: "-0.025em",
  margin: 0,
};

const DOC_SECTION_CHILDREN: CSSProperties = {
  paddingLeft: "0.75rem",
};

const DOC_FIELD_TABLE_ROOT: CSSProperties = {
  marginTop: "0.5rem",
  marginBottom: "0.5rem",
  width: "100%",
  fontSize: "10.5px",
  borderCollapse: "collapse",
};

const DOC_FIELD_TABLE_ROW: CSSProperties = {
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderBottomColor: Z_100,
};

const DOC_FIELD_TABLE_LABEL: CSSProperties = {
  textAlign: "left",
  verticalAlign: "top",
  fontWeight: 500,
  color: Z_700,
  paddingTop: "0.25rem",
  paddingBottom: "0.25rem",
  paddingRight: "0.5rem",
};

const DOC_FIELD_TABLE_VALUE: CSSProperties = {
  verticalAlign: "top",
  paddingTop: "0.25rem",
  paddingBottom: "0.25rem",
};

const DOC_INPUT_ROOT: CSSProperties = {
  display: "inline-block",
  verticalAlign: "middle",
};

const DOC_INPUT_INNER: CSSProperties = {
  display: "inline-block",
  minWidth: "80px",
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderBottomColor: Z_400,
  fontSize: "10.5px",
  color: Z_400,
  paddingLeft: "0.25rem",
  paddingRight: "0.25rem",
};

const DOC_TEXTAREA_ROOT: CSSProperties = {
  marginTop: "0.5rem",
  marginBottom: "0.5rem",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: Z_300,
  background: Z_50,
  paddingLeft: "0.5rem",
  paddingRight: "0.5rem",
  paddingTop: "0.25rem",
  paddingBottom: "0.25rem",
  fontSize: "10.5px",
  color: Z_400,
};

const DOC_CHECKBOX_ROOT: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
};

const DOC_CHECKBOX_BOX: CSSProperties = {
  display: "inline-block",
  height: "0.75rem",
  width: "0.75rem",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: Z_400,
  borderRadius: "0.125rem",
  background: "#ffffff",
};

const DOC_CHECKBOX_LABEL: CSSProperties = {
  fontSize: "10.5px",
  color: Z_800,
};

const DOC_SIGNATURE_ROOT: CSSProperties = {
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.125rem",
};

const DOC_SIGNATURE_LINE: CSSProperties = {
  height: "36px",
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderBottomColor: Z_400,
};

const DOC_SIGNATURE_LABEL: CSSProperties = {
  fontSize: "9px",
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  color: Z_500,
  margin: 0,
};

const CUSTOM_HTML_ROOT: CSSProperties = {
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

/**
 * INTERNAL_DEFAULTS — the shipped-with-@cosxai/blocks style bank.
 *
 * Callers (BlockRenderer) reach for these sub-styles via typed
 * exports below. Re-exported as a whole so consumers can inspect /
 * copy from the defaults (e.g. building a workspace theme preset).
 */
export const INTERNAL_DEFAULTS = {
  heading: {
    eyebrow: EYEBROW,
    "level-1": HEADING_1,
    "level-2": HEADING_2,
    "level-3": HEADING_3,
  },
  prose: {
    body: PROSE_BODY,
    "body-tight": PROSE_BODY_TIGHT,
  },
  divider: {
    root: DIVIDER_ROOT,
  },
  "footer-note": {
    root: FOOTER_NOTE_ROOT,
  },
  callout: {
    base: CALLOUT_BASE,
    tones: CALLOUT_TONES,
  },
  "bullet-list": {
    root: BULLET_LIST_ROOT,
    item: BULLET_LIST_ITEM,
    "item-first": BULLET_LIST_ITEM_FIRST,
    markers: BULLET_MARKERS,
  },
  image: {
    base: IMAGE_BASE,
    align: IMAGE_ALIGN,
  },
  "two-column": {
    root: TWO_COLUMN_ROOT,
    left: TWO_COLUMN_LEFT,
    "right-flex": TWO_COLUMN_RIGHT_FLEX,
  },
  "card-grid": {
    root: CARD_GRID_ROOT,
    card: CARD,
    "card-image": CARD_IMAGE,
    "card-title": CARD_TITLE,
    "card-body": CARD_BODY,
    "card-foot": CARD_FOOT,
  },
  "stat-grid": {
    root: STAT_GRID_ROOT,
    cell: STAT_CELL,
    label: STAT_LABEL,
    value: STAT_VALUE,
  },
  timeline: {
    "root-vertical": TIMELINE_VERTICAL,
    "root-horizontal": TIMELINE_HORIZONTAL,
    "step-vertical": TIMELINE_STEP_VERTICAL,
    "step-horizontal": TIMELINE_STEP_HORIZONTAL,
    dot: TIMELINE_DOT,
    "step-num": TIMELINE_STEP_NUM,
    "step-eyebrow": TIMELINE_STEP_EYEBROW,
    "step-title": TIMELINE_STEP_TITLE,
    "step-body": TIMELINE_STEP_BODY,
    "step-output": TIMELINE_STEP_OUTPUT,
  },
  table: {
    wrapper: TABLE_WRAPPER,
    root: TABLE_ROOT,
    th: TABLE_TH_BASE,
    tones: TABLE_TONES,
    td: TABLE_TD_BASE,
    emphasis: TABLE_TD_EMPHASIS,
  },
  "doc-section": {
    root: DOC_SECTION_ROOT,
    header: DOC_SECTION_HEADER,
    num: DOC_SECTION_NUM,
    title: DOC_SECTION_TITLE,
    children: DOC_SECTION_CHILDREN,
  },
  "doc-field-table": {
    root: DOC_FIELD_TABLE_ROOT,
    row: DOC_FIELD_TABLE_ROW,
    label: DOC_FIELD_TABLE_LABEL,
    value: DOC_FIELD_TABLE_VALUE,
  },
  "doc-input": {
    root: DOC_INPUT_ROOT,
    inner: DOC_INPUT_INNER,
  },
  "doc-textarea": {
    root: DOC_TEXTAREA_ROOT,
  },
  "doc-checkbox": {
    root: DOC_CHECKBOX_ROOT,
    box: DOC_CHECKBOX_BOX,
    label: DOC_CHECKBOX_LABEL,
  },
  "doc-signature": {
    root: DOC_SIGNATURE_ROOT,
    line: DOC_SIGNATURE_LINE,
    label: DOC_SIGNATURE_LABEL,
  },
  "custom-html": {
    root: CUSTOM_HTML_ROOT,
  },
} as const;

/**
 * Text-align helper — returns the CSSProperties for a given
 * horizontal alignment. Used by table columns, image align, etc.
 */
export function alignStyle(
  align: "left" | "center" | "right" | undefined,
): CSSProperties {
  switch (align) {
    case "center":
      return { textAlign: "center" };
    case "right":
      return { textAlign: "right" };
    default:
      return { textAlign: "left" };
  }
}
