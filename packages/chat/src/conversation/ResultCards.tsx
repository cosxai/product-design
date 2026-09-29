import { Button, cn } from '@cosxai/ui';
import { FileText } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';

import { PersonAvatar, TextButton } from './parts';

export type ResultCardProps = Omit<ComponentProps<'section'>, 'title'> & {
  /** The small grey line on top (Task created · T-128). */
  eyebrow?: ReactNode;
  title?: ReactNode;
  /** A tile on the left (the document icon). */
  leading?: ReactNode;
  /** yellow: something now waits with the team (a task). @default "plain" */
  tone?: 'plain' | 'yellow' | undefined;
};

/**
 * ResultCard — the base of the cards inside an answer: what it made or
 * found. Each opens its own page. Distinct from ConfirmationCard (ink
 * outline), which asks before anything leaves.
 */
export function ResultCard({ eyebrow, title, leading, tone = 'plain', className, children, ...rest }: ResultCardProps) {
  return (
    <section
      className={cn(
        'flex max-w-[400px] gap-3.5 rounded-lg p-4',
        tone === 'yellow' ? 'bg-yellow text-ink' : 'border border-rule bg-page text-fg',
        className,
      )}
      {...rest}
    >
      {leading}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {eyebrow && <div className={cn('text-meta', tone === 'yellow' ? 'text-fg-on-yellow-secondary' : 'text-fg-secondary')}>{eyebrow}</div>}
        {title && <div className="text-ui leading-[1.4] font-medium">{title}</div>}
        {children}
      </div>
    </section>
  );
}

/** Open as a link when the host gives a URL, else a button. */
function OpenLink({ href, onOpen, children }: { href?: string | undefined; onOpen?: (() => void) | undefined; children: ReactNode }) {
  const cls = 'text-meta';
  if (href)
    return (
      <a href={href} onClick={onOpen} className={cn(cls, 'w-fit rounded-xs font-medium text-fg underline underline-offset-[3px] outline-none focus-visible:shadow-(--focus-ring)')}>
        {children}
      </a>
    );
  return (
    <TextButton onClick={onOpen} className={cn(cls, 'w-fit')}>
      {children}
    </TextButton>
  );
}

export type TaskResultProps = Omit<ResultCardProps, 'eyebrow' | 'title' | 'tone'> & {
  /** T-128 */
  taskId: string;
  title: ReactNode;
  /** Who has it (Sam Ortiz). */
  assignee?: string | undefined;
  href?: string | undefined;
  onOpen?: (() => void) | undefined;
  labels?: Partial<{ created: (id: string) => string; withUs: (name: string) => string; open: string }> | undefined;
};

/** TaskResult — a task the answer created, now with the team. */
export function TaskResult({ taskId, title, assignee, href, onOpen, labels, ...rest }: TaskResultProps) {
  const created = labels?.created ?? ((id: string) => `Task created · ${id}`);
  const withUs = labels?.withUs ?? ((n: string) => `With us · ${n}`);
  return (
    <ResultCard tone="yellow" eyebrow={created(taskId)} title={title} {...rest}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-meta text-fg-on-yellow-secondary">{assignee && withUs(assignee)}</span>
        {href ? (
          <Button asChild size="sm" ground="yellow" onClick={onOpen}>
            <a href={href}>{labels?.open ?? 'Open'}</a>
          </Button>
        ) : (
          <Button size="sm" ground="yellow" onClick={onOpen}>
            {labels?.open ?? 'Open'}
          </Button>
        )}
      </div>
    </ResultCard>
  );
}

export type DocumentResultProps = Omit<ResultCardProps, 'eyebrow' | 'title' | 'leading'> & {
  name: string;
  pages?: number | undefined;
  /** The project or room it is in. */
  project?: ReactNode;
  href?: string | undefined;
  onOpen?: (() => void) | undefined;
  labels?: Partial<{ pages: (n: number) => string; open: string }> | undefined;
};

