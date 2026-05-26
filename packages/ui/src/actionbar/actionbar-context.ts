import { createContext } from "react";
import type { ActionBarItem, ActionBarCategories } from "./types";

// Registry + expansion + category catalog. Items are pushed by
// pages through useActionBarItems(); categories are declared at
// the provider level (passed as a prop). expandedKey tracks which
// group is currently open (one at a time).

export interface ActionBarContextValue {
  register: (sourceKey: string, items: ActionBarItem[]) => void;
  unregister: (sourceKey: string) => void;
  // Flat list assembled from all sources, with `__builtins__`
  // pinned to the front (so consumer-declared "Create" items
  // always land before page contributions).
  items: ActionBarItem[];
  // Static category catalog from the provider — `{ create: {label, icon}, ... }`.
  categories: ActionBarCategories;
  // Which group head is currently expanded. null = none.
  expandedKey: string | null;
  setExpandedKey: (key: string | null) => void;
}

export const ActionBarContext = createContext<ActionBarContextValue | null>(null);
