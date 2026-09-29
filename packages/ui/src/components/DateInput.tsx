import * as Popover from '@radix-ui/react-popover';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { DayPicker, type ChevronProps } from 'react-day-picker';
import { zhCN } from 'react-day-picker/locale';

import { cn } from '../lib/cn';
import { Field, useField } from './Field';
import { controlFrame, controlInner } from './forms-control';
import { SegmentedControl } from './SegmentedControl';
import { formatDate, fromDate, fromIso, langOf, parseDate, toDate, toIso, type PartialDate } from './inputs-date';

type Common = {
  label?: ReactNode;
  hint?: ReactNode;
  /** An error of the caller's own (required, out of range). */
  error?: ReactNode;
  disabled?: boolean | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  id?: string | undefined;
  name?: string | undefined;
  className?: string | undefined;
  /** Shown when the text cannot be read. */
  formatHint?: ReactNode;
};

export type DateInputProps = Common & {
  /** ISO date, YYYY-MM-DD; null when empty. */
  value?: string | null | undefined;
  defaultValue?: string | null | undefined;
  /** ISO date, or null when cleared. Unreadable text is not a change. */
  onChange?: ((value: string | null) => void) | undefined;
  /** Accessible name of the calendar button. @default "Choose a date" */
  calendarLabel?: string | undefined;
  /** Earliest / latest choosable (ISO). */
  min?: string | undefined;
  max?: string | undefined;
  placeholder?: string | undefined;
  /** Start with the calendar open. */
  defaultOpen?: boolean | undefined;
};

const calendarClasses = {
  root: 'font-sans text-fg',
  months: 'relative',
  month: 'flex flex-col gap-2',
  month_caption: 'flex h-8 items-center px-1 text-ui font-medium',
  caption_label: '',
  nav: 'absolute top-0 right-0 flex gap-1',
  button_previous:
    'inline-grid size-8 cursor-pointer place-items-center rounded-md text-fg outline-none hover:bg-hover focus-visible:shadow-(--focus-ring) disabled:opacity-40',
  button_next:
    'inline-grid size-8 cursor-pointer place-items-center rounded-md text-fg outline-none hover:bg-hover focus-visible:shadow-(--focus-ring) disabled:opacity-40',
  month_grid: 'border-collapse',
  weekdays: '',
  weekday: 'h-8 w-9 text-meta font-medium text-fg-secondary',
  week: '',
  day: 'p-0 text-center',
  day_button:
    'm-px inline-grid size-[34px] cursor-pointer place-items-center rounded-md text-[13px] tabular-nums text-fg outline-none hover:bg-hover focus-visible:shadow-(--focus-ring)',
  selected: '[&>button]:bg-ink [&>button]:font-semibold [&>button]:text-linen [&>button]:hover:bg-ink-raised ink:[&>button]:bg-yellow-accent ink:[&>button]:text-ink ink:[&>button]:hover:bg-yellow-accent-hover',
  today: '[&>button]:underline [&>button]:decoration-yellow-accent [&>button]:decoration-2 [&>button]:underline-offset-4',
  outside: '[&>button]:text-fg-secondary [&>button]:opacity-50',
  disabled: '[&>button]:cursor-not-allowed [&>button]:opacity-30',
  hidden: 'invisible',
  chevron: '',
};

function Chevron({ orientation }: ChevronProps) {
  return orientation === 'left' ? <ChevronLeft size={15} aria-hidden /> : <ChevronRight size={15} aria-hidden />;
}

/** A Field is built only from the component's own label / hint / error —
 * props that do not flip while typing — so the control never remounts when
 * the format note comes and goes. Without one, the note sits below. */
function ownField(common: Common) {
  return common.label !== undefined || common.hint !== undefined || common.error !== undefined;
}

