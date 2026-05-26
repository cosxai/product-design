import type { CommandItem } from "./types";

// Tiny fuzzy ranker. Three signals:
//   - label substring match  → score 100
//   - label prefix match     → score +20
//   - keyword substring match → score 60 (lower than label)
// Anything that doesn't match returns null.
//
// Not as fancy as fzf — good enough for command palettes with
// dozens to low hundreds of items. Swap in a fancier library if
// you outgrow it; the call site (`useFilteredCommands`) is small.

interface Ranked {
  item: CommandItem;
  score: number;
}

function scoreOne(item: CommandItem, q: string): number | null {
  if (!q) return 1; // empty query — everyone passes, sorted by registration order
  const ql = q.toLowerCase();
  const lab = item.label.toLowerCase();
  let s = 0;
  if (lab.includes(ql)) {
    s = 100;
    if (lab.startsWith(ql)) s += 20;
  } else if (item.keywords?.some((k) => k.toLowerCase().includes(ql))) {
    s = 60;
  } else if (item.sublabel?.toLowerCase().includes(ql)) {
    s = 40;
  } else {
    return null;
  }
  return s;
}

export function rankItems(items: CommandItem[], query: string): CommandItem[] {
  const ranked: Ranked[] = [];
  for (const item of items) {
    const sc = scoreOne(item, query);
    if (sc !== null) ranked.push({ item, score: sc });
  }
  // Stable sort by score descending.
  ranked.sort((a, b) => b.score - a.score);
  return ranked.map((r) => r.item);
}
