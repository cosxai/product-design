import { FileText } from 'lucide-react';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@cosxai/ui';

/** One source an answer relies on. */
export type CitationSource = {
  /** The document or record: "Shareholder agreement v3". */
  title: ReactNode;
  /** Page in the source. Sets the default location ("p. 14") and action ("Open at page 14"). */
  page?: number | undefined;
  /** Where in the source, when it is not a page: "Clause 7.2(c)", "Row 12". Overrides the page's "p. 14". */
  location?: ReactNode;
  /** The quoted passage. Quotation marks are added. */
  excerpt?: ReactNode;
  /** Opens the source at the cited place (the viewer, highlighted). Preferred over `href`. */
  onOpen?: (() => void) | undefined;
  /** A link to the cited place, when opening is navigation. */
  href?: string | undefined;
};

/** Numbered sources, as the Agent cites them: `{ 1: {...}, 2: {...} }`. */
export type Citations = Readonly<Record<number, CitationSource>>;

export type CitationLabels = {
  /** The chip's accessible name. @default (n) => `Source ${n}` */
  source?: ((n: number) => string) | undefined;
  /** @default (page) => `p. ${page}` */
  page?: ((page: number) => string) | undefined;
  /** @default (page) => `Open at page ${page}` */
  openAtPage?: ((page: number) => string) | undefined;
  /** The action when there is no page. @default "Open source" */
  open?: string | undefined;
};

export const defaultCitationLabels = {
  source: (n: number) => `Source ${n}`,
  page: (page: number) => `p. ${page}`,
  openAtPage: (page: number) => `Open at page ${page}`,
  open: 'Open source',
} satisfies Required<CitationLabels>;

const labelsWith = (labels?: CitationLabels): Required<{ [K in keyof CitationLabels]-?: NonNullable<CitationLabels[K]> }> => ({
  source: labels?.source ?? defaultCitationLabels.source,
  page: labels?.page ?? defaultCitationLabels.page,
  openAtPage: labels?.openAtPage ?? defaultCitationLabels.openAtPage,
  open: labels?.open ?? defaultCitationLabels.open,
});

/** The source's location line: its own location, else "p. 14". */
export function citationLocation(source: CitationSource, labels?: CitationLabels): ReactNode {
  if (source.location !== undefined) return source.location;
  return source.page !== undefined ? labelsWith(labels).page(source.page) : undefined;
}

export type CitationProps = {
  n: number;
  source: CitationSource;
  labels?: CitationLabels | undefined;
  /** Controlled open state of the source card (for screenshots and tests). */
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  className?: string | undefined;
};

const OPEN_DELAY = 200;

const TABBABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** The next element in document Tab order after `from`, skipping citation cards. */
function tabbableAfter(from: HTMLElement | null): HTMLElement | null {
  if (!from) return null;
  for (const el of Array.from(document.querySelectorAll<HTMLElement>(TABBABLE))) {
    if (el.closest('[data-citation-card]')) continue;
    if (from.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) return el;
  }
  return null;
}
const CLOSE_DELAY = 150;

/**
 * Citation — the numbered chip at the end of a cited sentence. Hover or
 * focus shows the source card (title, location, the quoted passage and
 * "Open at page 14"); clicking the chip opens the source at that place.
 * The Markdown renderer draws one for every `[[n]]` it can resolve.
 *
 * Visual: design.cosx.co/pattern-agent (Citations).
 */
