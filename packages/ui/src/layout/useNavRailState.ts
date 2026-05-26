import { useCallback, useEffect, useState } from "react";
import { useViewport } from "../hooks/useViewport";

// Manages the collapse state of <LeftNavRail>. Two layers:
//
//   1. User preference — persisted in localStorage under
//      `storageKey`. The user toggles via a button in the rail.
//   2. Viewport rule — below `forceCollapseBelow` the rail is
//      always collapsed regardless of user preference.
//
// The hook returns the EFFECTIVE collapsed state (combining the
// two) plus a setter that only mutates the user preference (the
// viewport rule continues to apply on top).

export interface UseNavRailStateOpts {
  storageKey?: string;
  // Viewport width below which the rail force-collapses, ignoring
  // user preference. Default 1100 px.
  forceCollapseBelow?: number;
  // Initial preference if nothing is in localStorage. Default false
  // (expanded).
  defaultCollapsed?: boolean;
}

export interface NavRailState {
  collapsed: boolean;
  // The viewport is currently overriding the user preference.
  // Toggle button should be disabled when this is true.
  forcedByViewport: boolean;
  toggle: () => void;
  setCollapsed: (next: boolean) => void;
}

const DEFAULT_KEY = "ck-leftnav-collapsed";

export function useNavRailState({
  storageKey = DEFAULT_KEY,
  forceCollapseBelow = 1100,
  defaultCollapsed = false,
}: UseNavRailStateOpts = {}): NavRailState {
  const [userPref, setUserPref] = useState<boolean>(() => {
    if (typeof window === "undefined") return defaultCollapsed;
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "1") return true;
    if (stored === "0") return false;
    return defaultCollapsed;
  });
  const vp = useViewport({ narrow: forceCollapseBelow });
  const forcedByViewport = vp.isNarrow;
  const collapsed = forcedByViewport || userPref;

  const setCollapsed = useCallback(
    (next: boolean) => {
      setUserPref(next);
    },
    [],
  );

  useEffect(() => {
    window.localStorage.setItem(storageKey, userPref ? "1" : "0");
  }, [userPref, storageKey]);

  const toggle = useCallback(() => {
    if (forcedByViewport) return; // no-op — viewport rules
    setUserPref((v) => !v);
  }, [forcedByViewport]);

  return { collapsed, forcedByViewport, toggle, setCollapsed };
}
