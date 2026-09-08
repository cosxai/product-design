import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

import { Chip, type ChipTone } from "./Chip";
import {
  COMBOBOX_DEFAULT_INVALID_HINT,
  Combobox,
  type ComboboxHandle,
  type ComboboxProps,
} from "./Combobox";

/**
 * MultiCombobox — a Combobox that collects MANY values. The embedded
 * search input clears after every commit (`clearOnCommit`) and the
 * parent renders what it collected as a row of removable Chips below
 * the field. Exists so recipient lists (group share links: one URL,
 * N emails) and similar "pick several people / things" fields share
 * one interaction model with the single-value Combobox — same async
 * search, same free-entry gate, same blur auto-commit.
 *
 * Like Combobox, the value is PARENT-OWNED: `onCommit` hands the
 * parent each pick / free entry, the parent maps it onto its own
 * domain state and passes back `entries` for display. Splitting a
 * pasted "a@x.co, b@x.co" into several entries is the parent's job
 * inside `onCommit` (`allowFreeEntry` sees the whole raw string).
 *
 * Per entry: `title` (chip text), `subtitle` (native tooltip),
 * `tone` (e.g. `warning` for "still needs a name"), `editing` — the
 * one entry currently being edited renders `selected` and, when
 * `renderEntryEditor` is given, its editor mounts under the chip row
 * (the parent owns the editor's state; use the forwarded handle's
 * `focus()` to hand focus back to the search input when it closes).
 *
 * Keyboard: Backspace in the EMPTY search input removes the last
 * entry (`backspaceRemovesLast`, default true). The check is scoped
 * to the embedded Combobox's input, so Backspace inside an entry
 * editor never removes anything.
 *
 * Layouts (`layout`): `stacked` (default) — the search field, then
 * the chip row underneath. `inline` — a mail-client "To" field: one
 * Input-like frame (`.ck-multi-combobox-field`) holding the chips
 * with the search input continuing after the last chip; the label
 * renders above as an eyebrow, the editor and hint still below.
 *
 * Compose with: Chip (entries), Input (inside `renderEntryEditor`),
 * dialogs collecting recipients.
 *
 * Visual: see docs/components/multi-combobox.
 *
 * Forwards a `MultiComboboxHandle` (= `ComboboxHandle`): `focus()`
 * the search input, `clear()` its text (e.g. after rejecting a
 * duplicate). Testids (from `testid`, default "multi-combobox"):
 * `${testid}` wrapper, `${testid}-combobox-input` / `-dropdown` /
 * `-free-entry` (the embedded Combobox), `${testid}-entries` (the
 * list), `${testid}-entry-${key}` (each chip), `${testid}-editor`.
 */

export type MultiComboboxEntry = {
  // Stable identity — list key, testid suffix, and the argument to
  // `onRemoveEntry` / `onEntryClick`.
  key: string;
  // Chip text.
  title: ReactNode;
  // Native tooltip on the chip (e.g. the email behind a name).
  subtitle?: string | undefined;
  tone?: ChipTone | undefined;
  // Marks the entry being edited: chip renders `selected`, and
  // `renderEntryEditor(entry)` mounts below the chip row.
  editing?: boolean | undefined;
};

export type MultiComboboxHandle = ComboboxHandle;

export type MultiComboboxLayout = "stacked" | "inline";

export type MultiComboboxProps = Omit<
  ComboboxProps,
  "committed" | "committedExtra" | "onUncommit" | "clearOnCommit" | "bare" | "inputId"
> & {
  entries: MultiComboboxEntry[];
  // `stacked` (default): field, then chips underneath. `inline`:
  // chips inside the field, input after the last chip.
  layout?: MultiComboboxLayout | undefined;
  onRemoveEntry: (key: string) => void;
  // When set, chip labels become buttons (e.g. click-to-edit).
  onEntryClick?: ((key: string) => void) | undefined;
  // Inline editor for the entry with `editing: true`.
  renderEntryEditor?: ((entry: MultiComboboxEntry) => ReactNode) | undefined;
  // aria-label of the entries list. Default "Selected items".
  entriesLabel?: string | undefined;
  // Per-entry aria-label for the chip's × button. Default "Remove".
  removeLabel?: ((entry: MultiComboboxEntry) => string) | undefined;
  // Backspace in the empty search input removes the last entry.
  // Default true.
  backspaceRemovesLast?: boolean | undefined;
  // Small tertiary line under the entries (counts, duplicate notices).
  hint?: ReactNode | undefined;
};

// Inline layout: the host-drawn field mirrors Input's chrome. Focus
// ring / invalid border / disabled dim come from styles/index.css
// (`.ck-multi-combobox-field`).
const INLINE_FIELD_STYLE: CSSProperties = {
  position: "relative",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 6,
  minHeight: 36,
  padding: "4px 8px",
  boxSizing: "border-box",
  background: "var(--ck-bg-surface, #fff)",
  border: "1px solid var(--ck-border-strong, #C5C9D2)",
  borderRadius: "var(--ck-radius-sm, 6px)",
  transition: "border-color var(--ck-dur-fast, 120ms) var(--ck-ease, ease)",
};
// The bare Combobox's own root is `position: static` + flex sizing;
// this wrapper (needed for the Backspace scoping) must not interfere.
const INLINE_COMBOBOX_WRAP: CSSProperties = { display: "contents" };

