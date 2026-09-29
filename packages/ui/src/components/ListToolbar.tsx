import { LayoutGrid, List as ListIcon, Search, X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Input } from './Input';
import { Select, type SelectOption } from './Select';

export type ListView = 'cards' | 'list';
export type SearchScope = 'deep' | 'folder';

export type ListFilter = { id: string; label: string; active?: boolean | undefined };

export type ListToolbarLabels = {
  /** The toolbar's accessible name. */
  toolbar: string;
  search: string;
  sort: string;
  view: string;
  cards: string;
  list: string;
  removeFilter: (label: string) => string;
  /** "Searching this folder and its subfolders" */
  scopeDeep: string;
  /** "Searching this folder only" */
  scopeFolder: string;
  /** The switch to folder only: "This folder only" */
  switchToFolder: string;
  /** The switch back: "Include subfolders" */
  switchToDeep: string;
};

const EN: ListToolbarLabels = {
  toolbar: 'List tools',
  search: 'Search this folder',
  sort: 'Sort',
  view: 'View',
  cards: 'Cards',
  list: 'List',
  removeFilter: (l) => `Remove filter ${l}`,
  scopeDeep: 'Searching this folder and its subfolders',
  scopeFolder: 'Searching this folder only',
  switchToFolder: 'This folder only',
  switchToDeep: 'Include subfolders',
};

export type ListToolbarProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  query?: string | undefined;
  onQueryChange?: ((query: string) => void) | undefined;
  /** Where the search looks; the line under the toolbar says so and switches it. */
  scope?: SearchScope | undefined;
  onScopeChange?: ((scope: SearchScope) => void) | undefined;
  sortOptions?: Array<string | SelectOption> | undefined;
  sort?: string | undefined;
  onSortChange?: ((value: string) => void) | undefined;
  /** Active filters show as chips on the brand field with a remove button. */
  filters?: ListFilter[] | undefined;
  onFilterRemove?: ((id: string) => void) | undefined;
  view?: ListView | undefined;
  onViewChange?: ((view: ListView) => void) | undefined;
  /** "2 folders · 14 documents · more below" */
  counts?: ReactNode;
  labels?: Partial<ListToolbarLabels> | undefined;
};

/**
 * ListToolbar — search in the folder (with its scope said out loud), sort,
 * active filters, the cards / list switch and the counts. Shared by every
 * list.
 */
export function ListToolbar({
  query,
  onQueryChange,
  scope = 'deep',
  onScopeChange,
  sortOptions,
  sort,
  onSortChange,
  filters,
  onFilterRemove,
  view,
  onViewChange,
  counts,
  labels,
  className,
  ...rest
}: ListToolbarProps) {
  const t = { ...EN, ...labels };
  const active = (filters ?? []).filter((f) => f.active !== false);
  const searching = Boolean(query);
  return (
    <div className={cn('flex flex-col gap-2', className)} {...rest}>
      <div role="toolbar" aria-label={t.toolbar} className="flex flex-wrap items-center gap-2">
        {onQueryChange && (
          <Input
            type="search"
            aria-label={t.search}
            placeholder={t.search}
            value={query ?? ''}
            onChange={(e) => onQueryChange(e.target.value)}
            prefix={<Search size={15} strokeWidth={1.75} aria-hidden />}
            frameClassName="min-w-[200px] flex-1"
          />
        )}
        {sortOptions && (
          <div className="w-[160px]">
            <Select options={sortOptions} value={sort} onChange={onSortChange} aria-label={t.sort} />
          </div>
        )}
        {active.map((f) => (
          <span key={f.id} className="inline-flex h-[38px] items-center gap-1.5 rounded-md bg-brand-field px-3 text-ui font-medium text-ink">
            {f.label}
            {onFilterRemove && (
              <button
                type="button"
                aria-label={t.removeFilter(f.label)}
                onClick={() => onFilterRemove(f.id)}
                className="grid cursor-pointer place-items-center rounded-xs outline-none focus-visible:shadow-(--focus-ring)"
              >
                <X size={14} strokeWidth={2} aria-hidden />
              </button>
            )}
          </span>
        ))}
        {onViewChange && (
          <div role="radiogroup" aria-label={t.view} className="inline-flex h-[38px] items-center gap-0.5 rounded-md bg-sunk p-1">
            {(
              [
                ['cards', LayoutGrid, t.cards],
                ['list', ListIcon, t.list],
              ] as const
            ).map(([v, Glyph, label]) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={view === v}
                aria-label={label}
                title={label}
                onClick={() => onViewChange(v)}
                className={cn(
                  'grid size-[30px] cursor-pointer place-items-center rounded-sm text-fg outline-none focus-visible:shadow-(--focus-ring)',
                  view === v ? 'bg-brand-field text-ink' : 'hover:bg-hover',
                )}
              >
                <Glyph size={15} strokeWidth={1.75} aria-hidden />
              </button>
            ))}
          </div>
        )}
      </div>
      {(searching || counts) && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-meta text-fg-secondary">
          <span>
            {searching && (
              <>
                {scope === 'deep' ? t.scopeDeep : t.scopeFolder}
                {onScopeChange && (
                  <>
                    {' · '}
                    <button
                      type="button"
                      onClick={() => onScopeChange(scope === 'deep' ? 'folder' : 'deep')}
                      className="cursor-pointer text-fg underline underline-offset-2 outline-none focus-visible:shadow-(--focus-ring)"
                    >
                      {scope === 'deep' ? t.switchToFolder : t.switchToDeep}
                    </button>
                  </>
                )}
              </>
            )}
          </span>
          {counts && <span aria-live="polite">{counts}</span>}
        </div>
      )}
    </div>
  );
}