function describedBy(common: Common, field: ReturnType<typeof useField>, unreadable: boolean, noteId: string) {
  const ids = [field?.describedBy, unreadable && !ownField(common) ? noteId : undefined].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

function wrap(common: Common, invalidNote: ReactNode | null, control: ReactNode, noteId: string) {
  const { label, hint, error } = common;
  if (ownField(common)) {
    return (
      <Field label={label} hint={hint} error={error ?? invalidNote ?? undefined} disabled={common.disabled} id={common.id}>
        {control}
      </Field>
    );
  }
  return (
    <>
      {control}
      {invalidNote !== null && (
        <span id={noteId} className="mt-1.5 block text-meta leading-normal text-error-text ink:text-error">
          {invalidNote}
        </span>
      )}
    </>
  );
}

/**
 * DateInput — type a date or pick one. Reads 12/03/2019 (day first),
 * 2019-03-12, 12 Mar 2019 and 2019年3月12日; shows it back as 12 Mar 2019.
 * The calendar sits on paper; the chosen day on the brand colour, today
 * underlined in the accent.
 */
export function DateInput(props: DateInputProps) {
  const { value, defaultValue = null, onChange, calendarLabel = 'Choose a date', min, max, placeholder = 'e.g. 12 Mar 2019', defaultOpen = false, formatHint = 'Use a date like 12 Mar 2019 or 2019-03-12.', name } =
    props;
  const [own, setOwn] = useState<string | null>(defaultValue);
  const iso = value === undefined ? own : value;
  const parsed = fromIso(iso);
  const frame = useRef<HTMLDivElement | null>(null);
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  useEffect(() => setLang(langOf(frame.current)), []);
  const [text, setText] = useState(parsed ? formatDate(parsed, lang) : '');
  const [unreadable, setUnreadable] = useState(false);
  const noteId = useId();
  const [open, setOpen] = useState(defaultOpen);

  // Follow value changes from outside.
  useEffect(() => {
    setText(parsed ? formatDate(parsed, lang) : '');
    setUnreadable(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iso, lang]);

  const commit = (next: string | null) => {
    if (value === undefined) setOwn(next);
    onChange?.(next);
  };
  const readText = () => {
    if (!text.trim()) {
      setUnreadable(false);
      if (iso !== null) commit(null);
      return;
    }
    const p = parseDate(text);
    if (!p) {
      setUnreadable(true);
      return;
    }
    setUnreadable(false);
    const next = toIso(p);
    setText(formatDate(p, lang));
    if (next !== iso) commit(next);
  };

  const bounds = [min && fromIso(min) ? { before: toDate(fromIso(min)!) } : null, max && fromIso(max) ? { after: toDate(fromIso(max)!) } : null].filter(
    (m): m is { before: Date } | { after: Date } => m !== null,
  );

  const control = (
    <Inner {...props} frame={frame} invalid={unreadable}>
      {(field) => (
        <>
          <input
            id={props.id ?? field?.id}
            value={text}
            placeholder={placeholder}
            disabled={props.disabled || field?.disabled}
            aria-invalid={unreadable || Boolean(props.error) || field?.invalid || undefined}
            aria-describedby={describedBy(props, field, unreadable, noteId)}
            onChange={(e) => {
              setText(e.target.value);
              if (unreadable) setUnreadable(false);
            }}
            onBlur={readText}
            onKeyDown={(e) => {
              if (e.key === 'Enter') readText();
              if (e.key === 'ArrowDown' && e.altKey) {
                e.preventDefault();
                setOpen(true);
              }
            }}
            className={controlInner}
          />
          {name && <input type="hidden" name={name} value={iso ?? ''} />}
          <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild disabled={props.disabled || field?.disabled}>
              <button
                type="button"
                aria-label={calendarLabel}
                className="-mr-1 inline-grid size-7 shrink-0 cursor-pointer place-items-center rounded-sm text-fg-secondary outline-none hover:bg-hover hover:text-fg focus-visible:shadow-(--focus-ring) disabled:cursor-not-allowed"
              >
                <CalendarDays size={15} aria-hidden />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="end"
                sideOffset={6}
                collisionPadding={12}
                aria-label={calendarLabel}
                // Focus lands on the chosen day (or today), not the first nav button.
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="rise z-60 rounded-lg border border-rule bg-page p-3 [--motion-reveal:200ms]"
              >
                <DayPicker
                  autoFocus
                  {...(lang === 'zh' ? { locale: zhCN } : {})}
                  mode="single"
                  weekStartsOn={1}
                  {...(parsed?.day ? { selected: toDate(parsed), defaultMonth: toDate(parsed) } : {})}
                  onSelect={(d) => {
                    if (!d) return;
                    commit(toIso(fromDate(d)));
                    setOpen(false);
                  }}
                  disabled={bounds}
                  classNames={calendarClasses}
                  components={{ Chevron }}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </>
      )}
    </Inner>
  );
  return wrap(props, unreadable ? formatHint : null, control, noteId);
}

function Inner({
  size,
  disabled,
  error,
  className,
  frame,
  invalid,
  children,
}: Common & { frame: React.RefObject<HTMLDivElement | null>; invalid: boolean; children: (field: ReturnType<typeof useField>) => ReactNode }) {
  const field = useField();
  const bad = invalid || Boolean(error) || Boolean(field?.invalid);
  const off = Boolean(disabled || field?.disabled);
  return (
    <div ref={frame} className={cn(controlFrame({ size, invalid: bad, disabled: off }), className)}>
      {children(field)}
    </div>
  );
}

export type DatePrecision = 'day' | 'month' | 'year';

export type FuzzyDateInputProps = Common & {
  /** YYYY-MM-DD, YYYY-MM or YYYY — or, when it could not be read, the text as typed. */
  value?: string | null | undefined;
  defaultValue?: string | null | undefined;
  /**
   * The date as ISO (partial allowed), `valid: false` with the raw text when
   * it cannot be read — which still saves: the caller decides.
   */
  onChange?: ((value: string | null, meta: { valid: boolean }) => void) | undefined;
  /** Precision labels. @default { day: 'Day', month: 'Month', year: 'Year', precision: 'Precision' } */
  labels?: { day: string; month: string; year: string; precision?: string | undefined } | undefined;
};

const precisionOf = (p: PartialDate): DatePrecision => (p.day !== undefined ? 'day' : p.month !== undefined ? 'month' : 'year');
const EXAMPLE: Record<DatePrecision, string> = { day: '2019-03-12', month: '2019-03', year: '2019' };

/**
 * FuzzyDateInput — a date people only partly remember (first entry to the
 * UK: 2019-03). One field that reads 12/03/2019, 2019-03-12, 12 Mar 2019,
 * Mar 2019 or 2019, and a Day · Month · Year switch that shows how much is
 * known — choosing a coarser one drops the rest. If the text cannot be read
 * it says the expected format — and still lets the form save.
 */
export function FuzzyDateInput(props: FuzzyDateInputProps) {
  const { value, defaultValue = null, onChange, labels: labelsIn, formatHint = 'Year required; day and month if known, e.g. 2019-03 or 12 Mar 2019.', size, name } = props;
  const labels = { day: 'Day', month: 'Month', year: 'Year', precision: 'Precision', ...labelsIn };
  const current = value === undefined ? defaultValue : value;
  const [text, setText] = useState(current ?? '');
  const [unreadable, setUnreadable] = useState(false);
  const [wanted, setWanted] = useState<DatePrecision | null>(null);
  const noteId = useId();
  const input = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value === undefined) return;
    if (value === null || fromIso(value)) setText(value ?? '');
  }, [value]);

  const parsed = parseDate(text, { partial: true });
  const precision = wanted ?? (parsed ? precisionOf(parsed) : 'month');

  const commit = (raw: string) => {
    const t = raw.trim();
    if (!t) {
      setUnreadable(false);
      setText('');
      onChange?.(null, { valid: true });
      return;
    }
    const p = parseDate(t, { partial: true });
    setUnreadable(!p);
    if (p) {
      setText(toIso(p));
      setWanted(null);
    }
    onChange?.(p ? toIso(p) : t, { valid: Boolean(p) });
  };

  const choose = (next: DatePrecision) => {
    const rank = { year: 0, month: 1, day: 2 };
    if (parsed && rank[next] < rank[precisionOf(parsed)]) {
      const cut: PartialDate = next === 'year' ? { year: parsed.year } : { year: parsed.year, month: parsed.month };
      setText(toIso(cut));
      setWanted(null);
      onChange?.(toIso(cut), { valid: true });
      return;
    }
    // Finer than what is known: say what to add, and let them type it.
    setWanted(next);
    input.current?.focus();
  };

  const control = (
    <FuzzyField>
      {(field) => (
        <div className={cn('flex items-center gap-2', props.className)}>
          <span className={cn(controlFrame({ size, invalid: unreadable || Boolean(props.error) || Boolean(field?.invalid), disabled: Boolean(props.disabled || field?.disabled) }), 'min-w-0 flex-1')}>
            <input
              ref={input}
              id={props.id ?? field?.id}
              value={text}
              placeholder={`e.g. ${EXAMPLE[precision]}`}
              autoComplete="off"
              disabled={props.disabled || field?.disabled}
              aria-invalid={unreadable || undefined}
              aria-describedby={describedBy(props, field, unreadable, noteId)}
              onChange={(e) => setText(e.target.value)}
              onBlur={(e) => commit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit(e.currentTarget.value);
              }}
              className={cn(controlInner, 'tabular-nums')}
            />
          </span>
          <SegmentedControl
            aria-label={labels.precision}
            value={precision}
            onChange={(v) => choose(v as DatePrecision)}
            segments={[
              { value: 'day', label: labels.day },
              { value: 'month', label: labels.month },
              { value: 'year', label: labels.year },
            ]}
            className="shrink-0"
            {...(size === 'sm' ? { size: 'sm' as const } : {})}
          />
          {name && <input type="hidden" name={name} value={parsed ? toIso(parsed) : text} />}
        </div>
      )}
    </FuzzyField>
  );
  return wrap(props, unreadable ? formatHint : null, control, noteId);
}

function FuzzyField({ children }: { children: (field: ReturnType<typeof useField>) => ReactNode }) {
  return <>{children(useField())}</>;
}
