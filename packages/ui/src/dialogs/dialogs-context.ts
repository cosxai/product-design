import { createContext } from "react";
import type { DialogsApi } from "./types";

// React Fast Refresh requires component modules to export only
// components — same reason ThemeContext lives in its own file.
export const DialogsContext = createContext<DialogsApi | null>(null);
