// Style primitives for the data-driven block renderer.
//
// Design (v0.7.0 breaking):
//   1. Every block type has an entry in `INTERNAL_DEFAULTS` — but at
//      v0.7.0 this ONLY carries STRUCTURAL props (display,
//      listStyleType, flexDirection, alignItems, justifyContent, flex,
//      overflowX, borderCollapse — the props whose absence would
//      collapse the block's layout to nonsense). All APPEARANCE props
//      (fontFamily, color, background, fontSize, fontWeight,
//      letterSpacing, textTransform, lineHeight, border*, padding,
//      margin, borderRadius, dimensional theme values like a dot's
//      height/width) live in DATA — in the doc's own draft_style /
//      commit.style JSONB, populated at creation time by
//      product-mesh's template_seeds.go and backfilled onto historical
//      rows by migration 000042. Package version bumps therefore
//      cannot silently re-render history: if the data says nothing
//      about font-family, no fallback provides one.
//   2. A doc-level bank at `docStyle[blockType][subKey]` — mirroring
//      the internal sub-part structure — provides appearance. The
//      renderer merges package structural, doc bank, and block
//      override at every sub-part call site.
//   3. A single block can override its ROOT element via `block.style`
//      (still flat CSSProperties, applies to the block's outermost
//      DOM node only — sub-parts unaffected).
//
// Cascade (per sub-part, highest → lowest):
//   block.style (root only) > docStyle[type][subKey] > INTERNAL_DEFAULTS[type][subKey]
//
// If a consumer wants the "editorial" visual language (Playfair
// display, Geist body, indigo accent), they must EITHER:
//   - Use a doc created via product-mesh (which auto-populates
//     draft_style with the editorial bank at CreateBlockDoc /
//     InitializeWorkspaceDefault time), OR
//   - Pass docStyle explicitly to BlockList — the mesh's exposed
//     editorial JSON is a reasonable choice.
//
// Blacklist:
//   `resolveStyle` strips a small set of CSS properties that could
//   break the consumer's layout (position: fixed / absolute would
//   escape the block flow; transform on an ancestor breaks
//   position:fixed descendants like product-meta's DocumentWatermark
//   portal). If a user writes `{ position: 'fixed' }` in their
//   block.style or docStyle, the property is silently dropped at
//   render time.

import type { CSSProperties } from "react";

/**
 * User-facing style for a block's root element.
 *
 * A subset of React.CSSProperties in intent (see BLACKLIST) — TS
 * doesn't narrow to the subset, but resolveStyle strips disallowed
 * properties at render time. Consumers writing invalid values just
 * see them silently ignored.
 */
export type BlockStyle = CSSProperties;

// ──────────────────────────────────────────────────────────────────
// Per-block-type sub-banks. Mirror the nested structure of
// INTERNAL_DEFAULTS so a doc-level bank can override any sub-part.
// ──────────────────────────────────────────────────────────────────

export type HeadingBank = {
  eyebrow?: CSSProperties;
  "level-1"?: CSSProperties;
  "level-2"?: CSSProperties;
  "level-3"?: CSSProperties;
};

export type ProseBank = {
  body?: CSSProperties;
  "body-tight"?: CSSProperties;
};

export type DividerBank = {
  root?: CSSProperties;
};

export type FooterNoteBank = {
  root?: CSSProperties;
};

export type CalloutBank = {
  base?: CSSProperties;
  tones?: {
    info?: CSSProperties;
    accent?: CSSProperties;
    muted?: CSSProperties;
  };
};

export type BulletListBank = {
  root?: CSSProperties;
  item?: CSSProperties;
  "item-first"?: CSSProperties;
  markers?: {
    dot?: CSSProperties;
    check?: CSSProperties;
    arrow?: CSSProperties;
  };
};

export type ImageBank = {
  base?: CSSProperties;
  align?: {
    left?: CSSProperties;
    center?: CSSProperties;
    right?: CSSProperties;
  };
};

export type TwoColumnBank = {
  root?: CSSProperties;
  left?: CSSProperties;
  "right-flex"?: CSSProperties;
};

export type CardGridBank = {
  root?: CSSProperties;
  card?: CSSProperties;
  "card-image"?: CSSProperties;
  "card-title"?: CSSProperties;
  "card-body"?: CSSProperties;
  "card-foot"?: CSSProperties;
};

