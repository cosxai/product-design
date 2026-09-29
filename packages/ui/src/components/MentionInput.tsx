import * as Popover from '@radix-ui/react-popover';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Button } from './Button';
import { useField } from './Field';
import { DEFAULT_LABELS, ListboxBody, type ListboxLabels, type ListItem } from './inputs-listbox';
import type { SearchStatus } from './inputs-search';

export type Mention = { value: string; label: string };

export type MentionInputProps = {
  value?: string | undefined;
  defaultValue?: string | undefined;
  /** The text and the people mentioned in it (those whose @Name is still there). */
  onChange?: ((text: string, mentions: Mention[]) => void) | undefined;
  /** ⌘Enter / Ctrl+Enter, or the send button. */
  onSubmit?: ((text: string, mentions: Mention[]) => void) | undefined;
  /** People who can be mentioned; meta is their role (Member, Customer). */
  people: ListItem[];
  placeholder?: string | undefined;
  /** @default "Send" — null hides the button (⌘Enter still sends). */
  submitLabel?: ReactNode;
  /** @default "⌘Enter to send" (Ctrl+Enter off the Mac) */
  submitHint?: ReactNode;
  labels?: Partial<ListboxLabels> | undefined;
  disabled?: boolean | undefined;
  /** Rows before it scrolls. @default 3 */
  rows?: number | undefined;
  /** Focus on mount, caret at the end (an @ being typed there opens the list). */
  autoFocus?: boolean | undefined;
  id?: string | undefined;
  'aria-label'?: string | undefined;
  className?: string | undefined;
};

const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** The @query being typed at the caret: "@" at a word start, no spaces since. */
export function mentionAt(text: string, caret: number): { start: number; query: string } | null {
  const before = text.slice(0, caret);
  const at = before.lastIndexOf('@');
  if (at < 0) return null;
  if (at > 0 && !/\s/.test(before[at - 1]!)) return null;
  const query = before.slice(at + 1);
  if (/\s/.test(query) || query.length > 30) return null;
  return { start: at, query };
}

/**
 * MentionInput — the comment box: @ opens the people who can be mentioned
 * (arrows, Enter or Tab to insert, Esc to close); the mention goes in as
 * @Name. ⌘Enter sends. Mentions are reported with the text, and only while
 * their @Name is still in it.
 */
