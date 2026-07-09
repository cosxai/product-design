# Changelog

## 0.10.0 (2026-07-09)

- **feat(actionbar)**: New `adminOnly?: boolean` on `ActionBarItem`. Marking an item admin-only hides it behind an auto-appearing shield toggle button (rendered between the drag grip and the first item). When active, admin items reveal + the bar picks up a subtle accent-tinted background so the "elevated privileges" state reads at a glance. State persists per `storageKey`. Toggle only renders when at least one registered item has adminOnly=true — a bar with no admin items looks exactly as it always did. Reusable across viewers (block_doc, PDF, etc.) so cross-kind admin surfaces stay consistent.
- **feat(actionbar)**: Bar background + border animate on admin-mode transition (180 ms ease-out). Accent-mixed 8% opacity in oklab space so the tint reads on both light and dark themes without a full palette override.

## 0.9.0 (2026-07-08)

- **feat(actionbar)**: New `ActionBarModeHandle` component + `useActionBarMode` hook for the block_doc viewer's admin peek-out affordance. The handle sits ~6px above the ActionBar's top edge at rest (a slim 44×6 accent-coloured pill) and grows to 68×24 on hover / focus while revealing a label — click swaps the ActionBar's item set between named modes ("viewer" / "manage" / "draft"). `useActionBarMode({ modes, defaultMode, storageKey })` manages the state, persists to localStorage, and registers the active mode's items into the ActionBar registry atomically (previous set unregistered on mode change). Gate the handle behind a capability bit with `visible={can.manage}` — non-privileged principals never see the affordance. Lands with product-mesh M4.5 Phase F; consumer wiring in product-meta comes with Phase G-I.

## 0.7.1 (2026-07-01)

- **fix(MentionCombobox)**: Removed `padding: 0 4px` + `font-weight: 500` from the highlight chip. Both added glyph advance to the overlay that the underlying textarea didn't have, so every character after `@Ben Zhang` drifted right of its true position (visible mis-alignment reported at ~8px, matching the chip's horizontal padding). The chip now conveys "highlighted" purely via background + colour + a tight border-radius; overlay and textarea characters occupy identical widths so the caret stays where the user typed it.

## 0.7.0 (2026-07-01)

- **feat(MentionCombobox)**: New `mentionNames?: readonly string[]` prop. When provided and non-empty, the primitive draws a mirrored overlay behind the textarea that highlights each `@Name` (matched longest-first, whitespace-bounded) as an accent-tinted chip while the user is still composing. Textarea's own glyphs are hidden with `color: transparent` + `-webkit-text-fill-color: transparent`; `caret-color` keeps the cursor visible. Scroll syncs via a `onScroll` handler so long comments stay aligned. Omit or pass empty to opt out — the primitive renders exactly as before. Consumers typically derive the list from their captured pick-list (product-meta CommentComposer stores `PickedMention[]` for its bracket-form wire serializer and passes `picks.map(p => p.name)` here).
- **feat(MentionCombobox)**: Export `splitByMentionNames` helper used internally by the overlay — useful for consumers that render the same body outside the composer (e.g. a preview panel).

## 0.6.0 (2026-06-28)

- **feat(MentionCombobox)**: New headless generic primitive. Same @-trigger + debounced-search + keyboard-nav behaviour previously in product-meta, hoisted up so mesh + future consumers can share it. Consumers plug in `loadCandidates`, `getItemKey`, `getInsertionText`, `renderItem`. Ref exposes `focus()` for mount-on-open flows.

## 0.5.0 (2026-06-26)

- **feat(Button)**: New `loading?: boolean` prop. When true the
  button renders a leading CSS ring spinner (`.ck-btn-spinner`
  inherits `currentColor` so it reads on every variant), is set
  natively `disabled`, and exposes `aria-busy="true"`. Distinct
  from `disabled` — `disabled` means "you can't take this action
  right now", `loading` means "we're already taking this action".
  Wire both together for async submits behind form validation:
  `<Button disabled={!name.trim()} loading={submitting}>`.
