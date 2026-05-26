# @cosx/ui — internal component library

A portable, shadcn-style component kit extracted from a working
product. Tokens · layout shell · dialogs · floating action bar ·
cmd+k command palette · PWA scaffolding.

## Structure

```
ui-kit/
  packages/
    ui/                       # the library — @cosx/ui
      src/
        styles/               # fonts, tokens, base CSS + utility classes
        primitives/           # Button, Card, Tag, Input, Checkbox, …
        layout/               # Shell, Topbar, Breadcrumb, LeftNavRail, MobileTabBar, …
        dialogs/              # Modal, DialogsProvider, useDialogs
        actionbar/            # registry + floating bar renderer
        command/              # cmd+k palette + fuzzy ranker
        hooks/                # useViewport, useReducedMotion, useKeyboardHotkey
        theme/                # ThemeProvider, useTheme, getInlineThemeScript
        pwa/                  # InstallPromptBanner, registerSW, manifest template
      public/fonts/           # Geist + Geist Mono (reference copies)
  apps/
    docs/                     # Vite + React docs/demo site
      src/
        routes/               # one page per cluster
```

## Develop

```sh
pnpm install
pnpm dev        # boots apps/docs at http://localhost:5173
```

The docs app imports `@cosx/ui` via workspace protocol — editing
files under `packages/ui` hot-reloads in the demo immediately.

## Distribution model

shadcn-style: source-first. Two consumption modes:

1. **Workspace dep** (during dev or in another monorepo): add
   `"@cosx/ui": "workspace:*"` (or git URL after lift-out).
2. **Copy-paste** (for projects that want full ownership): copy
   the relevant files under `packages/ui/src/` into your project's
   `src/components/ui/` and adjust import paths.

The kit deliberately ships TS source, not a built bundle —
consumers get readable code, easy customisation, and no version
lock-in.

## Theming

Two orthogonal axes:

| Attribute | Values | Default | Drives |
|---|---|---|---|
| `data-ck-theme` | `light` · `dark` | `system` | Color mode |
| `data-ck-chrome` | `classic` · `seamless` · *(custom)* | `seamless` | Visual style |

```tsx
import { ThemeProvider } from "@cosx/ui";
import "@cosx/ui/styles.css";

<ThemeProvider defaultTheme="system" defaultChrome="seamless">
  <App />
</ThemeProvider>
```

Pre-mount inline script (prevents white-flash on dark sessions):

```tsx
import { getInlineThemeScript } from "@cosx/ui";
// at build time:
const script = getInlineThemeScript({ defaultChrome: "seamless" });
// inject into index.html <head>
```

### Custom chrome

Add any number of chrome variants by writing a CSS block targeting
`html[data-ck-chrome="<name>"]` that overrides whichever tokens you
want. Example "neon" variant lives at `apps/docs/src/routes/theming.tsx`.

### Brand accent

Single primitive — every shade derives via `color-mix()`. Override
per-app:

```ts
document.documentElement.style.setProperty("--ck-accent-light-override", "#059669");
document.documentElement.style.setProperty("--ck-accent-dark-override", "#34D399");
```

## Lift-out (when graduating to own repo)

The `ui-kit/` directory is already a complete repo — root
`package.json`, workspace config, both packages self-contained.

```sh
# 1. Copy the directory out
cp -r ui-kit/ ../cosx-ui/
cd ../cosx-ui

# 2. Initialise a fresh git repo
git init
git add .
git commit -m "init from deck-kit"

# 3. Re-install (lockfile not committed)
pnpm install

# 4. Verify
pnpm dev
```

Before lifting, verify nothing imports back into the parent repo:

```sh
grep -r "deck-kit" packages/ apps/ || echo "clean"
```

## Publishing later

When ready for npm:

1. Set `"private": false` in `packages/ui/package.json`
2. Pick a real version
3. Add a build step (e.g. `tsup` or just `tsc -d`) producing
   `dist/` with `.d.ts` files
4. Update `main` / `types` / `exports` to point at `dist/`
5. `pnpm publish --access restricted` (or public)

## Highlights

- **Token system**: 60+ CSS variables across colors, type, motion,
  radii, status, shadows. Switches in lockstep across all
  components on theme / chrome change. Live token table:
  http://localhost:5173/tokens
- **Layout via CSS vars**: each rail (left nav, right rail, mobile
  tab bar, breadcrumb) stamps its own size onto `documentElement` so
  page content insets itself without prop-drilling.
- **Registry-driven action bar + palette**: pages push items via
  `useActionBarItems()` / `useCommandSource()`; the renderers
  flatten + display. Auto-cleanup on unmount.
- **Hotkey hook**: `useKeyboardHotkey()` ships the conflict guards
  (input focus, modifier keys, modal stacking) so call sites don't
  reinvent them.
- **Dialogs API**: `useDialogs().{confirm, prompt, toast}` returns
  promises — call sites flow naturally without managing local
  modal state.
- **PWA pieces**: install prompt banner + SW registration helper +
  manifest template; vite-plugin-pwa wiring documented at /pwa.
