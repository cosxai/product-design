import * as Popover from '@radix-ui/react-popover';
import { Search, X } from 'lucide-react';
import { useId, useRef, useState, type KeyboardEvent } from 'react';

import { cn } from '../lib/cn';
import { useField } from './Field';
import { controlFrame, controlInner } from './forms-control';
import { Avatar, DEFAULT_LABELS, ListboxBody, type ListboxLabels, type ListItem } from './inputs-listbox';
import { useDebouncedSearch } from './inputs-search';
import { Spinner } from './Spinner';

export type AsyncSelectProps = {
  /** Look up matches; the signal aborts when newer input arrives. */
  search: (query: string, signal: AbortSignal) => Promise<ListItem[]>;
  value?: ListItem | null | undefined;
  onChange?: ((item: ListItem | null) => void) | undefined;
  /** Offer “Create …” for text that matches nothing exactly. */
  onCreate?: ((query: string) => void | ListItem | Promise<ListItem | void>) | undefined;
  /** @default "Search" */
  placeholder?: string | undefined;
  /** ms. @default 250 */
  debounce?: number | undefined;
  labels?: Partial<ListboxLabels> & { clear?: string | undefined };
  invalid?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Start with this search typed and its results open. */
  defaultQuery?: string | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  id?: string | undefined;
  'aria-label'?: string | undefined;
  className?: string | undefined;
};

/**
 * AsyncSelect — choose one from a large or remote set (a customer, a
 * project). Typing searches after a short pause and drops stale answers;
 * a spinner shows until the answer comes, then results with their meta, a
 * Create row, “nothing matches”, or an error with Retry. The choice
 * becomes a card that clears with ×.
 */
export function AsyncSelect({
  search,
  value,
  onChange,
  onCreate,
  placeholder = 'Search',
  debounce = 250,
  labels: labelsIn,
  invalid,
  disabled,
  defaultQuery = '',
  size,
  id,
  className,
  ...aria
}: AsyncSelectProps) {
  const field = useField();
  const auto = useId();
  const listId = `as${auto}-list`;
  const optionId = (i: number) => `as${auto}-o${i}`;
  const labels = { ...DEFAULT_LABELS, ...labelsIn };
  const [own, setOwn] = useState<ListItem | null>(null);
  const chosen = value === undefined ? own : value;
  const [query, setQuery] = useState(defaultQuery);
  const [open, setOpen] = useState(defaultQuery !== '');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement | null>(null);
  const { status, result, retry } = useDebouncedSearch(query, search, { delay: debounce });
  const items = status === 'done' ? (result ?? []) : [];
  const q = query.trim();
  const canCreate = Boolean(onCreate) && q.length > 0 && !items.some((i) => i.label.toLowerCase() === q.toLowerCase());
  const count = items.length + (canCreate ? 1 : 0);
  const bad = Boolean(invalid || field?.invalid);
  const off = Boolean(disabled || field?.disabled);

  const pick = (item: ListItem | null) => {
    if (value === undefined) setOwn(item);
    onChange?.(item);
    setQuery('');
    setOpen(false);
  };
  const choose = async (i: number) => {
    if (i < items.length) return pick(items[i]!);
    if (i === items.length && canCreate) {
      const made = await onCreate!(q);
      if (made && typeof made === 'object') pick(made);
      else {
        setQuery('');
        setOpen(false);
      }
    }
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(count - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter' && open && count > 0) {
      e.preventDefault();
      void choose(active);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  if (chosen) {
    return (
      <div
        className={cn(
          'flex min-h-[38px] items-center gap-2.5 rounded-md border bg-sunk px-2 py-1.5 font-sans text-ui text-fg',
          bad ? 'border-error' : 'border-rule-soft',
          off && 'bg-well text-fg-secondary',
          className,
        )}
      >
        <Avatar item={chosen} className="size-8 rounded-sm bg-ink text-linen ink:bg-yellow-accent ink:text-ink" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span id={id ?? field?.id} className="truncate font-medium">
            {chosen.label}
          </span>
          {chosen.meta && <span className="truncate text-meta text-fg-secondary">{chosen.meta}</span>}
        </span>
        {!off && (
          <button
            type="button"
            aria-label={`${labelsIn?.clear ?? 'Clear'} ${chosen.label}`}
            onClick={() => {
              pick(null);
              requestAnimationFrame(() => input.current?.focus());
            }}
            className="inline-grid shrink-0 cursor-pointer place-items-center rounded-xs p-0.5 text-fg-secondary outline-none hover:text-fg focus-visible:shadow-(--focus-ring)"
          >
            <X size={13} aria-hidden />
          </button>
        )}
      </div>
    );
  }

  const showList = open && q.length > 0;
  return (
    <Popover.Root open={showList} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
        <div className={cn(controlFrame({ size, invalid: bad, disabled: off }), className)}>
          <Search size={14} aria-hidden className="shrink-0 text-fg-secondary" />
          <input
            ref={input}
            id={id ?? field?.id}
            role="combobox"
            aria-expanded={showList}
            aria-controls={showList ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={showList && status === 'done' && count > 0 ? optionId(active) : undefined}
            aria-invalid={bad || undefined}
            aria-describedby={field?.describedBy}
            aria-label={aria['aria-label']}
            disabled={off}
            value={query}
            placeholder={placeholder}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => q && setOpen(true)}
            onKeyDown={onKey}
            className={controlInner}
          />
          {status === 'searching' && <Spinner size={12} className="text-fg-secondary" />}
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={12}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (e.target instanceof Node && input.current?.parentElement?.contains(e.target)) e.preventDefault();
          }}
          className="rise z-60 rounded-lg border border-rule bg-page p-1 font-sans [--motion-reveal:200ms]"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <ListboxBody
            id={listId}
            optionId={optionId}
            items={items}
            active={active}
            status={status}
            query={q}
            canCreate={canCreate}
            labels={labels}
            onActive={setActive}
            onChoose={(i) => void choose(i)}
            onRetry={retry}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
