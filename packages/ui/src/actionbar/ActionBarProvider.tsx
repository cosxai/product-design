import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ActionBarContext } from "./actionbar-context";
import type { ActionBarItem, ActionBarCategories, ActionBarStatusDot, ActionBarPanelMeta } from "./types";

// Provider for the action-bar registry + expansion state +
// category catalog. Mount once near the app root, inside the
// router so consumer hooks (useNavigate etc.) work but outside
// any per-route boundary.

export interface ActionBarProviderProps {
  children: ReactNode;
  // Declare the categories your app uses, keyed by category id.
  // Items with `category: "create"` look up { label, icon } here
  // for the group head. If you don't declare a category that an
  // item references, that item still renders — it just falls
  // back to its own label as the group head.
  categories?: ActionBarCategories;
}

export function ActionBarProvider({
  children,
  categories = {},
}: ActionBarProviderProps) {
  const [sources, setSources] = useState<Record<string, ActionBarItem[]>>({});
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [statusDot, setStatusDot] = useState<ActionBarStatusDot | null>(null);
  const [panel, setPanel] = useState<ActionBarPanelMeta | null>(null);
  const [panelHost, setPanelHost] = useState<HTMLDivElement | null>(null);
  const [toastActive, setToastActive] = useState(false);
  const [toastHost, setToastHost] = useState<HTMLDivElement | null>(null);

  const register = useCallback((sourceKey: string, items: ActionBarItem[]) => {
    setSources((prev) => {
      const cur = prev[sourceKey];
      if (cur && cur.length === items.length && cur.every((it, i) => it === items[i])) {
        return prev;
      }
      return { ...prev, [sourceKey]: items };
    });
  }, []);

  const unregister = useCallback((sourceKey: string) => {
    setSources((prev) => {
      if (!(sourceKey in prev)) return prev;
      const next = { ...prev };
      delete next[sourceKey];
      return next;
    });
  }, []);

  // `__builtins__` pinned to front. Convention used by consumers
  // that want a stable "Create" group regardless of which page
  // registered first.
  const items = useMemo(() => {
    const all: ActionBarItem[] = [];
    if (sources["__builtins__"]) all.push(...sources["__builtins__"]);
    for (const [key, list] of Object.entries(sources)) {
      if (key === "__builtins__") continue;
      all.push(...list);
    }
    return all;
  }, [sources]);

  const value = useMemo(
    () => ({
      register,
      unregister,
      items,
      categories,
      expandedKey,
      setExpandedKey,
      statusDot,
      setStatusDot,
      panel,
      setPanel,
      panelHost,
      setPanelHost,
      toastActive,
      setToastActive,
      toastHost,
      setToastHost,
    }),
    [register, unregister, items, categories, expandedKey, statusDot, panel, panelHost, toastActive, toastHost],
  );

  return (
    <ActionBarContext.Provider value={value}>
      {children}
    </ActionBarContext.Provider>
  );
}
