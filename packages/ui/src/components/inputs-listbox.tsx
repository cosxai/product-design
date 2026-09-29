import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../lib/cn';
import type { SearchStatus } from './inputs-search';
import { Spinner } from './Spinner';

export type ListItem = {
  value: string;
  label: string;
  /** Right-hand line: Customer · 3 projects. */
  meta?: string | undefined;
  /** Initials in the avatar square (HV). Derived from the label if omitted. */
  initials?: string | undefined;
};

export function initialsOf(item: ListItem): string {
  if (item.initials) return item.initials;
  const words = item.label.trim().split(/\s+/);
  const first = words[0] ?? '';
  // One hanzi reads as an initial on its own (王).
  if (/[㐀-鿿]/.test(first)) return first[0]!;
  return ((first[0] ?? '') + (words.length > 1 ? (words[words.length - 1]![0] ?? '') : '')).toUpperCase();
}

export function Avatar({ item, className }: { item: ListItem; className?: string | undefined }) {
  return (
    <span aria-hidden className={cn('inline-grid size-6 shrink-0 place-items-center rounded-pill bg-well text-[10.5px] font-semibold text-fg', className)}>
      {initialsOf(item)}
    </span>
  );
}

export type ListboxLabels = {
  searching: string;
  empty: (query: string) => string;
  error: string;
  retry: string;
  create: (query: string) => string;
};

export const DEFAULT_LABELS: ListboxLabels = {
  searching: 'Searching',
  empty: (q) => `Nothing matches “${q}”.`,
  error: 'Couldn’t load results.',
  retry: 'Retry',
  create: (q) => `Create “${q}”`,
};

/** Rows of an async listbox: results, then an optional Create row; or one state row. */
export function ListboxBody({
  id,
  optionId,
  items,
  active,
  status,
  query,
  canCreate,
  labels,
  onActive,
  onChoose,
  onRetry,
  selectedValues,
}: {
  id: string;
  optionId: (i: number) => string;
  items: ListItem[];
  /** Index of the active row; items.length means the Create row. */
  active: number;
  status: SearchStatus;
  query: string;
  canCreate: boolean;
  labels: ListboxLabels;
  onActive: (i: number) => void;
  onChoose: (i: number) => void;
  onRetry: () => void;
  selectedValues?: ReadonlySet<string>;
}) {
  const row = (i: number, content: ReactNode, selected = false) => (
    <div
      key={optionId(i)}
      id={optionId(i)}
      role="option"
      aria-selected={selected}
      data-active={i === active || undefined}
      onMouseMove={() => i !== active && onActive(i)}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onChoose(i)}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] leading-[1.35] text-fg',
        i === active ? 'bg-brand-field text-ink' : selected && 'bg-hover',
      )}
    >
      {content}
    </div>
  );

  let state: ReactNode = null;
  if (status === 'searching') {
    state = (
      <div className="flex items-center gap-2 px-2.5 py-2.5 text-[12.5px] text-fg-secondary">
        <Spinner size={12} /> {labels.searching}
      </div>
    );
  } else if (status === 'error') {
    state = (
      <div className="flex items-center gap-2 px-2.5 py-2 text-[12.5px] text-fg-secondary">
        <span className="flex-1">{labels.error}</span>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onRetry}
          className="cursor-pointer rounded-xs font-medium text-fg underline underline-offset-3 outline-none focus-visible:shadow-(--focus-ring)"
        >
          {labels.retry}
        </button>
      </div>
    );
  } else if (status === 'done' && items.length === 0 && !canCreate) {
    state = <div className="px-2.5 py-2.5 text-[12.5px] text-fg-secondary">{labels.empty(query)}</div>;
  }

  return (
    <div id={id} role="listbox" className="flex max-h-[260px] flex-col overflow-y-auto">
      {status === 'done' &&
        items.map((it, i) =>
          row(
            i,
            <>
              <Avatar item={it} className={i === active ? 'bg-ink text-linen' : undefined} />
              <span className="min-w-0 flex-1 truncate">{it.label}</span>
              {it.meta && <span className="shrink-0 text-meta text-fg-secondary">{it.meta}</span>}
            </>,
            selectedValues?.has(it.value),
          ),
        )}
      {status === 'done' && items.length === 0 && canCreate && (
        <div className="px-2.5 pt-1.5 pb-1 text-meta text-fg-secondary">{labels.empty(query)}</div>
      )}
      {status === 'done' &&
        canCreate &&
        row(
          items.length,
          <>
            <span aria-hidden className="inline-grid size-6 shrink-0 place-items-center rounded-sm border border-dashed border-rule text-fg-secondary">
              <Plus size={13} />
            </span>
            <span className="font-medium">{labels.create(query)}</span>
          </>,
        )}
      {state}
    </div>
  );
}
