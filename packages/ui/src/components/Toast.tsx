import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { useSyncExternalStore, type ReactNode } from 'react';

import { cn } from '../lib/cn';

export type ToastStatus = 'neutral' | 'complete' | 'attention' | 'error' | 'progress';

export type ToastOptions = {
  /** One sentence in the past tense: "3 files moved to Archive." Errors say why and what next. */
  title: ReactNode;
  description?: ReactNode;
  /** Sets the dot and the label. @default "neutral" */
  status?: ToastStatus | undefined;
  /** At most one: Undo or Retry. With an action the toast stays 8s and pauses on hover. */
  action?: { label: string; onClick: () => void; altText?: string | undefined } | undefined;
  /** ms. @default 4000, 8000 with an action */
  duration?: number | undefined;
};

type Entry = ToastOptions & { id: number };

/** At most three at once; the oldest leaves first. */
const MAX_VISIBLE = 3;
/** The same error shows once per 30 seconds. */
const REPEAT_WINDOW = 30_000;

let entries: Entry[] = [];
let nextId = 1;
const lastShown = new Map<string, number>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function set(next: Entry[]) {
  entries = next;
  emit();
}

/**
 * toast — report a result that happened off the page (a copy, a background
 * move, an upload finishing elsewhere). When the result can show in place
 * (a button, a row, a field), don't toast. Needs a <Toaster/> mounted once.
 * Returns the toast id, or null when an identical error is suppressed.
 */
export function toast(options: ToastOptions): number | null {
  const status = options.status ?? 'neutral';
  if (status === 'error' && typeof options.title === 'string') {
    const key = `error:${options.title}`;
    const at = lastShown.get(key);
    const now = Date.now();
    if (at !== undefined && now - at < REPEAT_WINDOW) return null;
    lastShown.set(key, now);
  }
  const id = nextId++;
  // The oldest leaves when a fourth arrives.
  set([...entries, { ...options, status, id }].slice(-MAX_VISIBLE));
  return id;
}

/** Close a toast early. */
toast.dismiss = (id: number) => set(entries.filter((e) => e.id !== id));

/** Test and story helper: forget every toast and the repeat window. */
toast.reset = () => {
  lastShown.clear();
  set([]);
};

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const DOT: Record<ToastStatus, string> = {
  neutral: 'bg-grey-inverse',
  progress: 'bg-grey-inverse',
  complete: 'bg-linen',
  attention: 'bg-yellow-accent',
  error: 'bg-error',
};

export type ToastLabels = Record<ToastStatus, string> & { dismiss: string; region: string };

const DEFAULT_LABELS: ToastLabels = {
  neutral: 'Notice',
  complete: 'Done',
  attention: 'Attention',
  error: 'Failed',
  progress: 'In progress',
  dismiss: 'Dismiss',
  region: 'Notifications',
};

const CARD = 'flex w-80 max-w-full items-start gap-3 rounded-[12px] bg-ink px-4 py-3.5 font-sans text-linen ink:border ink:border-inv-rule ink:bg-ink-raised';
const ACTION =
  'mt-2.5 inline-flex h-8 cursor-pointer items-center rounded-md border border-inv-rule bg-transparent px-3 text-[13px] font-semibold text-linen outline-none hover:border-linen focus-visible:shadow-[0_0_0_3px_var(--ink),0_0_0_5px_var(--yellow)]';
const CLOSE = 'flex cursor-pointer rounded-xs border-0 bg-transparent p-0.5 text-grey-inverse outline-none hover:text-linen focus-visible:shadow-[0_0_0_2px_var(--yellow)]';
const statusLabelClass = (status: ToastStatus) => cn('mb-0.5 text-meta font-medium', status === 'attention' ? 'text-yellow-accent' : 'text-grey-inverse');

export type ToastCardProps = Omit<ToastOptions, 'duration' | 'action'> & {
  /** A label, or the full action (label + onClick). */
  action?: string | ToastOptions['action'];
  onClose?: (() => void) | undefined;
  labels?: Partial<ToastLabels> | undefined;
  className?: string | undefined;
};

/**
 * ToastCard — one toast drawn in place, not queued: documentation
 * specimens and previews. In the product, call toast() instead.
 */
export function ToastCard({ title, description, status = 'neutral', action, onClose, labels, className }: ToastCardProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const act = typeof action === 'string' ? { label: action, onClick: () => {} } : action;
  return (
    <div className={cn(CARD, className)}>
      <span aria-hidden className={cn('mt-[5px] size-2 shrink-0 rounded-pill', DOT[status])} />
      <div className="min-w-0 flex-1">
        <div className={statusLabelClass(status)}>{l[status]}</div>
        <div className="text-ui leading-[1.4] font-medium">{title}</div>
        {description && <div className="mt-0.5 text-[13px] leading-normal text-grey-inverse">{description}</div>}
        {act && (
          <button type="button" onClick={act.onClick} className={ACTION}>
            {act.label}
          </button>
        )}
      </div>
      <button type="button" aria-label={l.dismiss} onClick={onClose} className={CLOSE}>
        <X size={14} strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}

export type ToasterProps = {
  /** Wording of the status labels and controls (e.g. Chinese). */
  labels?: Partial<ToastLabels> | undefined;
  /** px from the bottom — keep clear of the action bar and the zoom pill. @default 24 */
  offset?: number | undefined;
};

/**
 * Toaster — mount once. Ink notices, bottom right, three at most. Polite
 * announcements (errors assertive); a toast never takes focus, its action
 * is reachable by keyboard (F8 jumps to the region). Radix Toast.
 */
export function Toaster({ labels, offset = 24 }: ToasterProps) {
  const list = useSyncExternalStore(subscribe, () => entries, () => entries);
  const l = { ...DEFAULT_LABELS, ...labels };

  return (
    <ToastPrimitive.Provider swipeDirection="right" label={l.region}>
      {list.map((t) => {
        const status = t.status ?? 'neutral';
        return (
          <ToastPrimitive.Root
            key={t.id}
            open
            onOpenChange={(open) => {
              if (!open) set(entries.filter((e) => e.id !== t.id));
            }}
            duration={t.duration ?? (t.action ? 8000 : 4000)}
            type={status === 'error' ? 'foreground' : 'background'}
            className={cn(CARD, 'data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=end]:hidden')}
          >
            <span aria-hidden className={cn('mt-[5px] size-2 shrink-0 rounded-pill', DOT[status])} />
            <div className="min-w-0 flex-1">
              <div className={statusLabelClass(status)}>{l[status]}</div>
              <ToastPrimitive.Title className="text-ui leading-[1.4] font-medium">{t.title}</ToastPrimitive.Title>
              {t.description && <ToastPrimitive.Description className="mt-0.5 text-[13px] leading-normal text-grey-inverse">{t.description}</ToastPrimitive.Description>}
              {t.action && (
                <ToastPrimitive.Action
                  altText={t.action.altText ?? t.action.label}
                  onClick={t.action.onClick}
                  className={ACTION}
                >
                  {t.action.label}
                </ToastPrimitive.Action>
              )}
            </div>
            <ToastPrimitive.Close
              aria-label={l.dismiss}
              className={CLOSE}
            >
              <X size={14} strokeWidth={2} aria-hidden />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        );
      })}
      <ToastPrimitive.Viewport
        className="fixed right-6 z-[60] m-0 flex max-w-[calc(100vw-48px)] list-none flex-col gap-2.5 p-0 outline-none"
        style={{ bottom: offset }}
      />
    </ToastPrimitive.Provider>
  );
}
