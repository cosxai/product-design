import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';

export type ActivityEvent = {
  id: string;
  /** Who did it. Initials default from the name (first letters of up to two words; a single CJK name → its first character). */
  actor: { name: string; initials?: string | undefined };
  /** What they did, without the name: "viewed Cap table.xlsx for 6 min". */
  action: ReactNode;
  /** Shown time ("14:02"); `dateTime` makes it a <time>. */
  time: ReactNode;
  dateTime?: string | undefined;
  /** Extra detail after the time: "pages 2–4 most". */
  detail?: ReactNode;
};

export type ActivityGroup = { label: ReactNode; events: ActivityEvent[] };

export type ActivityTimelineProps = Omit<ComponentProps<'section'>, 'children'> & {
  /** Grouped by time, newest first: Today, Yesterday, then dates. */
  groups: ActivityGroup[];
  /** Above the groups: the scope switch ("This share / Whole chain"). */
  scope?: ReactNode;
  /** Heading level of the group labels. @default 3 */
  level?: 2 | 3 | 4 | undefined;
  /** When there is nothing yet. */
  empty?: ReactNode;
};

export function initialsOf(name: string): string {
  const t = name.trim();
  if (!t) return '?';
  if (/[㐀-鿿]/.test(t[0]!)) return t[0]!;
  return t
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

/** ActivityTimeline — who did what, grouped by time. */
export function ActivityTimeline({ groups, scope, level = 3, empty, className, ...rest }: ActivityTimelineProps) {
  const H = `h${level}` as const;
  const any = groups.some((g) => g.events.length > 0);
  return (
    <section className={cn('flex flex-col gap-3', className)} {...rest}>
      {scope}
      {!any && empty}
      {groups
        .filter((g) => g.events.length > 0)
        .map((g, gi) => (
          <div key={gi} className="flex flex-col gap-2">
            <H className="m-0 text-meta font-medium text-fg-secondary">{g.label}</H>
            <ol className="m-0 flex list-none flex-col gap-3 p-0">
              {g.events.map((e) => (
                <li key={e.id} className="flex gap-2.5">
                  <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-pill bg-sunk text-[10px] font-semibold text-fg">
                    {e.actor.initials ?? initialsOf(e.actor.name)}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-ui text-fg">
                      <span className="font-medium">{e.actor.name}</span> {e.action}
                    </span>
                    <span className="text-meta text-fg-secondary">
                      {e.dateTime ? <time dateTime={e.dateTime}>{e.time}</time> : e.time}
                      {e.detail && <> · {e.detail}</>}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
    </section>
  );
}
