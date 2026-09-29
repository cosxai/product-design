import * as Popover from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { useField } from './Field';
import { DEFAULT_LABELS, ListboxBody, type ListboxLabels, type ListItem } from './inputs-listbox';
import { useDebouncedSearch } from './inputs-search';

export type RecipientStatus = 'valid' | 'invalid' | 'unverified';
export type Recipient = { email: string; name?: string | undefined; status: RecipientStatus };

export type RecipientsInputProps = {
  value?: Recipient[] | undefined;
  defaultValue?: Recipient[] | undefined;
  onChange?: ((recipients: Recipient[]) => void) | undefined;
  /** People to suggest while typing (value = email). */
  search?: ((query: string, signal: AbortSignal) => Promise<ListItem[]>) | undefined;
  /** Status for a typed address that is well formed: valid, or unverified (dashed) when the caller can't confirm it. @default () => 'valid' */
  verify?: ((email: string) => 'valid' | 'unverified') | undefined;
  /** @default "Add people or paste emails" */
  placeholder?: string | undefined;
  labels?: Partial<ListboxLabels> & { remove?: ((r: Recipient) => string) | undefined; invalid?: string | undefined; unverified?: string | undefined };
  disabled?: boolean | undefined;
  /** A leading word inside the field, e.g. "To". */
  prefix?: ReactNode | undefined;
  id?: string | undefined;
  'aria-label'?: string | undefined;
  className?: string | undefined;
};

const EMAIL = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;
const SPLIT = /[\s,;]+/;

/** "Anna K <anna@x.co>" → the address; anything else as typed. */
function addressOf(token: string): string {
  const m = token.match(/<([^>]+)>/);
  return (m ? m[1]! : token).trim();
}

/**
 * RecipientsInput — the "To" field. Addresses become chips as they are
 * confirmed (Enter, comma, space or leaving the field); pasting a list
 * splits it. A malformed address gets the red outline and opens for
 * editing in place when clicked; one the caller can't confirm is dashed.
 * Backspace in the empty field removes the last chip.
 */
