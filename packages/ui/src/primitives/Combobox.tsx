import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { Input } from "./Input";

// Combobox — async-search commit picker (recipient fields, entity
// lookups). Extracted from product-meta's CustomerPicker so every
// product surface shares one commit model (QA 2026-07-21: typed-but-
// uncommitted text was visually identical to a committed pick, and on
// slow networks the dropdown never even appeared before the user
// moved on).
//
// The model has exactly two visible states, both always unambiguous:
//
//   · The INPUT is always rendered and always editable — it carries
//     the "in progress" state (typing / searching). Editing it after
//     a commit clears the commit (via onUncommit) and resumes search.
//   · The COMMITTED CARD below the input carries the "confirmed"
//     state — title + subtitle + × to clear + an optional extra slot
//     (e.g. a display-name input for brand-new entities).
//
// Commit paths:
//   · click / Enter on a dropdown row            → onCommit(option)
//   · click / Enter on the free-entry row        → onCommit(free)
//   · BLUR with committable text (auto-commit)   → exact option match
//     when the search already returned one, else free entry when
//     `allowFreeEntry(raw)` passes. Deliberately independent of the
//     dropdown having rendered — on a slow network the free-entry
//     path still commits from the local validity check alone.
//   · blur with non-committable text             → invalid state
//     (error border + `invalidHint`), never a silent look-alike.
//
// The committed value is PARENT-OWNED (controlled): the parent maps
// options / free entries onto its own domain state and passes back
// `committed` for display. This keeps the primitive product-agnostic.

export interface ComboboxOption {
  // Stable identity for list keys + commit payloads.
  key: string;
  // Primary row line (e.g. a person's name).
  title: string;
  // Secondary row line (e.g. their email). Also used by the default
  // auto-commit matcher, so put the canonical typed value here.
  subtitle?: string | undefined;
}

export type ComboboxCommit =
  | { kind: "option"; option: ComboboxOption }
  | { kind: "free"; raw: string };

export interface ComboboxCommitted {
  title: ReactNode;
  subtitle?: ReactNode | undefined;
}

export interface ComboboxProps {
  label?: ReactNode | undefined;
  placeholder?: string | undefined;
  autoFocus?: boolean | undefined;
  disabled?: boolean | undefined;
  // Async search. Called after `debounceMs` of quiet with a non-empty
  // trimmed query; the AbortSignal cancels superseded requests.
  search: (query: string, signal: AbortSignal) => Promise<ComboboxOption[]>;
  debounceMs?: number | undefined;
  // Free-entry gate: return true when the raw text is committable on
  // its own (e.g. a syntactically valid email). Omit to disable free
  // entry entirely (only listed options commit).
  allowFreeEntry?: ((raw: string) => boolean) | undefined;
  // Dropdown row copy for the free-entry affordance.
  freeEntryLabel?: ((raw: string) => ReactNode) | undefined;
  // Rendered in the dropdown when a search returned nothing and free
  // entry doesn't apply.
  emptyHint?: ReactNode | undefined;
  // Error copy for "blurred with text that can't commit".
  invalidHint?: string | undefined;
  // Matcher backing blur auto-commit against loaded options. Default:
  // case-insensitive equality on subtitle, then title.
  matchOption?: ((raw: string, option: ComboboxOption) => boolean) | undefined;
  // Parent-owned committed state; null/undefined = nothing committed.
  committed?: ComboboxCommitted | null | undefined;
  // Extra content inside the committed card (below subtitle).
  committedExtra?: ReactNode | undefined;
  onCommit: (commit: ComboboxCommit) => void;
  // Fired when the user edits the input after a commit, or clicks the
  // card's ×. Parent clears its committed state.
  onUncommit?: (() => void) | undefined;
  testid?: string | undefined;
}

const DEFAULT_DEBOUNCE_MS = 250;

