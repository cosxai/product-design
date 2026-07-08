import { useCallback, useEffect, useMemo, useState } from "react";
import { useActionBarItems } from "./useActionBarItems";
import type { ActionBarItem } from "./types";

// useActionBarMode — one hook that manages a small set of named
// "modes" (each with its own item list) + registers the active mode's
// items into the ActionBar registry. Consumer combines this with
// <ActionBarModeHandle> to give privileged users a peek-out affordance
// that flips between the modes.
//
// Design intent (M4.5 block_doc surface):
//   - Default mode: standard viewer actions (comment / download / share)
//   - Manage mode: admin-only shortcuts (preview draft / manage share /
//     view activity), gated behind `capabilities.manage === true`
//   - Draft mode (optional third): appears once the user enters draft
//     preview; distinct action set (publish / discard / raw JSON /
//     return)
//
// The mode name is the ActionBar's source key, so switching modes
// unregisters the previous set and registers the new set atomically
// (useActionBarItems handles the cleanup).
//
// State persistence: pass `storageKey` for localStorage-backed
// stickiness across reloads. Nil-safe when window is unavailable
// (SSR).

export type ActionBarModeConfig<K extends string> = {
  [key in K]: ActionBarItem[];
};

export interface UseActionBarModeOptions<K extends string> {
  /**
   * Map of mode keys → items. Each mode key becomes the source key
   * passed to useActionBarItems, so it must be a stable string
   * (e.g. "viewer", "manage") — mode registrations will not
   * "cross-contaminate" the item set of another mode.
   */
  modes: ActionBarModeConfig<K>;
  /**
   * Which mode to start in. Overridden by localStorage when
   * `storageKey` is set AND localStorage has a valid value.
   */
  defaultMode: K;
  /**
   * Optional localStorage key. When set, the current mode is
   * persisted + rehydrated across reloads.
   */
  storageKey?: string | undefined;
}

export interface UseActionBarModeResult<K extends string> {
  /** The currently active mode key. */
  mode: K;
  /** Set the mode explicitly (typically wired to the mode Handle). */
  setMode: (next: K) => void;
  /**
   * Toggle between the FIRST two modes in the config's iteration
   * order. Convenience for the common two-mode case; a
   * three-mode consumer uses setMode directly.
   */
  toggle: () => void;
  /**
   * All configured mode keys in registration order — useful for
   * building a cycle-through-modes button.
   */
  allModes: readonly K[];
}

function loadPersistedMode<K extends string>(
  storageKey: string,
  allModes: readonly K[],
): K | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw && (allModes as readonly string[]).includes(raw)) {
      return raw as K;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function persistMode(storageKey: string, mode: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, mode);
  } catch {
    /* ignore */
  }
}

export function useActionBarMode<K extends string>(
  opts: UseActionBarModeOptions<K>,
): UseActionBarModeResult<K> {
  const { modes, defaultMode, storageKey } = opts;
  const allModes = useMemo(() => Object.keys(modes) as K[], [modes]);
  const [mode, setModeState] = useState<K>(() => {
    if (storageKey) {
      const persisted = loadPersistedMode<K>(storageKey, allModes);
      if (persisted) return persisted;
    }
    return defaultMode;
  });

  // If the modes config changes (dev / hot reload) so the current
  // mode key is no longer valid, drop back to the default.
  useEffect(() => {
    if (!(allModes as readonly string[]).includes(mode)) {
      setModeState(defaultMode);
    }
  }, [mode, allModes, defaultMode]);

  const setMode = useCallback(
    (next: K) => {
      setModeState(next);
      if (storageKey) persistMode(storageKey, next);
    },
    [storageKey],
  );

  const toggle = useCallback(() => {
    if (allModes.length < 2) return;
    const idx = allModes.indexOf(mode);
    // Cycle to the NEXT mode; wrap-around handles both the "toggle
    // between 2" and "cycle through 3+" cases.
    const nextIdx = (idx + 1) % allModes.length;
    const next = allModes[nextIdx];
    if (next !== undefined) {
      setMode(next);
    }
  }, [allModes, mode, setMode]);

  // Register the active mode's items with the ActionBar. Uses the
  // mode key as the source key, so switching modes atomically
  // unregisters the previous set. Items themselves must be stable
  // (useMemo'd) — the ActionBar deduplicates by reference, so passing
  // `modes[mode]` re-uses the caller's memoized array.
  const activeItems = modes[mode];
  useActionBarItems(mode, activeItems);

  return { mode, setMode, toggle, allModes };
}
