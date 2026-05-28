import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "../lib/cn";

// Custom listbox-pattern select. We deliberately do NOT use native
// <select> — browsers refuse to style the popup, so terminal /
// editorial / swiss etc. would punch through with macOS/Win blue
// and break the visual contract.
//
// Two modes via `searchable`:
//
//   searchable=false (default)
//     Trigger button. Keyboard handlers live on the trigger.
//     Typeahead (A-Z / 0-9) jumps to next matching label.
//     Right for ≤ ~10 short options.
//
//   searchable=true
//     Trigger button + a search input pinned at the top of the
//     popover. Focus moves to the search input on open; the
//     listbox below filters by case-insensitive label substring.
//     Right for long lists (countries, currencies, time zones,
//     user pickers).
//
// Popover ALWAYS renders via createPortal to document.body so it
// escapes Card / Drawer / Dialog parents whose overflow:hidden
// would otherwise clip it. Position is computed against the
// trigger's bounding rect and re-computed on page scroll + window
// resize so the popover tracks the trigger. Scrolls INSIDE the
// popover (the option list / search input) are filtered out — only
// outer scrolls reposition.
//
// Keyboard model (mirrors ARIA 1.2 combobox-as-listbox spec):
//   trigger CLOSED:
//     Space / Enter             → open
//     ArrowDown / ArrowUp       → open (first / last)
//     A-Z / 0-9 (!searchable)   → open + typeahead
//   open, !searchable, on trigger:
//     ArrowDown / ArrowUp       → move highlight
//     Home / End                → first / last
//     Enter                     → commit highlighted
//     Escape                    → close
//     Tab                       → close, focus advances
//     A-Z / 0-9                 → typeahead (500 ms reset window)
//   open, searchable, on search input:
//     Typing                    → filter
//     ArrowDown / ArrowUp       → move highlight inside filtered list
//     Home / End                → first / last in filtered list
//     Enter                     → commit highlighted
//     Escape                    → close
//     Tab                       → close, focus advances

export interface SelectOption {
  value: string;
  label: string;
  // Optional disabled flag — the option renders dimmed and isn't
  // selectable via click / keyboard. Useful for "Coming soon" rows.
  disabled?: boolean | undefined;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: ReactNode | undefined;
  helper?: ReactNode | undefined;
  error?: string | null | undefined;
  placeholder?: string | undefined;
  // full = stretches to container width; auto = intrinsic.
  fit?: "full" | "auto" | undefined;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  name?: string | undefined;
  id?: string | undefined;
  className?: string | undefined;
  // Max height of the popover. Long lists scroll inside.
  maxOptionsHeight?: number | undefined;
  // Show a search input pinned at the top of the popover. Filters
  // options by case-insensitive label substring. Recommended for
  // lists > ~10 items.
  searchable?: boolean | undefined;
  // Placeholder for the search input (when searchable).
  searchPlaceholder?: string | undefined;
}

const TRIGGER_BASE_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  width: "100%",
  height: 36,
  padding: "0 12px",
  font: "400 13px/1 var(--ck-font-sans)",
  background: "var(--ck-bg-surface)",
  color: "var(--ck-text-primary)",
  borderRadius: "var(--ck-radius-sm)",
  outline: "none",
  textAlign: "left",
  cursor: "pointer",
  transition: "border-color var(--ck-dur-fast) var(--ck-ease)",
};

// Visual gap between the trigger's bottom edge and the popover's
// top edge. Matches Radix / Headless UI default; small enough to
// read as "attached", large enough not to feel sticky.
const POPOVER_GAP = 4;

