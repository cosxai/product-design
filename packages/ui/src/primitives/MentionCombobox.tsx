/**
 * MentionCombobox — headless `@`-trigger combobox with a textarea +
 * async-loaded dropdown. Consumer-agnostic: the dropdown's rows and
 * the data source are slotted in via props, so the same primitive
 * powers comment composers, share-invitation forms, DM autocomplete,
 * and anything else that needs `@<thing>` selection.
 *
 * Behavior:
 *   - User types `@` (or a custom `trigger`) → the component captures
 *     the cursor position + opens the dropdown
 *   - Whitespace after the trigger closes the dropdown without
 *     inserting (allows typing an `@email@host` verbatim)
 *   - The substring from trigger to next whitespace is the query;
 *     debounced (~150ms) before firing `loadCandidates(query, signal)`
 *   - Previous in-flight request is aborted on every keystroke
 *   - ArrowUp / ArrowDown move the highlight; Enter inserts the
 *     selected candidate's `getInsertionText(item)` back into the
 *     textarea, replacing the `@<query>` substring; Esc closes
 *
 * Positioning:
 *   - Dropdown sits absolutely positioned beneath the textarea — make
 *     sure the parent isn't `overflow: hidden` if the dropdown would
 *     extend past it. For embedded-in-modal usage, wrap consumers in
 *     a positioned ancestor with enough room or stamp `overflow:
 *     visible`.
 *
 * Public API (stable v0.6+):
 *   - generic `MentionComboboxProps<T>`
 *   - `MentionComboboxHandle.focus()`
 *   - `findActiveMentionStart()`, `extractQuery()` helpers (re-exported
 *     for consumers that need to inspect the textarea state themselves)
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ForwardedRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

export interface MentionComboboxProps<T> {
  value: string;
  onChange: (next: string) => void;

  // Data source. Called every time the debounced query changes.
  // The signal aborts when the next keystroke or unmount kicks in;
  // the loader is responsible for forwarding it to fetch().
  loadCandidates: (query: string, signal: AbortSignal) => Promise<T[]>;

  // React-key extractor for the dropdown.
  getItemKey: (item: T) => string;

  // The text that gets dropped into the textarea on selection,
  // INCLUDING the trigger rune. Consumer decides the canonical form
  // (`@email@host`, `@slug`, `@<display-name>`, etc.).
  getInsertionText: (item: T) => string;

  // Row renderer. The primitive owns the listbox shell + the active
  // background; the consumer just describes the row's contents.
  renderItem: (item: T, ctx: { highlighted: boolean }) => ReactNode;

  // Trigger character. Defaults to `@`.
  trigger?: string | undefined;

  // Debounce window before firing loadCandidates. Defaults to 150ms.
  debounceMs?: number | undefined;

  // Hard cap on rendered candidates (the dropdown shell). The loader
  // can return more; the primitive truncates. Defaults to 8.
  maxResults?: number | undefined;

  // Standard textarea props.
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  rows?: number | undefined;
  ariaLabel: string;
  "data-testid"?: string | undefined;

  // Optional error sink. Receives anything that's NOT an abort error.
  // Defaults to `console.warn` so a quiet swallow isn't the default
  // behaviour; consumers wanting Sentry plumb their own logger here.
  onLoadError?: ((err: unknown) => void) | undefined;
}

export interface MentionComboboxHandle {
  focus: () => void;
}

const DEFAULT_DEBOUNCE_MS = 150;
const DEFAULT_MAX_RESULTS = 8;
const DEFAULT_TRIGGER = "@";
const ABORTED_NAME = "AbortError";

// React.forwardRef erases generics; we cast back to a generic-aware
// signature so consumers get `MentionCombobox<T>` ergonomics.
function MentionComboboxInner<T>(
  props: MentionComboboxProps<T>,
  ref: ForwardedRef<MentionComboboxHandle>,
): ReactElement {
  const {
    value,
    onChange,
    loadCandidates,
    getItemKey,
    getInsertionText,
    renderItem,
    trigger = DEFAULT_TRIGGER,
    debounceMs = DEFAULT_DEBOUNCE_MS,
    maxResults = DEFAULT_MAX_RESULTS,
    placeholder,
    disabled = false,
    rows = 3,
    ariaLabel,
    onLoadError,
    "data-testid": testid,
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Imperative focus — consumer composers' mount-on-open flow needs it.
  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }));

  // Mention state — the active trigger position is the index of the
  // triggering rune (NOT the rune after it). null = no active mention.
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [candidates, setCandidates] = useState<T[]>([]);

  // Derive the active query from the value + mentionStart.
  const activeQuery = useMemo(() => {
    if (mentionStart === null) return "";
    return extractQuery(value, mentionStart);
  }, [value, mentionStart]);

  // Reset highlight whenever the candidate list changes.
  useEffect(() => {
    setHighlightIdx(0);
  }, [candidates]);

  // Debounced search with abort. We deliberately do NOT render a
  // "Searching…" spinner — the typical fetch round-trip after the
  // debounce is too short for one to be useful, and it ends up
  // flashing in/out per keystroke.
  useEffect(() => {
    if (mentionStart === null) {
      setCandidates([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      loadCandidates(activeQuery, controller.signal).then(
        (results) => {
          setCandidates(results.slice(0, maxResults));
        },
        (err) => {
          // Aborts are expected control flow; swallow silently.
          if (isAbortError(err)) return;
          setCandidates([]);
          if (onLoadError) onLoadError(err);
          else if (typeof console !== "undefined") {
            // eslint-disable-next-line no-console
            console.warn("MentionCombobox loadCandidates failed", err);
          }
        },
      );
    }, debounceMs);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // loadCandidates intentionally not in deps — most consumers
    // inline a fresh function each render and we'd thrash the debounce
    // on every keystroke. Consumers that want to reactively change
    // the data source can change `mentionStart` (close + reopen).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuery, mentionStart, debounceMs, maxResults]);

  const onValueChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;
      onChange(next);
      const cursor = e.target.selectionStart ?? next.length;
      setMentionStart(findActiveMentionStart(next, cursor, trigger));
    },
    [onChange, trigger],
  );

  // Re-derive mentionStart whenever the caret moves WITHOUT a value
  // change — click, arrow keys, home/end. Without this the dropdown
  // can linger after the user clicks away from the active trigger.
  const syncMentionFromCaret = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const cursor = el.selectionStart ?? el.value.length;
    setMentionStart(findActiveMentionStart(el.value, cursor, trigger));
  }, [trigger]);

  // Close on blur so a click outside the textarea doesn't orphan
  // the dropdown above other UI.
  const onBlur = useCallback(() => {
    setMentionStart(null);
  }, []);

  const onSelect = useCallback(
    (item: T) => {
      if (mentionStart === null) return;
      const before = value.slice(0, mentionStart);
      const after = value.slice(mentionStart + 1 + activeQuery.length);
      const insert = getInsertionText(item);
      const trailing = after.startsWith(" ") ? "" : " ";
      const next = `${before}${insert}${trailing}${after}`;
      onChange(next);
      setMentionStart(null);
      const cursorAt = before.length + insert.length + trailing.length;
      queueMicrotask(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(cursorAt, cursorAt);
      });
    },
    [activeQuery.length, getInsertionText, mentionStart, onChange, value],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (mentionStart === null || candidates.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIdx((i) => (i + 1) % candidates.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIdx((i) => (i - 1 + candidates.length) % candidates.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const candidate = candidates[highlightIdx];
        if (candidate !== undefined) onSelect(candidate);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setMentionStart(null);
      }
    },
    [candidates, highlightIdx, mentionStart, onSelect],
  );

  const open = mentionStart !== null && candidates.length > 0;
  const listboxId = "ck-mention-combobox-listbox";

  return (
    <div style={containerStyle}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onValueChange}
        onKeyDown={onKeyDown}
        onSelect={syncMentionFromCaret}
        onClick={syncMentionFromCaret}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        rows={rows}
        disabled={disabled}
        data-testid={testid}
        style={textareaStyle}
      />
      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          data-testid="ck-mention-combobox-listbox"
          aria-label="Mention suggestions"
          style={listboxStyle}
        >
          {candidates.map((item, i) => {
            const highlighted = i === highlightIdx;
            return (
              <li
                key={getItemKey(item)}
                role="option"
                aria-selected={highlighted}
                onMouseDown={(e) => {
                  // mousedown not click — onClick fires after
                  // textarea blurs, which would close the dropdown
                  // before the selection runs.
                  e.preventDefault();
                  onSelect(item);
                }}
                onMouseEnter={() => setHighlightIdx(i)}
                data-testid={`ck-mention-combobox-option-${getItemKey(item)}`}
                style={optionStyle(highlighted)}
              >
                {renderItem(item, { highlighted })}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

// forwardRef erases generics; re-assert the generic signature so
// consumers get T-aware ergonomics.
export const MentionCombobox = forwardRef(MentionComboboxInner) as <T>(
  props: MentionComboboxProps<T> & { ref?: ForwardedRef<MentionComboboxHandle> },
) => ReactElement;

// ────────────────────────────────────────────────────────────────────
// Helpers — exported for consumers that need to inspect textarea
// state themselves (e.g. computing whether an existing mention is
// already inserted before re-firing the picker).
// ────────────────────────────────────────────────────────────────────

/**
 * Find the index of the trigger rune that starts the mention
 * containing `cursor`, or null when the cursor isn't inside a mention.
 *
 * Rules:
 *   - The rune at cursor-1 must be the trigger, OR every rune walking
 *     back from cursor-1 must be a non-whitespace non-trigger rune
 *     until we hit a trigger preceded by whitespace / start-of-input.
 *   - The look-behind on whitespace means an embedded `email@host`
 *     in prose does NOT open the dropdown — only a trigger that
 *     follows whitespace (or is at position 0) counts.
 */
