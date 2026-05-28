# Changelog

## 0.2.1 (2026-05-28)

- **fix**: `Input` addon (`prefix` / `suffix`) visual contrast.
  Previously the addon shared the input's `--ck-bg-surface`
  background and relied on a hard `1px` divider for separation,
  which read as a vertical cut across an otherwise homogeneous
  field. Switched to `--ck-bg-muted` (the canonical "recessed
  slab" token) and removed the divider — the bg shift carries the
  separation across every chrome and dark variant.

## 0.2.0 (2026-05-28)

- **breaking**: remove `frutiger` chrome. The preset's tokens, CSS,
  and components (`SkyBackdrop`, `GlossyOrb`) are deleted; the
  `Chrome` type union no longer includes `"frutiger"`. Consumers
  using it should switch to `ambient` (closest spiritual match).
- **fix**: ThemeProvider now persists every built-in chrome through
  reloads, not just `classic` / `seamless` (cosxai/product-design#2).
  `BUILTIN_CHROMES` is the new source of truth — exported from
  `@cosxai/ui` so consumers can use it for chrome pickers.
- **feat**: `Input` gains optional `prefix` + `suffix` props for
  inline addons inside the bordered field (e.g. `acme.cosx.dev`
  workspace pickers, currency symbols, search icons). The native
  HTML `prefix` RDFa attribute is now Omitted from the `InputProps`
  surface — consumers needing it can drop to a raw `<input>`.

## 0.1.0 (2026-05-26)

- Initial public release on npm.
