# @cosxai/ui

The COSX Design System 3.0 in React: tokens, a Tailwind v4 theme and
(from the 1.0 alphas on) components. The design lives at
[design.cosx.co](https://design.cosx.co); this package is its
implementation.

> **1.x is a new system.** 0.x (the `--ck-*` kit with its presets) is
> maintained on the `ui-0.x` branch and published under the `v0` dist-tag;
> `^0.x` ranges keep getting its fixes. 1.0 alphas are published under
> `next` — install with `@cosxai/ui@next`.

## Use

```css
/* app.css — Tailwind v4 app */
@import "tailwindcss";
@import "@cosxai/ui/theme.css";
@import "@cosxai/ui/styles.css";
@source "../node_modules/@cosxai/ui/src";
```

Without Tailwind, `@cosxai/ui/styles.css` alone gives the tokens and fonts
as CSS variables (`var(--bg-page)`, `var(--radius-md)` …).

**Ink (dark) mode:** `data-mode="ink"` on `<html>`, or `.ink-mode` on a
subtree. The semantic utilities (`bg-page`, `text-fg`, `border-rule` …)
switch with it — no `dark:` variants.

## What the theme gives you

| Kind | Utilities | Notes |
|---|---|---|
| Surfaces | `bg-page` `bg-sunk` `bg-well` `bg-chrome` `bg-field` | switch with ink mode |
| Type colour | `text-fg` `text-fg-secondary` `text-fg-label` | |
| Materials | `bg-paper` `bg-linen` `bg-ink` `bg-yellow` `bg-yellow-accent` … | fixed |
| Status | `attention` `error` (+ `-wash`, `error-text`) | yellow, ink and one red only |
| Radius | `rounded-xs` 4 · `sm` 6 · `md` 8 · `lg` 16 · `xl` 24 · `pill` | |
| Size | `text-meta` 12 · `small` 13.5 · `ui` 14 · `body` 15 · `h3` 18 · `lede` 20 · `title` 22 · `figure` 32 · `h2` `h1` `display` | |
| Family | `font-sans`, `font-sans-cjk` | Geist + Noto Sans SC, self-hosted |
| Motion | `ease-standard` `ease-out` `ease-in` | |

Tailwind's own palette, radii, shadows and easings are removed on purpose:
3.0 has no shadows and one yellow.

## Develop

`pnpm test` (theme ↔ tokens agreement, `cn`), `pnpm check:css` (a real
Tailwind build of the theme), `pnpm typecheck`.

`src/tokens/` are copied unchanged from the "COSX Design System 3.0"
Claude Design project — change them there, copy again.
