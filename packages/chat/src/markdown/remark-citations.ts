/**
 * remarkCitations — turns citation markers in the text into citation nodes
 * the renderer draws as a Citation chip.
 *
 *   `[[1]]`  the documented form (what the Agent's prompt should ask for)
 *   `[^1]`   also accepted: a bare footnote marker, or a GFM footnote
 *            reference whose definition exists (the definition is then
 *            dropped, the Sources list shows it instead)
 *
 * Only numbers present in `known` become citations; any other number stays
 * the text it was. Markers inside code and inside links are left alone.
 */

type Node = { type: string; value?: string; children?: Node[]; identifier?: string; label?: string; data?: Record<string, unknown> };

export type RemarkCitationsOptions = {
  /** The citation numbers the host can resolve. */
  known: ReadonlySet<number>;
};

/** Matches `[[12]]` and `[^12]`. */
const MARKER = /\[\[(\d{1,4})\]\]|\[\^(\d{1,4})\]/g;

/** The node every citation becomes; rendered as <span data-citation="n">. */
function citationNode(n: number, text: string): Node {
  return { type: 'citation', value: text, data: { hName: 'span', hProperties: { dataCitation: String(n) }, hChildren: [{ type: 'text', value: text }] } };
}

function splitText(value: string, known: ReadonlySet<number>): Node[] | null {
  MARKER.lastIndex = 0;
  const out: Node[] = [];
  let last = 0;
  let changed = false;
  for (let m = MARKER.exec(value); m; m = MARKER.exec(value)) {
    const n = Number(m[1] ?? m[2]);
    if (!known.has(n)) continue;
    if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
    out.push(citationNode(n, m[0]));
    last = m.index + m[0].length;
    changed = true;
  }
  if (!changed) return null;
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}

const SKIP = new Set(['link', 'linkReference', 'code', 'inlineCode', 'math', 'inlineMath', 'html']);

export function remarkCitations(options: RemarkCitationsOptions) {
  const { known } = options;
  return (tree: Node) => {
    const cited = new Set<string>();
    const walk = (node: Node) => {
      const kids = node.children;
      if (!kids || SKIP.has(node.type)) return;
      for (let i = 0; i < kids.length; i++) {
        const child = kids[i]!;
        if (child.type === 'text' && child.value) {
          const parts = splitText(child.value, known);
          if (parts) {
            kids.splice(i, 1, ...parts);
            i += parts.length - 1;
          }
        } else if (child.type === 'footnoteReference' && /^\d{1,4}$/.test(child.identifier ?? '') && known.has(Number(child.identifier))) {
          cited.add(child.identifier!);
          kids[i] = citationNode(Number(child.identifier), `[^${child.label ?? child.identifier}]`);
        } else {
          walk(child);
        }
      }
    };
    walk(tree);
    // A definition whose references all became citations would otherwise
    // render a footnotes section repeating the Sources list.
    if (cited.size && tree.children) {
      tree.children = tree.children.filter((c) => !(c.type === 'footnoteDefinition' && cited.has(c.identifier ?? '')));
    }
  };
}
