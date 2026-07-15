import type { CSSProperties } from "react";

import type { Block } from "./blocks.js";
import { INTERNAL_DEFAULTS, alignStyle, resolveStyle, type DocStyle } from "./styles.js";

// asArray — defensive wrapper for schema fields that MUST be arrays
// but occasionally aren't (hand-edited JSON in the draft editor,
// missing fields from schema drift, agent-generated content that
// dropped a shape). Renderer collapses to an empty list instead of
// throwing `d.map is not a function` on the whole page (v0.7.1 fix
// following QA reports on 2026-07-15). See the per-type comments
// where it's used.
function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

// Long text guard — hashes, URLs, storage keys and other unbroken
// identifier strings should wrap mid-word rather than horizontally
// overflow the page. `overflow-wrap: anywhere` gives the browser
// permission to break at any character as a last resort; it
// preserves natural word boundaries for prose that DOES have
// spaces. Applied to every text-carrying block's root inline
// style at build time so a rogue long line can't visually escape
// the artboard (QA 2026-07-15 · long checksums broke past the
// slide edge).
const TEXT_OVERFLOW_GUARD: CSSProperties = {
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

// BlockRenderer — dispatch + per-type views for content-as-data
// block_doc pages. Signing-form blocks render as read-only placeholders
// here; live signing interactions live in the signing surface, not the
// generic renderer.
//
// Style model (v0.7.0 nested cascade):
//   Every block outputs inline `style={...}` computed per-sub-part
//   from the cascade:
//     block.style (root only) > docStyle[type][subKey] > INTERNAL_DEFAULTS[type][subKey]
//   INTERNAL_DEFAULTS carries STRUCTURAL props only (display, flex,
//   list-style, overflow, borderCollapse — see styles.ts). Appearance
//   (fontFamily, colors, spacing, borders, dimensions) MUST be
//   provided by docStyle. product-mesh populates docStyle from the
//   doc's persisted draft_style / commit.style JSONB, seeded by
//   template_seeds.go's buildSeedDraftStyle at doc creation.
//   Rendering with an absent docStyle produces a structurally-correct
//   but visually-blank DOM — this is the intended failure mode when
//   the data layer is broken.
//
// Design:
//   - Every block gets `data-block-id="<id>"` on its root, so future
//     block-anchored comments + edit affordances can hang off DOM.
//   - HTML strings on prose / callout / footer-note / bullet-list
//     items / table cells are sanitised SERVER-SIDE on write
//     (product-mesh document/sanitize.go), so dangerouslySetInnerHTML
//     is safe.
//   - Read-only always. Any editor / form interaction lives outside
//     this component.
//   - Custom-html + custom-css: consumer trusts server-sanitised
//     values; renders inside a data-block-custom-id scope so the
//     server-prefixed selectors match.

export interface BlockRendererProps {
  block: Block;
  /**
   * Optional doc-level style override. Middle layer in the cascade
   * (block.style > docStyle > defaults). Keyed by block `type`;
   * unknown keys ignored. Typically hydrated from
   * `doc.metadata.style` (SPA) or `commit.style` (immutable
   * snapshot from mesh).
   */
  docStyle?: DocStyle | undefined;
}

export function BlockRenderer({ block, docStyle }: BlockRendererProps) {
  switch (block.type) {
    case "heading":
      return <HeadingView b={block} docStyle={docStyle} />;
    case "prose":
      return <ProseView b={block} docStyle={docStyle} />;
    case "divider":
      return <DividerView b={block} docStyle={docStyle} />;
    case "footer-note":
      return <FooterNoteView b={block} docStyle={docStyle} />;
    case "callout":
      return <CalloutView b={block} docStyle={docStyle} />;
    case "bullet-list":
      return <BulletListView b={block} docStyle={docStyle} />;
    case "image":
      return <ImageView b={block} docStyle={docStyle} />;
    case "two-column":
      return <TwoColumnView b={block} docStyle={docStyle} />;
    case "card-grid":
      return <CardGridView b={block} docStyle={docStyle} />;
    case "stat-grid":
      return <StatGridView b={block} docStyle={docStyle} />;
    case "timeline":
      return <TimelineView b={block} docStyle={docStyle} />;
    case "table":
      return <TableView b={block} docStyle={docStyle} />;
    case "doc-section":
      return <DocSectionView b={block} docStyle={docStyle} />;
    case "doc-field-table":
      return <DocFieldTableView b={block} docStyle={docStyle} />;
    case "doc-input":
      return <DocInputPlaceholder b={block} docStyle={docStyle} />;
    case "doc-textarea":
      return <DocTextareaPlaceholder b={block} docStyle={docStyle} />;
    case "doc-checkbox":
      return <DocCheckboxPlaceholder b={block} docStyle={docStyle} />;
    case "doc-signature":
      return <DocSignaturePlaceholder b={block} docStyle={docStyle} />;
    case "custom-html":
      return <CustomHtmlView b={block} docStyle={docStyle} />;
    case "slide-decoration":
      return null; // Slide renders decorations at its own layer
    default: {
      // Exhaustive switch guard — TS surfaces a type error at compile
      // time when the discriminated union grows a new variant without
      // a matching case. The `never` binding is what turns the compile
      // check on; the runtime `return null` handles the impossible case.
      const _exhaustive: never = block;
      void _exhaustive;
      return null;
    }
  }
}

export interface BlockListProps {
  blocks: readonly Block[];
  /**
   * Optional doc-level style override threaded to every BlockRenderer.
   */
  docStyle?: DocStyle | undefined;
}

/** BlockList — helper that maps a Block[] to a rendered list. */
export function BlockList({ blocks, docStyle }: BlockListProps) {
  // Defensive: any caller passing a non-array (schema-drifted
  // container blocks whose left/right/valueBlocks came through as a
  // string or object) collapses to an empty list rather than
  // crashing the whole render tree with `d.map is not a function`.
  const safe = asArray<Block>(blocks);
  return (
    <>
      {safe.map((b) => (
        <BlockRenderer key={b.id} block={b} docStyle={docStyle} />
      ))}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// Inline-text blocks
// ──────────────────────────────────────────────────────────────────

function HeadingView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "heading" }>;
  docStyle: DocStyle | undefined;
}) {
  const headingBank = docStyle?.heading;
  const eyebrow = b.eyebrow ? (
    <p style={resolveStyle(INTERNAL_DEFAULTS.heading.eyebrow, headingBank?.eyebrow, undefined)}>
      {b.eyebrow}
    </p>
  ) : null;
  // TEXT_OVERFLOW_GUARD is spread on every heading level so long
  // unbroken text (URLs, checksums, storage keys) wraps at any
  // character as a last resort instead of horizontally overflowing
  // the artboard.
  if (b.level === 1) {
    const style = {
      ...resolveStyle(INTERNAL_DEFAULTS.heading["level-1"], headingBank?.["level-1"], b.style),
      ...TEXT_OVERFLOW_GUARD,
    };
    return (
      <div data-block-id={b.id}>
        {eyebrow}
        <h1 style={style}>{b.text}</h1>
      </div>
    );
  }
  if (b.level === 2) {
    const style = {
      ...resolveStyle(INTERNAL_DEFAULTS.heading["level-2"], headingBank?.["level-2"], b.style),
      ...TEXT_OVERFLOW_GUARD,
    };
    return (
      <div data-block-id={b.id}>
        {eyebrow}
        <h2 style={style}>{b.text}</h2>
      </div>
    );
  }
  const style = {
    ...resolveStyle(INTERNAL_DEFAULTS.heading["level-3"], headingBank?.["level-3"], b.style),
    ...TEXT_OVERFLOW_GUARD,
  };
  return (
    <div data-block-id={b.id}>
      {eyebrow}
      <h3 style={style}>{b.text}</h3>
    </div>
  );
}