interface PopoverRect {
  top: number;
  left: number;
  width: number;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    value,
    onChange,
    options,
    label,
    helper,
    error,
    placeholder,
    fit = "full",
    disabled,
    required,
    name,
    id,
    className,
    maxOptionsHeight = 280,
    searchable = false,
    searchPlaceholder = "Search…",
  },
  ref,
) {
  const autoId = useId();
  const triggerId = id ?? `${autoId}-trigger`;
  const listboxId = `${autoId}-listbox`;

  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [query, setQuery] = useState("");
  const [rect, setRect] = useState<PopoverRect | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const typeaheadRef = useRef<{ buffer: string; resetAt: number }>({
    buffer: "",
    resetAt: 0,
  });

  // Filtered options when searchable; identical otherwise. Filter
  // by case-insensitive label substring. Disabled options remain
  // visible but unselectable; consumers can pre-filter their
  // options array if they want them hidden when search is non-empty.
  const filteredOptions = useMemo(() => {
    if (!searchable || query.trim() === "") return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [searchable, options, query]);

  const selectedIndex = useMemo(
    () => options.findIndex((o) => o.value === value),
    [options, value],
  );
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const setTriggerRef = useCallback(
    (el: HTMLButtonElement | null) => {
      triggerRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );

  const computeRect = useCallback((): PopoverRect | null => {
    const el = triggerRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: r.bottom + POPOVER_GAP,
      left: r.left,
      width: r.width,
    };
  }, []);

  // Position the popover on open + on window resize. Close on
  // page scroll — keeps the popover from drifting off the trigger
  // while the user pages around.
  useLayoutEffect(() => {
    if (!open) return;
    setRect(computeRect());
  }, [open, computeRect]);

  useEffect(() => {
    if (!open) return;
    const reposition = () => {
      const r = computeRect();
      if (r) setRect(r);
    };
    const onResize = reposition;
    const onScroll = (e: Event) => {
      // Scrolls INSIDE the popover (the option list / search input)
      // must not re-trigger positioning — they're not page scrolls.
      // capture=true catches them before they bubble; we filter here.
      const target = e.target as Node | null;
      if (target && popoverRef.current?.contains(target)) return;
      reposition();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, computeRect]);

  // Close on outside click + Esc (Esc handled in onKey below).
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (triggerRef.current?.contains(t)) return;
      if (popoverRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  // Auto-scroll highlighted option into view inside the popover.
  useEffect(() => {
    if (!open || highlight < 0) return;
    const el = optionRefs.current[highlight];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [open, highlight]);

  // Focus management on open:
  //   searchable=true → focus the search input
  //   searchable=false → trigger keeps focus (kbd handler lives there)
  useEffect(() => {
    if (!open) return;
    if (searchable) {
      // requestAnimationFrame to let the portal mount before focusing.
      const raf = requestAnimationFrame(() => searchInputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [open, searchable]);

  // When the filtered list changes (user types), reset highlight
  // to the first selectable option. Otherwise the highlight could
  // point at an index that no longer exists.
  useEffect(() => {
    if (!open) return;
    if (filteredOptions.length === 0) {
      setHighlight(-1);
      return;
    }
    // Try to keep the existing selection visible; else first
    // non-disabled option.
    const selectedInFiltered = filteredOptions.findIndex((o) => o.value === value);
    if (selectedInFiltered >= 0) {
      setHighlight(selectedInFiltered);
    } else {
      const firstEnabled = filteredOptions.findIndex((o) => !o.disabled);
      setHighlight(firstEnabled >= 0 ? firstEnabled : 0);
    }
  }, [open, filteredOptions, value]);

  const openPopover = useCallback(
    (startHighlight?: number) => {
      if (disabled) return;
      setOpen(true);
      setQuery("");
      setHighlight(
        startHighlight !== undefined
          ? startHighlight
          : selectedIndex >= 0
            ? selectedIndex
            : 0,
      );
    },
    [disabled, selectedIndex],
  );

  const closePopover = useCallback(() => {
    setOpen(false);
    setHighlight(-1);
    setQuery("");
    triggerRef.current?.focus();
  }, []);

  const commit = useCallback(
    (idx: number) => {
      const opt = filteredOptions[idx];
      if (!opt || opt.disabled) return;
      onChange(opt.value);
      closePopover();
    },
    [filteredOptions, onChange, closePopover],
  );

  // Move highlight skipping disabled rows.
  const moveHighlight = useCallback(
    (delta: 1 | -1, from?: number) => {
      const n = filteredOptions.length;
      if (n === 0) return;
      let i = (from ?? highlight) + delta;
      for (let attempt = 0; attempt < n; attempt++) {
        if (i < 0) i = n - 1;
        if (i >= n) i = 0;
        if (!filteredOptions[i]?.disabled) {
          setHighlight(i);
          return;
        }
        i += delta;
      }
    },
    [filteredOptions, highlight],
  );

  const typeahead = useCallback(
    (char: string) => {
      const now = Date.now();
      const t = typeaheadRef.current;
      if (now > t.resetAt) t.buffer = "";
      t.buffer += char.toLowerCase();
      t.resetAt = now + 500;

      const start = highlight >= 0 ? highlight : 0;
      const n = filteredOptions.length;
      for (let off = 1; off <= n; off++) {
        const idx = (start + off) % n;
        const o = filteredOptions[idx];
        if (o && !o.disabled && o.label.toLowerCase().startsWith(t.buffer)) {
          setHighlight(idx);
          return;
        }
      }
      if (t.buffer.length > 1) {
        t.buffer = char.toLowerCase();
        for (let off = 1; off <= n; off++) {
          const idx = (start + off) % n;
          const o = filteredOptions[idx];
          if (o && !o.disabled && o.label.toLowerCase().startsWith(t.buffer)) {
            setHighlight(idx);
            return;
          }
        }
      }
    },
    [filteredOptions, highlight],
  );

  // Keyboard handler for the trigger (non-searchable mode + closed
  // state in searchable mode).
  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (!open) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPopover();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        openPopover(0);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        openPopover(options.length - 1);
        return;
      }
      if (!searchable && e.key.length === 1 && /[a-z0-9]/i.test(e.key)) {
        openPopover();
        typeahead(e.key);
        return;
      }
      return;
    }
    // Open + on trigger (only happens when !searchable).
    if (e.key === "Escape") {
      e.preventDefault();
      closePopover();
      return;
    }
    if (e.key === "Tab") {
      setOpen(false);
      setHighlight(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveHighlight(1);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveHighlight(-1);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      moveHighlight(1, -1);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      moveHighlight(-1, options.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlight >= 0) commit(highlight);
      return;
    }
    if (e.key.length === 1 && /[a-z0-9]/i.test(e.key)) {
      e.preventDefault();
      typeahead(e.key);
      return;
    }
  };

  // Keyboard handler for the search input (searchable mode, open).
  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closePopover();
      return;
    }
    if (e.key === "Tab") {
      setOpen(false);
      setHighlight(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveHighlight(1);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveHighlight(-1);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      moveHighlight(1, -1);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      moveHighlight(-1, filteredOptions.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlight >= 0) commit(highlight);
      return;
    }
    // Plain typing flows to the input value via React's onChange.
  };

  const triggerLabel = selectedOption ? selectedOption.label : placeholder ?? "Select…";
  const showPlaceholder = !selectedOption;

  const popoverNode = open && rect && (
    <div
      ref={popoverRef}
      className="ck-select-popover"
      style={{
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        zIndex: 1000,
        background: "var(--ck-bg-surface)",
        border: "1px solid var(--ck-border-strong)",
        borderRadius: "var(--ck-radius-sm)",
        boxShadow: "var(--ck-shadow-3, 0 16px 48px rgba(0,0,0,0.12))",
        // Popover constrained vertically by maxOptionsHeight + an
        // allowance for the search row. The listbox itself scrolls.
        maxHeight: maxOptionsHeight + (searchable ? 48 : 0),
        display: "flex",
        flexDirection: "column",
        padding: 4,
      }}
    >
      {searchable && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "4px 6px",
            borderBottom: "1px solid var(--ck-border-subtle)",
            marginBottom: 4,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            style={{ color: "var(--ck-text-tertiary)", marginRight: 6, flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onSearchKey}
            placeholder={searchPlaceholder}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={
              highlight >= 0 ? `${listboxId}-opt-${highlight}` : undefined
            }
            className="ck-select-search"
            style={{
              flex: "1 1 auto",
              minWidth: 0,
              height: 28,
              padding: "0 4px",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "var(--ck-text-primary)",
              font: "400 13px/1 var(--ck-font-sans)",
            }}
          />
        </div>
      )}
      <ul
        id={listboxId}
        role="listbox"
        aria-labelledby={triggerId}
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          overflowY: "auto",
          maxHeight: maxOptionsHeight,
        }}
      >
        {filteredOptions.map((opt, i) => {
          const selected = opt.value === value;
          const highlighted = i === highlight;
          return (
            <li
              ref={(el) => {
                optionRefs.current[i] = el;
              }}
              key={opt.value}
              id={`${listboxId}-opt-${i}`}
              role="option"
              aria-selected={selected}
              aria-disabled={opt.disabled}
              onMouseEnter={() => !opt.disabled && setHighlight(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(i)}
              className={cn(
                "ck-select-option",
                selected && "ck-select-option--selected",
                highlighted && "ck-select-option--active",
                opt.disabled && "ck-select-option--disabled",
              )}
              style={{
                padding: "8px 10px",
                borderRadius: "calc(var(--ck-radius-sm) - 2px)",
                cursor: opt.disabled ? "not-allowed" : "pointer",
                color: opt.disabled
                  ? "var(--ck-text-tertiary)"
                  : "var(--ck-text-primary)",
                background: highlighted ? "var(--ck-bg-muted)" : "transparent",
                font: "400 13px/1.2 var(--ck-font-sans)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                transition: "background var(--ck-dur-fast) var(--ck-ease)",
              }}
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {opt.label}
              </span>
              {selected && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  style={{ color: "var(--ck-accent)", flexShrink: 0 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </li>
          );
        })}
        {filteredOptions.length === 0 && (
          <li
            role="presentation"
            style={{
              padding: "8px 10px",
              color: "var(--ck-text-tertiary)",
              font: "400 13px/1.2 var(--ck-font-sans)",
            }}
          >
            {searchable && query.trim() !== "" ? "No matches" : "No options"}
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <div
      className={cn("ck-select-field", className)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: fit === "full" ? "100%" : undefined,
      }}
    >
      {label && (
        <label
          htmlFor={triggerId}
          className="ck-eyebrow"
          style={{ color: "var(--ck-text-secondary)" }}
        >
          {label}
        </label>
      )}

      {name && <input type="hidden" name={name} value={value} required={required} />}

      <button
        ref={setTriggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={error ? true : undefined}
        aria-required={required}
        disabled={disabled}
        onClick={() => (open ? closePopover() : openPopover())}
        onKeyDown={onTriggerKey}
        className={cn(
          "ck-select-trigger",
          error && "ck-select-trigger--invalid",
          disabled && "ck-select-trigger--disabled",
        )}
        style={{
          ...TRIGGER_BASE_STYLE,
          border: `1px solid ${error ? "var(--ck-critical)" : "var(--ck-border-strong)"}`,
          color: showPlaceholder ? "var(--ck-text-tertiary)" : "var(--ck-text-primary)",
          opacity: disabled ? 0.55 : 1,
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {triggerLabel}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{
            flexShrink: 0,
            opacity: 0.7,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 180ms var(--ck-ease)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {(helper || error) && (
        <div
          style={{
            font: "400 11px/1.4 var(--ck-font-sans)",
            color: error ? "var(--ck-critical)" : "var(--ck-text-tertiary)",
          }}
        >
          {error ?? helper}
        </div>
      )}

      {typeof document !== "undefined" && popoverNode
        ? createPortal(popoverNode, document.body)
        : null}
    </div>
  );
});
