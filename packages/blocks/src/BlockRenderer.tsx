import type { CSSProperties } from "react";

import type { Block } from "./blocks.js";
import { INTERNAL_DEFAULTS, alignStyle, resolveStyle, type DocStyle } from "./styles.js";

// BlockRenderer — dispatch + per-type views for content-as-data
// block_doc pages. Signing-form blocks render as read-only placeholders
// here; live signing interactions live in the signing surface, not the
// generic renderer.
//
// Style model (v0.6.0 breaking change):
//   Every block outputs inline `style={...}` computed from the cascade
//     block.style > docStyle[block.type] > INTERNAL_DEFAULTS[block.type]
//   No consumer needs to bundle Tailwind CSS — the renderer's output
//   is self-contained. See styles.ts for the resolver + defaults bank.
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
      return <CustomHtmlView b={block} />;
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
  return (
    <>
      {blocks.map((b) => (
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
  const eyebrow = b.eyebrow ? (
    <p style={INTERNAL_DEFAULTS.heading.eyebrow}>{b.eyebrow}</p>
  ) : null;
  const docLayer = docStyle?.heading;
  if (b.level === 1) {
    const style = resolveStyle(INTERNAL_DEFAULTS.heading["level-1"], docLayer, b.style);
    return (
      <div data-block-id={b.id}>
        {eyebrow}
        <h1 style={style}>{b.text}</h1>
      </div>
    );
  }
  if (b.level === 2) {
    const style = resolveStyle(INTERNAL_DEFAULTS.heading["level-2"], docLayer, b.style);
    return (
      <div data-block-id={b.id}>
        {eyebrow}
        <h2 style={style}>{b.text}</h2>
      </div>
    );
  }
  const style = resolveStyle(INTERNAL_DEFAULTS.heading["level-3"], docLayer, b.style);
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
  const base = b.tight ? INTERNAL_DEFAULTS.prose["body-tight"] : INTERNAL_DEFAULTS.prose.body;
  const style = resolveStyle(base, docStyle?.prose, b.style);
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
  const style = resolveStyle(INTERNAL_DEFAULTS.divider.root, docStyle?.divider, b.style);
  return <hr data-block-id={b.id} style={style} />;
}

function FooterNoteView({
  b,
  docStyle,
}: {
  b: Extract<Block, { type: "footer-note" }>;
  docStyle: DocStyle | undefined;
}) {
  const style = resolveStyle(
    INTERNAL_DEFAULTS["footer-note"].root,
    docStyle?.["footer-note"],
    b.style,
  );
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
  const base: CSSProperties = {
    ...INTERNAL_DEFAULTS.callout.base,
    ...INTERNAL_DEFAULTS.callout.tones[b.tone],
  };
  const style = resolveStyle(base, docStyle?.callout, b.style);
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
  const marker = b.variant === "check" ? "✓" : b.variant === "arrow" ? "→" : "•";
  const markerStyle = INTERNAL_DEFAULTS["bullet-list"].markers[b.variant ?? "dot"];
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["bullet-list"].root,
    docStyle?.["bullet-list"],
    b.style,
  );
  return (
    <ul data-block-id={b.id} style={rootStyle}>
      {b.items.map((it, i) => (
        <li
          key={i}
          style={
            i === 0
              ? INTERNAL_DEFAULTS["bullet-list"]["item-first"]
              : INTERNAL_DEFAULTS["bullet-list"].item
          }
        >
          <span aria-hidden style={markerStyle}>
            {marker}
          </span>
          <span dangerouslySetInnerHTML={{ __html: it.html }} />
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
  const align = b.align ?? "left";
  const base: CSSProperties = {
    ...INTERNAL_DEFAULTS.image.base,
    ...INTERNAL_DEFAULTS.image.align[align],
    ...(b.width !== undefined ? { width: b.width } : {}),
  };
  const style = resolveStyle(base, docStyle?.image, b.style);
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
  // rightWidth accepts a CSS length ("280px", "20rem", "30%") applied
  // via inline style — the portable path since v0.6.0 dropped
  // className flows entirely. Legacy Tailwind class fragments
  // ("w-[280px]") passed here have no effect (className removed from
  // this component); document authors should switch to CSS lengths.
  const rw = b.rightWidth;
  const isCssLength = !!rw && /^-?[\d.]+(px|%|rem|em|vw|vh|ch|pt|cm|mm|in)$/.test(rw);
  const rightStyle: CSSProperties = isCssLength
    ? { width: rw, flex: "0 0 auto" }
    : INTERNAL_DEFAULTS["two-column"]["right-flex"];
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["two-column"].root,
    docStyle?.["two-column"],
    b.style,
  );
  return (
    <div data-block-id={b.id} style={rootStyle}>
      <div style={INTERNAL_DEFAULTS["two-column"].left}>
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
  const rootStyle: CSSProperties = {
    ...resolveStyle(INTERNAL_DEFAULTS["card-grid"].root, docStyle?.["card-grid"], b.style),
    gridTemplateColumns: `repeat(${b.cols}, minmax(0, 1fr))`,
  };
  return (
    <div data-block-id={b.id} style={rootStyle}>
      {b.cards.map((c, i) => (
        <div key={i} style={INTERNAL_DEFAULTS["card-grid"].card}>
          {c.image && <img src={c.image} alt="" style={INTERNAL_DEFAULTS["card-grid"]["card-image"]} />}
          {c.title && <h4 style={INTERNAL_DEFAULTS["card-grid"]["card-title"]}>{c.title}</h4>}
          {c.body && (
            <p
              style={INTERNAL_DEFAULTS["card-grid"]["card-body"]}
              dangerouslySetInnerHTML={{ __html: c.body }}
            />
          )}
          {c.foot && <p style={INTERNAL_DEFAULTS["card-grid"]["card-foot"]}>{c.foot}</p>}
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
  const rootStyle: CSSProperties = {
    ...resolveStyle(INTERNAL_DEFAULTS["stat-grid"].root, docStyle?.["stat-grid"], b.style),
    gridTemplateColumns: `repeat(${b.stats.length}, minmax(0, 1fr))`,
  };
  return (
    <div data-block-id={b.id} style={rootStyle}>
      {b.stats.map((s, i) => (
        <div key={i} style={INTERNAL_DEFAULTS["stat-grid"].cell}>
          <p style={INTERNAL_DEFAULTS["stat-grid"].label}>{s.label}</p>
          <p style={INTERNAL_DEFAULTS["stat-grid"].value}>{s.value}</p>
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
  const isHorizontal = b.orientation === "horizontal";
  const baseRoot = isHorizontal
    ? INTERNAL_DEFAULTS.timeline["root-horizontal"]
    : INTERNAL_DEFAULTS.timeline["root-vertical"];
  const rootStyle = resolveStyle(baseRoot, docStyle?.timeline, b.style);
  const stepStyle = isHorizontal
    ? INTERNAL_DEFAULTS.timeline["step-horizontal"]
    : INTERNAL_DEFAULTS.timeline["step-vertical"];
  return (
    <ol data-block-id={b.id} style={rootStyle}>
      {b.steps.map((step, i) => (
        <li key={i} style={stepStyle}>
          {!isHorizontal && <span aria-hidden style={INTERNAL_DEFAULTS.timeline.dot} />}
          <div style={{ flex: 1 }}>
            {step.num && <p style={INTERNAL_DEFAULTS.timeline["step-num"]}>{step.num}</p>}
            {step.eyebrow && (
              <p style={INTERNAL_DEFAULTS.timeline["step-eyebrow"]}>{step.eyebrow}</p>
            )}
            <p style={INTERNAL_DEFAULTS.timeline["step-title"]}>{step.title}</p>
            {step.body && (
              <p
                style={INTERNAL_DEFAULTS.timeline["step-body"]}
                dangerouslySetInnerHTML={{ __html: step.body }}
              />
            )}
            {step.output && <p style={INTERNAL_DEFAULTS.timeline["step-output"]}>→ {step.output}</p>}
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
  // widthFr is a fractional weight per column. Rendered as a
  // percentage of the total assigned weight so the values compose
  // consistently on a regular <table> (fr units are grid-only and
  // invalid on `width`). Columns without widthFr contribute 0 to
  // the total; when no column carries a weight, we skip the style
  // and let the browser auto-size.
  const totalFr = b.columns.reduce((sum, c) => sum + (c.widthFr ?? 0), 0);
  const widthStyleFor = (widthFr: number | undefined): CSSProperties | undefined => {
    if (widthFr === undefined || totalFr <= 0) return undefined;
    return { width: `${(widthFr / totalFr) * 100}%` };
  };
  const wrapperStyle = resolveStyle(
    INTERNAL_DEFAULTS.table.wrapper,
    docStyle?.table,
    b.style,
  );
  return (
    <div data-block-id={b.id} style={wrapperStyle}>
      <table style={INTERNAL_DEFAULTS.table.root}>
        <thead>
          <tr>
            {b.columns.map((c) => {
              const tone: keyof typeof INTERNAL_DEFAULTS.table.tones =
                c.tone === "accent" ? "accent" : c.tone === "muted" ? "muted" : "default";
              const style: CSSProperties = {
                ...INTERNAL_DEFAULTS.table.th,
                ...INTERNAL_DEFAULTS.table.tones[tone],
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
          {b.rows.map((row, ri) => (
            <tr key={ri}>
              {b.columns.map((c) => {
                const cellHtml = row.cells[c.id] ?? "";
                const emphasis = row.emphasis?.[c.id] ?? "normal";
                const style: CSSProperties = {
                  ...INTERNAL_DEFAULTS.table.td,
                  ...alignStyle(c.align),
                  ...INTERNAL_DEFAULTS.table.emphasis[emphasis],
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
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-section"].root,
    docStyle?.["doc-section"],
    b.style,
  );
  return (
    <section data-block-id={b.id} style={rootStyle}>
      <div style={INTERNAL_DEFAULTS["doc-section"].header}>
        {b.num !== undefined && (
          <span style={INTERNAL_DEFAULTS["doc-section"].num}>§{b.num}</span>
        )}
        <h3 style={INTERNAL_DEFAULTS["doc-section"].title}>{b.title}</h3>
      </div>
      <div style={INTERNAL_DEFAULTS["doc-section"].children}>
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
  const labelW = b.labelWidth ?? "32%";
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-field-table"].root,
    docStyle?.["doc-field-table"],
    b.style,
  );
  return (
    <table data-block-id={b.id} style={rootStyle}>
      <colgroup>
        <col style={{ width: labelW }} />
        <col />
      </colgroup>
      <tbody>
        {b.rows.map((r, i) => (
          <tr key={i} style={INTERNAL_DEFAULTS["doc-field-table"].row}>
            <th style={INTERNAL_DEFAULTS["doc-field-table"].label}>{r.label}</th>
            <td style={INTERNAL_DEFAULTS["doc-field-table"].value}>
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
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-input"].root,
    docStyle?.["doc-input"],
    b.style,
  );
  return (
    <span data-block-id={b.id} style={rootStyle}>
      <span style={INTERNAL_DEFAULTS["doc-input"].inner}>{b.placeholder ?? " "}</span>
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
    ...resolveStyle(INTERNAL_DEFAULTS["doc-textarea"].root, docStyle?.["doc-textarea"], b.style),
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
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-checkbox"].root,
    docStyle?.["doc-checkbox"],
    b.style,
  );
  return (
    <span data-block-id={b.id} style={rootStyle}>
      <span aria-hidden style={INTERNAL_DEFAULTS["doc-checkbox"].box} />
      {b.label && <span style={INTERNAL_DEFAULTS["doc-checkbox"].label}>{b.label}</span>}
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
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["doc-signature"].root,
    docStyle?.["doc-signature"],
    b.style,
  );
  return (
    <div data-block-id={b.id} style={rootStyle}>
      <div style={INTERNAL_DEFAULTS["doc-signature"].line} />
      <p style={INTERNAL_DEFAULTS["doc-signature"].label}>
        Signature
        {b.recipientIndex !== undefined ? ` · Signer ${b.recipientIndex + 1}` : ""}
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Custom HTML escape hatch
// ──────────────────────────────────────────────────────────────────

function CustomHtmlView({ b }: { b: Extract<Block, { type: "custom-html" }> }) {
  // Server-side sanitised on write; SPA trusts stored value.
  const rootStyle = resolveStyle(
    INTERNAL_DEFAULTS["custom-html"].root,
    undefined, // custom-html intentionally opaque — no docStyle override
    b.style,
  );
  return (
    <div data-block-id={b.id} data-block-custom-id={b.id} style={rootStyle}>
      {b.css && <style dangerouslySetInnerHTML={{ __html: b.css }} />}
      <div dangerouslySetInnerHTML={{ __html: b.html }} />
    </div>
  );
}
