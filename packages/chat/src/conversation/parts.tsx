import { initialsOf, cn, formatBytes } from '@cosxai/ui';
import { FileText, Sparkles, X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

/**
 * AgentAvatar — the Agent's ink tile with the yellow spark. Decorative: the message says who spoke.
 *
 * @deprecated Use MetaAvatar — Meta drawn in its states, in the workspace's brand colour.
 */
export function AgentAvatar({ size = 28, className, ...rest }: Omit<ComponentProps<'span'>, 'children'> & { size?: number | undefined }) {
  return (
    <span
      aria-hidden
      className={cn('grid shrink-0 place-items-center rounded-sm bg-ink text-yellow-accent ink:border ink:border-inv-rule', className)}
      style={{ width: size, height: size }}
      {...rest}
    >
      <Sparkles size={Math.round(size * 0.5)} strokeWidth={1.75} />
    </span>
  );
}

/** PersonAvatar — a round initials avatar for a person (staff, people lists). */
export function PersonAvatar({ name, size = 28, className, ...rest }: Omit<ComponentProps<'span'>, 'children'> & { name: string; size?: number | undefined }) {
  return (
    <span
      aria-hidden
      className={cn('grid shrink-0 place-items-center rounded-pill bg-well font-semibold text-fg', className)}
      style={{ width: size, height: size, fontSize: size <= 22 ? 9 : 11 }}
      {...rest}
    >
      {initialsOf(name)}
    </span>
  );
}

export type SystemLineProps = ComponentProps<'div'> & {
  /** A small icon before the text. */
  icon?: ReactNode;
};

/** SystemLine — tasks created, hand-overs, permission changes: centred grey text between rules, no avatar. */
export function SystemLine({ icon, className, children, ...rest }: SystemLineProps) {
  return (
    <div role="note" className={cn('flex items-center gap-3 text-meta text-fg-secondary', className)} {...rest}>
      <span aria-hidden className="h-px flex-1 bg-rule-soft" />
      <span className="inline-flex items-center gap-2 text-center">
        {icon}
        <span>{children}</span>
      </span>
      <span aria-hidden className="h-px flex-1 bg-rule-soft" />
    </div>
  );
}

export type AttachmentChipProps = Omit<ComponentProps<'span'>, 'children'> & {
  name: string;
  /** Bytes; shown when the file is ready. */
  size?: number | undefined;
  /** 0–1 while uploading; replaces the size with a bar. */
  progress?: number | undefined;
  onRemove?: (() => void) | undefined;
  /** @default "Remove" */
  removeLabel?: string | undefined;
};

/** AttachmentChip — a file on a message or in the composer: name, size (or upload bar), remove. */
export function AttachmentChip({ name, size, progress, onRemove, removeLabel = 'Remove', className, ...rest }: AttachmentChipProps) {
  const uploading = progress !== undefined && progress < 1;
  return (
    <span
      className={cn('inline-flex h-7 max-w-[280px] items-center gap-1.5 rounded-sm border border-rule-soft bg-page px-2 text-meta text-fg', className)}
      {...rest}
    >
      <FileText size={13} strokeWidth={1.75} aria-hidden className="shrink-0" />
      <span className="truncate">{name}</span>
      {uploading ? (
        <span
          role="progressbar"
          aria-label={name}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          className="ml-1 h-[3px] w-10 shrink-0 overflow-hidden rounded-pill bg-well"
        >
          <span className="block h-full rounded-pill bg-fg" style={{ width: `${Math.round(progress * 100)}%` }} />
        </span>
      ) : (
        size !== undefined && <span className="shrink-0 text-fg-secondary tabular-nums">{formatBytes(size)}</span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${removeLabel} ${name}`}
          className="-mr-0.5 inline-grid shrink-0 cursor-pointer place-items-center rounded-xs text-fg-secondary outline-none hover:text-fg focus-visible:shadow-(--focus-ring)"
        >
          <X size={12} strokeWidth={2} aria-hidden />
        </button>
      )}
    </span>
  );
}

/** A text action in a line of copy (Continue, Ask the team instead, Show all 4). */
export function TextButton({ className, ...rest }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'cursor-pointer rounded-xs font-medium text-fg underline underline-offset-[3px] outline-none hover:decoration-2 focus-visible:shadow-(--focus-ring) disabled:cursor-not-allowed disabled:text-fg-secondary',
        className,
      )}
      {...rest}
    />
  );
}
