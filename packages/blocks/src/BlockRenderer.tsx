import type { Block } from "./blocks";

// Static alignment class map — Tailwind's build-time class extraction
// requires literal class names, so `text-${c.align}` template
// interpolation silently drops in production builds. Map here + the
// column/cell renderers pick from it.
function alignClass(align: "left" | "center" | "right" | undefined) {
  switch (align) {
    case "center": return "text-center";
    case "right":  return "text-right";
    default:       return "text-left";
  }
}

// BlockRenderer — dispatch + per-type views for content-as-data
// block_doc pages. Signing-form blocks render as read-only placeholders
// here; live signing interactions live in the signing surface, not the
// generic renderer.
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

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return <HeadingView b={block} />;
    case "prose":
      return <ProseView b={block} />;
    case "divider":
      return <DividerView b={block} />;
    case "footer-note":
      return <FooterNoteView b={block} />;
    case "callout":
      return <CalloutView b={block} />;
    case "bullet-list":
      return <BulletListView b={block} />;
    case "image":
      return <ImageView b={block} />;
    case "two-column":
      return <TwoColumnView b={block} />;
    case "card-grid":
      return <CardGridView b={block} />;
    case "stat-grid":
      return <StatGridView b={block} />;
    case "timeline":
      return <TimelineView b={block} />;
    case "table":
      return <TableView b={block} />;
    case "doc-section":
      return <DocSectionView b={block} />;
    case "doc-field-table":
      return <DocFieldTableView b={block} />;
    case "doc-input":
      return <DocInputPlaceholder b={block} />;
    case "doc-textarea":
      return <DocTextareaPlaceholder b={block} />;
    case "doc-checkbox":
      return <DocCheckboxPlaceholder b={block} />;
    case "doc-signature":
      return <DocSignaturePlaceholder b={block} />;
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

