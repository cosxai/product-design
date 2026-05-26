import { useContext, useEffect, useMemo } from "react";
import { CommandContext } from "./command-context";
import type { CommandItem } from "./types";

// Register a set of commands. Same lifecycle pattern as
// useActionBarItems — auto-unregister on unmount / sourceKey change.
//
// **Important**: same `ctx`-in-deps caveat as useActionBarItems —
// depending on the whole ctx object would cause an infinite render
// loop (register mutates provider state → ctx ref changes → effect
// re-runs → loop). Destructure register/unregister out so we depend
// on the stable useCallback'd refs instead.

export function useCommandSource(sourceKey: string, items: CommandItem[]) {
  const ctx = useContext(CommandContext);
  if (!ctx) {
    throw new Error("useCommandSource must be used within <CommandProvider>");
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

export function useCommandPalette() {
  const ctx = useContext(CommandContext);
  if (!ctx) {
    throw new Error("Command palette context not found");
  }
  return { open: ctx.open, setOpen: ctx.setOpen };
}
