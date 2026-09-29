import { Check, ChevronRight, Folder, FolderOpen, Minus, type LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Spinner } from './Spinner';

export type TreeNode = {
  id: string;
  label: string;
  /** Defaults to a folder (open when expanded). */
  icon?: LucideIcon | undefined;
  /** Right-aligned: a count, "System". */
  meta?: ReactNode;
  /** Known children. Leave undefined with hasChildren for lazy loading. */
  children?: TreeNode[] | undefined;
  /** Has children not loaded yet (lazy). */
  hasChildren?: boolean | undefined;
  disabled?: boolean | undefined;
};

export type FolderTreeProps = {
  nodes: TreeNode[];
  /** Accessible name of the tree. */
  label: string;
  /** The current folder (brand field). */
  selectedId?: string | null | undefined;
  onSelect?: ((id: string) => void) | undefined;
  /** Controlled expansion. */
  expandedIds?: readonly string[] | undefined;
  defaultExpandedIds?: readonly string[] | undefined;
  onExpandedChange?: ((ids: string[]) => void) | undefined;
  /** Expand every ancestor of this id (opening a folder elsewhere reveals it here) and move focus to it. */
  revealId?: string | null | undefined;
  /** Loads a lazy node's children on first expand. */
  loadChildren?: ((id: string) => Promise<TreeNode[]>) | undefined;
  /** Checkbox mode: ticks with partial (mixed) parents. Ids of ticked nodes. */
  checkedIds?: readonly string[] | undefined;
  onCheckedChange?: ((ids: string[]) => void) | undefined;
  /** Nodes become drop targets while something is dragged over them. */
  onDropItems?: ((targetId: string, data: DataTransfer) => void) | undefined;
  /** Whether a drop is allowed here. @default all but disabled nodes */
  canDrop?: ((targetId: string) => boolean) | undefined;
  /** @default "Loading" */
  loadingLabel?: string | undefined;
  className?: string | undefined;
};

type Flat = { node: TreeNode; level: number; parentId: string | null; posinset: number; setsize: number };

/** Resolved children: loaded ones override what the node declares. */
function kids(n: TreeNode, loaded: Map<string, TreeNode[]>): TreeNode[] | undefined {
  return loaded.get(n.id) ?? n.children;
}

function expandable(n: TreeNode, loaded: Map<string, TreeNode[]>): boolean {
  const c = kids(n, loaded);
  return c ? c.length > 0 : Boolean(n.hasChildren);
}

/** Every known descendant id (for ticks). */
function descendants(n: TreeNode, loaded: Map<string, TreeNode[]>): string[] {
  const out: string[] = [];
  const walk = (x: TreeNode) => {
    for (const c of kids(x, loaded) ?? []) {
      out.push(c.id);
      walk(c);
    }
  };
  walk(n);
  return out;
}

/** Path of ids from a root to `id` (inclusive), or null. */
function pathTo(nodes: TreeNode[], id: string, loaded: Map<string, TreeNode[]>): string[] | null {
  for (const n of nodes) {
    if (n.id === id) return [n.id];
    const c = kids(n, loaded);
    if (c) {
      const p = pathTo(c, id, loaded);
      if (p) return [n.id, ...p];
    }
  }
  return null;
}

/**
 * FolderTree — the WAI-ARIA tree for folders. The chevron and the name are
 * separate targets (the chevron only expands, the name opens). Arrows,
 * Home/End and typing a name move focus; Right/Left expand, collapse and
 * step in and out. Lazy children load on first expand; revealId opens a
 * folder's ancestors; checkbox mode shows partial ticks; nodes accept drops.
 */
