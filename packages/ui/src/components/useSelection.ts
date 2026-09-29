import { useCallback, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';

export type SelectionOptions = {
  /** Every selectable id, in display order (ranges follow this order). */
  ids: readonly string[];
  /** Controlled selection. */
  selected?: ReadonlySet<string> | readonly string[] | undefined;
  /** Uncontrolled starting selection. */
  defaultSelected?: readonly string[] | undefined;
  onChange?: ((selected: Set<string>) => void) | undefined;
  /**
   * Selection mode: a plain click toggles instead of opening. Unset: on
   * while anything is selected (ticking one box enters it, clearing leaves).
   */
  selectionMode?: boolean | undefined;
};

export type Selection = {
  selected: Set<string>;
  count: number;
  isSelected: (id: string) => boolean;
  /** True when a plain click toggles (see SelectionOptions.selectionMode). */
  selectionMode: boolean;
  toggle: (id: string) => void;
  /** Select from the anchor (last clicked) to id, keeping what is selected. */
  selectRange: (id: string) => void;
  selectAll: () => void;
  clear: () => void;
  set: (ids: Iterable<string>) => void;
  /**
   * The click on an item: ⇧ selects a range, ⌘/Ctrl toggles, a plain click
   * toggles in selection mode. Returns true when it handled the click —
   * otherwise the caller opens the item.
   */
  handleClick: (id: string, event: Pick<MouseEvent, 'shiftKey' | 'metaKey' | 'ctrlKey'>) => boolean;
  /** For the list container: ⌘/Ctrl-A selects all, Esc clears. */
  onKeyDown: (event: KeyboardEvent) => void;
};

function toSet(v: ReadonlySet<string> | readonly string[] | undefined): Set<string> | undefined {
  if (v === undefined) return undefined;
  return new Set(v);
}

/**
 * useSelection — the selection model every list and grid shares: click,
 * ⇧-click range, ⌘/Ctrl-click toggle, ⌘A, Esc. In selection mode the whole
 * card or row is the checkbox.
 */
export function useSelection({ ids, selected, defaultSelected, onChange, selectionMode }: SelectionOptions): Selection {
  const [inner, setInner] = useState<Set<string>>(() => new Set(defaultSelected ?? []));
  const controlled = toSet(selected);
  const current = useMemo(() => controlled ?? inner, [controlled, inner]);
  const anchor = useRef<string | null>(null);

  const commit = useCallback(
    (next: Set<string>) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      anchor.current = id;
      commit(next);
    },
    [current, commit],
  );

  const selectRange = useCallback(
    (id: string) => {
      const from = anchor.current === null ? -1 : ids.indexOf(anchor.current);
      const to = ids.indexOf(id);
      if (to < 0) return;
      const next = new Set(current);
      if (from < 0) next.add(id);
      else for (let i = Math.min(from, to); i <= Math.max(from, to); i++) next.add(ids[i]!);
      anchor.current = id;
      commit(next);
    },
    [ids, current, commit],
  );

  const selectAll = useCallback(() => commit(new Set(ids)), [ids, commit]);
  const clear = useCallback(() => {
    anchor.current = null;
    commit(new Set());
  }, [commit]);
  const set = useCallback((next: Iterable<string>) => commit(new Set(next)), [commit]);

  const mode = selectionMode ?? current.size > 0;

  const handleClick = useCallback<Selection['handleClick']>(
    (id, e) => {
      if (e.shiftKey) {
        selectRange(id);
        return true;
      }
      if (e.metaKey || e.ctrlKey || mode) {
        toggle(id);
        return true;
      }
      anchor.current = id;
      return false;
    },
    [mode, selectRange, toggle],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target?.closest('input, textarea, [contenteditable="true"]');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a' && !typing) {
        e.preventDefault();
        selectAll();
      } else if (e.key === 'Escape' && current.size > 0) {
        e.preventDefault();
        clear();
      }
    },
    [selectAll, clear, current.size],
  );

  return {
    selected: current,
    count: current.size,
    isSelected: (id) => current.has(id),
    selectionMode: mode,
    toggle,
    selectRange,
    selectAll,
    clear,
    set,
    handleClick,
    onKeyDown,
  };
}