function ProseView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "prose" }>;
  docStyle: DocStyle | undefined;
}) {
  const proseBank = docStyle?.prose;
  const subKey = b.tight ? "body-tight" : "body";
  const style = {
    ...resolveStyle(INTERNAL_DEFAULTS.prose[subKey], proseBank?.[subKey], b.style),
    ...TEXT_OVERFLOW_GUARD,
  };
  return (
    <p
      data-block-id={b.id}
      style={style}
      dangerouslySetInnerHTML={{ __html: b.html }}
    />
  );
}

function DividerView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "divider" }>;
  docStyle: DocStyle | undefined;
}) {
  const style = resolveStyle(
    INTERNAL_DEFAULTS.divider.root,
    docStyle?.divider?.root,
    b.style,
  );
  return <hr data-block-id={b.id} style={style} />;
}

function FooterNoteView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "footer-note" }>;
  docStyle: DocStyle | undefined;
}) {
  const style = {
    ...resolveStyle(
      INTERNAL_DEFAULTS["footer-note"].root,
      docStyle?.["footer-note"]?.root,
      b.style,
    ),
    ...TEXT_OVERFLOW_GUARD,
  };
  return (
    <p
      data-block-id={b.id}
      style={style}
      dangerouslySetInnerHTML={{ __html: b.html }}
    />
  );
}

