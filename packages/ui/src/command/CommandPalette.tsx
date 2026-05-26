import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { CommandContext } from "./command-context";
import { rankItems } from "./rank";
import { Kbd } from "../primitives/Kbd";
import type { CommandItem } from "./types";

// The palette UI. Mounts inside <CommandProvider>; reads items from
// the registry, filters, groups, navigates. Arrow keys + Enter +
// Esc bound while open. Cmd+K toggle lives in the provider.

export interface CommandPaletteProps {
  // Order in which groups appear. Items in groups not listed
  // here come last in registration order.
  groupOrder?: string[];
  placeholder?: string;
}

export function CommandPalette({
  groupOrder = [],
  placeholder = "Type a command or search…",
}: CommandPaletteProps) {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error("<CommandPalette> must be inside <CommandProvider>");
  const { open, setOpen, items } = ctx;
  const [q, setQ] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset query + focus on every open.
  useEffect(() => {
    if (open) {
      setQ("");
      setSelectedIdx(0);
      // RAF so the modal element exists before focus.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Filter + flat-group ordering.
  const filtered = useMemo(() => rankItems(items, q), [items, q]);
  const grouped = useMemo(() => {
    const byGroup: Record<string, CommandItem[]> = {};
    for (const it of filtered) {
      (byGroup[it.group] ??= []).push(it);
    }
    const seen = new Set<string>();
    const ordered: { group: string; items: CommandItem[] }[] = [];
    for (const g of groupOrder) {
      if (byGroup[g]) {
        ordered.push({ group: g, items: byGroup[g] });
        seen.add(g);
      }
    }
    for (const g of Object.keys(byGroup)) {
      if (seen.has(g)) continue;
      ordered.push({ group: g, items: byGroup[g]! });
    }
    return ordered;
  }, [filtered, groupOrder]);

  // Flat array for keyboard navigation (sequential across groups).
  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  // Clamp selectedIdx when results shrink.
  useEffect(() => {
    if (selectedIdx >= flat.length) setSelectedIdx(Math.max(0, flat.length - 1));
  }, [flat.length, selectedIdx]);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => (i + 1) % Math.max(1, flat.length));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => (i - 1 + Math.max(1, flat.length)) % Math.max(1, flat.length));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const pick = flat[selectedIdx];
        if (pick) pick.run({ close });
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // close + flat + selectedIdx are stable enough; intentionally omit
    // close from deps so we don't re-bind every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, flat, selectedIdx]);

  // Scroll selected row into view.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector(`[data-row-idx="${selectedIdx}"]`);
    (node as HTMLElement | null)?.scrollIntoView({ block: "nearest" });
  }, [open, selectedIdx]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 14, 26, 0.5)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "10vh 16px 16px",
        zIndex: 110,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="ck-anim-fade"
    >
      <div
        className="ck-anim-popover"
        style={
          {
            width: "100%",
            maxWidth: 560,
            background: "var(--ck-bg-surface)",
            border: "1px solid var(--ck-border-subtle)",
            borderRadius: "var(--ck-radius-md)",
            boxShadow: "var(--ck-shadow-3)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "70vh",
            fontFamily: "var(--ck-font-sans)",
            color: "var(--ck-text-primary)",
          } as CSSProperties
        }
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSelectedIdx(0);
          }}
          placeholder={placeholder}
          style={{
            height: 44,
            padding: "0 16px",
            border: "none",
            borderBottom: "1px solid var(--ck-border-subtle)",
            background: "transparent",
            color: "var(--ck-text-primary)",
            font: "400 14px/1 var(--ck-font-sans)",
            outline: "none",
          }}
        />
        <div ref={listRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 4 }}>
          {flat.length === 0 ? (
            <div
              style={{
                padding: "24px 16px",
                color: "var(--ck-text-tertiary)",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              No matches.
            </div>
          ) : (
            grouped.map((g) => (
              <div key={g.group} style={{ marginBottom: 6 }}>
                <div
                  className="ck-eyebrow"
                  style={{ padding: "8px 12px 4px", color: "var(--ck-text-tertiary)" }}
                >
                  {g.group}
                </div>
                {g.items.map((it) => {
                  const idx = flat.indexOf(it);
                  const selected = idx === selectedIdx;
                  return (
                    <div
                      key={it.key}
                      data-row-idx={idx}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      onClick={() => it.run({ close })}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: "var(--ck-radius-sm)",
                        background: selected ? "var(--ck-accent-muted)" : "transparent",
                        color: selected ? "var(--ck-accent)" : "var(--ck-text-primary)",
                        cursor: "pointer",
                        font: "400 13px/1.3 var(--ck-font-sans)",
                      }}
                    >
                      {it.icon && (
                        <span style={{ display: "inline-flex", color: "var(--ck-text-tertiary)" }}>
                          {it.icon}
                        </span>
                      )}
                      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {it.label}
                        {it.sublabel && (
                          <span style={{ color: "var(--ck-text-tertiary)", marginLeft: 6, fontSize: 12 }}>
                            {it.sublabel}
                          </span>
                        )}
                      </span>
                      {it.hint && (
                        <span style={{ color: "var(--ck-text-tertiary)", fontSize: 12 }}>
                          {it.hint}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div
          style={{
            padding: "8px 12px",
            borderTop: "1px solid var(--ck-border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "var(--ck-text-tertiary)",
            font: "400 11px/1 var(--ck-font-mono)",
            background: "var(--ck-bg-surface-2)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            navigate
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Kbd>Enter</Kbd>
            run
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Kbd>Esc</Kbd>
            close
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
