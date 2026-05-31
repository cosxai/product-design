# Changelog

## 0.3.2 (2026-05-31)

- **fix(actionbar)**: bar now renders when the only consumer is
  `useActionBarStatusDot` (no items registered). The empty-state
  guard previously checked `items.length === 0` only, so a
  status-dot-only surface would render nothing.

## 0.3.1 (2026-05-31)

- **feat(actionbar)**: bar-intrinsic `statusDot` slot at the right
  edge, mirroring the left-edge drag grip. Registered via
  `useActionBarStatusDot({color, title?, onClick?, pulse?} | null)`.
  Unlike `useActionBarItems`, the status dot is system chrome — not
  page-level content — so the API is a single hook with last-call-
  wins semantics (no source-key fan-out). Driven by `product-meta`
  needing a fixed sync indicator that visually anchors to the bar
  rather than registering as a registry item (the trailing slot
  worked but conflated system status with page actions). Exports
  `ActionBarStatusDot` type + `useActionBarStatusDot` hook.

## 0.3.0 (2026-05-31)

- **feat(actionbar)**: `ActionBarItem` gains a `slot?: 'leading' |
  'trailing'` field. Trailing items render after a flex spacer so
  they pin to the right edge of the bar regardless of registration
  order — system status indicators (sync, identity, connection)
  belong here, where page items registering later can't shuffle
  them. Default `'leading'` preserves existing behavior; this is a
  purely additive change. Exports `ActionBarItemSlot` from the
  bucket index. Driven by product-meta needing a stable home for
  the SWR sync-status indicator on dash AND inside workspace SPAs.

## 0.2.10 (2026-05-30)

- **fix**: Add `text-decoration: none` to `.ck-btn` so `<a class="ck-btn">`
  CTAs render flat instead of inheriting the browser's default
  anchor underline. Consumers using Tailwind preflight had this
  masked because Tailwind resets `<a>` decoration globally; mesh's
  embedded auth pages (no Tailwind) surfaced the underline on the
  verify-email success page's "Continue to [Product] →" anchor.

## 0.2.9 (2026-05-30)

- **fix**: Add a global `*, *::before, *::after { box-sizing: border-box }`
  reset to `base.css`. Every modern CSS reset ships this; without it,
  `min-height: 100vh` + padding extends elements beyond the viewport
  (default `content-box` stacks padding on top of the declared min-height)
  and creates a sneaky scroll on any consumer page that combines those
  two properties. Caught in mesh's `body.mesh-auth-page` where a green
  flash alert pushed a reset-password page slightly past 100vh and the
  whole page became scrollable. Consumers using Tailwind preflight
  already had this rule via Tailwind; consumers without it (like mesh's
  embedded auth pages) now pick it up here.

## 0.2.8 (2026-05-29)

- **feat**: `ActionBarButton` wraps the `icon` prop in a
  `.ck-actionbar-icon` span. Lifts unicode glyphs (◐ ☀ ☾ ◇) to
  16 px and applies a 1 px optical-centre nudge so they read on
  par with the heavier label text. Callers can drop any local
  wrappers and pass icons as bare strings / SVG nodes.

## 0.2.7 (2026-05-28)

- **fix**: `Select` popover used to close on ANY scroll event
  (including the option list's own internal scroll), so a user
  trying to scroll through a long list would see the popover
  vanish under their cursor. Scrolls that originate inside the
  popover are now filtered out; outer / page scrolls reposition
  the popover against the trigger instead of closing it.

## 0.2.6 (2026-05-28)

- **fix**: `Select` popover was clipped by ancestors with
  `overflow: hidden` (Card, Drawer, Dialog). Popover now renders
  via `createPortal` to `document.body` with `position: fixed`
  computed against the trigger's bounding rect — escapes any
  parent's clip box and stacks above sibling content. Closes on
  page scroll to avoid drifting off the trigger.
- **feat**: `Select` gains `searchable` + `searchPlaceholder`.
  When `searchable={true}` the popover renders a search input
  pinned at the top that filters options by case-insensitive
  label substring. Keyboard model on the input matches Radix /
  shadcn Combobox: Arrows navigate filtered list, Enter commits
  highlighted, Esc closes, Tab advances focus.

## 0.2.5 (2026-05-28)

- **feat**: new `Select` primitive. Custom listbox (NOT native
  `<select>`) so the popup styling actually responds to chrome
  overrides — native `<select>` popups are browser-locked on every
  OS, which used to punch through the design system with macOS
  blue on terminal/editorial dark mode.
  - Trigger renders the same shape as `Input`; chromes that restyle
    `.ck-input` automatically pick up `.ck-select-trigger` siblings.
  - ARIA combobox / listbox roles; full keyboard support
    (Space/Enter open, Arrows + Home/End navigate, Enter commits,
    Esc closes restoring previous value, Tab advances, A-Z/0-9
    typeahead with 500 ms reset).
  - Optional `name` prop emits a hidden `<input>` so plain `<form>`
    submits still carry the value.
  - Terminal chrome override included; other chromes inherit
    sensible defaults via token consumption (extend at the chrome
    file as their look diverges).

## 0.2.4 (2026-05-28)

- **fix**: bare `<a>` elements now default to `--ck-accent` (with
  a clean 1 px underline + `var(--ck-accent-hover)` on hover) and
  hold accent through the `:visited` state. Without this rule the
  browser's default visited-purple bled through every chrome —
  visible on terminal (green-on-black landed indigo-on-black) and
  editorial (coral landed purple). Components that style their own
  anchors (`NavItem`, `TopBar` nav, breadcrumbs) keep winning via
  more-specific selectors; this is a strictly-additive base rule.

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
