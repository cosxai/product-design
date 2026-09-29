import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Spinner } from './Spinner';

export type VirtualListProps<T> = {
  items: readonly T[];
  /** Estimated row height in px (rows may differ; they are measured). @default 42 */
  estimateSize?: number | undefined;
  renderItem: (item: T, index: number) => ReactNode;
  getKey?: ((item: T, index: number) => string | number) | undefined;
  /** Rows rendered beyond the viewport. @default 8 */
  overscan?: number | undefined;
  /** The scroll box's height (the list scrolls inside it). */
  height: number | string;
  /** Accessible name of the list. */
  label: string;
  className?: string | undefined;
  /** Rendered after the last row: an InfiniteLoader. */
  footer?: ReactNode;
};

/**
 * VirtualList — renders only the visible rows of a long list (thousands of
 * items), measuring each as it appears. The rows are list items.
 */
export function VirtualList<T>({ items, estimateSize = 42, renderItem, getKey, overscan = 8, height, label, className, footer }: VirtualListProps<T>) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const v = useVirtualizer({
    count: items.length,
    getScrollElement: () => scroller.current,
    estimateSize: () => estimateSize,
    overscan,
    ...(getKey ? { getItemKey: (i: number) => getKey(items[i]!, i) } : {}),
  });
  return (
    <div ref={scroller} className={cn('overflow-auto', className)} style={{ height }}>
      <ul aria-label={label} className="relative m-0 list-none p-0" style={{ height: v.getTotalSize() }}>
        {v.getVirtualItems().map((row) => (
          <li
            key={row.key}
            data-index={row.index}
            ref={v.measureElement}
            className="absolute top-0 left-0 w-full"
            style={{ transform: `translateY(${row.start}px)` } satisfies CSSProperties}
          >
            {renderItem(items[row.index]!, row.index)}
          </li>
        ))}
      </ul>
      {footer}
    </div>
  );
}

export type InfiniteLoaderProps = {
  /** Called when the sentinel comes within `margin` of the viewport. */
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean | undefined;
  /** How early to load: the spec asks for 200px before the end. @default 200 */
  margin?: number | undefined;
  /** Read out while loading. @default "Loading more" */
  loadingLabel?: string | undefined;
  className?: string | undefined;
};

/** InfiniteLoader — a sentinel at the end of a list that asks for the next
 *  page 200px before it comes into view. */
export function InfiniteLoader({ onLoadMore, hasMore, loading = false, margin = 200, loadingLabel = 'Loading more', className }: InfiniteLoaderProps) {
  const el = useRef<HTMLDivElement | null>(null);
  const latest = useRef(onLoadMore);
  latest.current = onLoadMore;

  useEffect(() => {
    const node = el.current;
    if (!node || !hasMore || loading || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && latest.current(), { rootMargin: `0px 0px ${margin}px 0px` });
    io.observe(node);
    return () => io.disconnect();
  }, [hasMore, loading, margin]);

  if (!hasMore && !loading) return null;
  return (
    <div ref={el} className={cn('flex h-10 items-center justify-center text-fg-secondary', className)}>
      {loading && <Spinner label={loadingLabel} />}
    </div>
  );
}
