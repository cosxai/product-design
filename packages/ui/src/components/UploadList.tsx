import { Check, File, Folder, X } from 'lucide-react';
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Button } from './Button';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { Progress } from './Progress';
import { formatBytes } from './status-files';

export type UploadState = 'queued' | 'uploading' | 'retrying' | 'failed' | 'done';

export type UploadItem = {
  id: string;
  name: string;
  state: UploadState;
  /** 0–100 while uploading. */
  progress?: number | undefined;
  /** Bytes, for "1.2 of 3.4 MB". */
  loaded?: number | undefined;
  size?: number | undefined;
  /** When the next attempt starts (epoch ms), while retrying. */
  retryAt?: number | undefined;
  /** Why it failed: "The connection dropped." */
  error?: ReactNode;
};

export type UploadRowLabels = {
  /** s is 0 once the retry has started. */
  retryingIn?: (s: number) => string;
  failed?: string;
  retry?: string;
  dismiss?: string;
  cancel?: string;
  done?: string;
  queued?: string;
  /** "1.2 MB of 3.4 MB" */
  sizeOf?: (loaded: string, total: string) => string;
};

/** Seconds left until `at`, ticking once a second. */
function useSecondsUntil(at: number | undefined): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (at === undefined) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [at]);
  return at === undefined ? 0 : Math.max(0, Math.ceil((at - now) / 1000));
}

export type UploadRowProps = Omit<ComponentProps<'li'>, 'children'> & {
  item: UploadItem;
  onRetry?: ((id: string) => void) | undefined;
  onDismiss?: ((id: string) => void) | undefined;
  onCancel?: ((id: string) => void) | undefined;
  labels?: UploadRowLabels | undefined;
};

/**
 * UploadRow — one file: name, progress, cancel. Retrying counts down;
 * a failure takes a red wash with the reason and Retry while the rest keep
 * going; done confirms until the real card takes its place.
 */
export function UploadRow({ item, onRetry, onDismiss, onCancel, labels, className, ...rest }: UploadRowProps) {
  const secs = useSecondsUntil(item.state === 'retrying' ? item.retryAt : undefined);
  const L = {
    retryingIn: labels?.retryingIn ?? ((s: number) => (s > 0 ? `Retrying in ${s} s` : 'Retrying…')),
    failed: labels?.failed ?? 'Upload failed.',
    retry: labels?.retry ?? 'Retry',
    dismiss: labels?.dismiss ?? 'Dismiss',
    cancel: labels?.cancel ?? 'Cancel',
    done: labels?.done ?? 'Uploaded',
    queued: labels?.queued ?? 'Waiting',
  };
  const pct = Math.round(item.progress ?? 0);
  const text =
    item.state === 'uploading'
      ? item.size
        ? (labels?.sizeOf ?? ((a: string, b: string) => `${a} of ${b}`))(formatBytes(item.loaded ?? (item.size * pct) / 100), formatBytes(item.size))
        : `${pct}%`
      : item.state === 'retrying'
        ? L.retryingIn(secs)
        : undefined;

  return (
    <li
      data-state={item.state}
      className={cn(
        'flex list-none items-center gap-3 rounded-md px-3 py-2.5 font-sans',
        item.state === 'failed' ? 'bg-error-wash text-ink ink:bg-error/20 ink:text-fg' : 'text-fg',
        className,
      )}
      {...rest}
    >
      <Icon icon={item.state === 'done' ? Check : File} size={16} className={item.state === 'done' ? 'text-fg' : 'text-fg-secondary'} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-small">{item.name}</span>
          {item.state === 'uploading' && <span className="text-meta font-medium text-fg-secondary tabular-nums">{pct}%</span>}
          {item.state === 'done' && <span className="text-meta font-medium text-fg-secondary">{L.done}</span>}
          {item.state === 'queued' && <span className="text-meta text-fg-secondary">{L.queued}</span>}
        </div>
        {(item.state === 'uploading' || item.state === 'retrying') && (
          <Progress label={item.name} value={item.state === 'uploading' ? pct : undefined} text={text} status="active" />
        )}
        {item.state === 'failed' && (
          <span role="alert" className="text-meta font-medium text-error-text ink:text-fg">
            {L.failed} {item.error}
          </span>
        )}
      </div>
      {item.state === 'failed' ? (
        <div className="flex items-center gap-1">
          {onRetry && (
            <Button size="sm" variant="secondary" ground="paper" onClick={() => onRetry(item.id)} className="ink:border-inv-rule ink:text-fg">
              {L.retry}
            </Button>
          )}
          {onDismiss && (
            <Button size="sm" variant="ghost" ground="paper" onClick={() => onDismiss(item.id)} className="ink:text-fg">
              {L.dismiss}
            </Button>
          )}
        </div>
      ) : (
        onCancel &&
        item.state !== 'done' && <IconButton icon={X} label={`${L.cancel} ${item.name}`} size="sm" onClick={() => onCancel(item.id)} />
      )}
    </li>
  );
}

export type UploadFolderRowProps = Omit<ComponentProps<'li'>, 'children'> & {
  name: string;
  done: number;
  total: number;
  failed?: number | undefined;
  labels?: { failed?: (n: number) => string } | undefined;
};

/** A folder's batch: a placeholder card that tracks "28 / 41 · 1 failed". */
export function UploadFolderRow({ name, done, total, failed = 0, labels, className, ...rest }: UploadFolderRowProps) {
  const failedText = labels?.failed ?? ((n: number) => `${n} failed`);
  const text = `${done} / ${total}${failed ? ` · ${failedText(failed)}` : ''}`;
  return (
    <li className={cn('flex list-none items-center gap-3 rounded-md px-3 py-2.5 font-sans text-fg', className)} {...rest}>
      <Icon icon={Folder} size={16} className="text-fg-secondary" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-small">{name}</span>
          <span className={cn('text-meta font-medium tabular-nums', failed ? 'text-error-text' : 'text-fg-secondary')}>{text}</span>
        </div>
        <Progress label={name} value={done} max={total} status={done + failed >= total ? (failed ? 'failed' : 'done') : 'active'} />
      </div>
    </li>
  );
}

/** UploadList — the rows of a batch. */
export function UploadList({ className, ...rest }: ComponentProps<'ul'>) {
  return <ul className={cn('m-0 flex flex-col gap-1 p-0', className)} {...rest} />;
}

/** While active, closing or reloading the page asks first. */
export function useBeforeUnloadWhile(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [active]);
}
