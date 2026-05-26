import { createContext } from "react";
import type { CommandItem } from "./types";

export interface CommandContextValue {
  register: (sourceKey: string, items: CommandItem[]) => void;
  unregister: (sourceKey: string) => void;
  items: CommandItem[];
  open: boolean;
  setOpen: (next: boolean) => void;
}

export const CommandContext = createContext<CommandContextValue | null>(null);
