import { useEffect, useRef } from "react";

// Single-key hotkey listener with the standard conflict guards:
//   - skipInputs (default true)        — ignore when an input /
//     textarea / select / contenteditable is focused
//   - skipModifiers (default true)     — let browser shortcuts
//     (Cmd+S, Ctrl+W, etc.) through
//   - skipWhenModalOpen (default true) — don't fire when a
//     <Modal> (anything with role="dialog") is mounted
//
// `key` is a single character (case-insensitive) or a special key
// name ("Escape", "Enter", "ArrowUp", etc.). For modifier
// combinations use `mod: true` (Cmd on Mac, Ctrl elsewhere).
//
// Handler refs are kept fresh via a ref-mirror — call sites don't
// need to memoise the callback.

export interface UseKeyboardHotkeyOptions {
  // Combine with Cmd (Mac) / Ctrl (other). Default false.
  mod?: boolean;
  skipInputs?: boolean;
  skipModifiers?: boolean; // ignored when `mod: true`
  skipWhenModalOpen?: boolean;
  // Disable without unmounting (toggle off without remount).
  enabled?: boolean;
}

const isMac = () =>
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/.test(navigator.platform);

export function useKeyboardHotkey(
  key: string,
  handler: (e: KeyboardEvent) => void,
  options: UseKeyboardHotkeyOptions = {},
) {
  const {
    mod = false,
    skipInputs = true,
    skipModifiers = true,
    skipWhenModalOpen = true,
    enabled = true,
  } = options;

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;
    const target = key.toLowerCase();
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== target) return;
      if (mod) {
        const wantedMod = isMac() ? e.metaKey : e.ctrlKey;
        if (!wantedMod) return;
        if (e.shiftKey || e.altKey) return;
      } else if (skipModifiers && (e.metaKey || e.ctrlKey || e.altKey)) {
        return;
      }
      if (skipInputs) {
        const ae = document.activeElement as HTMLElement | null;
        const tag = ae?.tagName;
        // Containers marked data-hotkey-passthrough host editables
        // the user never types into (e.g. a canvas spreadsheet's
        // hidden cell-editor focus trap) — hotkeys stay live there.
        // Mirrors the same convention in consumer apps.
        const passthrough = !!ae?.closest?.('[data-hotkey-passthrough="true"]');
        if (
          !passthrough &&
          (tag === "INPUT" ||
            tag === "TEXTAREA" ||
            tag === "SELECT" ||
            ae?.isContentEditable)
        ) {
          return;
        }
      }
      if (skipWhenModalOpen && document.querySelector('[role="dialog"]')) {
        return;
      }
      handlerRef.current(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, mod, skipInputs, skipModifiers, skipWhenModalOpen, enabled]);
}