export type StatGridBank = {
  root?: CSSProperties;
  cell?: CSSProperties;
  label?: CSSProperties;
  value?: CSSProperties;
};

export type TimelineBank = {
  "root-vertical"?: CSSProperties;
  "root-horizontal"?: CSSProperties;
  "step-vertical"?: CSSProperties;
  "step-horizontal"?: CSSProperties;
  dot?: CSSProperties;
  "step-num"?: CSSProperties;
  "step-eyebrow"?: CSSProperties;
  "step-title"?: CSSProperties;
  "step-body"?: CSSProperties;
  "step-output"?: CSSProperties;
};

export type TableBank = {
  wrapper?: CSSProperties;
  root?: CSSProperties;
  th?: CSSProperties;
  td?: CSSProperties;
  tones?: {
    muted?: CSSProperties;
    accent?: CSSProperties;
    default?: CSSProperties;
  };
  emphasis?: {
    lead?: CSSProperties;
    normal?: CSSProperties;
    muted?: CSSProperties;
  };
};

export type DocSectionBank = {
  root?: CSSProperties;
  header?: CSSProperties;
  num?: CSSProperties;
  title?: CSSProperties;
  children?: CSSProperties;
};

export type DocFieldTableBank = {
  root?: CSSProperties;
  row?: CSSProperties;
  label?: CSSProperties;
  value?: CSSProperties;
};

export type DocInputBank = {
  root?: CSSProperties;
  inner?: CSSProperties;
};

export type DocTextareaBank = {
  root?: CSSProperties;
};

export type DocCheckboxBank = {
  root?: CSSProperties;
  box?: CSSProperties;
  label?: CSSProperties;
};

export type DocSignatureBank = {
  root?: CSSProperties;
  line?: CSSProperties;
  label?: CSSProperties;
};

export type CustomHtmlBank = {
  root?: CSSProperties;
};

/**
 * A doc-level style map: per block type, a nested bank of sub-part
 * overrides. Keys match the discriminated-union `type` field on each
 * Block. Unknown keys are ignored (forward-compat with new block
 * types).
 *
 * v0.6.x used a flat `{ [type]: CSSProperties }` shape that only
 * overrode the block's root element. v0.7.0 extends to a nested
 * structure so per-sub-part overrides (heading level distinction,
 * callout tones, bullet markers, table tone/emphasis, etc.) are
 * expressible. The mesh side populates this via template_seeds.go's
 * `buildSeedDraftStyle` at doc creation time.
 */
export type DocStyle = {
  heading?: HeadingBank;
  prose?: ProseBank;
  divider?: DividerBank;
  "footer-note"?: FooterNoteBank;
  callout?: CalloutBank;
  "bullet-list"?: BulletListBank;
  image?: ImageBank;
  "two-column"?: TwoColumnBank;
  "card-grid"?: CardGridBank;
  "stat-grid"?: StatGridBank;
  timeline?: TimelineBank;
  table?: TableBank;
  "doc-section"?: DocSectionBank;
  "doc-field-table"?: DocFieldTableBank;
  "doc-input"?: DocInputBank;
  "doc-textarea"?: DocTextareaBank;
  "doc-checkbox"?: DocCheckboxBank;
  "doc-signature"?: DocSignatureBank;
  "custom-html"?: CustomHtmlBank;
  // Index signature preserves the "unknown keys ignored" forward-
  // compat promise. Consumers whose persisted docStyle carries a
  // block type not yet known to this @cosxai/blocks version (e.g.
  // a doc authored against a newer package that added a block
  // type) don't trip TS excess-property errors, and the extra key
  // is silently ignored at render time by BlockRenderer.
  [blockType: string]: unknown;
};

