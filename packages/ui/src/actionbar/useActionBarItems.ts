import { useContext, useEffect } from "react";
import { ActionBarContext } from "./actionbar-context";
import type { ActionBarItem } from "./types";

// Register a set of items into the global action-bar registry.
// Auto-unregisters on unmount + on sourceKey change.
//
// **Pass a `useMemo`'d array.** The effect re-registers whenever
// the array identity changes; the provider's `register()` then
// dedups by item-by-item identity, so a fresh array with identical
// item refs is cheap (state stays === and no re-render fires) but
// a fresh array with NEW item objects (e.g. consumers whose
// onClick closures captured updated state) does re-register —
// downstream renders pick up the fresh handlers.
//
// Inline-array consumers (`useActionBarItems(key, [{...}])`)
// will allocate new items every render and loop infinitely
// through `register → setState → re-render → register`. The
// useMemo on the caller side is what keeps that loop bounded
// to "items whose deps actually changed".
//
// Previous versions wrapped items in a local `useMemo` keyed by
// `[items.length, items.map(i => i.key).join('|')]`. That gate
// suppressed identity updates whenever the keys + length stayed
// stable, which is precisely the case for a selection-mode
// toolbar whose buttons are fixed but whose onClicks close over
// changing state — they ended up registered ONCE with the first
// render's closures and never refreshed, shipping stale state to
// every subsequent click. The gate is gone; the provider's
// shallow item-identity dedup is the single source of truth.
//
// **Important**: the useEffect deps below intentionally do NOT
// include the ctx object itself — only its stable function refs
// (register/unregister are useCallback'd in the provider).
// Including ctx would cause an infinite render loop: register
// mutates provider state → provider's value memo recomputes →
// ctx ref changes → effect re-runs → cleanup unregisters →
// state mutates again → ctx changes → loop. Manifests as the
// main thread saturating and event clicks never reaching the
// router. Same fix applies in useCommandSource.

export function useActionBarItems(sourceKey: string, items: ActionBarItem[]) {
  const ctx = useContext(ActionBarContext);
  if (!ctx) {
    throw new Error("useActionBarItems must be used within <ActionBarProvider>");
  }
  const { register, unregister } = ctx;
  useEffect(() => {
    register(sourceKey, items);
    return () => unregister(sourceKey);
  }, [register, unregister, sourceKey, items]);
}

export function useActionBarItemsContext() {
  const ctx = useContext(ActionBarContext);
  if (!ctx) {
    throw new Error("Action bar context not found");
  }
  return ctx;
}