export function RecipientsInput({
  value,
  defaultValue = [],
  onChange,
  search,
  verify = () => 'valid',
  placeholder = 'Add people or paste emails',
  labels: labelsIn,
  disabled,
  prefix,
  id,
  className,
  ...aria
}: RecipientsInputProps) {
  const field = useField();
  const auto = useId();
  const listId = `ri${auto}-list`;
  const optionId = (i: number) => `ri${auto}-o${i}`;
  const labels = { ...DEFAULT_LABELS, ...labelsIn };
  const [own, setOwn] = useState<Recipient[]>(defaultValue);
  const list = value ?? own;
  const [text, setText] = useState('');
  const [editing, setEditing] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement | null>(null);
  const off = Boolean(disabled || field?.disabled);
  const { status, result, retry } = useDebouncedSearch(text, search, { delay: 250 });
  const items = (status === 'done' ? (result ?? []) : []).filter((i) => !list.some((r) => r.email.toLowerCase() === i.value.toLowerCase()));
  // Suggestions only while there is something to suggest: a new address
  // that matches no one is normal here, not "nothing matches".
  const showList = Boolean(search) && text.trim().length > 0 && editing === null && (status === 'searching' || status === 'error' || items.length > 0);

  const commitList = (next: Recipient[]) => {
    if (value === undefined) setOwn(next);
    onChange?.(next);
  };
  const toRecipient = (token: string, name?: string): Recipient => {
    const email = addressOf(token);
    return { email, ...(name ? { name } : {}), status: EMAIL.test(email) ? verify(email) : 'invalid' };
  };
  /** Turn typed text into chips; returns true when something was added. */
  const commitText = (raw: string, at: number | null = null) => {
    const tokens = raw.split(SPLIT).map((t) => t.trim()).filter(Boolean);
    if (!tokens.length) return false;
    const fresh = tokens.map((t) => toRecipient(t)).filter((r) => !list.some((x, i) => i !== at && x.email.toLowerCase() === r.email.toLowerCase()));
    const next = [...list];
    if (at === null) next.push(...fresh);
    else next.splice(at, 1, ...fresh);
    commitList(next);
    setText('');
    setEditing(null);
    return true;
  };
  const choose = (i: number) => {
    const it = items[i];
    if (!it) return;
    commitList([...list, { email: it.value, name: it.label, status: 'valid' }]);
    setText('');
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (showList && items.length && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setActive((a) => (e.key === 'ArrowDown' ? Math.min(items.length - 1, a + 1) : Math.max(0, a - 1)));
      return;
    }
    if (e.key === 'Enter' || e.key === ',' || e.key === ';' || (e.key === ' ' && text.trim()) || (e.key === 'Tab' && text.trim())) {
      if (e.key === 'Enter' && showList && status === 'done' && items.length) {
        e.preventDefault();
        choose(active);
        return;
      }
      if (commitText(text, editing)) e.preventDefault();
      else if (e.key !== 'Tab' && e.key !== ' ') e.preventDefault();
    } else if (e.key === 'Backspace' && !text && editing === null && list.length) {
      e.preventDefault();
      commitList(list.slice(0, -1));
    } else if (e.key === 'Escape' && editing !== null) {
      setEditing(null);
      setText('');
    }
  };

  const editInput = (
    <input
      ref={input}
      id={editing === null ? (id ?? field?.id) : undefined}
      value={text}
      disabled={off}
      placeholder={list.length || editing !== null ? undefined : placeholder}
      aria-label={aria['aria-label'] ?? (field?.labelId ? undefined : placeholder)}
      aria-labelledby={field?.labelId}
      aria-describedby={field?.describedBy}
      role={search ? 'combobox' : undefined}
      aria-expanded={search ? showList : undefined}
      aria-controls={search && showList ? listId : undefined}
      aria-autocomplete={search ? 'list' : undefined}
      aria-activedescendant={showList && status === 'done' && items.length ? optionId(active) : undefined}
      autoComplete="off"
      onChange={(e) => {
        setText(e.target.value);
        setActive(0);
      }}
      onPaste={(e) => {
        const pasted = e.clipboardData.getData('text');
        if (SPLIT.test(pasted.trim())) {
          e.preventDefault();
          commitText(text + pasted, editing);
        }
      }}
      onBlur={() => text.trim() && commitText(text, editing)}
      onKeyDown={onKey}
      className={cn('min-w-[8ch] flex-1 border-none bg-transparent p-0 py-1 font-sans text-[13px] text-fg outline-none placeholder:text-fg-secondary', editing !== null && 'min-w-[16ch]')}
    />
  );

  return (
    <Popover.Root open={showList} onOpenChange={() => {}}>
      <Popover.Anchor asChild>
        <div
          onClick={(e) => e.target === e.currentTarget && input.current?.focus()}
          className={cn(
            'flex min-h-[38px] w-full flex-wrap items-center gap-1.5 rounded-md border border-rule bg-sunk px-2 py-1 font-sans text-fg',
            'transition-[border-color] duration-[120ms] ease-standard focus-within:border-fg focus-within:shadow-(--focus-ring)',
            off && 'cursor-not-allowed bg-well text-fg-secondary',
            className,
          )}
        >
          {prefix !== undefined && <span className="pr-0.5 pl-1 text-[12.5px] text-fg-secondary">{prefix}</span>}
          {list.map((r, i) =>
            editing === i ? (
              <span key={`edit-${i}`} className="inline-flex rounded-sm border border-error bg-page px-1.5">
                {editInput}
              </span>
            ) : (
              <span
                key={r.email + i}
                className={cn(
                  'inline-flex max-w-full items-center gap-1 rounded-sm border bg-page py-0.5 pr-1 pl-2 text-[12.5px] leading-[1.4]',
                  r.status === 'invalid' ? 'border-error bg-error-wash' : r.status === 'unverified' ? 'border-dashed border-fg-secondary' : 'border-rule',
                )}
              >
                {r.status === 'invalid' ? (
                  <button
                    type="button"
                    disabled={off}
                    onClick={() => {
                      setEditing(i);
                      setText(r.email);
                      requestAnimationFrame(() => input.current?.focus());
                    }}
                    className="cursor-text truncate rounded-xs outline-none focus-visible:shadow-(--focus-ring)"
                  >
                    {r.email}
                    <span className="sr-only">, {labelsIn?.invalid ?? 'not a valid address — edit'}</span>
                  </button>
                ) : (
                  <span className="truncate" title={r.name ? r.email : undefined}>
                    {r.name ?? r.email}
                    {r.status === 'unverified' && <span className="sr-only">, {labelsIn?.unverified ?? 'unverified'}</span>}
                  </span>
                )}
                {!off && (
                  <button
                    type="button"
                    aria-label={labelsIn?.remove?.(r) ?? `Remove ${r.name ?? r.email}`}
                    onClick={() => commitList(list.filter((_, k) => k !== i))}
                    className="inline-grid cursor-pointer place-items-center rounded-xs text-fg-secondary outline-none hover:text-fg focus-visible:shadow-(--focus-ring)"
                  >
                    <X size={12} aria-hidden />
                  </button>
                )}
              </span>
            ),
          )}
          {editing === null && editInput}
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={12}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="rise z-60 rounded-lg border border-rule bg-page p-1 font-sans [--motion-reveal:200ms]"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <ListboxBody
            id={listId}
            optionId={optionId}
            items={items}
            active={active}
            status={status}
            query={text.trim()}
            canCreate={false}
            labels={labels}
            onActive={setActive}
            onChoose={choose}
            onRetry={retry}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
