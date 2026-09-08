import { forwardRef, useRef, type KeyboardEvent, type ReactNode } from "react";

import { Chip, type ChipTone } from "./Chip";
import { Combobox, type ComboboxHandle, type ComboboxProps } from "./Combobox";

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

export type MultiComboboxProps = Omit<
  ComboboxProps,
  "committed" | "committedExtra" | "onUncommit" | "clearOnCommit"
> & {
  entries: MultiComboboxEntry[];
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
      testid = "multi-combobox",
      ...comboboxProps
    },
    ref,
  ) {
    // Wraps ONLY the embedded Combobox so the Backspace handler can
    // tell its input apart from any input inside `renderEntryEditor`.
    const comboboxWrapRef = useRef<HTMLDivElement | null>(null);
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

    return (
      <div data-testid={testid} onKeyDownCapture={handleKeyDownCapture}>
        <div ref={comboboxWrapRef}>
          <Combobox
            ref={ref}
            {...comboboxProps}
            clearOnCommit
            committed={null}
            testid={`${testid}-combobox`}
          />
        </div>

        <ul
          role="list"
          aria-label={entriesLabel ?? "Selected items"}
          data-testid={`${testid}-entries`}
          style={{
            listStyle: "none",
            margin: entries.length > 0 ? "8px 0 0" : 0,
            padding: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
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
