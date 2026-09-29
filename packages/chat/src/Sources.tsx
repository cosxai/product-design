import { useId, type ReactNode } from 'react';

import { cn } from '@cosxai/ui';

import { citationLocation, type CitationLabels, type Citations } from './Citation';

export type SourcesListProps = {
  /** The same map the answer's Markdown cites from; listed in number order. */
  citations: Citations;
  /** @default "Sources" */
  label?: ReactNode;
  /** Formats the "p. 14" location. */
  labels?: CitationLabels | undefined;
  className?: string | undefined;
};

/**
 * SourcesList — "Sources" and one numbered chip per source under an
 * answer: "1 Contacts · Harbour Series A". A chip with `onOpen` or `href`
 * opens the source at the cited place.
 *
 * Visual: design.cosx.co/pattern-agent (Sources).
 */
export function SourcesList({ citations, label = 'Sources', labels, className }: SourcesListProps) {
  const id = useId();
  const entries = Object.entries(citations)
    .map(([n, source]) => [Number(n), source] as const)
    .filter(([n]) => Number.isFinite(n))
    .sort(([a], [b]) => a - b);
  if (!entries.length) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5 font-sans', className)}>
      <span id={id} className="pr-1 text-meta font-medium text-fg-secondary">
        {label}
      </span>
      <ol aria-labelledby={id} className="m-0 contents list-none p-0">
        {entries.map(([n, source]) => {
          const location = citationLocation(source, labels);
          const body = (
            <>
              <span aria-hidden className="grid h-4 min-w-4 place-items-center rounded-xs bg-page px-[3px] text-[10px] leading-none font-semibold tabular-nums">
                {n}
              </span>
              <span className="min-w-0 truncate">
                {source.title}
                {location !== undefined && <> · {location}</>}
              </span>
            </>
          );
          const chip = 'inline-flex h-[26px] max-w-full items-center gap-1.5 rounded-sm bg-sunk pr-2 pl-1 text-meta text-fg';
          const interactive = 'cursor-pointer border-0 font-sans no-underline outline-none transition-colors duration-[120ms] ease-standard hover:bg-well focus-visible:shadow-(--focus-ring)';
          return (
            <li key={n} className="flex max-w-full" data-source={n}>
              {source.onOpen ? (
                <button type="button" onClick={source.onOpen} className={cn(chip, interactive)}>
                  {body}
                </button>
              ) : source.href ? (
                <a href={source.href} className={cn(chip, interactive)}>
                  {body}
                </a>
              ) : (
                <span className={chip}>{body}</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export type ScopeLineProps = {
  /** How many sources the answer used. */
  count: number;
  /** What the Agent could see: "Harbour Series A only". */
  scope?: ReactNode;
  /** @default (n) => n === 1 ? "1 source" : `${n} sources` */
  sourcesLabel?: ((count: number) => ReactNode) | undefined;
  className?: string | undefined;
};

/**
 * ScopeLine — the quiet line under an answer saying what it rested on:
 * "3 sources · Harbour Series A only". Sits beside the answer's actions.
 */
export function ScopeLine({ count, scope, sourcesLabel = (n) => (n === 1 ? '1 source' : `${n} sources`), className }: ScopeLineProps) {
  return (
    <span className={cn('font-sans text-meta text-fg-secondary tabular-nums', className)}>
      {sourcesLabel(count)}
      {scope !== undefined && scope !== null && scope !== '' && <> · {scope}</>}
    </span>
  );
}
