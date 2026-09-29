import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, FileText, Star, type LucideIcon } from 'lucide-react';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Badge, type BadgeStatus } from './Badge';

/** The shared column layout of a file list: [tick] icon · name · state · updated · [actions]. */
const GRID = 'grid grid-cols-[20px_minmax(0,1fr)_minmax(96px,120px)_minmax(96px,160px)_32px] items-center gap-x-3';
const GRID_SELECTABLE = 'grid grid-cols-[20px_20px_minmax(0,1fr)_minmax(96px,120px)_minmax(96px,160px)_32px] items-center gap-x-3';

export type FileListProps = ComponentProps<'div'> & {
  /** Column headings: name, state, updated. Omit for a headless list. */
  columns?: { name: ReactNode; state: ReactNode; updated: ReactNode } | undefined;
  /** Leave room for the tick column. */
  selectable?: boolean | undefined;
  /** Accessible name of the list. */
  label: string;
};

/** FileList — the row container: optional headings, then FileRows. */
export function FileList({ columns, selectable = false, label, className, children, ...rest }: FileListProps) {
  return (
    <div className={cn('flex flex-col', className)} {...rest}>
      {columns && (
        <div aria-hidden className={cn(selectable ? GRID_SELECTABLE : GRID, 'border-b border-rule px-3 pb-2 text-meta font-medium text-fg-secondary')}>
          {selectable && <span />}
          <span />
          <span>{columns.name}</span>
          <span>{columns.state}</span>
          <span>{columns.updated}</span>
          <span />
        </div>
      )}
      <ul aria-label={label} className="m-0 flex list-none flex-col p-0">
        {children}
      </ul>
    </div>
  );
}

export type FileRowProps = Omit<ComponentProps<'li'>, 'title' | 'onClick'> & {
  name: ReactNode;
  icon?: LucideIcon | undefined;
  statusLabel?: ReactNode;
  status?: BadgeStatus | undefined;
  /** "2 hours ago" — or, in search results, the location: "in Legal / 2026". */
  updated?: ReactNode;
  /** A wash for rows that need someone (attention) or are overdue (error). */
  tone?: 'attention' | 'error' | undefined;
  /** Match the FileList's selectable. */
  selectable?: boolean | undefined;
  selected?: boolean | undefined;
  selectionMode?: boolean | undefined;
  onSelectedChange?: ((selected: boolean) => void) | undefined;
  /** @default "Select" */
  selectLabel?: string | undefined;
  starred?: boolean | undefined;
  onStarredChange?: ((starred: boolean) => void) | undefined;
  /** @default "Star" */
  starLabel?: string | undefined;
  onOpen?: (() => void) | undefined;
  /** Every press with its modifiers — wire useSelection.handleClick; replaces the default open / toggle. */
  onPress?: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;
};

/**
 * FileRow — a list row: icon, name, state, updated or location, a star on
 * hover. Like FileCard, the name is the one button stretched over the row;
 * the tick box and the star sit above it and never open the row.
 */
export function FileRow({
  name,
  icon: Glyph = FileText,
  statusLabel,
  status,
  updated,
  tone,
  selectable = false,
  selected = false,
  selectionMode = false,
  onSelectedChange,
  selectLabel = 'Select',
  starred,
  onStarredChange,
  starLabel = 'Star',
  onOpen,
  onPress,
  className,
  ...rest
}: FileRowProps) {
  const press = (e: MouseEvent<HTMLButtonElement>) => {
    if (onPress) onPress(e);
    else if (selectionMode) onSelectedChange?.(!selected);
    else onOpen?.();
  };
  return (
    <li
      data-selected={selected || undefined}
      className={cn(
        selectable ? GRID_SELECTABLE : GRID,
        'group relative min-h-[42px] border-b border-rule-soft px-3 py-2 text-ui text-fg',
        selected
          ? 'bg-brand-field text-ink'
          : tone === 'attention'
            ? 'bg-yellow-wash-32 ink:bg-yellow-accent/15'
            : tone === 'error'
              ? 'bg-error-wash ink:bg-error/20'
              : 'hover:bg-hover',
        className,
      )}
      {...rest}
    >
      {selectable && (
        <CheckboxPrimitive.Root
          checked={selected}
          onCheckedChange={(v) => onSelectedChange?.(v === true)}
          aria-label={selectLabel}
          className={cn(
            'relative z-10 grid size-4 cursor-pointer place-items-center rounded-xs border border-rule bg-page outline-none',
            'data-[state=checked]:border-fg data-[state=checked]:bg-fg data-[state=checked]:text-page focus-visible:shadow-(--focus-ring)',
            selectionMode || selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
          )}
        >
          <CheckboxPrimitive.Indicator>
            <Check size={12} strokeWidth={2.5} aria-hidden />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      )}
      <Glyph size={16} strokeWidth={1.75} aria-hidden className="text-fg" />
      <button
        type="button"
        onClick={press}
        aria-pressed={selectionMode ? selected : undefined}
        className="min-w-0 cursor-pointer truncate text-left outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:shadow-(--focus-ring)"
      >
        {name}
      </button>
      <span className="min-w-0">{statusLabel ? <Badge status={status}>{statusLabel}</Badge> : null}</span>
      <span className={cn('min-w-0 truncate text-small', selected ? 'text-fg-on-yellow-secondary' : 'text-fg-secondary')}>{updated}</span>
      <span className="flex justify-end">
        {onStarredChange && (
          <button
            type="button"
            aria-label={starLabel}
            aria-pressed={Boolean(starred)}
            onClick={() => onStarredChange(!starred)}
            className={cn(
              'relative z-10 grid size-7 cursor-pointer place-items-center rounded-md outline-none hover:bg-hover focus-visible:shadow-(--focus-ring)',
              starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
            )}
          >
            <Star size={15} strokeWidth={1.75} aria-hidden className={starred ? 'fill-brand-mark' : undefined} />
          </button>
        )}
      </span>
    </li>
  );
}
