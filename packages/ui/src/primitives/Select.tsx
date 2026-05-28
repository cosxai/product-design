import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "../lib/cn";

// Custom listbox-pattern select. We deliberately do NOT use native
// <select> — browsers refuse to style the popup, so terminal /
// editorial / swiss etc. would punch through with macOS/Win blue and
// break the visual contract. Trade-off: ~200 LOC of state +
// keyboard handling we'd otherwise get for free.
//
// Keyboard model (mirrors ARIA 1.2 combobox-as-listbox spec):
//   Space / Enter on the trigger    → open
//   ArrowDown / ArrowUp             → open (highlight first / last)
//   ArrowDown / ArrowUp (open)      → move highlight
//   Home / End (open)               → first / last option
//   Enter (open)                    → commit highlighted option
//   Escape (open)                   → close, restore previous value
//   Tab                             → close + advance focus
//   A-Z / 0-9 (open or closed)      → jump to next option whose label
//                                     starts with that character
//                                     (typeahead; 500 ms reset window)
//
// Layout model:
//   - Trigger is a styled <button> that LOOKS like .ck-input
//   - Popover is absolutely positioned beneath the trigger
//   - We do NOT portal — keeps the markup simple. If a parent has
//     `overflow: hidden` that clips the popover, wrap the Select
//     in a sibling rather than mounting it inside that container.

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
  },
  ref,
) {
  const autoId = useId();
  const triggerId = id ?? `${autoId}-trigger`;
  const listboxId = `${autoId}-listbox`;

  const [open, setOpen] = useState(false);
  // Highlighted index while the popover is open. -1 = nothing
  // highlighted; first open with no selection lands on 0.
  const [highlight, setHighlight] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  // Typeahead buffer + reset timer for "press a letter to jump".
  const typeaheadRef = useRef<{ buffer: string; resetAt: number }>({
    buffer: "",
    resetAt: 0,
  });

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

  // Close on outside click + Esc.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (triggerRef.current?.contains(t)) return;
      if (popoverRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Auto-scroll highlighted option into view inside the popover.
  useEffect(() => {
    if (!open || highlight < 0) return;
    const el = optionRefs.current[highlight];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [open, highlight]);

  // When opening, seed the highlight to the currently selected option
  // so the user lands on what they've already chosen.
  const openPopover = useCallback(
    (startHighlight?: number) => {
      if (disabled) return;
      setOpen(true);
      setHighlight(
        startHighlight !== undefined ? startHighlight : selectedIndex >= 0 ? selectedIndex : 0,
      );
    },
    [disabled, selectedIndex],
  );

  const closePopover = useCallback(() => {
    setOpen(false);
    setHighlight(-1);
    // Re-focus the trigger so keyboard users stay on context.
    triggerRef.current?.focus();
  }, []);

  const commit = useCallback(
    (idx: number) => {
      const opt = options[idx];
      if (!opt || opt.disabled) return;
      onChange(opt.value);
      closePopover();
    },
    [options, onChange, closePopover],
  );

  // Move highlight skipping disabled rows.
  const moveHighlight = useCallback(
    (delta: 1 | -1, from?: number) => {
      const n = options.length;
      if (n === 0) return;
      let i = (from ?? highlight) + delta;
      // Loop max n times to avoid infinite hunt when ALL options
      // are disabled.
      for (let attempt = 0; attempt < n; attempt++) {
        if (i < 0) i = n - 1;
        if (i >= n) i = 0;
        if (!options[i]?.disabled) {
          setHighlight(i);
          return;
        }
        i += delta;
      }
    },
    [options, highlight],
  );

  // Typeahead — press a letter to jump to the next option whose
  // label starts with that letter (or the typed prefix, if pressed
  // within the reset window).
  const typeahead = useCallback(
    (char: string) => {
      const now = Date.now();
      const t = typeaheadRef.current;
      if (now > t.resetAt) t.buffer = "";
      t.buffer += char.toLowerCase();
      t.resetAt = now + 500;

      const start = highlight >= 0 ? highlight : 0;
      const n = options.length;
      for (let off = 1; off <= n; off++) {
        const idx = (start + off) % n;
        const o = options[idx];
        if (o && !o.disabled && o.label.toLowerCase().startsWith(t.buffer)) {
          setHighlight(idx);
          return;
        }
      }
      // No prefix match — try single-char from current.
      if (t.buffer.length > 1) {
        t.buffer = char.toLowerCase();
        for (let off = 1; off <= n; off++) {
          const idx = (start + off) % n;
          const o = options[idx];
          if (o && !o.disabled && o.label.toLowerCase().startsWith(t.buffer)) {
            setHighlight(idx);
            return;
          }
        }
      }
    },
    [options, highlight],
  );

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
      if (e.key.length === 1 && /[a-z0-9]/i.test(e.key)) {
        openPopover();
        typeahead(e.key);
        return;
      }
      return;
    }
    // Open
    if (e.key === "Escape") {
      e.preventDefault();
      closePopover();
      return;
    }
    if (e.key === "Tab") {
      // Close but DON'T preventDefault — let focus advance.
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

  const triggerLabel = selectedOption ? selectedOption.label : placeholder ?? "Select…";
  const showPlaceholder = !selectedOption;

  return (
    <div
      className={cn("ck-select-field", className)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: fit === "full" ? "100%" : undefined,
        position: "relative",
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

      {/* Hidden native input mirrors the value so plain <form> POSTs
          still carry the field. Consumers using the controlled value
          directly can ignore this. */}
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
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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

      {open && (
        <div
          ref={popoverRef}
          className="ck-select-popover"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 50,
            background: "var(--ck-bg-surface)",
            border: "1px solid var(--ck-border-strong)",
            borderRadius: "var(--ck-radius-sm)",
            boxShadow: "var(--ck-shadow-3, 0 16px 48px rgba(0,0,0,0.12))",
            maxHeight: maxOptionsHeight,
            overflowY: "auto",
            padding: 4,
          }}
        >
          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={triggerId}
            style={{ listStyle: "none", margin: 0, padding: 0 }}
          >
            {options.map((opt, i) => {
              const selected = opt.value === value;
              const highlighted = i === highlight;
              return (
                <li
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={opt.disabled}
                  onMouseEnter={() => !opt.disabled && setHighlight(i)}
                  onMouseDown={(e) => {
                    // Prevent the trigger from losing focus before
                    // commit (otherwise the popover closes via
                    // outside-click before onClick fires).
                    e.preventDefault();
                  }}
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
                    background: highlighted
                      ? "var(--ck-bg-muted)"
                      : "transparent",
                    font: "400 13px/1.2 var(--ck-font-sans)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    transition: "background var(--ck-dur-fast) var(--ck-ease)",
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
            {options.length === 0 && (
              <li
                role="presentation"
                style={{
                  padding: "8px 10px",
                  color: "var(--ck-text-tertiary)",
                  font: "400 13px/1.2 var(--ck-font-sans)",
                }}
              >
                No options
              </li>
            )}
          </ul>
        </div>
      )}

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
    </div>
  );
});
