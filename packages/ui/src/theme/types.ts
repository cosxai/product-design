// Theme axes. Light/dark is the conventional dark-mode toggle.
// Chrome ("classic" vs "seamless") is an orthogonal style — classic
// has visible borders + subtle dividers, seamless flattens them and
// relies on background shifts for layering. Both axes are applied
// as data attributes on <html>: data-ck-theme, data-ck-chrome.

export type Theme = "light" | "dark";

// Built-in chromes ship with the kit; custom strings are also
// allowed at runtime (the kit just stamps the value onto
// `data-ck-chrome`, your CSS supplies the overrides). The
// `(string & {})` trick preserves autocomplete for the built-ins
// while widening the union to any string for custom chromes.
export type Chrome = "classic" | "seamless" | "editorial" | "neobrutalism" | "ambient" | "swiss" | "terminal" | "bento" | "frutiger" | "riso" | "sketch" | (string & {});

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (next: Theme) => void;
  toggleTheme: () => void;
  chrome: Chrome;
  setChrome: (next: Chrome) => void;
}
