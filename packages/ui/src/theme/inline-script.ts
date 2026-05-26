import type { Theme, Chrome } from "./types";

// Pre-mount inline script generator. Paste the returned string
// into a <script> tag in your index.html <head> so the data-ck-*
// attributes are set before React hydrates — prevents a white-
// flash on dark sessions. Pass the same keys you pass to
// <ThemeProvider> so localStorage stays in sync.
//
// Lives in its own file (not co-located with ThemeProvider) so
// React Fast Refresh stays happy — Vite's plugin-react requires
// modules to export only components, and mixing this helper into
// the same file would silently degrade HMR into full reloads (and
// take the data router's in-memory state with it on every save).

export function getInlineThemeScript(opts: {
  themeStorageKey?: string;
  chromeStorageKey?: string;
  defaultTheme?: Theme | "system";
  defaultChrome?: Chrome;
} = {}): string {
  const t = JSON.stringify(opts.themeStorageKey ?? "ck-theme");
  const c = JSON.stringify(opts.chromeStorageKey ?? "ck-chrome");
  const dt = JSON.stringify(opts.defaultTheme ?? "system");
  const dc = JSON.stringify(opts.defaultChrome ?? "seamless");
  return `(function(){try{
    var t=localStorage.getItem(${t});
    if(t!=="light"&&t!=="dark"){
      var d=${dt};
      t=d==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):d;
    }
    document.documentElement.setAttribute("data-ck-theme",t);
    var c=localStorage.getItem(${c});
    if(c!=="classic"&&c!=="seamless")c=${dc};
    document.documentElement.setAttribute("data-ck-chrome",c);
  }catch(e){}})();`;
}
