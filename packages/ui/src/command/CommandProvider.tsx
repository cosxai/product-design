import { useCallback, useMemo, useState, type ReactNode } from "react";
import { CommandContext } from "./command-context";
import { useKeyboardHotkey } from "../hooks/useKeyboardHotkey";
import type { CommandItem } from "./types";

// Hosts the command-source registry + the palette's open state.
// Binds Cmd+K globally so any consumer page can trigger the palette
// without wiring its own listener.

export function CommandProvider({
  children,
  hotkey = "k",
}: {
  children: ReactNode;
  // Letter for the Mod+_ shortcut. Default "k".
  hotkey?: string;
}) {
  const [sources, setSources] = useState<Record<string, CommandItem[]>>({});
  const [open, setOpen] = useState(false);

  const register = useCallback((sourceKey: string, items: CommandItem[]) => {
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

  const items = useMemo(() => Object.values(sources).flat(), [sources]);

  useKeyboardHotkey(
    hotkey,
    (e) => {
      e.preventDefault();
      setOpen((v) => !v);
    },
    { mod: true, skipWhenModalOpen: false },
  );

  const value = useMemo(
    () => ({ register, unregister, items, open, setOpen }),
    [register, unregister, items, open],
  );

  return <CommandContext.Provider value={value}>{children}</CommandContext.Provider>;
}
