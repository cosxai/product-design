import type { ReactNode } from "react";

// Single item in the action bar. Pages register items via
// useActionBarItems() — the bar itself reads from the registry
// and renders them grouped by category. Categories with 2+ items
// fold into one inline-expandable group head.

export type ActionBarItemVariant = "ghost" | "primary" | "soft";

// Slot anchor — which edge of the bar the item gravitates toward.
// `leading` (default) keeps existing behavior: items pack from the
// drag grip outward in registration order. `trailing` pins the item
// to the right edge with a flex spacer separating it from the
// leading group, regardless of registration order. Use trailing for
// system status indicators (sync, connection, identity) that need a
// stable visual home and shouldn't be shuffled by page items
// registering after them.
export type ActionBarItemSlot = "leading" | "trailing";

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
  // Slot anchor. Defaults to `leading`. Trailing items render after
  // a flex spacer so they pin to the right edge regardless of
  // registration order — system status indicators belong here.
  slot?: ActionBarItemSlot;
  // Marks this item as admin-only. Hidden until the ActionBar's
  // admin-mode toggle is switched on. The toggle button auto-appears
  // on the bar whenever at least one registered item has adminOnly=
  // true; when no consumer registers such items, the toggle stays
  // hidden and the bar looks exactly as it always did.
  //
  // Use for elevated-privilege actions that would confuse regular
  // users (version history, retry render, delete forever, etc.).
  // Consumer decides eligibility upstream — typically by only
  // registering the item when the caller has `capabilities.manage`
  // (or an equivalent gate) === true. The kit does not check
  // permissions; it only handles the toggle UX.
  adminOnly?: boolean;
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

// Status dot — bar-intrinsic chrome rendered at the right edge,
// mirroring the left-edge drag grip. Distinct from `ActionBarItem`
// (which is page-level content registered through the items
// registry): a status dot is a fixed system affordance —
// connection / sync / identity health. The grip on the left says
// "you can move this thing"; the status dot on the right says
// "here's how the system is doing."
//
// Visual: a small coloured dot, optionally pulsing. Hover shows the
// title as a native tooltip. Click fires `onClick` — the bar owns
// no popover behaviour; consumers render their own popover anchored
// to body / wherever fits their UX.
//
// Registered via `useActionBarStatusDot()`. One source of truth at
// any time (last call wins). Pass `null` to clear.
export interface ActionBarStatusDot {
  // Colour of the dot. Any CSS colour string — typically a token
  // like `var(--ck-status-success)`. The bar applies no defaulting,
  // so omit the entry (pass null to the hook) to render no dot.
  color: string;
  // Hover tooltip + aria-label. Falls back to "Status".
  title?: string;
  // Click handler. When omitted the dot renders as a non-interactive
  // span (no focus ring, no cursor change, no role=button).
  onClick?: () => void;
  // When true, the dot pulses (CSS animation). Use sparingly —
  // pulsing reads as attention-grabbing.
  pulse?: boolean;
}
