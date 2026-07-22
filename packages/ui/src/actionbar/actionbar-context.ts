import { createContext } from "react";
import type { ActionBarItem, ActionBarCategories, ActionBarStatusDot, ActionBarPanelMeta } from "./types";

// Registry + expansion + category catalog + status-dot slot. Items are
// pushed by pages through useActionBarItems(); the status dot is
// pushed by a separate hook (useActionBarStatusDot) because it's
// bar-intrinsic chrome, not page-level content. expandedKey tracks
// which group is currently open (one at a time).

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
  // Bar-intrinsic right-edge status indicator. null when no consumer
  // has registered one. Last call to setStatusDot wins.
  statusDot: ActionBarStatusDot | null;
  setStatusDot: (dot: ActionBarStatusDot | null) => void;
  // Bar-intrinsic popover slot (design#13). useActionBarPanel
  // registers META only (open/onOpenChange/width/ariaLabel); the bar
  // renders an empty themed container and publishes its DOM node via
  // panelHost, into which the hook PORTALS the consumer's content.
  // Content never enters context state — a fresh JSX identity per
  // consumer render would otherwise re-render-loop through setPanel.
  panel: ActionBarPanelMeta | null;
  setPanel: (panel: ActionBarPanelMeta | null) => void;
  panelHost: HTMLDivElement | null;
  setPanelHost: (el: HTMLDivElement | null) => void;
  // Transient bubble above the bar (completion toasts etc.) — same
  // portal-host pattern: consumers register only "active", content
  // portals into toastHost.
  toastActive: boolean;
  setToastActive: (active: boolean) => void;
  toastHost: HTMLDivElement | null;
  setToastHost: (el: HTMLDivElement | null) => void;
}

export const ActionBarContext = createContext<ActionBarContextValue | null>(null);