function defaultMatch(raw: string, option: ComboboxOption): boolean {
  const norm = raw.trim().toLowerCase();
  return (
    (option.subtitle ?? "").trim().toLowerCase() === norm ||
    option.title.trim().toLowerCase() === norm
  );
}

export function Combobox({
  label,
  placeholder,
  autoFocus,
  disabled,
  search,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  allowFreeEntry,
  freeEntryLabel,
  emptyHint,
  invalidHint,
  matchOption = defaultMatch,
  committed,
  committedExtra,
  onCommit,
  onUncommit,
  testid = "combobox",
}: ComboboxProps): ReactNode {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [invalid, setInvalid] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isCommitted = !!committed;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // Search is suspended while a commit is displayed — the input
    // still holds the committed text but shouldn't re-open the list.
    if (!query.trim() || isCommitted) {
      setResults([]);
      setLoading(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setLoading(true);
      search(query.trim(), ac.signal)
        .then((rows) => {
          if (ac.signal.aborted) return;
          setResults(rows);
          setHighlight(0);
          setLoading(false);
        })
        .catch(() => {
          if (ac.signal.aborted) return;
          // Search failure degrades to "no suggestions" — free-entry
          // auto-commit still works, which is the whole point on a
          // flaky network.
          setResults([]);
          setLoading(false);
        });
    }, debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [query, isCommitted, search, debounceMs]);

  const trimmed = query.trim();
  const freeEntryOk = !!allowFreeEntry && trimmed.length > 0 && allowFreeEntry(trimmed);
  const hasNoResults = !loading && trimmed.length > 0 && results.length === 0;
  const offerFree = !isCommitted && freeEntryOk && !results.some((r) => matchOption(trimmed, r));
  const totalEntries = results.length + (offerFree ? 1 : 0);

  const commitOption = useCallback(
    (option: ComboboxOption) => {
      setInvalid(false);
      setResults([]);
      setHighlight(0);
      // Reflect the commit in the input so a half-typed query never
      // sits next to a card naming someone else.
      setQuery(option.subtitle ?? option.title);
      onCommit({ kind: "option", option });
    },
    [onCommit],
  );

  const commitFree = useCallback(
    (raw: string) => {
      setInvalid(false);
      setResults([]);
      setHighlight(0);
      setQuery(raw);
      onCommit({ kind: "free", raw });
    },
    [onCommit],
  );

  // Blur auto-commit — the fix for "typed it, tabbed on, looked
  // committed but wasn't". Exact option match wins (brings the
  // entity's identity along); otherwise free entry; otherwise flag
  // invalid. Runs on a short delay so a dropdown row click (which
  // blurs first) still lands on the row handler.
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setFocused(false);
      if (isCommitted) return;
      const raw = trimmed;
      if (!raw) {
        setInvalid(false);
        return;
      }
      const exact = results.find((r) => matchOption(raw, r));
      if (exact) {
        commitOption(exact);
        return;
      }
      if (allowFreeEntry?.(raw)) {
        commitFree(raw);
        return;
      }
      setInvalid(true);
    }, 150);
  }, [isCommitted, trimmed, results, matchOption, allowFreeEntry, commitOption, commitFree]);

  const handleQueryChange = useCallback(
    (next: string) => {
      setQuery(next);
      setInvalid(false);
      if (isCommitted) onUncommit?.();
    },
    [isCommitted, onUncommit],
  );

  const clearCommitted = useCallback(() => {
    onUncommit?.();
    // Keep the committed text in the input for editing; focus so the
    // user can immediately type.
    inputRef.current?.focus();
  }, [onUncommit]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (isCommitted) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(totalEntries - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (totalEntries > 0) {
        e.preventDefault();
        if (highlight < results.length) {
          const chosen = results[highlight];
          if (chosen) commitOption(chosen);
        } else if (offerFree) {
          commitFree(trimmed);
        }
      } else if (freeEntryOk) {
        // No dropdown (e.g. search still in flight on a slow
        // network) — Enter on a valid free entry commits directly.
        e.preventDefault();
        commitFree(trimmed);
      }
    } else if (e.key === "Escape") {
      setQuery("");
      setResults([]);
      setInvalid(false);
    }
  };

  const showDropdown =
    focused && !isCommitted && (results.length > 0 || offerFree || (hasNoResults && !!emptyHint));

  return (
    <div style={{ position: "relative" }}>
      <Input
        ref={inputRef}
        label={label}
        data-testid={`${testid}-input`}
        value={query}
        disabled={disabled}
        onChange={(e) => handleQueryChange(e.target.value)}
        onFocus={() => {
          setFocused(true);
          setInvalid(false);
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        error={invalid ? (invalidHint ?? "Pick from the list to continue.") : null}
      />

      {showDropdown ? (
        <div
          data-testid={`${testid}-dropdown`}
          style={{
            position: "absolute",
            top: "100%",
            marginTop: 4,
            left: 0,
            right: 0,
            background: "var(--ck-bg-surface)",
            border: "1px solid var(--ck-border-strong)",
            borderRadius: "var(--ck-radius-sm)",
            boxShadow: "var(--ck-shadow-menu, 0 4px 12px rgba(0,0,0,0.08))",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          {results.map((row, i) => (
            <button
              key={row.key}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                commitOption(row);
              }}
              onMouseEnter={() => setHighlight(i)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "8px 12px",
                border: "none",
                background: i === highlight ? "var(--ck-bg-muted)" : "transparent",
                cursor: "pointer",
                font: "inherit",
                fontSize: 13,
                color: "var(--ck-text-primary)",
              }}
            >
              <div style={{ fontWeight: 500 }}>{row.title}</div>
              {row.subtitle ? (
                <div style={{ fontSize: 12, color: "var(--ck-text-secondary)" }}>
                  {row.subtitle}
                </div>
              ) : null}
            </button>
          ))}
          {offerFree ? (
            <button
              type="button"
              data-testid={`${testid}-free-entry`}
              onMouseDown={(e) => {
                e.preventDefault();
                commitFree(trimmed);
              }}
              onMouseEnter={() => setHighlight(results.length)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "8px 12px",
                border: "none",
                background:
                  highlight === results.length ? "var(--ck-bg-muted)" : "transparent",
                borderTop: results.length > 0 ? "1px solid var(--ck-border-subtle)" : "none",
                cursor: "pointer",
                font: "inherit",
                fontSize: 13,
                color: "var(--ck-accent)",
              }}
            >
              {freeEntryLabel ? freeEntryLabel(trimmed) : <>Use “{trimmed}”</>}
            </button>
          ) : hasNoResults && emptyHint ? (
            <div style={{ padding: "8px 12px", fontSize: 12, color: "var(--ck-text-secondary)" }}>
              {emptyHint}
            </div>
          ) : null}
        </div>
      ) : null}

      {committed ? (
        <div
          data-testid={`${testid}-committed`}
          style={{
            marginTop: 8,
            padding: "10px 12px",
            background: "var(--ck-bg-muted)",
            border: "1px solid var(--ck-border-subtle)",
            borderRadius: "var(--ck-radius-sm)",
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ck-text-primary)" }}>
              {committed.title}
            </div>
            {committed.subtitle ? (
              <div style={{ fontSize: 12, color: "var(--ck-text-secondary)" }}>
                {committed.subtitle}
              </div>
            ) : null}
            {committedExtra ? <div style={{ marginTop: 6 }}>{committedExtra}</div> : null}
          </div>
          {onUncommit ? (
            <button
              type="button"
              aria-label="Clear selection"
              data-testid={`${testid}-clear`}
              onClick={clearCommitted}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "var(--ck-text-secondary)",
                fontSize: 14,
                lineHeight: 1,
                padding: 2,
                flexShrink: 0,
              }}
            >
              ×
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
