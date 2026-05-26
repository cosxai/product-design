import { createContext } from "react";
import type { ThemeContextValue } from "./types";

// React Fast Refresh requires component modules to export only
// components. The context object + the hook must therefore live
// in their own files; ThemeProvider.tsx imports from here.
export const ThemeContext = createContext<ThemeContextValue | null>(null);
