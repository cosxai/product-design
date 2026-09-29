import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';

export type PageHeaderFigure = { value: ReactNode; label: ReactNode };

export type PageHeaderProps = Omit<ComponentProps<'header'>, 'title'> & {
  /** "Project · Series A" */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Beside the title: a Badge. */
  status?: ReactNode;
  /** A note line under the title: sync state, counts ("Syncing · 6,831 items"). */
  note?: ReactNode;
  /** A brand dot before the note (background work running). */
  noteDot?: boolean | undefined;
  /** Stat figures; hidden on phones. */
  figures?: PageHeaderFigure[] | undefined;
  /** Right-hand actions. */
  actions?: ReactNode;
  /** Heading level of the title. @default 1 */
  level?: 1 | 2 | 3 | undefined;
};

/**
 * PageHeader — the "seven in one" header card: eyebrow, title, status, a
 * note line, figures (hidden on phones) and actions. Every part is optional
 * but the title.
 */
export function PageHeader({ eyebrow, title, status, note, noteDot = false, figures, actions, level = 1, className, ...rest }: PageHeaderProps) {
  const H = `h${level}` as const;
  return (
    <header className={cn('flex flex-col gap-4 rounded-lg bg-sunk p-5 text-fg', className)} {...rest}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          {eyebrow && <div className="text-meta font-medium text-fg-secondary">{eyebrow}</div>}
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <H className="m-0 truncate text-title leading-tight font-medium tracking-heading">{title}</H>
            {status}
          </div>
          {note && (
            <div className="flex items-center gap-2 text-meta text-fg-secondary">
              {noteDot && <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-brand-mark" />}
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {figures && figures.length > 0 && (
        <dl className="m-0 hidden flex-wrap gap-x-8 gap-y-3 sm:flex">
          {figures.map((f, i) => (
            <div key={i} className="flex flex-col-reverse">
              <dt className="text-meta text-fg-secondary">{f.label}</dt>
              <dd className="m-0 text-title leading-tight font-medium tabular-nums">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}