/** DocumentResult — a document the answer found: name, pages · project, Open. */
export function DocumentResult({ name, pages, project, href, onOpen, labels, ...rest }: DocumentResultProps) {
  const pagesText = labels?.pages ?? ((n: number) => `${n} ${n === 1 ? 'page' : 'pages'}`);
  const meta = [pages !== undefined ? pagesText(pages) : null, project].filter((x) => x != null && x !== '');
  return (
    <ResultCard
      leading={
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-md bg-sunk">
          <FileText size={16} strokeWidth={1.75} />
        </span>
      }
      title={<span className="block truncate">{name}</span>}
      {...rest}
    >
      {meta.length > 0 && (
        <div className="-mt-1 truncate text-meta text-fg-secondary">
          {meta.map((m, i) => (
            <span key={i}>
              {i > 0 && ' · '}
              {m}
            </span>
          ))}
        </div>
      )}
      <OpenLink href={href} onOpen={onOpen}>
        {labels?.open ?? 'Open'}
      </OpenLink>
    </ResultCard>
  );
}

export type ResultPerson = { id: string; name: string; /** 9 days */ meta?: ReactNode };

export type PeopleResultProps = Omit<ResultCardProps, 'title' | 'children'> & {
  /** What the list is (Invited · NDA not signed); the total follows. */
  eyebrow: ReactNode;
  people: ResultPerson[];
  /** The full count; "Show all N" appears when it is above the rows shown. @default people.length */
  total?: number | undefined;
  href?: string | undefined;
  onShowAll?: (() => void) | undefined;
  labels?: Partial<{ showAll: (n: number) => string }> | undefined;
};

/** PeopleResult — people the answer found, each with initials and a detail; Show all opens the list. */
export function PeopleResult({ eyebrow, people, total = people.length, href, onShowAll, labels, ...rest }: PeopleResultProps) {
  const showAll = labels?.showAll ?? ((n: number) => `Show all ${n}`);
  return (
    <ResultCard
      eyebrow={
        <>
          {eyebrow} · {total}
        </>
      }
      {...rest}
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0 pt-1">
        {people.map((p) => (
          <li key={p.id} className="flex items-center gap-2.5 text-ui">
            <PersonAvatar name={p.name} size={22} />
            <span className="min-w-0 flex-1 truncate">{p.name}</span>
            {p.meta != null && <span className="shrink-0 text-meta text-fg-secondary">{p.meta}</span>}
          </li>
        ))}
      </ul>
      {(href || onShowAll) && (
        <div className="pt-1">
          <OpenLink href={href} onOpen={onShowAll}>
            {showAll(total)}
          </OpenLink>
        </div>
      )}
    </ResultCard>
  );
}

export type DraftResultProps = Omit<ResultCardProps, 'title'> & {
  /** Draft email · to 4 investors */
  eyebrow: ReactNode;
  onEdit?: (() => void) | undefined;
  /** Copy the draft; the button confirms in place. */
  onCopy?: (() => void) | undefined;
  labels?: Partial<{ edit: string; copy: string; copied: string }> | undefined;
};

/** DraftResult — a draft the answer wrote (an email, a note): the text, Edit and Copy. Nothing is sent from here. */
export function DraftResult({ eyebrow, onEdit, onCopy, labels, children, ...rest }: DraftResultProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = () => {
    onCopy?.();
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };
  return (
    <ResultCard eyebrow={eyebrow} {...rest}>
      <div className="line-clamp-4 text-small leading-[1.55] whitespace-pre-wrap text-fg">{children}</div>
      {(onEdit || onCopy) && (
        <div className="flex items-center gap-1 pt-1.5">
          {onEdit && (
            <Button variant="secondary" size="sm" onClick={onEdit}>
              {labels?.edit ?? 'Edit'}
            </Button>
          )}
          {onCopy && (
            <Button variant="ghost" size="sm" onClick={copy} state={copied ? 'done' : 'idle'} doneLabel={labels?.copied ?? 'Copied'}>
              {labels?.copy ?? 'Copy'}
            </Button>
          )}
        </div>
      )}
    </ResultCard>
  );
}
