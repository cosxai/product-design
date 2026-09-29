import { CloudOff, FileQuestion, FolderOpen, Info, Lock, RefreshCw, SearchX, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Icon } from './Icon';

export type PageStateKind = 'empty' | 'no-results' | 'forbidden' | 'not-found' | 'error' | 'offline';

const GLYPH: Record<PageStateKind, LucideIcon> = {
  empty: FolderOpen,
  'no-results': SearchX,
  forbidden: Lock,
  'not-found': FileQuestion,
  error: TriangleAlert,
  offline: CloudOff,
};

export type PageStateProps = Omit<ComponentProps<'div'>, 'title' | 'children'> & {
  kind: PageStateKind;
  /** The one sentence: "No documents yet", "Couldn't load; your work is saved". */
  title: ReactNode;
  /** Optional second line. */
  description?: ReactNode;
  /** The one action (a Button): Upload files, Try again, Go to my documents. */
  action?: ReactNode;
  /** Tighter, for a panel or a list rather than a page. */
  compact?: boolean | undefined;
};

/**
 * PageState — one sentence and one action per state: nothing yet, no
 * results, no access, not found, error, offline. Never "No results" while a
 * search is still running (show a Skeleton instead).
 */
export function PageState({ kind, title, description, action, compact = false, className, ...rest }: PageStateProps) {
  return (
    <div
      role={kind === 'error' || kind === 'offline' ? 'alert' : 'status'}
      data-kind={kind}
      className={cn('flex flex-col items-center text-center font-sans', compact ? 'gap-2 py-8' : 'gap-3 py-16', className)}
      {...rest}
    >
      <span className={cn('grid place-items-center rounded-lg bg-sunk text-fg-secondary', compact ? 'size-10' : 'size-12')}>
        <Icon icon={GLYPH[kind]} size={compact ? 18 : 22} />
      </span>
      <div className="flex flex-col gap-1">
        <p className={cn('m-0 font-medium text-fg', compact ? 'text-small' : 'text-body')}>{title}</p>
        {description && <p className="m-0 max-w-[44ch] text-small text-fg-secondary">{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export type PageNoticeProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** info: a quiet sunk line (a truncated document); update: a new version is out. */
  tone?: 'info' | 'update' | undefined;
  children: ReactNode;
  /** One action: Refresh. */
  action?: ReactNode;
};

/**
 * PageNotice — a full-width line above the content: "This document has
 * 1,240 pages. Only the first 500 were processed…", or "Metaroom has been
 * updated. Refresh to load this page."
 */
export function PageNotice({ tone = 'info', children, action, className, ...rest }: PageNoticeProps) {
  return (
    <div
      role={tone === 'update' ? 'alert' : 'status'}
      className={cn(
        'flex items-center gap-3 rounded-md px-4 py-2.5 font-sans text-small',
        tone === 'update' ? 'bg-brand-field text-ink' : 'bg-sunk text-fg',
        className,
      )}
      {...rest}
    >
      <Icon icon={tone === 'update' ? RefreshCw : Info} size={15} className={tone === 'update' ? undefined : 'text-fg-secondary'} />
      <span className="flex-1">{children}</span>
      {action}
    </div>
  );
}
