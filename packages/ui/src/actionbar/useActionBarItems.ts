import { useContext, useEffect, useMemo } from "react";
import { ActionBarContext } from "./actionbar-context";
import type { ActionBarItem } from "./types";

// Register a set of items into the global action-bar registry.
// Auto-unregisters on unmount + on sourceKey change.
//
// `items` is the live array — pass a useMemo'd array to avoid
// re-registration thrash. The provider's register() does shallow
// equality, so passing a NEW array with identical refs is fine,
// but a NEW array with all-new item objects (from inline JSX
// blocks) will re-register every render.
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
  const memo = useMemo(
    () => items,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length, items.map((i) => i.key).join("|")],
  );
  useEffect(() => {
    register(sourceKey, memo);
    return () => unregister(sourceKey);
  }, [register, unregister, sourceKey, memo]);
}

export function useActionBarItemsContext() {
  const ctx = useContext(ActionBarContext);
  if (!ctx) {
    throw new Error("Action bar context not found");
  }
  return ctx;
}