export function FolderTree({
  nodes,
  label,
  selectedId,
  onSelect,
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
  revealId,
  loadChildren,
  checkedIds,
  onCheckedChange,
  onDropItems,
  canDrop,
  loadingLabel = 'Loading',
  className,
}: FolderTreeProps) {
  const [innerExpanded, setInnerExpanded] = useState<Set<string>>(() => new Set(defaultExpandedIds ?? []));
  const expanded = useMemo(() => (expandedIds ? new Set(expandedIds) : innerExpanded), [expandedIds, innerExpanded]);
  const [loaded, setLoaded] = useState<Map<string, TreeNode[]>>(() => new Map());
  const [loading, setLoading] = useState<Set<string>>(() => new Set());
  const [focusId, setFocusId] = useState<string | null>(null);
  const [dropId, setDropId] = useState<string | null>(null);
  const items = useRef(new Map<string, HTMLLIElement>());
  const typeahead = useRef({ text: '', at: 0 });
  // A treeitem's name would otherwise include its whole subtree.
  const idBase = useId();
  const labelId = (id: string) => `${idBase}-${id}`;

  const setExpanded = useCallback(
    (next: Set<string>) => {
      if (!expandedIds) setInnerExpanded(next);
      onExpandedChange?.([...next]);
    },
    [expandedIds, onExpandedChange],
  );

  const load = useCallback(
    async (n: TreeNode) => {
      if (!loadChildren || kids(n, loaded) || loading.has(n.id) || !n.hasChildren) return;
      setLoading((s) => new Set(s).add(n.id));
      try {
        const children = await loadChildren(n.id);
        setLoaded((m) => new Map(m).set(n.id, children));
      } finally {
        setLoading((s) => {
          const next = new Set(s);
          next.delete(n.id);
          return next;
        });
      }
    },
    [loadChildren, loaded, loading],
  );

  const toggleExpand = useCallback(
    (n: TreeNode, open?: boolean) => {
      const willOpen = open ?? !expanded.has(n.id);
      const next = new Set(expanded);
      if (willOpen) {
        next.add(n.id);
        void load(n);
      } else next.delete(n.id);
      setExpanded(next);
    },
    [expanded, load, setExpanded],
  );

  // Visible rows in order.
  const flat = useMemo(() => {
    const out: Flat[] = [];
    const walk = (list: TreeNode[], level: number, parentId: string | null) => {
      list.forEach((n, i) => {
        out.push({ node: n, level, parentId, posinset: i + 1, setsize: list.length });
        const c = kids(n, loaded);
        if (expanded.has(n.id) && c) walk(c, level + 1, n.id);
      });
    };
    walk(nodes, 1, null);
    return out;
  }, [nodes, loaded, expanded]);

  // Reveal: expand every ancestor, focus the node.
  useEffect(() => {
    if (!revealId) return;
    const path = pathTo(nodes, revealId, loaded);
    if (!path) return;
    const ancestors = path.slice(0, -1);
    if (ancestors.some((id) => !expanded.has(id))) setExpanded(new Set([...expanded, ...ancestors]));
    setFocusId(revealId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealId, nodes, loaded]);

  const current = focusId && flat.some((f) => f.node.id === focusId) ? focusId : (selectedId ?? flat[0]?.node.id ?? null);
  const moveFocus = (id: string | undefined) => {
    if (!id) return;
    setFocusId(id);
    items.current.get(id)?.focus();
  };

  // Ticks
  const checked = useMemo(() => new Set(checkedIds ?? []), [checkedIds]);
  const tickState = (n: TreeNode): boolean | 'mixed' => {
    const d = descendants(n, loaded);
    if (d.length === 0) return checked.has(n.id);
    const on = d.filter((id) => checked.has(id)).length;
    if (on === 0) return false;
    return on === d.length ? true : 'mixed';
  };
  const toggleTick = (n: TreeNode) => {
    if (!onCheckedChange) return;
    const state = tickState(n);
    const ids = [n.id, ...descendants(n, loaded)];
    const next = new Set(checked);
    if (state === true) ids.forEach((id) => next.delete(id));
    else ids.forEach((id) => next.add(id));
    onCheckedChange([...next]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const i = flat.findIndex((f) => f.node.id === current);
    const here = flat[i];
    if (!here) return;
    const n = here.node;
    switch (e.key) {
      case 'ArrowDown':
        moveFocus(flat[i + 1]?.node.id);
        break;
      case 'ArrowUp':
        moveFocus(flat[i - 1]?.node.id);
        break;
      case 'Home':
        moveFocus(flat[0]?.node.id);
        break;
      case 'End':
        moveFocus(flat[flat.length - 1]?.node.id);
        break;
      case 'ArrowRight':
        if (expandable(n, loaded) && !expanded.has(n.id)) toggleExpand(n, true);
        else if (expanded.has(n.id)) moveFocus(flat[i + 1]?.parentId === n.id ? flat[i + 1]!.node.id : undefined);
        break;
      case 'ArrowLeft':
        if (expanded.has(n.id)) toggleExpand(n, false);
        else if (here.parentId) moveFocus(here.parentId);
        break;
      case 'Enter':
        if (!n.disabled) onSelect?.(n.id);
        break;
      case ' ':
        if (onCheckedChange && !n.disabled) toggleTick(n);
        else if (!n.disabled) onSelect?.(n.id);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          const now = Date.now();
          const ta = typeahead.current;
          ta.text = now - ta.at > 600 ? e.key.toLowerCase() : ta.text + e.key.toLowerCase();
          ta.at = now;
          const order = [...flat.slice(i + 1), ...flat.slice(0, i + 1)];
          const hit = order.find((f) => f.node.label.toLowerCase().startsWith(ta.text)) ?? order.find((f) => f.node.label.toLowerCase().startsWith(e.key.toLowerCase()));
          if (hit) moveFocus(hit.node.id);
        }
        return;
    }
    e.preventDefault();
  };

  const allowDrop = (id: string, n: TreeNode) => Boolean(onDropItems) && !n.disabled && (canDrop ? canDrop(id) : true);

  const renderLevel = (list: TreeNode[], level: number): ReactNode =>
    list.map((n, i) => {
      const c = kids(n, loaded);
      const canExpand = expandable(n, loaded);
      const open = canExpand && expanded.has(n.id);
      const isLoading = loading.has(n.id);
      const Glyph = n.icon ?? (open ? FolderOpen : Folder);
      const selected = selectedId === n.id;
      const tick = onCheckedChange ? tickState(n) : undefined;
      return (
        <li
          key={n.id}
          ref={(el) => {
            if (el) items.current.set(n.id, el);
            else items.current.delete(n.id);
          }}
          role="treeitem"
          aria-labelledby={labelId(n.id)}
          aria-level={level}
          aria-posinset={i + 1}
          aria-setsize={list.length}
          aria-expanded={canExpand ? open : undefined}
          aria-selected={onCheckedChange ? undefined : selected}
          aria-checked={tick}
          aria-disabled={n.disabled || undefined}
          aria-busy={isLoading || undefined}
          tabIndex={current === n.id ? 0 : -1}
          onFocus={(e) => {
            if (e.target === e.currentTarget) setFocusId(n.id);
          }}
          className="outline-none [&:focus-visible>div]:shadow-(--focus-ring)"
        >
          <div
            data-drop={dropId === n.id || undefined}
            onDragOver={(e: DragEvent) => {
              if (!allowDrop(n.id, n)) return;
              e.preventDefault();
              setDropId(n.id);
            }}
            onDragLeave={() => setDropId((d) => (d === n.id ? null : d))}
            onDrop={(e: DragEvent) => {
              if (!allowDrop(n.id, n)) return;
              e.preventDefault();
              setDropId(null);
              onDropItems?.(n.id, e.dataTransfer);
            }}
            className={cn(
              'flex h-[34px] items-center gap-1.5 rounded-md pr-2 text-ui',
              selected ? 'bg-brand-field font-medium text-ink' : 'text-fg hover:bg-hover',
              dropId === n.id && 'ring-2 ring-fg ring-inset',
              n.disabled && 'opacity-40',
            )}
            style={{ paddingLeft: 4 + (level - 1) * 18 }}
          >
            {canExpand ? (
              <span
                aria-hidden
                onClick={() => toggleExpand(n)}
                className="grid size-5 shrink-0 cursor-pointer place-items-center rounded-xs text-fg hover:bg-hover"
              >
                <ChevronRight size={14} strokeWidth={2} className={cn('transition-transform duration-[120ms]', open && 'rotate-90')} />
              </span>
            ) : (
              <span aria-hidden className="size-5 shrink-0" />
            )}
            {tick !== undefined && (
              <span
                aria-hidden
                onClick={() => !n.disabled && toggleTick(n)}
                className={cn(
                  'grid size-4 shrink-0 cursor-pointer place-items-center rounded-xs border',
                  tick === false ? 'border-rule bg-page' : 'border-fg bg-fg text-page',
                )}
              >
                {tick === true && <Check size={11} strokeWidth={3} />}
                {tick === 'mixed' && <Minus size={11} strokeWidth={3} />}
              </span>
            )}
            <span
              onClick={() => {
                if (n.disabled) return;
                setFocusId(n.id);
                onSelect?.(n.id);
              }}
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-2"
            >
              <Glyph size={16} strokeWidth={1.75} aria-hidden className="shrink-0" />
              <span id={labelId(n.id)} className="truncate">
                {n.label}
              </span>
            </span>
            {n.meta !== undefined && (
              <span className={cn('shrink-0 text-meta tabular-nums', selected ? 'text-fg-on-yellow-secondary' : 'text-fg-secondary')}>{n.meta}</span>
            )}
          </div>
          {open && (
            <ul role="group" className="m-0 list-none p-0">
              {isLoading && !c ? (
                <li role="none" className="flex h-[34px] items-center text-fg-secondary" style={{ paddingLeft: 4 + level * 18 + 26 }}>
                  <Spinner label={loadingLabel} />
                </li>
              ) : (
                renderLevel(c ?? [], level + 1)
              )}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul role="tree" aria-label={label} aria-multiselectable={onCheckedChange ? true : undefined} onKeyDown={onKeyDown} className={cn('m-0 flex list-none flex-col gap-0.5 p-0', className)}>
      {renderLevel(nodes, 1)}
    </ul>
  );
}