- **refactor(Button)**: `forwardRef` to the underlying `<button>`
  so consumers can wire focus management (e.g. autoFocus on dialog
  mount). Was a Phase 0 stub; aligns with the
  `.claude/rules/code-style.md` `forwardRef-for-all-interactive-
  elements` rule.

## 0.4.11 (2026-06-25)

- **fix(ActionBar)**: The keyboard-shortcut `hint` badge stayed
  visible on phone-width viewports even though the matching label
  had already collapsed via `@media (max-width: 767px)`. Result:
  on a phone, the bar read as `[icon] C` instead of just `[icon]`
  — a dangling badge advertising a shortcut nobody can press
  without a keyboard. Tag the hint span with `ck-actionbar-hint`
  and add it to the same `display: none` media rule.

## 0.4.10 (2026-06-24)

- **feat(tokens)**: New `--ck-shadow-overlay` token for floating
  surfaces that need to read as "lifted off the page" rather than
  "card on a page". Default light value ~2× the punch of shadow-3
  (32-px blur on the soft layer + 8-px blur on the tight layer);
  per-chrome overrides for dark, editorial light, and dark-editorial
  so the shadow stays legible on charcoal surfaces.
- **fix(Modal)**: Bump card to `--ck-radius-lg` (12 px) + the new
  `--ck-shadow-overlay`, and stretch slot paddings to a unified
  24-px gutter (`20px 24px` header, `20px 24px 24px` body,
  `16px 24px` footer). Consumers reported the previous chrome read
  as "another tier of card" — these changes give the modal an
  unambiguous hierarchy step above the page.

## 0.4.9 (2026-06-24)

- **fix(Modal)**: Bump backdrop blur from 2 px to 8 px so the page
  surface visibly drops out of focus when a modal opens. The earlier
  value read as "barely there" — consumers cross-referencing
  agent-dataroom (4 px `backdrop-blur-sm`) asked for distinctly
  more separation; 8 px lands on the "the world stopped" side of
  the curve while still letting the surface tint show through.
  Also adds the `-webkit-` prefix so Safari < 18 (and any WebKit
  embed) gets the same effect instead of falling through to no
  blur at all.

## 0.4.8 (2026-06-24)

- **fix(chrome-editorial)**: NavItem rows in the LeftNavRail now get a
  hover background like every other chrome. Editorial was the only one
  missing the `[data-ck-navitem]:not([data-active="true"]):hover` rule
  — rail items read as static even though they're navigable, which
  product-meta consumers noticed against the cards / actionbar items
  that DO tint on hover. Sketch / ambient / riso / neobrutalism /
  terminal already had the equivalent rule; this brings editorial up
  to parity using the shared `--ck-bg-muted` token.
- **fix(Modal)**: ModalHeader's close `×` button picks up a
  `--ck-bg-muted` background on hover + a subtle border-radius. The
  previous styles only set color + cursor, so the corner control
  looked like static decoration. Same hover token + transition as the
  rest of the kit's interactive surfaces so the affordance reads
  consistently across light / dark / chrome variants.

## 0.4.7 (2026-06-24)

- **fix(actionbar)**: `useActionBarItems` no longer freezes the
  registered items on first mount when the array length + item
  `key`s are stable. Previously the hook wrapped the caller's
  array in `useMemo(() => items, [items.length, keys.join('|')])`
  to throttle re-registration; that gate suppressed identity
  updates whenever length + keys matched, which is exactly the
  case for a selection-mode toolbar with fixed buttons whose
  `onClick`s close over changing state (e.g. the current selection
  set). The registered items kept their first render's closures,
  so every click after the first shipped stale state to the
  consumer — observed in product-meta as Trash bulk-restore +
  bulk-purge sending only the first-selected id even when the
  user had picked many. The gate is gone; the provider's existing
  shallow item-identity dedup in `register()` is now the single
  source of truth. Consumers MUST `useMemo` their items array
  (already in the JSDoc) — without it, every render allocates new
  item objects and the effect loops `register → setState →
  re-render → register`. The hook docstring now spells out the
  trade-off explicitly.

## 0.4.6 (2026-06-20)