function CalloutView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "callout" }>;
  docStyle: DocStyle | undefined;
}) {
  const calloutBank = docStyle?.callout;
  // Compose base + tone at both package and doc layers. Package
  // layers go into packageDefault (trusted); doc layers into docLayer
  // (routed through resolveStyle's stripBlacklisted so persisted
  // banks can't smuggle blacklisted position/transform/zIndex).
  // block.style is applied last at the outermost element only.
  const style = resolveStyle(
    {
      ...INTERNAL_DEFAULTS.callout.base,
      ...INTERNAL_DEFAULTS.callout.tones[b.tone],
    },
    {
      ...calloutBank?.base,
      ...calloutBank?.tones?.[b.tone],
    },
    b.style,
  );
  return (
    <div
      data-block-id={b.id}
      style={style}
      dangerouslySetInnerHTML={{ __html: b.html }}
    />
  );
}

function BulletListView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "bullet-list" }>;
  docStyle: DocStyle | undefined;
}) {
  const bulletBank = docStyle?.["bullet-list"];
  const marker = b.variant === "check" ? "✓" : b.variant === "arrow" ? "→" : "•";
  const variant = b.variant ?? "dot";
  const markerStyle = resolveStyle(
    INTERNAL_DEFAULTS["bullet-list"].markers[variant],
    bulletBank?.markers?.[variant],
    undefined,
  );
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["bullet-list"].root,
    bulletBank?.root,
    b.style,
  );
  const itemStyle = resolveStyle(
    INTERNAL_DEFAULTS["bullet-list"].item,
    bulletBank?.item,
    undefined,
  );
  const itemFirstStyle = resolveStyle(
    INTERNAL_DEFAULTS["bullet-list"]["item-first"],
    bulletBank?.["item-first"],
    undefined,
  );
  return (
    <ul data-block-id={b.id} style={rootStyle}>
      {asArray<{ html: string }>(b.items).map((it, i) => (
        <li key={i} style={i === 0 ? itemFirstStyle : itemStyle}>
          <span aria-hidden style={markerStyle}>
            {marker}
          </span>
          <span dangerouslySetInnerHTML={{ __html: it?.html ?? "" }} />
        </li>
      ))}
    </ul>
  );
}

function ImageView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "image" }>;
  docStyle: DocStyle | undefined;
}) {
  const imageBank = docStyle?.image;
  const align = b.align ?? "left";
  // Package base + align go into packageDefault (trusted); doc base +
  // align through resolveStyle's docLayer so stripBlacklisted runs.
  // block.width is a well-known block prop from the schema so it
  // rides on packageDefault (not user data, no strip needed).
  const style = resolveStyle(
    {
      ...INTERNAL_DEFAULTS.image.base,
      ...INTERNAL_DEFAULTS.image.align[align],
      ...(b.width !== undefined ? { width: b.width } : {}),
    },
    {
      ...imageBank?.base,
      ...imageBank?.align?.[align],
    },
    b.style,
  );
  return <img data-block-id={b.id} src={b.src} alt={b.alt} style={style} />;
}

// ──────────────────────────────────────────────────────────────────
// Structural blocks
// ──────────────────────────────────────────────────────────────────