export const MultiCombobox = forwardRef<MultiComboboxHandle, MultiComboboxProps>(
  function MultiCombobox(
    {
      entries,
      onRemoveEntry,
      onEntryClick,
      renderEntryEditor,
      entriesLabel,
      removeLabel,
      backspaceRemovesLast = true,
      hint,
      layout = "stacked",
      testid = "multi-combobox",
      label,
      ...comboboxProps
    },
    ref,
  ) {
    // Wraps ONLY the embedded Combobox so the Backspace handler can
    // tell its input apart from any input inside `renderEntryEditor`.
    const comboboxWrapRef = useRef<HTMLDivElement | null>(null);
    const handleRef = useRef<ComboboxHandle | null>(null);
    useImperativeHandle(ref, () => ({
      focus: () => handleRef.current?.focus(),
      clear: () => handleRef.current?.clear(),
    }));
    const inputId = useId();
    const inline = layout === "inline";
    const editing = entries.find((entry) => entry.editing);

    const handleKeyDownCapture = (e: KeyboardEvent<HTMLDivElement>): void => {
      if (!backspaceRemovesLast || e.key !== "Backspace") return;
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (!comboboxWrapRef.current?.contains(target)) return;
      if (target.value !== "") return;
      const last = entries[entries.length - 1];
      if (!last) return;
      onRemoveEntry(last.key);
    };

    // Clicking the field's empty area (inline) focuses the input, like
    // a mail client's To field. Chip / input clicks handle themselves.
    const handleFieldMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
      if (e.target !== e.currentTarget) return;
      e.preventDefault();
      handleRef.current?.focus();
    };

    const entriesList = (
      <ul
        role="list"
        aria-label={entriesLabel ?? "Selected items"}
        data-testid={`${testid}-entries`}
        style={
          inline
            ? { listStyle: "none", margin: 0, padding: 0, display: "contents" }
            : {
                listStyle: "none",
                margin: entries.length > 0 ? "8px 0 0" : 0,
                padding: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
              }
        }
      >
        {entries.map((entry) => (
          <li key={entry.key} style={{ minWidth: 0, maxWidth: "100%" }}>
            <Chip
              data-testid={`${testid}-entry-${entry.key}`}
              title={entry.subtitle}
              tone={entry.tone}
              selected={entry.editing}
              disabled={comboboxProps.disabled}
              onClick={onEntryClick ? () => onEntryClick(entry.key) : undefined}
              onRemove={() => onRemoveEntry(entry.key)}
              removeLabel={removeLabel?.(entry)}
            >
              {entry.title}
            </Chip>
          </li>
        ))}
      </ul>
    );

    const combobox = (
      <div ref={comboboxWrapRef} style={inline ? INLINE_COMBOBOX_WRAP : undefined}>
        <Combobox
          ref={handleRef}
          {...comboboxProps}
          label={inline ? undefined : label}
          bare={inline}
          inputId={inline ? inputId : undefined}
          clearOnCommit
          committed={null}
          testid={`${testid}-combobox`}
        />
      </div>
    );

    return (
      <div data-testid={testid} onKeyDownCapture={handleKeyDownCapture}>
        {inline ? (
          <>
            {label ? (
              <label
                htmlFor={inputId}
                className="ck-eyebrow"
                style={{ color: "var(--ck-text-secondary)", display: "block", marginBottom: 6 }}
              >
                {label}
              </label>
            ) : null}
            <div
              className="ck-multi-combobox-field"
              data-testid={`${testid}-field`}
              style={INLINE_FIELD_STYLE}
              onMouseDown={handleFieldMouseDown}
            >
              {entriesList}
              {combobox}
            </div>
            <div
              className="ck-multi-combobox-invalid-hint"
              style={{
                marginTop: 6,
                font: "400 11px/1.4 var(--ck-font-sans)",
                color: "var(--ck-critical)",
              }}
            >
              {comboboxProps.invalidHint ?? COMBOBOX_DEFAULT_INVALID_HINT}
            </div>
          </>
        ) : (
          <>
            {combobox}
            {entriesList}
          </>
        )}

        {editing && renderEntryEditor ? (
          <div data-testid={`${testid}-editor`} style={{ marginTop: 8 }}>
            {renderEntryEditor(editing)}
          </div>
        ) : null}

        {hint ? (
          <div
            style={{
              marginTop: 6,
              fontSize: 11,
              lineHeight: 1.4,
              color: "var(--ck-text-tertiary, #8B92A3)",
            }}
          >
            {hint}
          </div>
        ) : null}
      </div>
    );
  },
);
