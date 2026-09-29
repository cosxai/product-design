import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/** system follows the OS; light is paper; ink is the dark page. */
export type ThemeMode = 'system' | 'light' | 'ink';

type ThemeContextValue = {
  /** What the person chose. */
  mode: ThemeMode;
  /** What is showing now (system resolved). */
  resolved: 'light' | 'ink';
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const QUERY = '(prefers-color-scheme: dark)';

function readStored(key: string | null): ThemeMode | null {
  if (!key) return null;
  try {
    const v = localStorage.getItem(key);
    return v === 'system' || v === 'light' || v === 'ink' ? v : null;
  } catch {
    return null;
  }
}

export type ThemeProviderProps = {
  children: ReactNode;
  /** @default "system" */
  defaultMode?: ThemeMode | undefined;
  /** localStorage key for the choice; null keeps it in memory only. @default "cosx-theme" */
  storageKey?: string | null | undefined;
};

/**
 * ThemeProvider — system (default) / light / ink. Sets data-mode="ink" on
 * <html> when the ink page shows (the tokens switch on it); follows the OS
 * live in system mode.
 */
export function ThemeProvider({ children, defaultMode = 'system', storageKey = 'cosx-theme' }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStored(storageKey) ?? defaultMode);
  const [systemInk, setSystemInk] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches === true);

  useEffect(() => {
    const mq = window.matchMedia?.(QUERY);
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => setSystemInk(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolved: 'light' | 'ink' = mode === 'system' ? (systemInk ? 'ink' : 'light') : mode;

  useEffect(() => {
    const root = document.documentElement;
    if (resolved === 'ink') root.setAttribute('data-mode', 'ink');
    else root.removeAttribute('data-mode');
  }, [resolved]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      if (!storageKey) return;
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* storage unavailable: the choice lasts for this page */
      }
    },
    [storageKey],
  );

  const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** The current theme and a setter. Outside a ThemeProvider: light, no-op. */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext) ?? { mode: 'light', resolved: 'light', setMode: () => {} };
}
