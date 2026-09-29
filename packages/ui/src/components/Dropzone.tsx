import { FileX, Upload } from 'lucide-react';
import { useRef, useState, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Button } from './Button';
import { Icon } from './Icon';
import { checkFiles, DEFAULT_MAX_SIZE, formatBytes, fromInput, hasFiles, readDataTransfer, type DroppedFile, type FileRules, type Rejected } from './status-files';
import { useWindowDrop } from './WindowDrop';

export type DropzoneLabels = {
  idle?: string;
  limit?: (maxSize: number) => string;
  dragging?: string;
  release?: (target: string) => string;
  choose?: string;
  chooseFolder?: string;
  compact?: string;
  refused?: (r: Rejected) => string;
};

export type DropzoneProps = Omit<ComponentProps<'div'>, 'onDrop' | 'children'> &
  FileRules & {
    /** Allow several files. @default true */
    multiple?: boolean | undefined;
    /** Offer "Choose a folder" too. */
    directory?: boolean | undefined;
    /** Folder name shown on hover: "Release to upload to <target>". */
    target?: string | undefined;
    /** One line, for list views. */
    compact?: boolean | undefined;
    disabled?: boolean | undefined;
    /** Files that passed the checks, with folder paths. */
    onFiles: (files: DroppedFile[]) => void;
    /** Files refused, with the reason. */
    onReject?: ((items: Rejected[]) => void) | undefined;
    labels?: DropzoneLabels | undefined;
    /** Extra actions beside Choose files. */
    actions?: ReactNode;
  };

export function refusedText(r: Rejected, maxSize = DEFAULT_MAX_SIZE): string {
  if (r.reason === 'type') {
    const ext = r.file.name.includes('.') ? r.file.name.slice(r.file.name.lastIndexOf('.')) : r.file.name;
    return `${ext} files aren’t supported`;
  }
  if (r.reason === 'size') return `Files over ${formatBytes(maxSize)} aren’t supported`;
  return 'Folders nested this deep aren’t supported';
}

/**
 * Dropzone — drop files or folders here, or choose them (a real button:
 * drag and drop is never the only way). Idle: a dashed edge; while files
 * are dragged into the window: lit; over the zone: the yellow field naming
 * the folder; refused: says why, not just red.
 */
export function Dropzone({
  accept,
  maxSize = DEFAULT_MAX_SIZE,
  maxDepth,
  multiple = true,
  directory = false,
  target,
  compact = false,
  disabled = false,
  onFiles,
  onReject,
  labels,
  actions,
  className,
  ...rest
}: DropzoneProps) {
  const { dragging, setHoverTarget } = useWindowDrop();
  const [over, setOver] = useState(false);
  const [refused, setRefused] = useState<Rejected | null>(null);
  const files = useRef<HTMLInputElement | null>(null);
  const folder = useRef<HTMLInputElement | null>(null);
  const depth = useRef(0);

  const take = (items: DroppedFile[]) => {
    const { accepted, rejected } = checkFiles(items, { accept, maxSize, maxDepth });
    const kept = multiple ? accepted : accepted.slice(0, 1);
    setRefused(kept.length === 0 && rejected[0] ? rejected[0] : null);
    if (kept.length) onFiles(kept);
    if (rejected.length) onReject?.(rejected);
  };

  const release = labels?.release ?? ((t: string) => `Release to upload to ${t}`);
  const state = disabled ? 'disabled' : over ? 'over' : refused ? 'refused' : dragging ? 'dragging' : 'idle';

  return (
    <div
      data-state={state}
      onDragEnter={(e) => {
        if (disabled || !hasFiles(e.dataTransfer)) return;
        depth.current += 1;
        setOver(true);
        setRefused(null);
        if (target) setHoverTarget(target);
      }}
      onDragOver={(e) => {
        if (disabled || !hasFiles(e.dataTransfer)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDragLeave={(e) => {
        if (!hasFiles(e.dataTransfer)) return;
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) {
          setOver(false);
          setHoverTarget(null);
        }
      }}
      onDrop={(e) => {
        if (disabled || !hasFiles(e.dataTransfer)) return;
        e.preventDefault();
        e.stopPropagation(); // the window layer must not also take it
        depth.current = 0;
        setOver(false);
        setHoverTarget(null);
        void readDataTransfer(e.dataTransfer).then(take);
      }}
      className={cn(
        'flex rounded-lg border font-sans transition-[background-color,border-color] duration-[120ms] ease-standard',
        compact ? 'items-center justify-between gap-3 px-4 py-2.5' : 'flex-col items-center justify-center gap-2 px-6 py-8 text-center',
        state === 'idle' && 'border-dashed border-rule bg-transparent',
        state === 'dragging' && 'border-dashed border-fg bg-yellow-wash-20 ink:bg-sunk',
        state === 'over' && 'border-solid border-ink bg-brand-field text-ink',
        state === 'refused' && 'border-dashed border-error bg-error-wash text-error-text ink:bg-error/20 ink:text-fg',
        state === 'disabled' && 'border-dashed border-rule opacity-40',
        className,
      )}
      {...rest}
    >
      <div className={cn('flex items-center', compact ? 'gap-2' : 'flex-col gap-2')}>
        <Icon icon={state === 'refused' ? FileX : Upload} size={compact ? 16 : 20} />
        <span aria-live="polite" className={cn('font-medium', compact ? 'text-small' : 'text-ui')}>
          {state === 'over' && target
            ? release(target)
            : state === 'refused' && refused
              ? (labels?.refused ?? ((r: Rejected) => refusedText(r, maxSize)))(refused)
              : state === 'dragging' || state === 'over'
                ? (labels?.dragging ?? 'Drop here')
                : compact
                  ? (labels?.compact ?? 'Drop files or choose')
                  : (labels?.idle ?? (directory ? 'Drop files or folders' : 'Drop files'))}
        </span>
        {!compact && state === 'idle' && <span className="text-meta text-fg-secondary">{(labels?.limit ?? ((n: number) => `Up to ${formatBytes(n)} each`))(maxSize)}</span>}
      </div>
      <div className={cn('flex items-center gap-2', !compact && 'mt-2')}>
        <Button size="sm" variant={compact ? 'secondary' : 'primary'} disabled={disabled} onClick={() => files.current?.click()}>
          {labels?.choose ?? 'Choose files'}
        </Button>
        {directory && (
          <Button size="sm" variant="ghost" disabled={disabled} onClick={() => folder.current?.click()}>
            {labels?.chooseFolder ?? 'Choose a folder'}
          </Button>
        )}
        {actions}
      </div>
      <input
        ref={files}
        type="file"
        hidden
        tabIndex={-1}
        multiple={multiple}
        accept={accept}
        onChange={(e) => {
          take(fromInput(e.target.files));
          e.target.value = '';
        }}
      />
      {directory && (
        <input
          ref={folder}
          type="file"
          hidden
          tabIndex={-1}
          {...({ webkitdirectory: '' } as object)}
          onChange={(e) => {
            take(fromInput(e.target.files));
            e.target.value = '';
          }}
        />
      )}
    </div>
  );
}
