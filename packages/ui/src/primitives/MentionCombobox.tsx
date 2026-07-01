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

  // Optional list of already-inserted mention display names. When
  // provided and non-empty, the primitive draws a mirrored overlay
  // behind the textarea that renders each `@Name` occurrence
  // (matched longest-first, whitespace-bounded) as an accent-tinted
  // chip while the user is still composing. Textarea's own glyphs
  // are hidden with `color: transparent` + `caret-color: currentColor`
  // so the cursor stays visible but the overlay is what the reader
  // actually sees.
  //
  // Consumers typically derive this from their captured
  // pick-list — see product-meta's CommentComposer which stores
  // `PickedMention[]` on submit for the bracket-form wire
  // serializer and passes `picks.map(p => p.name)` here.
  //
  // Omit or pass an empty array to opt out — the primitive renders
  // exactly as before with zero overlay overhead.
  mentionNames?: readonly string[] | undefined;
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
    mentionNames,
    "data-testid": testid,
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const showOverlay = mentionNames !== undefined && mentionNames.length > 0;

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

  // Sync the overlay's scroll position when the textarea scrolls.
  // Long comments overflow vertically; the overlay must scroll in
  // lockstep so highlighted spans stay aligned with the caret.
  const onTextareaScroll = useCallback(() => {
    const ta = textareaRef.current;
    const ov = overlayRef.current;
    if (ta && ov) ov.scrollTop = ta.scrollTop;
  }, []);

  return (
    <div style={containerStyle}>
      {showOverlay ? (
        <MentionHighlightOverlay
          ref={overlayRef}
          value={value}
          mentionNames={mentionNames}
        />
      ) : null}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onValueChange}
        onKeyDown={onKeyDown}
        onSelect={syncMentionFromCaret}
        onClick={syncMentionFromCaret}
        onBlur={onBlur}
        onScroll={showOverlay ? onTextareaScroll : undefined}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        rows={rows}
        disabled={disabled}
        data-testid={testid}
        style={showOverlay ? textareaTransparentStyle : textareaStyle}
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
// Mention highlight overlay
// ────────────────────────────────────────────────────────────────────

// MentionHighlightOverlay renders a mirrored view of the composer
// text with each `@Name` (where Name matches an entry in
// `mentionNames`) wrapped in an accent-tinted chip. Sits behind the
// transparent-glyph textarea; scroll is synced by the parent when
// the textarea overflows.
//
// forwardRef so the parent can drive scrollTop on `onScroll`.
const MentionHighlightOverlay = forwardRef<
  HTMLDivElement,
  { value: string; mentionNames: readonly string[] }
>(function MentionHighlightOverlay({ value, mentionNames }, ref) {
  const segments = splitByMentionNames(value, mentionNames);
  return (
    <div
      ref={ref}
      aria-hidden
      data-testid="ck-mention-combobox-overlay"
      style={overlayStyle}
    >
      {segments.map((seg, i) =>
        seg.kind === "mention" ? (
          <span key={i} style={chipStyle}>
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
      {/* Trailing zero-width character keeps a trailing newline
          visible in the overlay (browsers collapse a lone final \n
          in a block, but the textarea shows the empty line — the
          zero-width forces the overlay to match). */}
      {value.endsWith("\n") ? "​" : null}
    </div>
  );
});

// splitByMentionNames walks the composer text and produces an
// alternating sequence of plain-text + mention-chip segments,
// scanning left-to-right and matching known names longest-first so
// `@Ben Zhang` beats a shorter `@Ben`. Boundary rule: the char
// before `@` must be whitespace or start-of-input; this keeps an
// embedded email like `user@host` from mistakenly matching a
// zero-length prefix.
export function splitByMentionNames(
  text: string,
  names: readonly string[],
): Array<{ kind: "text" | "mention"; text: string }> {
  if (!text || names.length === 0) return [{ kind: "text", text }];
  const tokens = [...names].sort((a, b) => b.length - a.length).map((n) => `@${n}`);
  const out: Array<{ kind: "text" | "mention"; text: string }> = [];
  let i = 0;
  while (i < text.length) {
    let matched = false;
    for (const token of tokens) {
      if (!text.startsWith(token, i)) continue;
      if (i > 0) {
        const prev = text[i - 1];
        if (prev !== undefined && /\S/.test(prev)) continue;
      }
      out.push({ kind: "mention", text: token });
      i += token.length;
      matched = true;
      break;
    }
    if (!matched) {
      const last = out[out.length - 1];
      const ch = text[i];
      if (ch === undefined) {
        i++;
        continue;
      }
      if (last && last.kind === "text") {
        last.text += ch;
      } else {
        out.push({ kind: "text", text: ch });
      }
      i++;
    }
  }
  return out;
}

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
  lineHeight: 1.5,
  border: "1px solid var(--ck-border-subtle)",
  borderRadius: "var(--ck-radius-md)",
  background: "var(--ck-bg-canvas)",
  color: "var(--ck-text-primary)",
  fontFamily: "inherit",
};

// textareaTransparentStyle is textareaStyle with:
//   - color: transparent  → hide the textarea's own glyphs
//   - -webkit-text-fill-color: transparent  → Safari counterpart
//   - caretColor: currentColor via inherit chain (the outer element
//     keeps its `--ck-text-primary` colour) so the cursor stays
//     visible even though text glyphs don't render
//   - background: transparent → let the overlay behind be visible
//   - position: relative + zIndex: 1 → sit on top of the absolutely-
//     positioned overlay so caret / selection are drawn above the
//     highlight chips
// Rest of the box model matches textareaStyle exactly so the
// overlay lines up character-for-character.
const textareaTransparentStyle: React.CSSProperties = {
  ...textareaStyle,
  position: "relative",
  zIndex: 1,
  background: "transparent",
  color: "transparent",
  WebkitTextFillColor: "transparent",
  caretColor: "var(--ck-text-primary, #111827)",
};

// overlayStyle is the mirrored render layer that sits BEHIND the
// transparent-glyph textarea. It matches textareaStyle's box model
// (padding, font, border) so text positions coincide with the
// textarea's positions on a character-for-character basis. The
// border here is visible so the composer keeps its box outline
// even though the textarea's own border is transparent.
const overlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  padding: "0.5rem 0.625rem",
  fontSize: "0.875rem",
  lineHeight: 1.5,
  border: "1px solid var(--ck-border-subtle)",
  borderRadius: "var(--ck-radius-md)",
  background: "var(--ck-bg-canvas)",
  color: "var(--ck-text-primary)",
  fontFamily: "inherit",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  overflowY: "auto",
  overflowX: "hidden",
  pointerEvents: "none",
  boxSizing: "border-box",
  zIndex: 0,
};

// chipStyle must NOT add any horizontal or vertical space (no
// padding, no margin, no border) — the textarea's underlying
// `@Ben Zhang` glyphs occupy the natural text width, and any extra
// width on the overlay chip would shift every character after it
// out of alignment with the textarea's caret. Instead we lean on
// background + color + a tight border-radius to convey "chip"
// without adding layout. `font-weight` stays at the inherited
// value for the same reason: heavier weight changes glyph advance
// widths and drifts the trailing text by a sub-pixel per character.
const chipStyle: React.CSSProperties = {
  borderRadius: 3,
  background: "var(--ck-accent-soft, rgba(37, 99, 235, 0.12))",
  color: "var(--ck-accent, #2563eb)",
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