export function Citation({ n, source, labels, open: openProp, onOpenChange, className }: CitationProps) {
  const l = labelsWith(labels);
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );
  const root = useRef<HTMLSpanElement>(null);
  const chip = useRef<HTMLElement | null>(null);
  const setChip = (el: HTMLElement | null) => {
    chip.current = el;
  };
  const card = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cardId = useId();
  // The card is portalled to <body> and placed with fixed coordinates, so a
  // scrolling or overflow-hidden container (the Agent drawer) never clips it.
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const schedule = (next: boolean, delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), delay);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  // Keep the card on screen: below the chip, flipped above when there is no
  // room, shifted left to stay inside the viewport; follows scroll and resize.
  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const place = () => {
      if (!card.current || !chip.current) return;
      const c = chip.current.getBoundingClientRect();
      const box = card.current.getBoundingClientRect();
      const vw = document.documentElement.clientWidth || window.innerWidth;
      const vh = window.innerHeight;
      const up = c.bottom + 6 + box.height > vh - 8 && c.top - 6 - box.height > 8;
      const top = up ? c.top - 6 - box.height : c.bottom + 6;
      const left = Math.max(8, Math.min(c.left, vw - 8 - box.width));
      setPos({ top, left });
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  const inside = (node: Node | null) => Boolean(node && (root.current?.contains(node) || card.current?.contains(node)));

  const location = citationLocation(source, labels);
  const openable = Boolean(source.onOpen || source.href);
  const action = source.page !== undefined ? l.openAtPage(source.page) : l.open;

  const openSource = () => {
    setOpen(false);
    source.onOpen?.();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      clearTimeout(timer.current);
      setOpen(false);
      chip.current?.focus();
      return;
    }
    // The card lives at the end of <body>, so keep Tab order as if it sat
    // right after the chip: chip → card action → whatever follows the chip.
    if (e.key !== 'Tab' || !open) return;
    const action = card.current?.querySelector<HTMLElement>('a[href], button');
    const inCard = Boolean(card.current?.contains(e.target as Node));
    if (!inCard && !e.shiftKey && action) {
      e.preventDefault();
      action.focus();
    } else if (inCard && e.shiftKey) {
      e.preventDefault();
      chip.current?.focus();
    } else if (inCard) {
      const next = tabbableAfter(chip.current);
      if (next) {
        e.preventDefault();
        setOpen(false);
        next.focus();
      }
    }
  };

  // The design's inline label (Metaroom Agent): number, source, location
  // on the brand field; a deeper yellow while hovered or open.
  const chipClass = cn(
    'inline-flex h-[22px] max-w-full cursor-pointer items-center gap-[5px] rounded-[6px] border-0 py-0 pr-[7px] pl-[3px] align-[1px] font-sans text-[12px] leading-none font-medium whitespace-nowrap text-ink',
    'mx-0.5 outline-none transition-colors duration-[120ms] ease-standard focus-visible:shadow-(--focus-ring)',
    open ? 'bg-yellow-accent' : 'bg-brand-field hover:bg-yellow-accent',
  );
  const chipBody = (
    <>
      <span className="inline-grid h-4 min-w-4 place-items-center rounded-[4px] bg-ink px-[3px] text-[10px] font-bold text-brand-field tabular-nums">{n}</span>
      <span className="max-w-[min(220px,40vw)] truncate">{source.title}</span>
      {location !== undefined && <span className="text-ink/60 tabular-nums">{location}</span>}
    </>
  );

  return (
    <span
      ref={root}
      className={cn('relative inline-block indent-0', className)}
      onMouseEnter={() => schedule(true, OPEN_DELAY)}
      onMouseLeave={() => schedule(false, CLOSE_DELAY)}
      onFocus={() => {
        clearTimeout(timer.current);
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!inside(e.relatedTarget as Node | null)) schedule(false, 0);
      }}
      onKeyDown={onKeyDown}
    >
      {source.href && !source.onOpen ? (
        <a ref={setChip} href={source.href} aria-label={l.source(n)} aria-describedby={open ? cardId : undefined} className={cn(chipClass, 'no-underline')} data-citation={n}>
          {chipBody}
        </a>
      ) : (
        <button
          ref={setChip}
          type="button"
          aria-label={l.source(n)}
          aria-describedby={open ? cardId : undefined}
          aria-expanded={openable ? undefined : open}
          onClick={() => (openable ? openSource() : setOpen(!open))}
          className={chipClass}
          data-citation={n}
        >
          {chipBody}
        </button>
      )}
      {open &&
        createPortal(
        <span
          ref={card}
          id={cardId}
          role="group"
          aria-label={l.source(n)}
          data-citation-card={n}
          onMouseEnter={() => clearTimeout(timer.current)}
          onMouseLeave={() => schedule(false, CLOSE_DELAY)}
          onKeyDown={onKeyDown}
          onBlur={(e) => {
            if (!inside(e.relatedTarget as Node | null)) schedule(false, 0);
          }}
          style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, visibility: pos ? 'visible' : 'hidden' }}
          className={cn(
            'fixed z-[60] flex w-[320px] max-w-[calc(100vw-32px)] flex-col gap-2 rounded-[12px] border border-rule bg-page p-3.5 text-left font-sans text-fg',
            'leading-normal whitespace-normal [text-indent:0]',
          )}
        >
          <span className="flex items-center gap-2">
            <FileText size={14} strokeWidth={1.75} aria-hidden className="shrink-0" />
            <span className="min-w-0 truncate text-[13px] font-medium">{source.title}</span>
            {location !== undefined && <span className="ml-auto shrink-0 text-meta text-fg-secondary tabular-nums">{location}</span>}
          </span>
          {source.excerpt !== undefined && (
            <span className="block text-[13px] leading-[1.55] text-fg-secondary">
              “{source.excerpt}”
            </span>
          )}
          {openable &&
            (source.onOpen ? (
              <button
                type="button"
                onClick={openSource}
                className="cursor-pointer self-start rounded-xs border-0 bg-transparent p-0 font-sans text-meta font-semibold text-fg underline underline-offset-[3px] outline-none focus-visible:shadow-(--focus-ring)"
              >
                {action}
              </button>
            ) : (
              <a href={source.href} className="self-start rounded-xs text-meta font-semibold text-fg underline underline-offset-[3px] outline-none focus-visible:shadow-(--focus-ring)">
                {action}
              </a>
            ))}
        </span>,
          document.body,
        )}
    </span>
  );
}