export function MentionInput({
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  people,
  placeholder,
  submitLabel = 'Send',
  submitHint,
  labels: labelsIn,
  disabled,
  rows = 3,
  autoFocus = false,
  id,
  className,
  ...aria
}: MentionInputProps) {
  const field = useField();
  const auto = useId();
  const listId = `mi${auto}-list`;
  const optionId = (i: number) => `mi${auto}-o${i}`;
  const labels = { ...DEFAULT_LABELS, ...labelsIn, empty: labelsIn?.empty ?? ((q: string) => `No one matches “${q}”.`) };
  const [own, setOwn] = useState(defaultValue);
  const text = value ?? own;
  const [picked, setPicked] = useState<Mention[]>([]);
  const [at, setAt] = useState<{ start: number; query: string } | null>(null);
  const [active, setActive] = useState(0);
  const area = useRef<HTMLTextAreaElement | null>(null);
  // After a token goes in, put the caret after it once the new text is on screen.
  const caretTo = useRef<number | null>(null);
  useLayoutEffect(() => {
    const pos = caretTo.current;
    if (pos === null || !area.current) return;
    caretTo.current = null;
    area.current.focus();
    area.current.setSelectionRange(pos, pos);
  }, [text]);
  const off = Boolean(disabled || field?.disabled);

  const matches = useMemo(() => {
    if (!at) return [];
    const q = at.query.toLowerCase();
    return people.filter((p) => p.label.toLowerCase().includes(q) || (p.meta ?? '').toLowerCase().startsWith(q)).slice(0, 8);
  }, [at, people]);
  const status: SearchStatus = 'done';
  const open = at !== null && !off;

  const live = (t: string) => picked.filter((m, i, all) => t.includes(`@${m.label}`) && all.findIndex((x) => x.value === m.value) === i);
  const set = (t: string, list = picked) => {
    if (value === undefined) setOwn(t);
    onChange?.(t, list.filter((m) => t.includes(`@${m.label}`)));
  };
  const track = (t: string, caret: number) => {
    const next = mentionAt(t, caret);
    setAt(next);
    if (next && (!at || next.query !== at.query)) setActive(0);
  };
  // autoFocus: caret at the end, and an @ being typed there opens the list.
  useEffect(() => {
    const el = area.current;
    if (!autoFocus || !el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
    track(el.value, el.value.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- on mount only
  }, []);
  const insert = (i: number) => {
    const p = matches[i];
    if (!p || !at) return;
    const token = `@${p.label} `;
    const caret = at.start + 1 + at.query.length;
    const next = text.slice(0, at.start) + token + text.slice(caret);
    const list = [...picked, { value: p.value, label: p.label }];
    setPicked(list);
    set(next, list);
    setAt(null);
    const pos = at.start + token.length;
    caretTo.current = pos;
  };
  const submit = () => {
    if (!text.trim()) return;
    onSubmit?.(text, live(text));
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (open && matches.length) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => (e.key === 'ArrowDown' ? (a + 1) % matches.length : (a - 1 + matches.length) % matches.length));
        return;
      }
      if ((e.key === 'Enter' && !e.metaKey && !e.ctrlKey) || e.key === 'Tab') {
        e.preventDefault();
        insert(active);
        return;
      }
    }
    if (open && e.key === 'Escape') {
      e.preventDefault();
      setAt(null);
      return;
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-md border border-rule bg-sunk font-sans text-fg',
        'transition-[border-color] duration-[120ms] ease-standard focus-within:border-fg focus-within:shadow-(--focus-ring)',
        field?.invalid && 'border-error focus-within:border-error',
        off && 'cursor-not-allowed bg-well text-fg-secondary',
        className,
      )}
    >
      <Popover.Root open={open} onOpenChange={(o) => !o && setAt(null)}>
        <Popover.Anchor asChild>
          <textarea
            ref={area}
            id={id ?? field?.id}
            rows={rows}
            value={text}
            placeholder={placeholder}
            disabled={off}
            aria-controls={open ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={open && matches.length ? optionId(active) : undefined}
            aria-label={aria['aria-label']}
            aria-describedby={field?.describedBy}
            onChange={(e) => {
              set(e.target.value);
              track(e.target.value, e.target.selectionStart ?? e.target.value.length);
            }}
            onSelect={(e) => track(e.currentTarget.value, e.currentTarget.selectionStart ?? 0)}
            onKeyDown={onKey}
            onBlur={() => setAt(null)}
            className="min-h-0 w-full resize-none border-none bg-transparent px-2.5 pt-2 pb-1 font-sans text-[13px] leading-normal text-inherit outline-none placeholder:text-fg-secondary"
          />
        </Popover.Anchor>
        <Popover.Portal>
          <Popover.Content
            align="start"
            side="bottom"
            sideOffset={4}
            collisionPadding={12}
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="rise z-60 w-[260px] rounded-lg border border-rule bg-page p-1 font-sans [--motion-reveal:200ms]"
          >
            <ListboxBody
              id={listId}
              optionId={optionId}
              items={matches}
              active={active}
              status={status}
              query={at?.query ?? ''}
              canCreate={false}
              labels={labels}
              onActive={setActive}
              onChoose={insert}
              onRetry={() => {}}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <div className="flex items-center justify-end gap-3 px-2 pb-2">
        <span className="text-meta text-fg-secondary">{submitHint ?? (isMac() ? '⌘Enter to send' : 'Ctrl+Enter to send')}</span>
        {submitLabel !== null && (
          <Button size="sm" disabled={off || !text.trim()} onClick={submit}>
            {submitLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
