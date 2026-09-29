import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, FileText, FileX, Folder, Link2, MessageSquare, Star, type LucideIcon } from 'lucide-react';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Badge, type BadgeStatus } from './Badge';
import { Spinner } from './Spinner';
import { Tag } from './Tag';

export type FileCardState = 'ready' | 'converting' | 'failed';

export type FileCardProps = Omit<ComponentProps<'div'>, 'title' | 'onClick'> & {
  title: ReactNode;
  /** file · folder · link (a card that points elsewhere: dashed edge). @default "file" */
  kind?: 'file' | 'folder' | 'link' | undefined;
  /** The thumbnail. Without one the icon sits on linen. */
  preview?: ReactNode;
  /** Icon when there is no preview. Defaults by kind. */
  icon?: LucideIcon | undefined;
  /** Format tag: PDF, Word. */
  type?: ReactNode;
  /** Status in words; `status` picks the badge. */
  statusLabel?: ReactNode;
  status?: BadgeStatus | undefined;
  /** The last line: "Updated 2 hours ago", "in Harbour / Site / 2026". */
  meta?: ReactNode;
  /** Comment count after the status; hidden at zero. */
  comments?: number | undefined;
  /** A small source label on the preview: "Dropbox". */
  source?: ReactNode;
  /** ready · converting (spinner and label) · failed (red wash, a Re-render action). */
  state?: FileCardState | undefined;
  stateLabel?: ReactNode;
  onRerender?: (() => void) | undefined;
  /** @default "Re-render" */
  rerenderLabel?: string | undefined;
  /** Link cards: the Remove link action beside the target. */
  onRemoveLink?: (() => void) | undefined;
  /** @default "Remove link" */
  removeLinkLabel?: string | undefined;

  selected?: boolean | undefined;
  /** In selection mode the whole card toggles instead of opening. */
  selectionMode?: boolean | undefined;
  onSelectedChange?: ((selected: boolean) => void) | undefined;
  /** Accessible name of the tick box. @default "Select" */
  selectLabel?: string | undefined;

  starred?: boolean | undefined;
  onStarredChange?: ((starred: boolean) => void) | undefined;
  /** @default "Star" */
  starLabel?: string | undefined;

  /** Opens the item (not in selection mode). */
  onOpen?: (() => void) | undefined;
  /** Every press of the card, with its modifiers — wire useSelection.handleClick here; replaces the default open / toggle. */
  onPress?: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;
};

const KIND_ICON: Record<NonNullable<FileCardProps['kind']>, LucideIcon> = { file: FileText, folder: Folder, link: Link2 };

/**
 * FileCard — the library card shared by every grid. The title is the one
 * real button, stretched over the card; the tick box, the star and inline
 * actions sit above it and never open the card. In selection mode the
 * whole card is the checkbox.
 */
