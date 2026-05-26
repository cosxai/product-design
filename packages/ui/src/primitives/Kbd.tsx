import type { ReactNode } from "react";
import { cn } from "../lib/cn";

// Keyboard hint pill — ⌘K, ⌃K, Shift, etc. Auto-translates "Mod"
// to ⌘ on Mac and Ctrl elsewhere so docs strings can stay portable.

export interface KbdProps {
  // "Mod" is replaced by ⌘ on Mac, Ctrl elsewhere. Otherwise rendered
  // verbatim — pass "Shift", "Enter", "↑", "K", etc.
  children: ReactNode;
  className?: string;
}

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/.test(navigator.platform);

function renderChild(c: ReactNode): ReactNode {
  if (typeof c !== "string") return c;
  if (c === "Mod") return isMac ? "⌘" : "Ctrl";
  return c;
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn("ck-kbd", className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 18,
        height: 18,
        padding: "0 5px",
        background: "var(--ck-bg-muted)",
        border: "1px solid var(--ck-border-subtle)",
        color: "var(--ck-text-secondary)",
        font: "500 11px/1 var(--ck-font-mono)",
        borderRadius: "var(--ck-radius-xs)",
      }}
    >
      {renderChild(children)}
    </kbd>
  );
}