// ──────────────────────────────────────────────────────────────────
// Blacklist — CSS properties resolveStyle strips.
//
// Rationale (unchanged from v0.6.x):
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
 * Merge cascade: block.style > docStyle[type][subKey] > packageDefault.
 * Later entries win. Blacklisted properties are stripped from user
 * layers (docStyle + block.style) — package defaults are trusted.
 *
 * @param packageDefault — INTERNAL_DEFAULTS sub-style (e.g.
 *   INTERNAL_DEFAULTS.prose.body). NOT stripped. In v0.7.0 packages
 *   this is structural-only.
 * @param docLayer — docStyle[block.type][subKey] (or undefined).
 *   Stripped. Carries the appearance layer in v0.7.0.
 * @param blockLayer — block.style (or undefined). Stripped. Only
 *   passed on ROOT-element resolves; sub-part resolves omit it.
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
// INTERNAL_DEFAULTS — structural-only per-block-type style bank.
//
// v0.7.0 breaking change: appearance stripped. Any value that would
// change with the visual theme (fontFamily, color, background,
// fontSize, fontWeight, letterSpacing, textTransform, lineHeight,
// border*, padding*, margin*, borderRadius, dimensional theme picks
// like a marker's height) is REMOVED and must be supplied by
// docStyle. Renderers with docStyle absent still emit a
// structurally-correct DOM (flex containers still flex, tables still
// collapse borders, bullet-list markers still emit their glyph
// characters) — but the appearance falls back to the browser's user-
// agent stylesheet: text in whatever UA font/size/color, no theme
// spacing or borders. That "unthemed but readable" state is the
// intended tell that the doc's own style data is missing.
//
// Kept structural props are those whose absence would collapse the
// block's LAYOUT (not its appearance) — e.g. `display: flex` on a
// two-column block, `listStyleType: none` + `paddingLeft: 0` on a
// bullet-list (else the browser's default disc markers double up
// with our custom marker spans), `borderCollapse: collapse` on a
// table (else neighbouring borders double up).
//
// If a value is questionable ("is padding structural?"): strip it.
// The whole point is to force appearance into data.
// ──────────────────────────────────────────────────────────────────

const HEADING_EYEBROW: CSSProperties = {};
const HEADING_1: CSSProperties = {};
const HEADING_2: CSSProperties = {};
const HEADING_3: CSSProperties = {};

const PROSE_BODY: CSSProperties = {};
const PROSE_BODY_TIGHT: CSSProperties = {};

const DIVIDER_ROOT: CSSProperties = {};

const FOOTER_NOTE_ROOT: CSSProperties = {};

const CALLOUT_BASE: CSSProperties = {};
const CALLOUT_TONES: Record<"info" | "accent" | "muted", CSSProperties> = {
  info: {},
  accent: {},
  muted: {},
};

// listStyle + paddingLeft:0 are structural — without them the browser
// renders its own disc markers next to our custom marker spans,
// doubling up.
const BULLET_LIST_ROOT: CSSProperties = {
  listStyle: "none",
  paddingLeft: 0,
};
// display:flex + alignItems keep the marker + text side by side; a
// missing display would drop the marker onto its own line.
const BULLET_LIST_ITEM: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
};
const BULLET_LIST_ITEM_FIRST: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
};
const BULLET_MARKERS: Record<"dot" | "check" | "arrow", CSSProperties> = {
  dot: {},
  check: {},
  arrow: {},
};

// display:block prevents an inline image from mangling surrounding
// text baseline. Kept structural.
const IMAGE_BASE: CSSProperties = { display: "block" };
// align:center / align:right depend on margin-auto to do their work;
// these are alignment semantics, kept structural.
const IMAGE_ALIGN: Record<"left" | "center" | "right", CSSProperties> = {
  left: {},
  center: { marginLeft: "auto", marginRight: "auto" },
  right: { marginLeft: "auto" },
};

// display:flex is the whole point of two-column; without it the
// second column drops below the first. Kept.
const TWO_COLUMN_ROOT: CSSProperties = { display: "flex" };
// flex:1 = share available width equally; the caller can override
// via docStyle to change the ratio.
const TWO_COLUMN_LEFT: CSSProperties = { flex: 1 };
const TWO_COLUMN_RIGHT_FLEX: CSSProperties = { flex: 1 };

// grid + column count is set at the callsite (BlockRenderer computes
// gridTemplateColumns from block.cols); we only ship the display
// switch structurally.
const CARD_GRID_ROOT: CSSProperties = { display: "grid" };
// Cards are flex-column so title+body+foot stack correctly.
const CARD: CSSProperties = { display: "flex", flexDirection: "column" };
const CARD_IMAGE: CSSProperties = { width: "100%" };
const CARD_TITLE: CSSProperties = {};
const CARD_BODY: CSSProperties = {};
const CARD_FOOT: CSSProperties = {};

