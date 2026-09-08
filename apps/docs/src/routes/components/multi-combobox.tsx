import { useCallback, useRef, useState, type ReactNode } from "react";
import {
  Chip,
  Combobox,
  Input,
  MultiCombobox,
  type ComboboxCommit,
  type ComboboxCommitted,
  type ComboboxOption,
  type MultiComboboxEntry,
  type MultiComboboxHandle,
  type MultiComboboxLayout,
} from "@cosxai/ui";

// Chip + MultiCombobox (+ a short single-value Combobox section, since
// the kit had no page for it). The multi demo mirrors product-meta's
// recipient list: pick people from a static directory or type emails;
// an email without a known name gets a warning chip and an inline
// name editor under the chip row.

type Person = { key: string; name: string; email: string };

const DIRECTORY: Person[] = [
  { key: "ada", name: "Ada Lovelace", email: "ada@example.com" },
  { key: "grace", name: "Grace Hopper", email: "grace@example.com" },
  { key: "linus", name: "Linus Torvalds", email: "linus@example.com" },
  { key: "margaret", name: "Margaret Hamilton", email: "margaret@example.com" },
  { key: "ken", name: "Ken Thompson", email: "ken@example.com" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const looksLikeEmail = (raw: string): boolean => EMAIL_RE.test(raw.trim());

// The free-entry gate sees the WHOLE raw string, so a consumer that
// wants paste support accepts a separated list here and splits it in
// onCommit.
const splitEmails = (raw: string): string[] =>
  raw
    .split(/[\s,;]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
const looksLikeEmailList = (raw: string): boolean => {
  const parts = splitEmails(raw);
  return parts.length > 0 && parts.every(looksLikeEmail);
};

// Static in-memory search — real consumers call their API here.
async function searchDirectory(query: string): Promise<ComboboxOption[]> {
  const q = query.trim().toLowerCase();
  return DIRECTORY.filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q),
  ).map((p) => ({ key: p.key, title: p.name, subtitle: p.email }));
}

function localPart(email: string): string {
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : email;
}

export function MultiComboboxPage() {
  return (
    <>
      <h1>Chip + MultiCombobox</h1>
      <p className="docs-summary">
        A <code>Chip</code> is one selected value — a pill on a muted
        slab with an optional × and an optional click-to-edit label.
        <code>MultiCombobox</code> stacks the async-search{" "}
        <code>Combobox</code> on top of a row of Chips so a field can
        collect many values with the same search / free-entry / blur
        auto-commit model as the single-value picker.
      </p>

      <h2>Chip</h2>
      <p>
        Sentence-case 13px body text — deliberately not <code>Tag</code>,
        which is the uppercase mono status label. Tones:{" "}
        <code>neutral</code> (default), <code>accent</code>,{" "}
        <code>warning</code>, <code>critical</code>.
      </p>
      <Demo>
        <Chip>Neutral</Chip>
        <Chip tone="accent">Accent</Chip>
        <Chip tone="warning">Warning</Chip>
        <Chip tone="critical">Critical</Chip>
      </Demo>
      <p>
        <code>onRemove</code> adds the × button (<code>removeLabel</code>{" "}
        is its aria-label, default "Remove"). <code>onClick</code> turns
        the label into a button. <code>selected</code> outlines the chip
        in the accent colour; <code>disabled</code> dims it and disables
        both buttons.
      </p>
      <Demo>
        <Chip onRemove={() => alert("remove")} removeLabel="Remove Ada">
          Ada Lovelace
        </Chip>
        <Chip onClick={() => alert("edit")} onRemove={() => alert("remove")}>
          Click me to edit
        </Chip>
        <Chip selected onClick={() => {}} onRemove={() => {}}>
          Selected (editing)
        </Chip>
        <Chip tone="warning" onRemove={() => {}} title="grace@example.com">
          grace@example.com
        </Chip>
        <Chip disabled onClick={() => {}} onRemove={() => {}}>
          Disabled
        </Chip>
      </Demo>
      <p style={{ fontSize: 13, color: "var(--ck-text-tertiary)" }}>
        Root is <code>&lt;span class="ck-chip" data-ck-chip data-tone
        data-selected data-disabled&gt;</code>; ref + <code>...rest</code>{" "}
        (title, data-*, aria-*) land on it. Chrome presets can restyle
        via <code>[data-ck-chip]</code> — 0.24.0 ships no per-chrome
        CSS.
      </p>

      <h2>MultiCombobox</h2>
      <p>
        Pick people from the list or type an email and press Enter (or
        just tab away — blur auto-commits). Emails the directory does
        not know become <code>warning</code> chips and open an inline
        name editor under the row (Enter confirms, Escape cancels and
        drops a still-nameless entry). Click a chip to rename it, × to
        remove it, Backspace in the empty field removes the last one.
        Duplicates are rejected via the handle's <code>clear()</code>.
      </p>
      <Demo column>
        <RecipientsDemo layout="stacked" testid="multi-combobox" />
      </Demo>

      <h3>Inline layout</h3>
      <p>
        <code>layout="inline"</code> turns it into a mail-client "To"
        field: one Input-like frame holds the chips and the search
        input continues after the last chip (wrapping onto new lines
        as the list grows). The label renders above as an eyebrow, the
        dropdown spans the whole field, and the editor + hint stay
        below. Same props, same testids — only the chrome moves.
      </p>
      <Demo column>
        <RecipientsDemo
          layout="inline"
          testid="inline-recipients"
          initial={[
            { email: "ada@example.com", name: "Ada Lovelace" },
            { email: "grace@example.com", name: "Grace Hopper" },
            { email: "linus@example.com", name: "Linus Torvalds" },
          ]}
        />
      </Demo>

      <h3>How the pieces fit</h3>
      <pre>
        <code>{`const ref = useRef<MultiComboboxHandle>(null);

<MultiCombobox
  ref={ref}
  label="Recipients"
  search={search}
  allowFreeEntry={looksLikeEmail}
  entries={entries}                 // { key, title, subtitle?, tone?, editing? }[]
  onCommit={(commit) => { /* map option / free raw → your state */ }}
  onRemoveEntry={(key) => …}
  onEntryClick={(key) => … /* mark editing */}
  renderEntryEditor={(entry) => <Input … onBlur … />}
  hint={\`\${entries.length} recipients\`}
/>`}</code>
      </pre>
      <ul style={{ fontSize: 13 }}>
        <li>
          The value is parent-owned, exactly like <code>Combobox</code>:{" "}
          <code>onCommit</code> hands you each pick / free entry, you
          pass back <code>entries</code>.
        </li>
        <li>
          Splitting a pasted "a@x.co, b@x.co" into several entries is
          your job inside <code>onCommit</code> — <code>allowFreeEntry</code>{" "}
          sees the whole raw string.
        </li>
        <li>
          Backspace-removes-last only listens to the embedded search
          input, never to inputs inside <code>renderEntryEditor</code>.
          Opt out with <code>backspaceRemovesLast={"{false}"}</code>.
        </li>
        <li>
          Testids (from <code>testid</code>): <code>-combobox-input</code>,{" "}
          <code>-combobox-dropdown</code>, <code>-combobox-free-entry</code>,{" "}
          <code>-entries</code>, <code>-entry-&lt;key&gt;</code>,{" "}
          <code>-editor</code>.
        </li>
      </ul>

      <h3>Props</h3>
      <PropsTable
        rows={[
          ["entries", "MultiComboboxEntry[]", "Chips to render, in order."],
          ["layout", "\"stacked\" | \"inline\"", "Default \"stacked\" (field, chips below). \"inline\": chips inside the field, input after the last chip."],
          ["onRemoveEntry", "(key) => void", "× on a chip, or Backspace in the empty input (last entry)."],
          ["onEntryClick", "(key) => void", "Optional; chip labels become buttons."],
          ["renderEntryEditor", "(entry) => ReactNode", "Rendered under the chip row for the entry with editing: true."],
          ["entriesLabel", "string", "aria-label of the list. Default \"Selected items\"."],
          ["removeLabel", "(entry) => string", "aria-label of each × button. Default \"Remove\"."],
          ["backspaceRemovesLast", "boolean", "Default true."],
          ["hint", "ReactNode", "Tertiary 11px line under the entries."],
          ["…ComboboxProps", "", "Everything except committed / committedExtra / onUncommit / clearOnCommit."],
        ]}
      />
      <p style={{ fontSize: 13, color: "var(--ck-text-tertiary)" }}>
        Ref: <code>MultiComboboxHandle</code> = <code>ComboboxHandle</code>{" "}
        = <code>{"{ focus(); clear() }"}</code>.
      </p>

      <h2>Combobox (single value)</h2>
      <p>
        The base primitive: async search, free-entry gate, blur
        auto-commit, and a parent-owned committed card. New in 0.24.0:{" "}
        <code>clearOnCommit</code> (reset the input after{" "}
        <code>onCommit</code> instead of echoing the value — what
        MultiCombobox uses) and a forwarded <code>ComboboxHandle</code>.
        New in 0.25.0: <code>bare</code> (no field chrome of its own —
        the host draws the frame; backed by <code>Input bare</code>) and{" "}
        <code>inputId</code> for a host-drawn label.
      </p>
      <Demo column>
        <SingleDemo />
      </Demo>
    </>
  );
}

// ---------------------------------------------------------------------
// Multi-value demo — a stand-in for product-meta's RecipientListPicker.

type Recipient = { email: string; name: string };

function RecipientsDemo({
  layout,
  testid,
  initial = [{ email: "ada@example.com", name: "Ada Lovelace" }],
}: {
  layout: MultiComboboxLayout;
  testid: string;
  initial?: Recipient[];
}) {
  const ref = useRef<MultiComboboxHandle>(null);
  const [recipients, setRecipients] = useState<Recipient[]>(initial);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const search = useCallback((q: string) => searchDirectory(q), []);

  const beginEdit = useCallback((email: string, current: string) => {
    setEditingEmail(email);
    setDraftName(current);
  }, []);

  const handleCommit = useCallback(
    (commit: ComboboxCommit) => {
      // Free entry: split a pasted list — the consumer's job.
      const incoming: Recipient[] =
        commit.kind === "option"
          ? DIRECTORY.filter((p) => p.key === commit.option.key).map((p) => ({
              email: p.email,
              name: p.name,
            }))
          : splitEmails(commit.raw).map((email) => ({
              email,
              name: DIRECTORY.find((p) => p.email === email)?.name ?? "",
            }));
      const seen = new Set(recipients.map((r) => r.email));
      const fresh: Recipient[] = [];
      const dupes: string[] = [];
      for (const r of incoming) {
        if (seen.has(r.email)) dupes.push(r.email);
        else {
          seen.add(r.email);
          fresh.push(r);
        }
      }
      setNotice(dupes.length > 0 ? `${dupes.join(", ")} already in the list.` : null);
      if (fresh.length === 0) {
        ref.current?.clear();
        return;
      }
      setRecipients((rs) => [...rs, ...fresh]);
      // The editor lands on the FIRST entry still missing a name.
      const nameless = fresh.find((r) => !r.name);
      if (nameless) beginEdit(nameless.email, "");
    },
    [recipients, beginEdit],
  );

  const remove = useCallback((email: string) => {
    setRecipients((rs) => rs.filter((r) => r.email !== email));
    setEditingEmail((cur) => (cur === email ? null : cur));
    setNotice(null);
  }, []);

  const confirmEdit = useCallback(() => {
    if (!editingEmail) return;
    const name = draftName.trim();
    if (!name) return;
    setRecipients((rs) => rs.map((r) => (r.email === editingEmail ? { ...r, name } : r)));
    setEditingEmail(null);
    ref.current?.focus();
  }, [editingEmail, draftName]);

  const cancelEdit = useCallback(() => {
    if (!editingEmail) return;
    // A still-nameless entry is dropped on cancel.
    setRecipients((rs) => rs.filter((r) => r.email !== editingEmail || r.name));
    setEditingEmail(null);
    ref.current?.focus();
  }, [editingEmail]);

  const entries: MultiComboboxEntry[] = recipients.map((r) => ({
    key: r.email,
    title: r.name || r.email,
    subtitle: r.email,
    tone: r.name ? "neutral" : "warning",
    editing: r.email === editingEmail,
  }));

  return (
    <MultiCombobox
      ref={ref}
      layout={layout}
      testid={testid}
      label="Recipients"
      placeholder="Search the directory or type an email…"
      search={search}
      debounceMs={0}
      allowFreeEntry={looksLikeEmailList}
      freeEntryLabel={(raw) => (
        <>
          + Add <strong>{raw}</strong>
        </>
      )}
      emptyHint="Nobody matches. Type a full email (or paste several) to add them."
      invalidHint="Enter full email addresses, or pick someone from the list."
      entries={entries}
      onCommit={handleCommit}
      onRemoveEntry={remove}
      onEntryClick={(key) => {
        const r = recipients.find((x) => x.email === key);
        if (r) beginEdit(key, r.name || localPart(key));
      }}
      removeLabel={(entry) => `Remove ${entry.subtitle ?? entry.key}`}
      renderEntryEditor={(entry) => (
        <Input
          label={`Display name for ${entry.subtitle ?? entry.key}`}
          value={draftName}
          autoFocus
          autoComplete="off"
          placeholder="Shown on the watermark"
          onChange={(e) => setDraftName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              confirmEdit();
            } else if (e.key === "Escape") {
              e.preventDefault();
              cancelEdit();
            }
          }}
          onBlur={() => {
            if (draftName.trim()) confirmEdit();
          }}
        />
      )}
      hint={
        notice ?? `${recipients.length} recipient${recipients.length === 1 ? "" : "s"}`
      }
    />
  );
}

