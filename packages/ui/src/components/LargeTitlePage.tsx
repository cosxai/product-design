import { forwardRef, useState, type ComponentProps, type ReactNode, type UIEvent } from 'react';
import { cn } from '../lib/cn';

export type LargeTitlePageProps = Omit<ComponentProps<'div'>, 'title' | 'children'> & {
  /** The page's name: large at the top, small in the bar once scrolled. */
  title: ReactNode;
  /** A line over the large title: the workspace's name. */
  eyebrow?: ReactNode | undefined;
  /** The bar's left: a back button. */
  leading?: ReactNode | undefined;
  /** The bar's right: icon buttons (search, new). */
  actions?: ReactNode | undefined;
  /** Held under the bar while the list scrolls: segments, chips. Given whether the title has collapsed. */
  pinned?: ReactNode | ((collapsed: boolean) => ReactNode) | undefined;
  /** How far the content scrolls before the title collapses into the bar. @default 30 */
  threshold?: number | undefined;
  /** Classes for the scrolling area (bottom padding for a floating bar). */
  scrollClassName?: string | undefined;
  children: ReactNode;
};

/**
 * LargeTitlePage — a phone page with the native large title: the title sits large at the
 * top-left under its eyebrow, scrolls away with the content, and past `threshold` a small
 * copy fades in, centred, in the bar above (Motion & Native Feel §09).
 *
 * Why: every phone module page (Chat, Tasks, Documents, Clients…) wears one title, the same
 * size and behaviour. Compose with BottomTabs (below it), SegmentedControl or chips in `pinned`,
 * IconButton in `actions`.
 *
 * The bar is solid and `position: sticky`: Safari on iOS 26 blurs whatever runs under the
 * top edge of the screen unless a fixed or sticky bar is there, whose colour it then extends.
 * Keep the page's own shell free of translucency too.
 *
 * Forwards ref to the scrolling element.
 */
export const LargeTitlePage = forwardRef<HTMLDivElement, LargeTitlePageProps>(function LargeTitlePage(
  { title, eyebrow, leading, actions, pinned, threshold = 30, scrollClassName, className, onScroll, children, ...rest },
  ref,
) {
  const [collapsed, setCollapsed] = useState(false);
  const scrolled = (e: UIEvent<HTMLDivElement>) => {
    const next = e.currentTarget.scrollTop > threshold;
    setCollapsed((was) => (was === next ? was : next));
  };
  return (
    <div className={cn('flex min-h-0 min-w-0 flex-1 flex-col bg-page text-fg', className)} {...rest}>
      <div
        className={cn(
          'sticky top-0 z-20 grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center bg-page px-1.5 transition-shadow duration-(--motion-fade)',
          collapsed ? 'shadow-[0_1px_0_var(--rule-soft)]' : 'shadow-none',
        )}
      >
        <div className="flex min-w-0 items-center justify-start">{leading}</div>
        <span aria-hidden={!collapsed} className={cn('max-w-[60vw] truncate text-[16px] font-medium transition-opacity duration-(--motion-fade)', collapsed ? 'opacity-100' : 'opacity-0')}>
          {title}
        </span>
        <div className="flex min-w-0 items-center justify-end gap-0.5">{actions}</div>
      </div>
      <div
        ref={ref}
        onScroll={(e) => {
          scrolled(e);
          onScroll?.(e);
        }}
        className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain', scrollClassName)}
      >
        <div className="flex flex-col px-5 pb-2.5 leading-tight">
          {eyebrow && <span className="truncate text-meta text-fg-secondary">{eyebrow}</span>}
          <h1 className="m-0 text-[28px] font-medium tracking-[-0.015em]">{title}</h1>
        </div>
        {pinned && <div className="sticky top-0 z-10 bg-page">{typeof pinned === 'function' ? pinned(collapsed) : pinned}</div>}
        {children}
      </div>
    </div>
  );
});