export function findActiveMentionStart(
  value: string,
  cursor: number,
  trigger: string = DEFAULT_TRIGGER,
): number | null {
  let i = cursor - 1;
  while (i >= 0) {
    const ch = value[i];
    if (ch === undefined) return null;
    if (/\s/.test(ch)) return null;
    if (ch === trigger) {
      if (i === 0) return i;
      const prev = value[i - 1];
      if (prev !== undefined && /\s/.test(prev)) return i;
      return null;
    }
    i--;
  }
  return null;
}

/**
 * Read the active mention's query — the characters from
 * mentionStart+1 up to the next whitespace (or end of value).
 */
export function extractQuery(value: string, mentionStart: number): string {
  const after = value.slice(mentionStart + 1);
  const m = after.match(/^\S*/);
  return m ? m[0] : "";
}

function isAbortError(err: unknown): boolean {
  if (typeof DOMException !== "undefined" && err instanceof DOMException && err.name === ABORTED_NAME) return true;
  if (err instanceof Error && err.name === ABORTED_NAME) return true;
  return false;
}

// ────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  position: "relative",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 60,
  resize: "vertical",
  padding: "0.5rem 0.625rem",
  fontSize: "0.875rem",
  border: "1px solid var(--ck-border-subtle)",
  borderRadius: "var(--ck-radius-md)",
  background: "var(--ck-bg-canvas)",
  color: "var(--ck-text-primary)",
  fontFamily: "inherit",
};

const listboxStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  right: 0,
  zIndex: 10,
  listStyle: "none",
  margin: 0,
  padding: 4,
  background: "var(--ck-bg-surface, #0f172a)",
  border: "1px solid var(--ck-border-subtle, #374151)",
  borderRadius: 6,
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.18)",
  maxHeight: 220,
  overflowY: "auto",
};

const optionStyle = (active: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 8px",
  borderRadius: 4,
  background: active ? "var(--ck-bg-muted)" : "transparent",
  fontSize: 12.5,
  cursor: "pointer",
});
