import { ArrowDown, ArrowUp } from 'lucide-react';
import type { ComponentProps, KeyboardEvent, ReactNode } from 'react';

import { cn } from '../lib/cn';

export type TableSortDirection = 'asc' | 'desc';
export type TableSort = { key: string; direction: TableSortDirection };

export type TableColumn<R> = {
  key: string;
  label: ReactNode;
  /** Numbers and dates right-aligned (tabular). @default "left" */
  align?: 'left' | 'right' | undefined;
  /** Quiet metadata cell: 12px grey, tabular. */
  meta?: boolean | undefined;
  width?: number | string | undefined;
  /** Header click sorts by this column. */
  sortable?: boolean | undefined;
  render?: ((row: R) => ReactNode) | undefined;
};

export type TableRowBase = {
  id: string | number;
  /** attention (yellow wash) or error (red wash); progress and complete stay plain — the status column says them. */
  status?: 'attention' | 'error' | 'progress' | 'complete' | 'neutral' | undefined;
  [key: string]: unknown;
};

export type TableProps<R extends TableRowBase> = Omit<ComponentProps<'table'>, 'children'> & {
  columns: TableColumn<R>[];
  rows: R[];
  /** Opening a row. The row is also reachable by keyboard (Enter). Prefer a real link in the first column (rowHref). */
  onRowClick?: ((row: R) => void) | undefined;
  /** Makes the first column a real link to the row. */
  rowHref?: ((row: R) => string) | undefined;
  sort?: TableSort | undefined;
  onSortChange?: ((sort: TableSort) => void) | undefined;
  dense?: boolean | undefined;
  /** Keep the head and show five skeleton rows. */
  loading?: boolean | undefined;
  /** One line and one action for an empty table. */
  empty?: ReactNode;
  /** Accessible name / visible caption. */
  caption?: ReactNode;
};

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;

/**
 * Table — a register: linen head, hairline rows, a wash on rows that need a
 * person (attention yellow, overdue red). For lists people compare and
 * sort; for browsing use list rows or cards. Six columns at most. On phones
 * each row becomes a card: the first column as the title, the rest one
 * line of metadata.
 */
export function Table<R extends TableRowBase>({
  columns,
  rows,
  onRowClick,
  rowHref,
  sort,
  onSortChange,
  dense = false,
  loading = false,
  empty,
  caption,
  className,
  ...rest
}: TableProps<R>) {
  const pad = dense ? 'px-3 py-[7px]' : 'px-3.5 py-2.5';
  const cell = (r: R, c: TableColumn<R>) => (c.render ? c.render(r) : (r[c.key] as ReactNode));

  return (
    <table className={cn('w-full border-collapse font-sans text-[13px] text-fg', 'max-sm:block', className)} {...rest}>
      {caption && <caption className="pb-2 text-left text-meta font-medium text-fg-secondary max-sm:block">{caption}</caption>}
      <thead className="max-sm:sr-only">
        <tr>
          {columns.map((c) => {
            const active = sort?.key === c.key;
            const next: TableSort = { key: c.key, direction: active && sort?.direction === 'asc' ? 'desc' : 'asc' };
            return (
              <th
                key={c.key}
                scope="col"
                aria-sort={c.sortable ? (active ? ARIA_SORT[sort!.direction] : 'none') : undefined}
                style={c.width !== undefined ? { width: c.width } : undefined}
                className={cn(pad, 'border-b border-rule bg-sunk text-meta font-medium whitespace-nowrap text-fg-secondary', c.align === 'right' ? 'text-right' : 'text-left')}
              >
                {c.sortable && onSortChange ? (
                  <button
                    type="button"
                    onClick={() => onSortChange(next)}
                    className={cn(
                      'inline-flex cursor-pointer items-center gap-1 rounded-xs border-0 bg-transparent p-0 font-[inherit] text-[length:inherit] font-medium outline-none hover:text-fg focus-visible:shadow-(--focus-ring)',
                      active ? 'text-fg' : 'text-fg-secondary',
                      c.align === 'right' && 'flex-row-reverse',
                    )}
                  >
                    {c.label}
                    {active && (sort!.direction === 'asc' ? <ArrowUp size={12} aria-hidden /> : <ArrowDown size={12} aria-hidden />)}
                  </button>
                ) : (
                  c.label
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className="max-sm:flex max-sm:w-full max-sm:flex-col max-sm:gap-2">
        {loading
          ? Array.from({ length: 5 }, (_, i) => (
              <tr key={i} aria-hidden className="max-sm:flex max-sm:w-full max-sm:gap-3">
                {columns.map((c) => (
                  <td key={c.key} className={cn(pad, 'border-b border-rule-soft')}>
                    <span className="block h-3 w-3/4 rounded-xs bg-well motion-safe:animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          : rows.length === 0 && empty
            ? (
                <tr>
                  <td colSpan={columns.length} className="px-3.5 py-6 text-center text-small text-fg-secondary">
                    {empty}
                  </td>
                </tr>
              )
            : rows.map((r) => {
                const wash =
                  r.status === 'attention'
                    ? 'bg-attention-wash ink:bg-yellow-accent/15'
                    : r.status === 'error'
                      ? 'bg-error-wash ink:bg-error/20'
                      : 'hover:bg-hover';
                const clickable = Boolean(onRowClick);
                return (
                  <tr
                    key={r.id}
                    data-status={r.status}
                    onClick={clickable ? () => onRowClick!(r) : undefined}
                    onKeyDown={
                      clickable && !rowHref
                        ? (e: KeyboardEvent<HTMLTableRowElement>) => {
                            if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                              e.preventDefault();
                              onRowClick!(r);
                            }
                          }
                        : undefined
                    }
                    tabIndex={clickable && !rowHref ? 0 : undefined}
                    className={cn(
                      'transition-colors duration-[120ms] ease-standard outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--text-primary)]',
                      wash,
                      clickable && 'cursor-pointer',
                      'max-sm:box-border max-sm:flex max-sm:w-full max-sm:flex-wrap max-sm:gap-x-2 max-sm:rounded-lg max-sm:border max-sm:border-rule max-sm:px-4 max-sm:py-3',
                    )}
                  >
                    {columns.map((c, i) => {
                      const content = cell(r, c);
                      return (
                        <td
                          key={c.key}
                          className={cn(
                            pad,
                            'border-b border-rule-soft align-middle',
                            c.align === 'right' && 'text-right tabular-nums',
                            c.meta && 'text-meta whitespace-nowrap text-fg-secondary tabular-nums',
                            // Phones: title line, then one line of metadata.
                            'max-sm:border-0 max-sm:p-0',
                            i === 0 ? 'max-sm:w-full max-sm:text-ui max-sm:font-medium' : 'max-sm:text-meta max-sm:text-fg-secondary',
                            i > 1 && "max-sm:before:content-['·_']",
                          )}
                        >
                          {i === 0 && rowHref ? (
                            <a
                              href={rowHref(r)}
                              onClick={(e) => e.stopPropagation()}
                              className="rounded-xs text-fg no-underline outline-none hover:underline focus-visible:shadow-(--focus-ring)"
                            >
                              {content}
                            </a>
                          ) : (
                            content
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
      </tbody>
    </table>
  );
}
