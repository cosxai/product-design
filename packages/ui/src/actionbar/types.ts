import type { ReactNode } from "react";

// Single item in the action bar. Pages register items via
// useActionBarItems() — the bar itself reads from the registry
// and renders them grouped by category. Categories with 2+ items
// fold into one inline-expandable group head.

export type ActionBarItemVariant = "ghost" | "primary" | "soft";

export interface ActionBarItem {
  // React key for the rendered button. Stable across rerenders.
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  // State indicator — active items render with the accent tone.
  active?: boolean;
  // Tooltip / aria-label. Falls back to label.
  title?: string;
  // Disable without removing.
  disabled?: boolean;
  // Group key — items sharing a category collapse into one
  // expandable group head when 2+ are present. Single items
  // render inline. Categories are declared at the provider level.
  category?: string;
  // Visual mode. Default ghost.
  variant?: ActionBarItemVariant;
  // Optional kbd hint shown beside the label (just visual — the
  // shortcut is wired by the caller via useKeyboardHotkey).
  hint?: string;
  // When inside an expanded group, clicking this item normally
  // collapses the group afterward. Set true to keep it open
  // (e.g. for items whose post-click state changes the label
  // and should stay visible).
  keepGroupOpenOnClick?: boolean;
}

// Category definition — declared at the provider level. Drives
// the group head's label + icon.
export interface ActionBarCategory {
  label: string;
  icon?: ReactNode;
}

export type ActionBarCategories = Record<string, ActionBarCategory>;

export interface ActionBarSource {
  sourceKey: string;
  items: ActionBarItem[];
}
