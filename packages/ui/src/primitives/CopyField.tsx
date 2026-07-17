import { forwardRef, useCallback, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

// CopyField — read-only value field with an embedded Copy button.
//
// One bordered frame (same 36px field chrome as Input-with-addon):
// the value renders mono + ellipsized on the left, the Copy button
// sits INSIDE the frame flush right on a muted slab (mirrors Input's
// suffix addon). Clicking copies to the clipboard and flips the
// label to "Copied ✓" for a beat; clicking the value text selects it
// (manual-copy fallback for non-secure origins where the Clipboard
// API is unavailable).
//
// Use for share links, signing URLs, tokens, API keys — anywhere the
// user's next action is overwhelmingly "copy this". Compose with:
// dialog bodies (share link rows), sidebar token reveals, settings
// pages (API-key display).
//
// Forwards ref to the copy <button>. Spreads `...rest` on the frame
// so consumers can pass data-* / aria-* / style / className.

export interface CopyFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "onCopy"> {
  // The string shown + copied. Rendered mono, single-line, ellipsized.
  value: string;
  // Copy-button label; flips to `copiedLabel` after a click.
  copyLabel?: ReactNode;
  copiedLabel?: ReactNode;
  // How long the copied state lingers before flipping back (ms).
  copiedForMs?: number;
  // Notified after a successful clipboard write. Clipboard failures
  // are silent by design — the value stays selectable in the field.
  onCopied?: (value: string) => void;
}

export const CopyField = forwardRef<HTMLButtonElement, CopyFieldProps>(function CopyField(
  {
    value,
    copyLabel = "Copy",
    copiedLabel = "Copied ✓",
    copiedForMs = 1500,
    onCopied,
    className,
    style,
    ...rest
  },
  ref,
) {
  const [copied, setCopied] = useState(false);
  const valueRef = useRef<HTMLElement | null>(null);

  const handleCopy = useCallback(() => {
    void navigator.clipboard
      ?.writeText(value)
      .then(() => onCopied?.(value))
      .catch(() => {
        // Clipboard rejected (permissions / non-secure origin). The
        // value stays visible + selectable in the field — no error UI.
      });
    setCopied(true);
    window.setTimeout(() => setCopied(false), copiedForMs);
  }, [value, copiedForMs, onCopied]);

  // Click-to-select on the value — the manual-copy fallback.
  const handleSelectAll = useCallback(() => {
    const node = valueRef.current;
    if (!node) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, []);

  return (
    <div
      {...rest}
      className={cn("ck-copy-field", className)}
      style={{
        display: "flex",
        alignItems: "stretch",
        height: 36,
        background: "var(--ck-bg-surface)",
        border: "1px solid var(--ck-border-strong)",
        borderRadius: "var(--ck-radius-sm)",
        overflow: "hidden",
        minWidth: 0,
        ...(style ?? {}),
      }}
    >
      <code
        ref={valueRef}
        title={value}
        onClick={handleSelectAll}
        style={{
          flex: 1,
          minWidth: 0,
          alignSelf: "center",
          padding: "0 12px",
          font: "400 12px/1.5 var(--ck-font-mono, ui-monospace, monospace)",
          color: "var(--ck-text-primary)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          cursor: "text",
        }}
      >
        {value}
      </code>
      <button
        ref={ref}
        type="button"
        onClick={handleCopy}
        disabled={copied}
        className="ck-copy-field-btn"
        style={{
          flex: "0 0 auto",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 14px",
          // Reserve the wider copied-label footprint so the value
          // column doesn't shift mid-flash.
          minWidth: 84,
          border: "none",
          borderLeft: "1px solid var(--ck-border-strong)",
          background: "var(--ck-bg-muted)",
          color: copied ? "var(--ck-text-secondary)" : "var(--ck-text-primary)",
          font: "500 11px/1 var(--ck-font-sans)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          cursor: copied ? "default" : "pointer",
          transition: "color var(--ck-dur-fast) var(--ck-ease)",
        }}
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
});
