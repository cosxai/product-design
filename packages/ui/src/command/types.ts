import type { ReactNode } from "react";

// Single executable command. Sources register sets of these; the
// palette flattens, filters by the user's query, groups by `group`,
// and runs `run()` when the user picks.

export interface CommandItem {
  key: string;
  // Visual category — items sharing a group render under a single
  // labelled header in the palette. Use anything; the kit pins
  // ordering via the palette's `groupOrder` prop.
  group: string;
  label: string;
  // Dimmed secondary text — usually a path or short context.
  sublabel?: string;
  // Right-aligned hint (kbd shortcut, "→", etc.).
  hint?: ReactNode;
  icon?: ReactNode;
  // Extra strings to score against (filenames, aliases). Lower
  // weight than label so they don't drown the primary match.
  keywords?: string[];
  // Called when the user picks this command. `close()` shuts the
  // palette — useful when the command opens a sub-flow that wants
  // to keep the palette open.
  run: (api: { close: () => void }) => void;
  // Cheat-code gating: when set, the item is INVISIBLE to every
  // query except an exact (case-insensitive, trimmed) match of this
  // phrase — it never appears in empty-query listings or partial
  // matches. Use for hidden debug/test menus; pair with a "Debug"
  // group so the reveal is self-describing.
  secret?: string;
}
