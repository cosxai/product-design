import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { useField } from './Field';
import { controlFrame } from './forms-control';

export type SelectOption = {
  value: string;
  label: string;
  /** Right-aligned secondary text: a count, a date — or, on a disabled row, the reason. */
  meta?: string | undefined;
  /** Rows sharing a group label are headed by it, in source order. */
  group?: string | undefined;
  disabled?: boolean | undefined;
};

export type SelectProps = {
  options: Array<string | SelectOption>;
  value?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  /** @default "Choose one" */
  placeholder?: string | undefined;
  /** A filter field at the top of the menu. Defaults to on above 8 options. */
  searchable?: boolean | undefined;
  /** @default "Nothing matches that." */
  emptyText?: string | undefined;
  /** Placeholder of the filter field. @default "Filter" */
  filterPlaceholder?: string | undefined;
  invalid?: boolean | undefined;
  disabled?: boolean | undefined;
  /** 32 · 38 · 44. @default "md" */
  size?: 'sm' | 'md' | 'lg' | undefined;
  /** auto (default): opens upward when below is short and above has more room; top / bottom force it. */
  placement?: 'auto' | 'top' | 'bottom' | undefined;
  /** Start open (uncontrolled). */
  defaultOpen?: boolean | undefined;
  id?: string | undefined;
  name?: string | undefined;
  className?: string | undefined;
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  'aria-describedby'?: string | undefined;
};

const TYPEAHEAD_MS = 600;

function normalise(options: SelectProps['options']): SelectOption[] {
  return options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
}

/**
 * Select — a styled listbox for a fixed set of 3 to 15 (two options: a
 * switch or segment; many or remote: the async search select). The menu
 * renders in a portal so dialogs don't clip it and opens upward when it
 * must. Arrows move, Enter chooses, Esc closes, Home/End jump, a letter
 * jumps to it. The chosen row sits on the brand colour; disabled rows stay
 * visible with their reason. No shadow — paper lifted by its hairline.
 */
