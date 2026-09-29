import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { useField } from './Field';
import { controlFrame, controlInner } from './forms-control';
import { useDebouncedSearch } from './inputs-search';
import { Spinner } from './Spinner';

export type SearchFieldProps = Omit<ComponentProps<'input'>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'type'> & {
  value?: string | undefined;
  defaultValue?: string | undefined;
  /** Every keystroke (the field is controlled or not). */
  onChange?: ((value: string) => void) | undefined;
  /**
   * Runs after the debounce with an AbortSignal that fires when newer input
   * arrives. Resolve with the result count to show it (14 results); a late
   * answer to an older query is ignored.
   */
  onSearch?: ((query: string, signal: AbortSignal) => Promise<number | void>) | undefined;
  /** ms. @default 250 */
  debounce?: number | undefined;
  /** Focus with / or ⌘K / Ctrl+K. One field per page. */
  shortcut?: boolean | undefined;
  /** The count line. @default (n) => `${n} results` */
  formatCount?: ((count: number) => ReactNode) | undefined;
  /** Accessible name of the clear button. @default "Clear search" */
  clearLabel?: string | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
};

function isTyping(el: EventTarget | null): boolean {
  const e = el as HTMLElement | null;
  return Boolean(e && (e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName)));
}

/**
 * SearchField — search with the debounce built in, so pages stop writing
 * their own. Four states: empty (with the / hint when it has a shortcut),
 * searching (a spinner — never "No results" before the answer), a result
 * count, and cleared. New input cancels the request in flight.
 */
export function SearchField({
  value,
  defaultValue = '',
  onChange,
  onSearch,
  debounce = 250,
  shortcut = false,
  formatCount = (n) => (n === 1 ? '1 result' : `${n} results`),
  clearLabel = 'Clear search',
  size,
  placeholder = 'Search',
  className,
  id,
  ref,
  ...rest
}: SearchFieldProps) {
  const field = useField();
  const [own, setOwn] = useState(defaultValue);
  const text = value ?? own;
  const inner = useRef<HTMLInputElement | null>(null);
  const { status, result } = useDebouncedSearch(text, onSearch, { delay: debounce });

  const set = (v: string) => {
    if (value === undefined) setOwn(v);
    onChange?.(v);
  };

  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((k === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isTyping(e.target) && !e.metaKey && !e.ctrlKey)) {
        e.preventDefault();
        inner.current?.focus();
        inner.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shortcut]);

  const off = Boolean(rest.disabled || field?.disabled);
  const count = status === 'done' && typeof result === 'number' ? result : null;

  return (
    <div role="search" className={cn(controlFrame({ size, disabled: off, invalid: Boolean(field?.invalid) }), className)}>
      <Search size={14} aria-hidden className="shrink-0 text-fg-secondary" />
      <input
        {...rest}
        ref={(el) => {
          inner.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        id={id ?? field?.id}
        type="search"
        value={text}
        placeholder={placeholder}
        disabled={off}
        aria-describedby={cn(rest['aria-describedby'], field?.describedBy) || undefined}
        onChange={(e) => set(e.target.value)}
        onKeyDown={(e) => {
          rest.onKeyDown?.(e);
          if (e.key === 'Escape' && text) {
            e.preventDefault();
            set('');
          }
        }}
        className={cn(controlInner, '[&::-webkit-search-cancel-button]:hidden')}
      />
      <span aria-live="polite" className="flex shrink-0 items-center gap-2 text-meta whitespace-nowrap text-fg-secondary tabular-nums">
        {status === 'searching' ? <Spinner label="Searching" size={12} /> : count !== null ? formatCount(count) : null}
      </span>
      {text ? (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => {
            set('');
            inner.current?.focus();
          }}
          className="inline-grid shrink-0 cursor-pointer place-items-center rounded-xs p-0.5 text-fg-secondary outline-none hover:text-fg focus-visible:shadow-(--focus-ring)"
        >
          <X size={13} aria-hidden />
        </button>
      ) : (
        shortcut && (
          <kbd aria-hidden className="shrink-0 rounded-xs border border-rule px-1.5 font-sans text-[11px] leading-[18px] text-fg-secondary">
            /
          </kbd>
        )
      )}
    </div>
  );
}