/** BlockList — helper that maps a Block[] to a rendered list. */
export function BlockList({ blocks }: { blocks: readonly Block[] }) {
  return (
    <>
      {blocks.map((b) => (
        <BlockRenderer key={b.id} block={b} />
      ))}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// Inline-text blocks
// ──────────────────────────────────────────────────────────────────

function HeadingView({ b }: { b: Extract<Block, { type: "heading" }> }) {
  const eyebrow = b.eyebrow ? (
    <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{b.eyebrow}</p>
  ) : null;
  if (b.level === 1) {
    return (
      <div data-block-id={b.id}>
        {eyebrow}
        <h1 className="text-[24px] font-light tracking-tight leading-tight mt-2 mb-3">{b.text}</h1>
      </div>
    );
  }
  if (b.level === 2) {
    return (
      <div data-block-id={b.id}>
        {eyebrow}
        <h2 className="text-[14px] font-semibold tracking-tight leading-snug mt-3 mb-2">{b.text}</h2>
      </div>
    );
  }
  return (
    <div data-block-id={b.id}>
      {eyebrow}
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-700 mt-3 mb-1">
        {b.text}
      </h3>
    </div>
  );
}

function ProseView({ b }: { b: Extract<Block, { type: "prose" }> }) {
  return (
    <p
      data-block-id={b.id}
      className={
        b.tight
          ? "text-[10.5px] leading-relaxed text-zinc-800"
          : "text-[10.5px] leading-relaxed text-zinc-800 my-3"
      }
      dangerouslySetInnerHTML={{ __html: b.html }}
    />
  );
}

function DividerView({ b }: { b: Extract<Block, { type: "divider" }> }) {
  return <hr data-block-id={b.id} className="my-3 border-zinc-200" />;
}

function FooterNoteView({ b }: { b: Extract<Block, { type: "footer-note" }> }) {
  return (
    <p
      data-block-id={b.id}
      className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 mt-4"
      dangerouslySetInnerHTML={{ __html: b.html }}
    />
  );
}

function CalloutView({ b }: { b: Extract<Block, { type: "callout" }> }) {
  const toneClass =
    b.tone === "accent"
      ? "border-l-2 border-[var(--ck-accent,#4f46e5)] bg-[color-mix(in_oklab,var(--ck-accent,#4f46e5)_8%,transparent)]"
      : b.tone === "muted"
        ? "border-l-2 border-zinc-300 bg-zinc-50"
        : "border-l-2 border-zinc-400 bg-zinc-50";
  return (
    <div
      data-block-id={b.id}
      className={`text-[10.5px] leading-relaxed text-zinc-800 my-3 px-3 py-2 ${toneClass}`}
      dangerouslySetInnerHTML={{ __html: b.html }}
    />
  );
}

function BulletListView({ b }: { b: Extract<Block, { type: "bullet-list" }> }) {
  return (
    <ul
      data-block-id={b.id}
      className="my-3 space-y-1.5 text-[10.5px] leading-relaxed text-zinc-800"
    >
      {b.items.map((it, i) => (
        <li key={i} className="flex gap-2 items-start">
          <span aria-hidden className="text-zinc-400 mt-[2px]">
            •
          </span>
          <span dangerouslySetInnerHTML={{ __html: it.html }} />
        </li>
      ))}
    </ul>
  );
}

function ImageView({ b }: { b: Extract<Block, { type: "image" }> }) {
  return (
    <img
      data-block-id={b.id}
      src={b.src}
      alt={b.alt}
      {...(b.width !== undefined ? { style: { width: b.width } } : {})}
      className={
        b.align === "center"
          ? "block mx-auto my-3"
          : b.align === "right"
            ? "block ml-auto my-3"
            : "block my-3"
      }
    />
  );
}

// ──────────────────────────────────────────────────────────────────
// Structural blocks
// ──────────────────────────────────────────────────────────────────

function TwoColumnView({ b }: { b: Extract<Block, { type: "two-column" }> }) {
  // Optional rightWidth is a Tailwind fragment ("w-[280px]"). When
  // present we hand it to the right column via className; otherwise
  // the two columns share equal space.
  const rightCls = b.rightWidth ?? "";
  return (
    <div data-block-id={b.id} className="my-3 flex gap-4">
      <div className="flex-1">
        <BlockList blocks={b.left} />
      </div>
      <div className={rightCls || "flex-1"}>
        <BlockList blocks={b.right} />
      </div>
    </div>
  );
}

function CardGridView({ b }: { b: Extract<Block, { type: "card-grid" }> }) {
  return (
    <div
      data-block-id={b.id}
      className="my-3 grid gap-3"
      style={{ gridTemplateColumns: `repeat(${b.cols}, minmax(0, 1fr))` }}
    >
      {b.cards.map((c, i) => (
        <div
          key={i}
          className="rounded border border-zinc-200 bg-white p-3 flex flex-col gap-1"
        >
          {c.image && <img src={c.image} alt="" className="w-full mb-1" />}
          {c.title && <h4 className="text-[12px] font-semibold text-zinc-900">{c.title}</h4>}
          {c.body && (
            <p
              className="text-[10px] leading-relaxed text-zinc-700"
              dangerouslySetInnerHTML={{ __html: c.body }}
            />
          )}
          {c.foot && <p className="text-[9px] text-zinc-500 mt-1">{c.foot}</p>}
        </div>
      ))}
    </div>
  );
}

function StatGridView({ b }: { b: Extract<Block, { type: "stat-grid" }> }) {
  return (
    <div
      data-block-id={b.id}
      className="my-3 grid gap-4"
      style={{ gridTemplateColumns: `repeat(${b.stats.length}, minmax(0, 1fr))` }}
    >
      {b.stats.map((s, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-500">{s.label}</p>
          <p className="text-[24px] font-semibold text-zinc-900 leading-none">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function TimelineView({ b }: { b: Extract<Block, { type: "timeline" }> }) {
  const isHorizontal = b.orientation === "horizontal";
  return (
    <ol
      data-block-id={b.id}
      className={
        isHorizontal
          ? "my-3 flex gap-3 overflow-x-auto"
          : "my-3 space-y-3"
      }
    >
      {b.steps.map((step, i) => (
        <li
          key={i}
          className={
            isHorizontal
              ? "flex-1 min-w-[140px] flex flex-col gap-1"
              : "flex gap-3 items-start"
          }
        >
          {!isHorizontal && (
            <span
              aria-hidden
              className="mt-[6px] h-2 w-2 rounded-full bg-[var(--ck-accent,#4f46e5)] flex-none"
            />
          )}
          <div className="flex-1">
            {step.num && <p className="text-[9px] text-zinc-500">{step.num}</p>}
            {step.eyebrow && (
              <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-500">
                {step.eyebrow}
              </p>
            )}
            <p className="text-[11px] font-semibold text-zinc-900">{step.title}</p>
            {step.body && (
              <p
                className="text-[10.5px] leading-relaxed text-zinc-700 mt-1"
                dangerouslySetInnerHTML={{ __html: step.body }}
              />
            )}
            {step.output && (
              <p className="text-[9px] text-zinc-500 mt-1">→ {step.output}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function TableView({ b }: { b: Extract<Block, { type: "table" }> }) {
  return (
    <div data-block-id={b.id} className="my-3 overflow-x-auto">
      <table className="w-full text-[10px] border-collapse">
        <thead>
          <tr>
            {b.columns.map((c) => (
              <th
                key={c.id}
                className={`border border-zinc-200 px-2 py-1 font-semibold text-zinc-800 ${
                  c.tone === "accent"
                    ? "bg-[color-mix(in_oklab,var(--ck-accent,#4f46e5)_10%,transparent)]"
                    : c.tone === "muted"
                      ? "bg-zinc-100"
                      : "bg-zinc-50"
                } ${alignClass(c.align)}`}
                style={c.widthFr !== undefined ? { width: `${c.widthFr}fr` } : undefined}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {b.rows.map((row, ri) => (
            <tr key={ri}>
              {b.columns.map((c) => {
                const cellHtml = row.cells[c.id] ?? "";
                const emphasis = row.emphasis?.[c.id];
                const emphasisCls =
                  emphasis === "lead"
                    ? "font-semibold text-zinc-900"
                    : emphasis === "muted"
                      ? "text-zinc-500"
                      : "text-zinc-800";
                return (
                  <td
                    key={c.id}
                    className={`border border-zinc-200 px-2 py-1 align-top ${alignClass(c.align)} ${emphasisCls}`}
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

function DocSectionView({ b }: { b: Extract<Block, { type: "doc-section" }> }) {
  return (
    <section data-block-id={b.id} className="my-4">
      <div className="flex items-baseline gap-2 mb-2 border-b border-zinc-300 pb-1">
        {b.num !== undefined && (
          <span className="text-[10px] font-semibold text-zinc-600">§{b.num}</span>
        )}
        <h3 className="text-[12px] font-semibold text-zinc-900 tracking-tight">{b.title}</h3>
      </div>
      <div className="pl-3">
        <BlockList blocks={b.children} />
      </div>
    </section>
  );
}

function DocFieldTableView({ b }: { b: Extract<Block, { type: "doc-field-table" }> }) {
  const labelW = b.labelWidth ?? "32%";
  return (
    <table
      data-block-id={b.id}
      className="my-2 w-full text-[10.5px] border-collapse"
    >
      <colgroup>
        <col style={{ width: labelW }} />
        <col />
      </colgroup>
      <tbody>
        {b.rows.map((r, i) => (
          <tr key={i} className="border-b border-zinc-100">
            <th className="text-left align-top font-medium text-zinc-700 py-1 pr-2">{r.label}</th>
            <td className="align-top py-1">
              <BlockList blocks={r.valueBlocks} />
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

function DocInputPlaceholder({ b }: { b: Extract<Block, { type: "doc-input" }> }) {
  return (
    <span data-block-id={b.id} className="inline-block align-middle">
      <span className="inline-block min-w-[80px] border-b border-zinc-400 text-[10.5px] text-zinc-400 px-1">
        {b.placeholder ?? " "}
      </span>
    </span>
  );
}

function DocTextareaPlaceholder({ b }: { b: Extract<Block, { type: "doc-textarea" }> }) {
  const rows = b.rows ?? 3;
  return (
    <div
      data-block-id={b.id}
      className="my-2 border border-zinc-300 bg-zinc-50 px-2 py-1 text-[10.5px] text-zinc-400"
      style={{ minHeight: `${rows * 1.3}em` }}
    >
      {b.placeholder ?? ""}
    </div>
  );
}

function DocCheckboxPlaceholder({ b }: { b: Extract<Block, { type: "doc-checkbox" }> }) {
  return (
    <span data-block-id={b.id} className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="inline-block h-3 w-3 border border-zinc-400 rounded-sm bg-white"
      />
      {b.label && <span className="text-[10.5px] text-zinc-800">{b.label}</span>}
    </span>
  );
}

function DocSignaturePlaceholder({ b }: { b: Extract<Block, { type: "doc-signature" }> }) {
  return (
    <div data-block-id={b.id} className="my-3 flex flex-col gap-0.5">
      <div className="h-[36px] border-b border-zinc-400" />
      <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-500">
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
  return (
    <div data-block-id={b.id} data-block-custom-id={b.id} className="my-3">
      {b.css && <style dangerouslySetInnerHTML={{ __html: b.css }} />}
      <div dangerouslySetInnerHTML={{ __html: b.html }} />
    </div>
  );
}
