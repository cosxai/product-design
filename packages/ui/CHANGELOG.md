# Changelog

## 0.2.3 (2026-05-28)

- **fix**: `Input` with `prefix` / `suffix` rendered with no left
  padding under the `swiss` chrome — swiss strips `padding-left`
  from `.ck-input` for the underline-only standalone look, but
  that made the input text collide with the addon slab. Restored
  padding for the `.ck-input--with-addon` variant; the swiss
  underline is now drawn on the OUTER wrap so the whole field
  (addons + input) reads as one underlined bar.

## 0.2.2 (2026-05-28)

> Note: `ui-v0.2.1` exists as a git tag but was never published to
> npm (publish workflow waiting for OTP at the time the fixes below
> were folded in). Consumers should ignore 0.2.1 — use 0.2.2.

- **fix**: `Input` addon (`prefix` / `suffix`) visual contrast.
  Previously the addon shared the input's `--ck-bg-surface`
  background and relied on a hard `1px` divider for separation,
  which read as a vertical cut across an otherwise homogeneous
  field. Switched to `--ck-bg-muted` (the canonical "recessed
  slab" token) and removed the divider — the bg shift carries the
  separation across every chrome and dark variant.
- **fix**: `Input` default height 34 → 36 px to line up with the
  default `Button` height (also 36 px under editorial; matches the
  shadcn/ui + Mantine convention). The previous 2 px short-fall
  made the field read as a size smaller than buttons next to it.

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
