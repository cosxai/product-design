import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Spinner } from './Spinner';

export type CommandItem = {
  id: string;
  title: ReactNode;
  /** Where it lives: "Series A / Legal". */
  subtitle?: ReactNode;
  /** Right-aligned: a page ("p. 14"), a shortcut. */
  meta?: ReactNode;
  /** A line of matched text (full-text results). */
  excerpt?: ReactNode;
  icon?: ReactNode;
  onSelect: () => void;
};

export type CommandSource = {
  id: string;
  /** Section heading: "Documents · titles", "Full text". */
  label: string;
  /** Results for the query. Aborted when the query changes. Throwing marks the source failed (it stops counting as pending). */
  search: (query: string, signal: AbortSignal) => Promise<CommandItem[]>;
  /** Characters needed before it runs. @default 1 */
  minQuery?: number | undefined;
};

export type CommandPaletteLabels = {
  /** @default "Search or run an action" */
  placeholder?: string;
  /** @default (q) => `Nothing matches “${q}”.` */
  empty?: (query: string) => ReactNode;
  /** Heading hint while a slower source has not returned. @default "arriving" */
  arriving?: string;
  /** @default "Actions" */
  actions?: string;
  /** Accessible name of the palette. @default "Command palette" */
  title?: string;
};

export type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Searched in parallel; each section appears as its source returns, in this order. */
  sources: CommandSource[];
  /** Actions for the query ("Ask the Agent about “cap table”"), always listed after the results. */
  actions?: ((query: string) => CommandItem[]) | undefined;
  labels?: CommandPaletteLabels | undefined;
  /** ms after typing before sources run. @default 150 */
  debounce?: number | undefined;
};

const GROUP = '[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-meta [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-fg-secondary';

type SourceState = { status: 'pending' | 'done' | 'failed'; items: CommandItem[] };

/**
 * CommandPalette — ⌘K. Fast sources (titles) show at once, slower ones
 * (full text with page and excerpt) fill in below; a spinner shows while
 * any is out, and "nothing matches" only once every source has returned.
 * Arrows, Enter, Esc (cmdk + Radix Dialog). Pair with useCommandPaletteHotkey.
 */
export function CommandPalette({ open, onOpenChange, sources, actions, labels = {}, debounce = 150 }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Record<string, SourceState>>({});
  // The highlighted row. Follows the first result as sections arrive,
  // until the person moves with the arrows.
  const [selected, setSelected] = useState('');
  const moved = useRef(false);
  const sourcesRef = useRef(sources);
  sourcesRef.current = sources;

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults({});
    }
  }, [open]);
  useEffect(() => {
    moved.current = false;
  }, [query]);

  useEffect(() => {
    const q = query.trim();
    const active = sourcesRef.current.filter((s) => q.length >= (s.minQuery ?? 1));
    if (!q || active.length === 0) {
      setResults({});
      return;
    }
    setResults(Object.fromEntries(active.map((s) => [s.id, { status: 'pending', items: [] } satisfies SourceState])));
    const controller = new AbortController();
    const timer = setTimeout(() => {
      for (const s of active) {
        s.search(q, controller.signal).then(
          (items) => !controller.signal.aborted && setResults((r) => ({ ...r, [s.id]: { status: 'done', items } })),
          () => !controller.signal.aborted && setResults((r) => ({ ...r, [s.id]: { status: 'failed', items: [] } })),
        );
      }
    }, debounce);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, debounce]);

  const q = query.trim();
  const states = Object.values(results);
  const pending = states.some((s) => s.status === 'pending');
  const found = states.some((s) => s.items.length > 0);
  const actionItems = q && actions ? actions(q) : [];
  const order = [
    ...sourcesRef.current.flatMap((s) => (results[s.id]?.items ?? []).map((i) => `${s.id}:${i.id}`)),
    ...actionItems.map((i) => `action:${i.id}`),
  ];
  const first = order[0] ?? '';
  useEffect(() => {
    if (!moved.current) setSelected(first);
  }, [first]);
  const run = (item: CommandItem) => {
    onOpenChange(false);
    item.onSelect();
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-scrim" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed top-[12vh] left-1/2 z-50 w-[calc(100%-32px)] max-w-[640px] -translate-x-1/2 overflow-hidden rounded-lg border border-rule bg-page font-sans text-fg outline-none"
        >
          <DialogPrimitive.Title className="sr-only">{labels.title ?? 'Command palette'}</DialogPrimitive.Title>
          <Command
            shouldFilter={false}
            loop
            label={labels.title ?? 'Command palette'}
            value={selected}
            onValueChange={setSelected}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') moved.current = true;
            }}
          >
            <div className="flex items-center gap-2.5 border-b border-rule px-4">
              <Search size={16} aria-hidden className="shrink-0 text-fg-secondary" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder={labels.placeholder ?? 'Search or run an action'}
                className="h-12 min-w-0 flex-1 border-0 bg-transparent font-sans text-[15px] text-fg outline-none placeholder:text-fg-secondary"
              />
              {pending && <Spinner label="Searching" className="text-fg-secondary" />}
            </div>
            <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto p-1.5">
              {sourcesRef.current.map((s) => {
                const st = results[s.id];
                if (!st || (st.status !== 'pending' && st.items.length === 0)) return null;
                return (
                  <Command.Group
                    key={s.id}
                    className={GROUP}
                    heading={
                      <span className="flex items-center gap-1.5">
                        {s.label}
                        {st.status === 'pending' && <span className="font-normal">· {labels.arriving ?? 'arriving'}</span>}
                      </span>
                    }
                  >
                    {st.items.map((item) => (
                      <PaletteItem key={`${s.id}:${item.id}`} value={`${s.id}:${item.id}`} item={item} onRun={run} />
                    ))}
                  </Command.Group>
                );
              })}
              {q && !pending && !found && (
                <div role="status" className="px-3 py-3 text-ui text-fg-secondary">
                  {labels.empty ? labels.empty(q) : `Nothing matches “${q}”.`}
                </div>
              )}
              {actionItems.length > 0 && (
                <Command.Group className={GROUP} heading={labels.actions ?? 'Actions'}>
                  {actionItems.map((item) => (
                    <PaletteItem key={`action:${item.id}`} value={`action:${item.id}`} item={item} onRun={run} />
                  ))}
                </Command.Group>
              )}
            </Command.List>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function PaletteItem({ item, value, onRun }: { item: CommandItem; value: string; onRun: (item: CommandItem) => void }) {
  return (
    <Command.Item
      value={value}
      onSelect={() => onRun(item)}
      className={cn('flex cursor-pointer items-start gap-2.5 rounded-md px-3 py-2 outline-none', 'data-[selected=true]:bg-hover')}
    >
      {item.icon && <span className="mt-0.5 grid size-4 shrink-0 place-items-center text-fg-secondary">{item.icon}</span>}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-ui">{item.title}</span>
        {item.subtitle && <span className="truncate text-meta text-fg-secondary">{item.subtitle}</span>}
        {item.excerpt && <span className="line-clamp-2 text-small text-fg-secondary">{item.excerpt}</span>}
      </span>
      {item.meta && <span className="mt-0.5 shrink-0 text-meta text-fg-secondary tabular-nums">{item.meta}</span>}
    </Command.Item>
  );
}

/** ⌘K / Ctrl+K toggles the palette (also from inside inputs). */
export function useCommandPaletteHotkey(setOpen: (update: (open: boolean) => boolean) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setOpen]);
}