// ---------------------------------------------------------------------
// Single-value demo.

function SingleDemo() {
  const [committed, setCommitted] = useState<ComboboxCommitted | null>(null);
  const search = useCallback((q: string) => searchDirectory(q), []);
  return (
    <Combobox
      label="Owner"
      placeholder="Search by name or email…"
      search={search}
      debounceMs={0}
      searchOnFocus
      allowFreeEntry={looksLikeEmail}
      emptyHint="Nobody matches."
      invalidHint="Pick someone from the list, or enter a full email."
      committed={committed}
      onCommit={(commit) =>
        setCommitted(
          commit.kind === "option"
            ? { title: commit.option.title, subtitle: commit.option.subtitle }
            : { title: "New person", subtitle: commit.raw },
        )
      }
      onUncommit={() => setCommitted(null)}
    />
  );
}

// ---------------------------------------------------------------------

function Demo({ children, column }: { children: ReactNode; column?: boolean }) {
  return (
    <div
      style={{
        padding: 16,
        background: "var(--ck-bg-surface)",
        border: "1px solid var(--ck-border-subtle)",
        borderRadius: "var(--ck-radius-md)",
        marginBottom: 24,
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        flexDirection: column ? "column" : "row",
        alignItems: column ? "stretch" : "center",
      }}
    >
      {children}
    </div>
  );
}

function PropsTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ fontSize: 13, borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {["Prop", "Type", "Notes"].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "6px 8px",
                  borderBottom: "1px solid var(--ck-border-subtle)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([prop, type, notes]) => (
            <tr key={prop}>
              <td style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>
                <code>{prop}</code>
              </td>
              <td style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>
                <code>{type}</code>
              </td>
              <td style={{ padding: "6px 8px", color: "var(--ck-text-secondary)" }}>{notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