function TwoColumnView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "two-column" }>;
  docStyle: DocStyle | undefined;
}) {
  const twoColBank = docStyle?.["two-column"];
  // rightWidth resolution:
  //   1. Plain CSS length ("280px", "20rem", "30%") — apply as
  //      inline `width` + `flex: 0 0 auto`. Portable path since
  //      v0.6.0 dropped className flows entirely.
  //   2. Legacy Tailwind arbitrary-value class fragment
  //      ("w-[280px]", "w-[30%]") — extract the value between the
  //      brackets and apply the same way. Preserves back-compat
  //      with stored docs authored against v0.5.x when className
  //      fragments were accepted here. See blocks.ts::TwoColumnBlock
  //      docs.
  //   3. Anything else / undefined — fall back to the right-flex
  //      sub-part (structural flex:1 + user-supplied appearance).
  const rw = b.rightWidth;
  const bracketMatch = rw ? /^w-\[(.+)\]$/.exec(rw) : null;
  const cssLength = bracketMatch
    ? bracketMatch[1]
    : rw && /^-?[\d.]+(px|%|rem|em|vw|vh|ch|pt|cm|mm|in)$/.test(rw)
      ? rw
      : null;
  const rightFlex = resolveStyle(
    INTERNAL_DEFAULTS["two-column"]["right-flex"],
    twoColBank?.["right-flex"],
    undefined,
  );
  const rightStyle: CSSProperties = cssLength
    ? { width: cssLength, flex: "0 0 auto" }
    : rightFlex;
  const leftStyle = resolveStyle(
    INTERNAL_DEFAULTS["two-column"].left,
    twoColBank?.left,
    undefined,
  );
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["two-column"].root,
    twoColBank?.root,
    b.style,
  );
  return (
    <div data-block-id={b.id} style={rootStyle}>
      <div style={leftStyle}>
        <BlockList blocks={b.left} docStyle={docStyle} />
      </div>
      <div style={rightStyle}>
        <BlockList blocks={b.right} docStyle={docStyle} />
      </div>
    </div>
  );
}

function CardGridView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "card-grid" }>;
  docStyle: DocStyle | undefined;
}) {
  const cardBank = docStyle?.["card-grid"];
  const rootStyle: CSSProperties = {
    ...resolveStyle(INTERNAL_DEFAULTS["card-grid"].root, cardBank?.root, b.style),
    gridTemplateColumns: `repeat(${b.cols}, minmax(0, 1fr))`,
  };
  const cardStyle = resolveStyle(INTERNAL_DEFAULTS["card-grid"].card, cardBank?.card, undefined);
  const cardImgStyle = resolveStyle(
    INTERNAL_DEFAULTS["card-grid"]["card-image"],
    cardBank?.["card-image"],
    undefined,
  );
  const cardTitleStyle = resolveStyle(
    INTERNAL_DEFAULTS["card-grid"]["card-title"],
    cardBank?.["card-title"],
    undefined,
  );
  const cardBodyStyle = resolveStyle(
    INTERNAL_DEFAULTS["card-grid"]["card-body"],
    cardBank?.["card-body"],
    undefined,
  );
  const cardFootStyle = resolveStyle(
    INTERNAL_DEFAULTS["card-grid"]["card-foot"],
    cardBank?.["card-foot"],
    undefined,
  );
  return (
    <div data-block-id={b.id} style={rootStyle}>
      {asArray<{
        image?: string;
        title?: string;
        body?: string;
        foot?: string;
      }>(b.cards).map((c, i) => (
        <div key={i} style={cardStyle}>
          {c.image && <img src={c.image} alt="" style={cardImgStyle} />}
          {c.title && <h4 style={cardTitleStyle}>{c.title}</h4>}
          {c.body && (
            <p style={cardBodyStyle} dangerouslySetInnerHTML={{ __html: c.body }} />
          )}
          {c.foot && <p style={cardFootStyle}>{c.foot}</p>}
        </div>
      ))}
    </div>
  );
}

