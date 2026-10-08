import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';

export type BreadcrumbItem = {
  label: ReactNode;
  /** A link; or use onSelect for in-app navigation. */
  href?: string | undefined;
  onSelect?: (() => void) | undefined;
  /** A trailing tag on the current page: its format (PDF). */
  tag?: ReactNode;
};

export type BreadcrumbProps = Omit<ComponentProps<'nav'>, 'children'> & {
  items: BreadcrumbItem[];
  /** What starts the trail — the workspace brand (on a customer domain it replaces the platform name). */
  root?: ReactNode;
  /** Beyond this many segments the middle folds into a menu. @default 4 */
  max?: number | undefined;
  /** @default "Breadcrumb" */
  label?: string | undefined;
  /** Accessible name of the fold button. @default "Show hidden folders" */
  foldLabel?: string | undefined;
  /** A line under the trail: the current item's status. */
  status?: ReactNode;
};

const linkClass = 'cursor-pointer text-fg-secondary outline-none hover:text-fg focus-visible:shadow-(--focus-ring) rounded-xs';

function Crumb({ item }: { item: BreadcrumbItem }) {
  if (item.href)
    return (
      <a href={item.href} onClick={item.onSelect} className={linkClass}>
        {item.label}
      </a>
    );
  if (item.onSelect)
    return (
      <button type="button" onClick={item.onSelect} className={linkClass}>
        {item.label}
      </button>
    );
  return <span className="text-fg-secondary">{item.label}</span>;
}

const Sep = () => (
  <span aria-hidden className="text-fg-secondary">
    /
  </span>
);

/**
 * Breadcrumb — where this page sits. The current page is the last segment
 * and not a link; beyond four segments the middle folds into a menu. On a
 * customer domain the trail starts at the workspace brand (root).
 */
export function Breadcrumb({ items, root, max = 4, label = 'Breadcrumb', foldLabel = 'Show hidden folders', status, className, ...rest }: BreadcrumbProps) {
  const last = items[items.length - 1];
  const before = items.slice(0, -1);
  const total = items.length + (root ? 1 : 0);
  const fold = total > max && before.length > 1;
  // Folded: [root or the first ancestor] / … / parent / current.
  const head = fold ? (root ? [] : before.slice(0, 1)) : before;
  const folded = fold ? before.slice(root ? 0 : 1, -1) : [];
  const tail = fold ? before.slice(-1) : [];
  const segment = 'flex items-center gap-2';

  return (
    <nav aria-label={label} className={cn('flex flex-col gap-1.5', className)} {...rest}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 text-ui">
        {root && (
          <li className={segment}>
            {root}
            {items.length > 0 && <Sep />}
          </li>
        )}
        {head.map((it, i) => (
          <li key={`h${i}`} className={segment}>
            <Crumb item={it} />
            <Sep />
          </li>
        ))}
        {folded.length > 0 && (
          <li className={segment}>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                aria-label={foldLabel}
                className="inline-grid h-6 min-w-6 cursor-pointer place-items-center rounded-sm bg-sunk px-1.5 text-meta font-semibold text-fg outline-none hover:bg-well focus-visible:shadow-(--focus-ring)"
              >
                …
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="start" sideOffset={6} className="z-50 min-w-[180px] rounded-lg border border-rule bg-page p-1.5 text-ui text-fg">
                  {folded.map((it, i) => (
                    <DropdownMenu.Item
                      key={i}
                      onSelect={() => {
                        if (it.href) window.location.assign(it.href);
                        else it.onSelect?.();
                      }}
                      className="flex h-8 cursor-pointer items-center rounded-md px-2.5 outline-none data-[highlighted]:bg-hover"
                    >
                      {it.label}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <Sep />
          </li>
        )}
        {tail.map((it, i) => (
          <li key={`t${i}`} className={segment}>
            <Crumb item={it} />
            <Sep />
          </li>
        ))}
        {last && (
          <li aria-current="page" className="flex items-center gap-2 font-medium text-fg">
            {last.label}
            {last.tag && <span className="rounded-sm bg-sunk px-1.5 py-0.5 text-[11px] font-semibold text-fg">{last.tag}</span>}
          </li>
        )}
      </ol>
      {status && <div className="text-meta text-fg-secondary">{status}</div>}
    </nav>
  );
}