export function FileCard({
  title,
  kind = 'file',
  preview,
  icon,
  type,
  statusLabel,
  status,
  meta,
  comments,
  source,
  state = 'ready',
  stateLabel,
  onRerender,
  rerenderLabel = 'Re-render',
  onRemoveLink,
  removeLinkLabel = 'Remove link',
  selected = false,
  selectionMode = false,
  onSelectedChange,
  selectLabel = 'Select',
  starred,
  onStarredChange,
  starLabel = 'Star',
  onOpen,
  onPress,
  className,
  ...rest
}: FileCardProps) {
  const Glyph = icon ?? KIND_ICON[kind];
  const press = (e: MouseEvent<HTMLButtonElement>) => {
    if (onPress) onPress(e);
    else if (selectionMode) onSelectedChange?.(!selected);
    else onOpen?.();
  };
  const showTick = Boolean(onSelectedChange) && (selectionMode || selected);

  return (
    <div
      data-selected={selected || undefined}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg bg-page text-fg',
        'transition-[border-color] duration-[120ms] ease-standard',
        kind === 'link' ? 'border border-dashed border-rule' : 'border border-rule',
        selected ? 'border-2 border-fg' : 'hover:border-fg focus-within:border-fg',
        className,
      )}
      {...rest}
    >
      {/* Preview */}
      <div
        className={cn(
          'relative grid h-[180px] place-items-center text-fg',
          selected ? 'bg-brand-field text-ink' : state === 'failed' ? 'bg-error-wash text-ink ink:bg-error/20 ink:text-fg' : kind === 'link' ? 'bg-page' : 'bg-sunk',
        )}
      >
        {state === 'converting' ? (
          <div className="flex flex-col items-center gap-2 text-small text-fg-secondary">
            <Spinner size={16} />
            {stateLabel}
          </div>
        ) : state === 'failed' ? (
          <div className="flex flex-col items-center gap-2 text-small">
            <FileX size={20} strokeWidth={1.75} aria-hidden />
            <span>{stateLabel}</span>
            {onRerender && (
              <button
                type="button"
                onClick={onRerender}
                className="relative z-10 cursor-pointer font-semibold underline underline-offset-2 outline-none focus-visible:shadow-(--focus-ring)"
              >
                {rerenderLabel}
              </button>
            )}
          </div>
        ) : (
          (preview ?? <Glyph size={32} strokeWidth={1.5} aria-hidden />)
        )}

        {source && !showTick && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-sm bg-page px-1.5 py-1 text-[11px] font-semibold text-fg">
            <span aria-hidden className="size-1.5 rounded-pill bg-brand-mark" />
            {source}
          </span>
        )}

        {onSelectedChange && (
          <CheckboxPrimitive.Root
            checked={selected}
            onCheckedChange={(v) => onSelectedChange(v === true)}
            aria-label={selectLabel}
            className={cn(
              'absolute top-2.5 left-2.5 z-10 grid size-5 cursor-pointer place-items-center rounded-xs border border-rule bg-page outline-none',
              'data-[state=checked]:border-fg data-[state=checked]:bg-fg data-[state=checked]:text-page focus-visible:shadow-(--focus-ring)',
              showTick ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
            )}
          >
            <CheckboxPrimitive.Indicator>
              <Check size={13} strokeWidth={2.5} aria-hidden />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
        )}

        {onStarredChange && (
          <button
            type="button"
            aria-label={starLabel}
            aria-pressed={Boolean(starred)}
            onClick={() => onStarredChange(!starred)}
            className={cn(
              'absolute top-2 right-2 z-10 grid size-7 cursor-pointer place-items-center rounded-md text-fg outline-none hover:bg-hover focus-visible:shadow-(--focus-ring)',
              starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
            )}
          >
            <Star size={15} strokeWidth={1.75} aria-hidden className={starred ? 'fill-brand-mark text-fg' : undefined} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-col gap-1.5 px-3.5 pt-3 pb-3.5">
        <button
          type="button"
          onClick={press}
          aria-pressed={selectionMode ? selected : undefined}
          className={cn(
            'min-w-0 cursor-pointer truncate text-left text-ui font-medium text-fg outline-none',
            // Stretched: the whole card is this button's target.
            'after:absolute after:inset-0 after:content-[""] focus-visible:after:rounded-lg focus-visible:after:shadow-(--focus-ring)',
          )}
        >
          {title}
        </button>
        {(type || statusLabel || (comments ?? 0) > 0) && (
          <div className="flex min-w-0 items-center gap-2">
            {type && <Tag className="px-1.5 py-0.5 font-semibold text-fg">{type}</Tag>}
            {statusLabel && <Badge status={status}>{statusLabel}</Badge>}
            {(comments ?? 0) > 0 && (
              <span className="ml-auto inline-flex items-center gap-1 text-meta text-fg-secondary">
                <MessageSquare size={13} strokeWidth={1.75} aria-hidden />
                <span className="tabular-nums">{comments}</span>
              </span>
            )}
          </div>
        )}
        {(meta || onRemoveLink) && (
          <div className="flex min-w-0 items-center gap-1 text-meta text-fg-secondary">
            {meta && <span className="truncate">{meta}</span>}
            {onRemoveLink && (
              <>
                {meta && <span aria-hidden>·</span>}
                <button
                  type="button"
                  onClick={onRemoveLink}
                  className="relative z-10 cursor-pointer text-fg-secondary outline-none hover:text-fg hover:underline focus-visible:shadow-(--focus-ring)"
                >
                  {removeLinkLabel}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