const STAT_GRID_ROOT: CSSProperties = { display: "grid" };
const STAT_CELL: CSSProperties = { display: "flex", flexDirection: "column" };
const STAT_LABEL: CSSProperties = {};
const STAT_VALUE: CSSProperties = {};

// Timeline: flex direction + listStyle keep the semantic structure.
const TIMELINE_VERTICAL: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  paddingLeft: 0,
};
const TIMELINE_HORIZONTAL: CSSProperties = {
  display: "flex",
  overflowX: "auto",
  listStyle: "none",
  paddingLeft: 0,
};
const TIMELINE_STEP_VERTICAL: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
};
const TIMELINE_STEP_HORIZONTAL: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};
// flex:"none" prevents the dot from stretching when its parent is
// flex — this is layout behaviour, not appearance. Size + color come
// from docStyle.
const TIMELINE_DOT: CSSProperties = { flex: "none" };
const TIMELINE_STEP_NUM: CSSProperties = {};
const TIMELINE_STEP_EYEBROW: CSSProperties = {};
const TIMELINE_STEP_TITLE: CSSProperties = {};
const TIMELINE_STEP_BODY: CSSProperties = {};
const TIMELINE_STEP_OUTPUT: CSSProperties = {};

// overflowX for horizontal scroll on narrow viewports; borderCollapse
// prevents doubled cell borders on styled tables.
const TABLE_WRAPPER: CSSProperties = { overflowX: "auto" };
const TABLE_ROOT: CSSProperties = { width: "100%", borderCollapse: "collapse" };
const TABLE_TH_BASE: CSSProperties = {};
const TABLE_TD_BASE: CSSProperties = {};
const TABLE_TONES: Record<"muted" | "accent" | "default", CSSProperties> = {
  accent: {},
  muted: {},
  default: {},
};
const TABLE_TD_EMPHASIS: Record<"lead" | "normal" | "muted", CSSProperties> = {
  lead: {},
  normal: {},
  muted: {},
};

const DOC_SECTION_ROOT: CSSProperties = {};
// header is flex to align the section num next to the title on one
// baseline; without display:flex the num drops to its own line.
const DOC_SECTION_HEADER: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
};
const DOC_SECTION_NUM: CSSProperties = {};
const DOC_SECTION_TITLE: CSSProperties = {};
const DOC_SECTION_CHILDREN: CSSProperties = {};

// borderCollapse mirrors the table structural default; width:100%
// keeps the field table full-width regardless of theme padding.
const DOC_FIELD_TABLE_ROOT: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};
const DOC_FIELD_TABLE_ROW: CSSProperties = {};
const DOC_FIELD_TABLE_LABEL: CSSProperties = {};
const DOC_FIELD_TABLE_VALUE: CSSProperties = {};

// inline-block so doc-input flows in the surrounding prose text
// instead of dropping to its own line.
const DOC_INPUT_ROOT: CSSProperties = { display: "inline-block" };
const DOC_INPUT_INNER: CSSProperties = { display: "inline-block" };

const DOC_TEXTAREA_ROOT: CSSProperties = {};

// inline-flex + alignItems:center keeps the checkbox glyph vertically
// centered against the label text.
const DOC_CHECKBOX_ROOT: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
};
const DOC_CHECKBOX_BOX: CSSProperties = { display: "inline-block" };
const DOC_CHECKBOX_LABEL: CSSProperties = {};

// flex-column so signature line + label caption stack.
const DOC_SIGNATURE_ROOT: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};
const DOC_SIGNATURE_LINE: CSSProperties = {};
const DOC_SIGNATURE_LABEL: CSSProperties = {};

const CUSTOM_HTML_ROOT: CSSProperties = {};

/**
 * INTERNAL_DEFAULTS — the shipped-with-@cosxai/blocks style bank.
 *
 * v0.7.0: structural-only. Appearance moved to data. See file header
 * for the design rationale + rollout notes.
 *
 * Callers (BlockRenderer) reach for these sub-styles via typed
 * exports below. Re-exported as a whole so consumers can inspect /
 * copy from the defaults.
 */
export const INTERNAL_DEFAULTS = {
  heading: {
    eyebrow: HEADING_EYEBROW,
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