function StatGridView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "stat-grid" }>;
  docStyle: DocStyle | undefined;
}) {
  const statBank = docStyle?.["stat-grid"];
  const stats = asArray<{ label: string; value: string }>(b.stats);
  const rootStyle: CSSProperties = {
    ...resolveStyle(INTERNAL_DEFAULTS["stat-grid"].root, statBank?.root, b.style),
    gridTemplateColumns: `repeat(${Math.max(1, stats.length)}, minmax(0, 1fr))`,
  };
  const cellStyle = resolveStyle(
    INTERNAL_DEFAULTS["stat-grid"].cell,
    statBank?.cell,
    undefined,
  );
  const labelStyle = resolveStyle(
    INTERNAL_DEFAULTS["stat-grid"].label,
    statBank?.label,
    undefined,
  );
  const valueStyle = resolveStyle(
    INTERNAL_DEFAULTS["stat-grid"].value,
    statBank?.value,
    undefined,
  );
  return (
    <div data-block-id={b.id} style={rootStyle}>
      {stats.map((s, i) => (
        <div key={i} style={cellStyle}>
          <p style={labelStyle}>{s.label}</p>
          <p style={valueStyle}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function TimelineView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "timeline" }>;
  docStyle: DocStyle | undefined;
}) {
  const timelineBank = docStyle?.timeline;
  const isHorizontal = b.orientation === "horizontal";
  const rootKey = isHorizontal ? "root-horizontal" : "root-vertical";
  const stepKey = isHorizontal ? "step-horizontal" : "step-vertical";
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS.timeline[rootKey],
    timelineBank?.[rootKey],
    b.style,
  );
  const stepStyle = resolveStyle(
    INTERNAL_DEFAULTS.timeline[stepKey],
    timelineBank?.[stepKey],
    undefined,
  );
  const dotStyle = resolveStyle(
    INTERNAL_DEFAULTS.timeline.dot,
    timelineBank?.dot,
    undefined,
  );
  const numStyle = resolveStyle(
    INTERNAL_DEFAULTS.timeline["step-num"],
    timelineBank?.["step-num"],
    undefined,
  );
  const eyebrowStyle = resolveStyle(
    INTERNAL_DEFAULTS.timeline["step-eyebrow"],
    timelineBank?.["step-eyebrow"],
    undefined,
  );
  const titleStyle = resolveStyle(
    INTERNAL_DEFAULTS.timeline["step-title"],
    timelineBank?.["step-title"],
    undefined,
  );
  const bodyStyle = resolveStyle(
    INTERNAL_DEFAULTS.timeline["step-body"],
    timelineBank?.["step-body"],
    undefined,
  );
  const outputStyle = resolveStyle(
    INTERNAL_DEFAULTS.timeline["step-output"],
    timelineBank?.["step-output"],
    undefined,
  );
  return (
    <ol data-block-id={b.id} style={rootStyle}>
      {asArray<{
        num?: string;
        eyebrow?: string;
        title: string;
        body?: string;
        output?: string;
      }>(b.steps).map((step, i) => (
        <li key={i} style={stepStyle}>
          {!isHorizontal && <span aria-hidden style={dotStyle} />}
          <div style={{ flex: 1 }}>
            {step.num && <p style={numStyle}>{step.num}</p>}
            {step.eyebrow && <p style={eyebrowStyle}>{step.eyebrow}</p>}
            <p style={titleStyle}>{step.title}</p>
            {step.body && (
              <p style={bodyStyle} dangerouslySetInnerHTML={{ __html: step.body }} />
            )}
            {step.output && <p style={outputStyle}>→ {step.output}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function TableView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "table" }>;
  docStyle: DocStyle | undefined;
}) {
  const tableBank = docStyle?.table;
  // Defensive: table.columns / .rows must be arrays. Schema drift
  // or hand-edited draft JSON that dropped either would crash the
  // whole page render. Collapse to [] instead — the table simply
  // renders empty.
  const columns = asArray<{
    id: string;
    header: string;
    align?: "left" | "center" | "right";
    tone?: "default" | "accent" | "muted";
    widthFr?: number;
  }>(b.columns);
  const rows = asArray<{
    cells: Record<string, string>;
    emphasis?: Record<string, "normal" | "muted" | "lead">;
  }>(b.rows);
  // widthFr is a fractional weight per column. Rendered as a
  // percentage of the total assigned weight so the values compose
  // consistently on a regular <table> (fr units are grid-only and
  // invalid on `width`). Columns without widthFr contribute 0 to
  // the total; when no column carries a weight, we skip the style
  // and let the browser auto-size.
  const totalFr = columns.reduce((sum, c) => sum + (c.widthFr ?? 0), 0);
  const widthStyleFor = (widthFr: number | undefined): CSSProperties | undefined => {
    if (widthFr === undefined || totalFr <= 0) return undefined;
    return { width: `${(widthFr / totalFr) * 100}%` };
  };
  const wrapperStyle = resolveStyle(
    INTERNAL_DEFAULTS.table.wrapper,
    tableBank?.wrapper,
    b.style,
  );
  const tableStyle = resolveStyle(
    INTERNAL_DEFAULTS.table.root,
    tableBank?.root,
    undefined,
  );
  return (
    <div data-block-id={b.id} style={wrapperStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((c) => {
              const tone: keyof typeof INTERNAL_DEFAULTS.table.tones =
                c.tone === "accent" ? "accent" : c.tone === "muted" ? "muted" : "default";
              // Package th + tone are trusted; tableBank.th + .tones[tone]
              // are user data → routed through resolveStyle's docLayer
              // so stripBlacklisted runs before merge. alignStyle +
              // widthStyleFor come from block schema (trusted) and
              // apply on top for column-specific overrides.
              const style: CSSProperties = {
                ...resolveStyle(
                  {
                    ...INTERNAL_DEFAULTS.table.th,
                    ...INTERNAL_DEFAULTS.table.tones[tone],
                  },
                  {
                    ...tableBank?.th,
                    ...tableBank?.tones?.[tone],
                  },
                  undefined,
                ),
                ...alignStyle(c.align),
                ...widthStyleFor(c.widthFr),
              };
              return (
                <th key={c.id} style={style}>
                  {c.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {columns.map((c) => {
                const cellHtml = row.cells?.[c.id] ?? "";
                const emphasis = row.emphasis?.[c.id] ?? "normal";
                // Same sanitisation pattern as th above.
                const style: CSSProperties = {
                  ...resolveStyle(
                    {
                      ...INTERNAL_DEFAULTS.table.td,
                      ...INTERNAL_DEFAULTS.table.emphasis[emphasis],
                    },
                    {
                      ...tableBank?.td,
                      ...tableBank?.emphasis?.[emphasis],
                    },
                    undefined,
                  ),
                  ...alignStyle(c.align),
                };
                return (
                  <td
                    key={c.id}
                    style={style}
                    dangerouslySetInnerHTML={{ __html: cellHtml }}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// A4 doc-* blocks
// ──────────────────────────────────────────────────────────────────

function DocSectionView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "doc-section" }>;
  docStyle: DocStyle | undefined;
}) {
  const sectBank = docStyle?.["doc-section"];
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-section"].root,
    sectBank?.root,
    b.style,
  );
  const headerStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-section"].header,
    sectBank?.header,
    undefined,
  );
  const numStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-section"].num,
    sectBank?.num,
    undefined,
  );
  const titleStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-section"].title,
    sectBank?.title,
    undefined,
  );
  const childrenStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-section"].children,
    sectBank?.children,
    undefined,
  );
  return (
    <section data-block-id={b.id} style={rootStyle}>
      <div style={headerStyle}>
        {b.num !== undefined && <span style={numStyle}>§{b.num}</span>}
        <h3 style={titleStyle}>{b.title}</h3>
      </div>
      <div style={childrenStyle}>
        <BlockList blocks={b.children} docStyle={docStyle} />
      </div>
    </section>
  );
}

function DocFieldTableView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "doc-field-table" }>;
  docStyle: DocStyle | undefined;
}) {
  const fieldBank = docStyle?.["doc-field-table"];
  const labelW = b.labelWidth ?? "32%";
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-field-table"].root,
    fieldBank?.root,
    b.style,
  );
  const rowStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-field-table"].row,
    fieldBank?.row,
    undefined,
  );
  const labelStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-field-table"].label,
    fieldBank?.label,
    undefined,
  );
  const valueStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-field-table"].value,
    fieldBank?.value,
    undefined,
  );
  return (
    <table data-block-id={b.id} style={rootStyle}>
      <colgroup>
        <col style={{ width: labelW }} />
        <col />
      </colgroup>
      <tbody>
        {asArray<{ label: string; valueBlocks: Block[] }>(b.rows).map((r, i) => (
          <tr key={i} style={rowStyle}>
            <th style={labelStyle}>{r.label}</th>
            <td style={valueStyle}>
              {/* r.valueBlocks may be non-array under schema drift;
                  BlockList's own asArray guard collapses it to []
                  rather than crashing. */}
              <BlockList blocks={r.valueBlocks} docStyle={docStyle} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ──────────────────────────────────────────────────────────────────
// Signing-form blocks — placeholders (this package is view-only; the
// signing surface owns live interaction).
// ──────────────────────────────────────────────────────────────────

function DocInputPlaceholder({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "doc-input" }>;
  docStyle: DocStyle | undefined;
}) {
  const inputBank = docStyle?.["doc-input"];
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-input"].root,
    inputBank?.root,
    b.style,
  );
  const innerStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-input"].inner,
    inputBank?.inner,
    undefined,
  );
  return (
    <span data-block-id={b.id} style={rootStyle}>
      <span style={innerStyle}>{b.placeholder ?? " "}</span>
    </span>
  );
}

function DocTextareaPlaceholder({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "doc-textarea" }>;
  docStyle: DocStyle | undefined;
}) {
  const rows = b.rows ?? 3;
  const rootStyle: CSSProperties = {
    ...resolveStyle(
      INTERNAL_DEFAULTS["doc-textarea"].root,
      docStyle?.["doc-textarea"]?.root,
      b.style,
    ),
    minHeight: `${rows * 1.3}em`,
  };
  return (
    <div data-block-id={b.id} style={rootStyle}>
      {b.placeholder ?? ""}
    </div>
  );
}

function DocCheckboxPlaceholder({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "doc-checkbox" }>;
  docStyle: DocStyle | undefined;
}) {
  const checkboxBank = docStyle?.["doc-checkbox"];
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-checkbox"].root,
    checkboxBank?.root,
    b.style,
  );
  const boxStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-checkbox"].box,
    checkboxBank?.box,
    undefined,
  );
  const labelStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-checkbox"].label,
    checkboxBank?.label,
    undefined,
  );
  return (
    <span data-block-id={b.id} style={rootStyle}>
      <span aria-hidden style={boxStyle} />
      {b.label && <span style={labelStyle}>{b.label}</span>}
    </span>
  );
}