- **fix(actionbar)**: ActionBarMenuGroup child-button hover bumps
  from 18% accent blend to 30%. The 18% overlay introduced in 0.4.5
  layered on top of the wrapper's `--ck-accent-muted` (already
  8–14% accent per chrome) composited to roughly 30% effective
  saturation — at that low saturation a translucent orange / coral /
  blue all wash out to salmon, so the hover lost its hue identity
  next to the solid `--ck-accent` text it sits beside. 30% pushes
  the overlay past the "dilution reads as pink" point so the
  workspace's actual brand colour is recognisable on hover.

## 0.4.5 (2026-06-20)

- **fix(actionbar)**: child-button hover state inside an open
  disclosure group now uses an accent-blended overlay instead of
  neutral `--ck-bg-muted` gray. The default `.ck-actionbar-btn:hover`
  rule paints gray; that's correct for buttons sitting on the app
  background, but the disclosure wrapper paints itself
  `--ck-accent-muted` (a coral / indigo pill in editorial / base
  chromes) while open, so child hover was stacking gray on top of
  the brand-tinted pill — visually muddy and the hover signal lost
  its hue. `ActionBarMenuGroup` now stamps a
  `ck-actionbar-group--open` class on its wrapper while expanded;
  a scoped rule overrides the child hover to
  `color-mix(in oklab, var(--ck-accent) 18%, transparent)` so the
  hover stays in the accent family. Closed groups + standalone
  buttons are untouched. Consumers don't need to change anything —
  bump the dep version and the fix lands.

## 0.4.4 (2026-06-15)

- **fix(chrome)**: primary-button text colour now reads from
  `var(--ck-accent-fg, <chrome default>)` in editorial / ambient /
  sketch / riso / neobrutalism chromes. Previously every chrome
  hardcoded its text color to pair with its OWN signature accent
  (editorial near-black on coral; ambient white on saturated blue;
  sketch paper-white on sketch-blue; riso near-black on pink;
  neobrutalism black on pastel). When a consumer stamped a runtime
  brand override via `--ck-accent-light-override`, the accent
  background flipped to the brand colour but the text stayed on
  the chrome default — a dark brand colour against a chrome's
  near-black text yielded illegible buttons (e.g. editorial coral
  → `#0F0F0F` text was fine, but brand `#000000` → `#0F0F0F` text
  was invisible). Consumer apps can now compute a contrast-aware
  foreground colour from the chosen accent (e.g. via WCAG relative
  luminance) and stamp `--ck-accent-fg` alongside the override knob,
  and every chrome respects it. Without an override the chrome's
  documented default fg still applies, so no visual change for
  in-the-box usage. Swiss chrome already used `var(--ck-bg-canvas)`
  for primary text (not tied to accent), so it's untouched.

## 0.4.3 (2026-06-15)

- **fix(tokens)**: respect the documented `--ck-accent-light-override` /
  `--ck-accent-dark-override` brand-override knob in every chrome that
  hardcoded accent shades. Previously `editorial`, `riso`, and `sketch`
  set `--ck-accent` to a literal hex (and `--ck-accent-hover` / `-active`
  to hand-tuned shades), which silently bypassed the override chain —
  consumer apps stamping their brand colour via the documented mechanism
  saw chrome stay on the platform palette. Each chrome now sets its
  signature colour as the `var(--ck-accent-light-override, <chrome
  default>)` fallback and derives hover/active via `color-mix(in oklab,
  var(--ck-accent), black 10% / 18%)` (matching the default `:root`
  formula). Sketch additionally swaps two `rgba(... blue-literal ...)`
  muted/border values for `color-mix(var(--ck-accent) NN%, transparent)`
  so they track the brand. Net: stamping `--ck-accent-light-override` on
  `documentElement.style` now cascades to the whole accent family across
  every chrome, single source of truth restored. Consumer impact:
  product-meta's `BrandProvider` can drop its accent-family mirror
  workaround (a98324f) and go back to stamping just the override knob.

## 0.4.2 (2026-06-06)

- **fix(input)**: add `minWidth: 0` to the `.ck-input-field` wrapper so it
  can shrink past its inner `.ck-input-addon-wrap`'s nowrap suffix when
  hosted inside a flex/grid parent. Long suffixes (e.g. `.meta.test.cosx.dev`)
  previously set a min-content floor that pushed the field past mobile
  viewports — product-meta's onboarding (`CreateWorkspace`, `ActivatePersonal`)
  and the workspace-name form on Landing all overflowed on iPhone Pro
  widths. Per-page CSS workarounds in consumer apps only covered one
  shell scope; fixing it at the primitive catches every page.
