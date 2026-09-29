import { Folder } from 'lucide-react';
import { useMemo, useState, type ComponentProps } from 'react';

import { cn } from '../lib/cn';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { Icon } from './Icon';
import { checkFiles, DEFAULT_MAX_SIZE, formatBytes, isHidden, type DroppedFile, type FileRules, type Rejected } from './status-files';

type Group = { key: string; label: string; files: DroppedFile[]; hidden: boolean };

const REASON: Record<Rejected['reason'], string> = { type: 'Unsupported type', size: 'Too large', depth: 'Nested too deep' };

/** Groups a folder's accepted files by their first sub-folder ("" = loose files in the root). */
export function groupByFolder(items: DroppedFile[]): Group[] {
  const map = new Map<string, DroppedFile[]>();
  for (const it of items) {
    const parts = it.path.split('/');
    const key = parts.length > 2 ? parts[1]! : '';
    map.set(key, [...(map.get(key) ?? []), it]);
  }
  return [...map.entries()]
    .map(([key, files]) => ({ key, label: key, files, hidden: key ? key.startsWith('.') : files.every((f) => isHidden(f.path)) }))
    .sort((a, b) => Number(a.hidden) - Number(b.hidden) || a.key.localeCompare(b.key));
}

export type UploadCheckLabels = {
  looseFiles?: string;
  wontUpload?: (n: number) => string;
  upload?: (n: number) => string;
  cancel?: string;
  of?: (included: number, total: number) => string;
  summary?: (files: number, size: string) => string;
  refused?: (r: Rejected) => string;
};

export type UploadCheckProps = Omit<ComponentProps<'div'>, 'children'> &
  FileRules & {
    /** The dropped folder's name. */
    folder: string;
    /** Everything read from it, with paths ("<folder>/Financials/a.pdf"). */
    items: DroppedFile[];
    onConfirm: (files: DroppedFile[]) => void;
    onCancel?: (() => void) | undefined;
    labels?: UploadCheckLabels | undefined;
  };

/**
 * UploadCheck — before a folder uploads: what will go (by sub-folder, with
 * counts), what is unticked by default (hidden items such as .cache), and
 * what won't upload and why (unsupported type, too large, nested too deep).
 */
export function UploadCheck({ folder, items, accept, maxSize = DEFAULT_MAX_SIZE, maxDepth, onConfirm, onCancel, labels, className, ...rest }: UploadCheckProps) {
  const { accepted, rejected } = useMemo(() => checkFiles(items, { accept, maxSize, maxDepth }), [items, accept, maxSize, maxDepth]);
  const groups = useMemo(() => groupByFolder(accepted), [accepted]);
  const [off, setOff] = useState<Set<string>>(() => new Set(groups.filter((g) => g.hidden).map((g) => g.key)));

  const chosen = groups.filter((g) => !off.has(g.key)).flatMap((g) => g.files);
  const bytes = chosen.reduce((n, f) => n + f.file.size, 0);
  const toggle = (key: string, on: boolean) =>
    setOff((s) => {
      const next = new Set(s);
      if (on) next.delete(key);
      else next.add(key);
      return next;
    });
  const L = {
    looseFiles: labels?.looseFiles ?? 'Files in this folder',
    wontUpload: labels?.wontUpload ?? ((n: number) => `${n} won’t upload`),
    upload: labels?.upload ?? ((n: number) => `Upload ${n} ${n === 1 ? 'file' : 'files'}`),
    of: labels?.of ?? ((a: number, b: number) => `${a} of ${b}`),
    refused: labels?.refused ?? ((r: Rejected) => REASON[r.reason]),
  };

  return (
    <div className={cn('flex flex-col gap-4 font-sans text-fg', className)} {...rest}>
      <div className="flex items-center gap-2">
        <Icon icon={Folder} size={18} />
        <span className="flex-1 truncate text-ui font-medium">{folder}</span>
        <span className="text-meta font-medium text-fg-secondary tabular-nums">{L.of(chosen.length, items.length)}</span>
      </div>
      <ul className="m-0 flex list-none flex-col rounded-md border border-rule p-0">
        {groups.map((g) => (
          <li key={g.key || '(root)'} className="flex items-center gap-3 border-b border-rule-soft px-3 py-2.5 last:border-b-0">
            <Checkbox
              checked={!off.has(g.key)}
              onChange={(v) => toggle(g.key, v)}
              label={g.key ? g.label : L.looseFiles}
              rowClassName={cn('flex-1', off.has(g.key) && 'text-fg-secondary')}
            />
            <span className="text-meta text-fg-secondary tabular-nums">{g.files.length}</span>
          </li>
        ))}
        {rejected.map((r) => (
          <li key={r.path} data-rejected={r.reason} className="flex items-center gap-3 border-b border-rule-soft px-3 py-2.5 last:border-b-0">
            <span className="size-4 shrink-0" />
            <span className="flex-1 truncate text-small text-fg-secondary">{r.path.split('/').slice(1).join(' / ') || r.path}</span>
            <span className="text-meta font-medium text-error-text">{L.refused(r)}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3">
        <span className="flex-1 text-meta text-fg-secondary tabular-nums">
          {(labels?.summary ?? ((n: number, s: string) => `${n} ${n === 1 ? 'file' : 'files'} · ${s}`))(chosen.length, formatBytes(bytes))}
          {rejected.length > 0 && ` · ${L.wontUpload(rejected.length)}`}
        </span>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            {labels?.cancel ?? 'Cancel'}
          </Button>
        )}
        <Button disabled={chosen.length === 0} onClick={() => onConfirm(chosen)}>
          {L.upload(chosen.length)}
        </Button>
      </div>
    </div>
  );
}