function DocSignaturePlaceholder({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "doc-signature" }>;
  docStyle: DocStyle | undefined;
}) {
  const sigBank = docStyle?.["doc-signature"];
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-signature"].root,
    sigBank?.root,
    b.style,
  );
  const lineStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-signature"].line,
    sigBank?.line,
    undefined,
  );
  const labelStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-signature"].label,
    sigBank?.label,
    undefined,
  );
  return (
    <div data-block-id={b.id} style={rootStyle}>
      <div style={lineStyle} />
      <p style={labelStyle}>
        Signature
        {b.recipientIndex !== undefined ? ` · Signer ${b.recipientIndex + 1}` : ""}
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Custom HTML escape hatch
// ──────────────────────────────────────────────────────────────────

function CustomHtmlView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "custom-html" }>;
  docStyle?: DocStyle | undefined;
}) {
  // Server-side sanitised on write; SPA trusts stored value.
  // custom-html accepts a root-level docStyle override so consumers
  // can apply theme spacing consistently; the html body is opaque
  // and not themed by us.
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["custom-html"].root,
    docStyle?.["custom-html"]?.root,
    b.style,
  );
  return (
    <div data-block-id={b.id} data-block-custom-id={b.id} style={rootStyle}>
      {b.css && <style dangerouslySetInnerHTML={{ __html: b.css }} />}
      <div dangerouslySetInnerHTML={{ __html: b.html }} />
    </div>
  );
}