- **fix(input)**: real disabled visual on `.ck-input` / `.ck-textarea` —
  `opacity: 0.55`, `cursor: not-allowed`, muted background. Mirrors the
  existing `.ck-btn:disabled` treatment. Disabled inputs on a cream /
  dark canvas were previously almost indistinguishable from editable
  ones (the QA report flagged this for product-meta's Profile Email
  field which is read-only pending the email-change verification flow).
  The `.ck-input-addon-wrap:has(:disabled)` selector dims the suffix /
  prefix along with the input so a disabled `slug + suffix` stack reads
  as one disabled unit. `:has()` is supported across all evergreen
  browsers since 2023.

## 0.4.1 (2026-06-01)

- **feat(fonts)**: add Noto Serif SC to the editorial-chrome `--ck-font-serif`
  fallback stack so CJK names render in a serif matching Playfair Display
  rather than the system *sans-serif* CJK fallback (PingFang SC / SimSun) the
  browser would otherwise pick. Names like "本杰明 Zoë" now read as one
  coherent typographic line cross-platform without depending on the user
  having Songti SC / Source Han Serif SC installed locally.

  Bandwidth shape: Noto Serif SC ships from Google Fonts as ~100
  unicode-range subsets. Pure-Latin pages pay only the CSS file (~5-10KB
  gzip) — no .woff2 binaries fetch. Pages with Chinese names pay an
  additional ~200-400KB of CJK subset binaries (only the ranges they use).
  Sans + mono slots intentionally stay system-only — PingFang SC /
  Microsoft YaHei is what users expect for UI body copy.

## 0.4.0 (2026-06-01)

- **feat(fonts)**: load Geist + Geist Mono + Playfair Display + Caveat from
  Google Fonts CDN instead of the prior self-hosted `@font-face` blocks.
  Closes a long-standing "Failed to decode downloaded font: …/fonts/Geist-Regular.otf"
  warning that fired on every page load in consumer SPAs that didn't ship
  the OTF files under their `/fonts/` route (the Cloudflare SPA fallback
  was returning index.html with `Content-Type: text/html` and the browser's
  font decoder was rejecting it). Consumers no longer need to provision
  `public/fonts/` themselves.
- **feat(fonts)**: append CJK system-font fallbacks to `--ck-font-sans` /
  `--ck-font-mono` / `--ck-font-serif`. Names containing 中文 / 日本語 /
  한국어 (e.g. "本杰明 Zoë") now render in the matching serif/sans
  system font (PingFang SC on macOS, Microsoft YaHei on Windows, etc.)
  instead of dropping into the browser's last-resort glyph. No new web
  font is loaded — every modern OS already ships at least one of the
  listed CJK families.

## 0.3.4 (2026-05-31)

- **fix(actionbar)**: bar now has symmetric horizontal padding
  (`0 6px` instead of `0 6px 0 0`). Previously the right-only padding
  pushed the leading items a few pixels left of the bar's true
  centre — the grip touched the left curve while the rightmost
  element (now the status dot) had visible breathing room. With
  0.3.3's leading spacer the imbalance was small but visible.
- **fix(actionbar)**: leading + trailing spacers now both use
  `minWidth: 0` instead of `0` and `12` respectively. Cosmetic
  alignment — `0` is the right neutral value for a spacer that's
  expected to grow into available room rather than enforce a
  minimum gap.

## 0.3.3 (2026-05-31)

- **fix(actionbar)**: leading items centre between the grip and the
  status dot when no trailing items are present. Previously a solo
  leading item (e.g. "Theme · Light") visually packed next to the
  grip leaving an unbalanced gap before the status dot. Now a
  balancing flex spacer is inserted to the LEFT of the leading
  group whenever it's the only content + the right side holds only
  a status dot. When trailing items ARE present, they retain their
  right-anchor role and leading goes back to natural left packing.

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