export function Select({
  options,
  value,
  onChange,
  placeholder = 'Choose one',
  searchable,
  emptyText = 'Nothing matches that.',
  filterPlaceholder = 'Filter',
  invalid,
  disabled,
  size,
  placement = 'auto',
  defaultOpen = false,
  id,
  name,
  className,
  ...aria
}: SelectProps) {
  const field = useField();
  const auto = useId();
  const listId = `sl${auto}-list`;
  const triggerId = id ?? field?.id ?? `sl${auto}-trigger`;
  const optionId = (i: number) => `sl${auto}-o${i}`;
  const all = useMemo(() => normalise(options), [options]);
  const canSearch = searchable ?? all.length > 8;
  const selected = all.find((o) => o.value === value);
  const bad = Boolean(invalid || field?.invalid);
  const off = Boolean(disabled || field?.disabled);

  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(() => (defaultOpen ? Math.max(0, all.findIndex((o) => o.value === value)) : -1));
  const listRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLInputElement | null>(null);
  const typed = useRef({ text: '', at: 0 });

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? all.filter((o) => `${o.label} ${o.meta ?? ''}`.toLowerCase().includes(q)) : all;
  }, [all, query]);

  const enabled = (i: number) => i >= 0 && i < shown.length && !shown[i]!.disabled;
  const step = (from: number, dir: 1 | -1) => {
    for (let i = from + dir; i >= 0 && i < shown.length; i += dir) if (enabled(i)) return i;
    return from;
  };
  const first = () => step(-1, 1);
  const last = () => step(shown.length, -1);

  // Keep the active row in view.
  useEffect(() => {
    if (!open || active < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`);
    el?.scrollIntoView?.({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open]);

  const openWith = (index?: number) => {
    setQuery('');
    const cur = all.findIndex((o) => o.value === value);
    setActive(index ?? (cur >= 0 && !all[cur]!.disabled ? cur : step(-1, 1)));
    setOpen(true);
  };
  const choose = (i: number) => {
    const o = shown[i];
    if (!o || o.disabled) return;
    onChange?.(o.value);
    setOpen(false);
  };

  /** First-letter jump: repeated keys cycle, fast typing matches a prefix. */
  const typeahead = (key: string, from: number) => {
    const now = Date.now();
    const t = typed.current;
    t.text = now - t.at < TYPEAHEAD_MS ? t.text + key.toLowerCase() : key.toLowerCase();
    t.at = now;
    const cycling = t.text.length > 1 && t.text.split('').every((c) => c === t.text[0]);
    const prefix = cycling ? t.text[0]! : t.text;
    const start = cycling || t.text.length === 1 ? from + 1 : from;
    for (let n = 0; n < shown.length; n++) {
      const i = (start + n) % shown.length;
      if (enabled(i) && shown[i]!.label.toLowerCase().startsWith(prefix)) return i;
    }
    return -1;
  };

  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (off || open) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openWith();
    } else if (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const cur = all.findIndex((o) => o.value === value);
      const hit = typeahead(e.key, cur);
      if (hit >= 0) {
        e.preventDefault();
        openWith(hit);
      }
    }
  };

  const onMenuKey = (e: KeyboardEvent<HTMLElement>) => {
    const inFilter = e.currentTarget === filterRef.current;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => (a < 0 ? first() : step(a, 1)));
        return;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => (a < 0 ? last() : step(a, -1)));
        return;
      case 'Home':
        if (inFilter) return;
        e.preventDefault();
        setActive(first());
        return;
      case 'End':
        if (inFilter) return;
        e.preventDefault();
        setActive(last());
        return;
      case 'Enter':
        e.preventDefault();
        choose(active);
        return;
      case 'Tab':
        setOpen(false);
        return;
      default:
        if (!inFilter && e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
          const hit = typeahead(e.key, active);
          if (hit >= 0) {
            e.preventDefault();
            setActive(hit);
          }
        }
    }
  };

  // Rows in source order, runs of a group wrapped in a labelled group.
  const rows: ReactNode[] = [];
  let i = 0;
  while (i < shown.length) {
    const group = shown[i]!.group;
    const start = i;
    while (i < shown.length && shown[i]!.group === group) i++;
    const items = shown.slice(start, i).map((o, k) => {
      const idx = start + k;
      const on = o.value === value;
      return (
        <div
          key={o.value}
          id={optionId(idx)}
          role="option"
          aria-label={o.meta ? `${o.label}, ${o.meta}` : undefined}
          aria-selected={on}
          aria-disabled={o.disabled || undefined}
          data-active={idx === active || undefined}
          onMouseMove={() => enabled(idx) && idx !== active && setActive(idx)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => choose(idx)}
          className={cn(
            'flex items-center gap-2 rounded-md px-2.5 py-2 text-[13px] leading-[1.35] text-fg transition-colors duration-[120ms] ease-standard',
            o.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
            on ? 'bg-brand-field font-medium text-ink' : idx === active && 'bg-hover',
          )}
        >
          <span className="min-w-0 flex-1 truncate">{o.label}</span>
          {o.meta && <span className={cn('shrink-0 text-meta tabular-nums', on ? 'text-fg-on-yellow-secondary' : 'text-fg-secondary')}>{o.meta}</span>}
          {on && <Check size={13} strokeWidth={2} aria-hidden className="shrink-0" />}
        </div>
      );
    });
    if (group) {
      const gid = `sl${auto}-g${start}`;
      rows.push(
        <div key={gid} role="group" aria-labelledby={gid}>
          <div id={gid} className="px-2.5 pt-2 pb-1 text-meta font-medium text-fg-secondary">
            {group}
          </div>
          {items}
        </div>,
      );
    } else rows.push(...items);
  }

  return (
    <Popover.Root open={open} onOpenChange={(o) => (o ? openWith() : setOpen(false))}>
      <Popover.Trigger asChild disabled={off}>
        <button
          type="button"
          id={triggerId}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listId : undefined}
          aria-invalid={bad || undefined}
          aria-label={aria['aria-label']}
          aria-labelledby={aria['aria-labelledby']}
          aria-describedby={cn(aria['aria-describedby'], field?.describedBy) || undefined}
          disabled={off}
          onKeyDown={onTriggerKey}
          className={cn(
            controlFrame({ size, invalid: bad, disabled: off }),
            'cursor-pointer text-left outline-none focus-visible:border-fg focus-visible:shadow-(--focus-ring) disabled:cursor-not-allowed',
            open && !bad && 'border-fg shadow-(--focus-ring)',
            className,
          )}
        >
          <span className={cn('min-w-0 flex-1 truncate', !selected && 'text-fg-secondary')}>{selected ? selected.label : placeholder}</span>
          {selected?.meta && <span className="shrink-0 text-meta text-fg-secondary">{selected.meta}</span>}
          <ChevronDown
            size={14}
            aria-hidden
            className={cn('shrink-0 text-fg-secondary transition-transform duration-[320ms] ease-out', open && 'rotate-180')}
          />
        </button>
      </Popover.Trigger>
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      <Popover.Portal>
        <Popover.Content
          side={placement === 'top' ? 'top' : 'bottom'}
          align="start"
          sideOffset={6}
          {...(aria['aria-labelledby'] ?? field?.labelId
            ? { 'aria-labelledby': aria['aria-labelledby'] ?? field?.labelId }
            : { 'aria-label': aria['aria-label'] ?? placeholder })}
          collisionPadding={12}
          avoidCollisions={placement === 'auto'}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            (canSearch ? filterRef.current : listRef.current)?.focus();
          }}
          className="rise z-60 flex flex-col overflow-hidden rounded-lg border border-rule bg-page p-1 font-sans text-fg [--motion-reveal:200ms]"
          style={{
            minWidth: 'var(--radix-popover-trigger-width)',
            maxHeight: 'min(280px, calc(var(--radix-popover-content-available-height) - 12px))',
          }}
        >
          {canSearch && (
            <div className="mb-1 flex shrink-0 items-center gap-[7px] border-b border-rule-soft px-2 pt-[5px] pb-2">
              <Search size={13} aria-hidden className="shrink-0 text-fg-secondary" />
              <input
                ref={filterRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(-1);
                }}
                onKeyDown={onMenuKey}
                placeholder={filterPlaceholder}
                aria-label={filterPlaceholder}
                aria-controls={listId}
                aria-activedescendant={active >= 0 ? optionId(active) : undefined}
                aria-autocomplete="list"
                role="combobox"
                aria-expanded
                className="min-w-0 flex-1 border-none bg-transparent p-0 font-sans text-[13px] text-fg outline-none placeholder:text-fg-secondary"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear"
                  onClick={() => {
                    setQuery('');
                    filterRef.current?.focus();
                  }}
                  className="inline-grid cursor-pointer place-items-center rounded-xs p-0.5 text-fg-secondary outline-none hover:text-fg focus-visible:shadow-(--focus-ring)"
                >
                  <X size={12} aria-hidden />
                </button>
              )}
            </div>
          )}
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={canSearch ? undefined : -1}
            aria-activedescendant={!canSearch && active >= 0 ? optionId(active) : undefined}
            onKeyDown={canSearch ? undefined : onMenuKey}
            className="min-h-0 flex-1 overflow-y-auto outline-none"
          >
            {shown.length === 0 ? <div className="px-2.5 pt-2.5 pb-3 text-[12.5px] text-fg-secondary">{emptyText}</div> : rows}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
