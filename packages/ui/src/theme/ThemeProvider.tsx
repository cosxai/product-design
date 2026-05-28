import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeContext } from "./theme-context";
import { BUILTIN_CHROMES } from "./types";
import type { Theme, Chrome, ThemeContextValue } from "./types";

const DEFAULT_THEME_KEY = "ck-theme";
const DEFAULT_CHROME_KEY = "ck-chrome";

function readStored<T extends string>(
  key: string,
  allowed: readonly T[],
): T | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(key);
  return allowed.includes(v as T) ? (v as T) : null;
}

function preferredTheme(defaultTheme: Theme | "system"): Theme {
  if (defaultTheme !== "system") return defaultTheme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme, storageKey: string) {
  document.documentElement.setAttribute("data-ck-theme", theme);
  window.localStorage.setItem(storageKey, theme);
}

function applyChrome(chrome: Chrome, storageKey: string) {
  document.documentElement.setAttribute("data-ck-chrome", chrome);
  window.localStorage.setItem(storageKey, chrome);
}

export interface ThemeProviderProps {
  children: ReactNode;
  // Initial theme if nothing's in localStorage. "system" reads
  // `prefers-color-scheme`; explicit "light" / "dark" forces it.
  defaultTheme?: Theme | "system";
  defaultChrome?: Chrome;
  // localStorage keys — override these per-consumer-app so a host
  // page with multiple sub-apps doesn't collide.
  themeStorageKey?: string;
  chromeStorageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultChrome = "seamless",
  themeStorageKey = DEFAULT_THEME_KEY,
  chromeStorageKey = DEFAULT_CHROME_KEY,
}: ThemeProviderProps) {
  // Initial values match what getInlineThemeScript() would have
  // painted on the <html> element pre-mount, so the React tree
  // hydrates without a flash.
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = readStored<Theme>(themeStorageKey, ["light", "dark"]);
    return stored ?? preferredTheme(defaultTheme);
  });
  const [chrome, setChromeState] = useState<Chrome>(() => {
    // Allow every built-in chrome out of localStorage. Custom strings
    // (the `(string & {})` half of the Chrome union) are not
    // persisted across reloads — consumers that ship custom chromes
    // can opt-in via a separate localStorage write upstream of this
    // provider if they want persistence.
    const stored = readStored<Chrome>(chromeStorageKey, BUILTIN_CHROMES);
    return stored ?? defaultChrome;
  });

  // Mirror state → DOM. Inline script already set the attribute
  // pre-mount; this useEffect handles subsequent runtime changes.
  useEffect(() => {
    applyTheme(theme, themeStorageKey);
  }, [theme, themeStorageKey]);

  useEffect(() => {
    applyChrome(chrome, chromeStorageKey);
  }, [chrome, chromeStorageKey]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const setChrome = useCallback((next: Chrome) => setChromeState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme, chrome, setChrome }),
    [theme, setTheme, toggleTheme, chrome, setChrome],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
