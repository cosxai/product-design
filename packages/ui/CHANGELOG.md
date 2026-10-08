## 1.0.0-alpha.23 (2026-10-08)

- CodeInput: every cell shows its edge (the rule colour, as Input does);
  the focused cell darkens to ink. On a sunk page the cells were
  invisible. Invalid cells take the error edge.

## 1.0.0-alpha.22 (2026-10-08)

- Breadcrumb: earlier levels no longer underline on hover (they aren't
  links in running text); hover deepens the colour only.

## 1.0.0-alpha.21 (2026-10-06)

- ActionBar keeps its grip inline too (the designs draw it on every
  desktop bar): drag to move, double-click to reset ("Drag to move ·
  double-click to reset"); an inline bar moves from where the page puts
  it. Dragging to the left edge folds only where folding works.
- ActionBar stays ink in the dark theme (it turned linen); a 12% white
  hairline keeps its edge on the dark ground, as in the dark boards.

## 1.0.0-alpha.20 (2026-10-06)

- ThemeSwitch order is now light · match system · dark (system in the
  middle). A quick click steps light → match system → dark → light.

## 1.0.0-alpha.19 (2026-10-06)

- ActionBar shortcuts read as keys: `backspace` → ⌫ (⌘⌫ with mod),
  `delete` → ⌦ on Apple / Del elsewhere, `enter` → ↵ (was "Backspace").

## 1.0.0-alpha.18 (2026-10-06)

- ActionBar `inline`: no grip — an inline bar sits in the page and can't
  be dragged. The floating bar keeps the grip.
- ActionBar: the fold button («) shows only when folding takes effect —
  `foldable` and no forced `presentation`. With no such bar mounted, the
  `\\` shortcut is left alone (not consumed, no stored fold toggled).

## 1.0.0-alpha.17 (2026-10-06)

- FolderTree `glide`: pass the surrounding container's useGlide result
  and one block glides across the app's own nav buttons and the tree's
  rows. Each row's field element carries `data-glide-key={id}`; while
  `glide.active` the selected row leaves its brand field to the block
  (keeps ink and medium weight). Expanding or collapsing a folder snaps
  the block to the selected row's new place.

## 1.0.0-alpha.16 (2026-10-06)

From Motion & Native Feel §07c (option B, "stretch then close"):

- useGlide + GlideIndicator: one shared selected block moves between items
  instead of the selection blinking. The leading edge goes first (200ms),
  the trailing edge follows 50ms later and closes in over 300ms + 40ms per
  item beyond the first (up to 6); cross edges 240ms; ease-out, no
  overshoot. A fast second click turns from where the block is. First
  paint, resizes and list changes that move the selection snap; reduced
  motion jumps. Mark items with `data-glide-key`, hide the item's own
  selected background while `glide.active`. Works in a scrolling list
  (the block lives in the scroller's content). Also `glideTransition`,
  `GLIDE_KEY`.
- AppRail (vertical), BottomTabs and SegmentedControl (horizontal) glide.
  The selected item no longer carries `bg-brand-field` itself — the block
  does (same token, so workspace colours carry; the item's radius).
- SegmentedControl matches Docs Mobile Home: equal-width segments on a
  sunk track without a border (`w-full` fills the row), labels in the
  primary text colour. Sizes: `md` 44px (38px segments, 14px, 12/9px
  corners — was 38px), new `compact` 34px (13px), `sm` 32px. DateInput's
  precision switch uses compact (sm with a small field).

## 1.0.0-alpha.15

- ActionBar `foldable={false}`: always shown in full — no fold button, and a stored fold is ignored (a page whose bar is its whole toolbar, like a document viewer).

## 1.0.0-alpha.14

- ActionBar: an action can carry `divider` (a rule before it), `iconOnly` (just the icon, label in the tooltip) and `wrap` + `wrapKey` (wrap the button in a menu or popover trigger so it opens something anchored to itself).

## 1.0.0-alpha.13 (2026-10-04)

- BottomSheet: the scrolling list reaches the sheet's sides (its padding
  is the sheet's) and never pans sideways — a row bleeding to the edges
  with `-mx-4` made it scroll 32px sideways and showed a scrollbar.

## 1.0.0-alpha.12 (2026-10-04)

From the Metaroom app (Motion & Native Feel §04, Account):

- BottomSheet: rises in 280ms and now leaves in 220ms instead of vanishing
  (it stays mounted for its exit; the scrim fades with it and carries
  `data-leaving` while it goes). `detents="two"`: half (60%) and full —
  typing in it, scrolling its list or dragging up lifts it to full,
  dragging down from full goes back to half; dragging above its top gives
  way at 0.3×. `action` (the title row's button) and `footer` (pinned below
  the list). The rise starts when Radix puts the content on the page, so it
  always plays. Buttons and fields in the title row don't start a drag.
- Avatar: size 64 (Account's profile photo), initials at 20px.

## 1.0.0-alpha.11 (2026-10-01)

App shell for the Agent module (Metaroom Agent, desktop and phone):

- Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose: a
  small non-modal panel on Radix Popover — portal, flips to fit, Esc and
  outside click close, focus returns. `inline` keeps it out of the portal.
- Avatar: a person's photo or initials, sizes 20–52, tone chrome / brand,
  optional ring; decorative unless `label` is given.
- BottomSheet: the phone's sheet on Radix Dialog — drag handle, title, drag
  or flick down to close, scrim, 20px top corners, safe-area padding, a
  screen-reader close button.
- BottomTabs: the phone tab bar — 48×28 pill in the brand field for the
  current tab, counts, avatar tab, disabled tabs at 40% (aria-disabled,
  `onDisabledSelect`).
- AppRail + AppRailSlot: the 60px desktop rail — workspace slot, 40×38
  module buttons (brand field when current), counts and dots, disabled
  modules with the caller's tooltip, account slot. A nav of buttons with
  aria-current.

## 1.0.0-alpha.10 (2026-09-30)

- BrandLoader: the COSX loop as a loading indicator (Claude Design, COSX
  Loader). A short stroke runs the loop, blooms into the full mark, holds,
  gathers back — 3.4 s a round, the head's speed continuous; at rest it
  is the logo itself. Tones ink / linen / accent / current, an optional
  faint track, `speed`; the full mark, still, under reduced motion. For
  whole-page and start-up waits; buttons, rows and inputs keep Spinner.

## 1.0.0-alpha.9 (2026-09-30)

- WorkspaceRow: `badge` — what the workspace still needs, as an attention
  badge beside the chevron ("Needs setup"; Metaroom Sign In, Set up your
  workspace).

## 1.0.0-alpha.8 (2026-09-30)

- ThemeSwitch: `defaultOpen` starts it opened (documentation specimens).
- WorkspaceMark: a logo that failed before React hydrated (a server-rendered
  page) now falls back to the initial too — onError had already fired.
- design.cosx.co: Patterns · Sign-in, every specimen the real component.

## 1.0.0-alpha.7 (2026-09-30)

Sign-in patterns checked against design.cosx.co Patterns · Sign-in:

- AuthPanel: the highlight band runs 40–94% with a hair of overhang each
  side; Chinese sets at 1.35, untracked, band from 50% (typography-cjk's
  :lang(zh) line-height is unlayered, so this one is important).
- WorkspaceRow: 14px name at 1.35, the outline an inset rule on the page
  colour (no border box).

## 1.0.0-alpha.6 (2026-09-29)

Sign-in patterns (Metaroom sign-in, design.cosx.co), moved here from the
COSX app so every product signs in with the same pages:

- AuthLayout: the step under the product lockup, header end (theme switch),
  help line, footer, and the yellow panel — dropped under 900px (container
  query, so a narrow window or pane works too). AuthPanel for the panel's
  text, AuthStepHead and AuthIconTile for a step.
- ThemeSwitch: match system · light · dark, folded to the current choice;
  hover or focus opens it, a quick click steps, a settled click picks.
  Follows the ThemeProvider unless given value / onChange.
- WorkspaceRow and WorkspaceMark: a workspace in a chooser (logo or
  initial, name, detail, busy).
- Every string is a prop with an English default.

## 1.0.0-alpha.5 (2026-09-29)

- Builds under the consuming app's TypeScript settings without
  DOM.Iterable (ActionBar no longer spreads a NodeList); `typecheck` checks it.

## 1.0.0-alpha.4 (2026-09-29)

- ToastCard: one toast drawn in place (documentation specimens, previews).
- theme.css is now theme-reset.css + theme-base.css. An app moving to the
  kit screen by screen imports `@cosxai/ui/theme-base.css`: the kit's
  utilities are added and Tailwind's own palette and sizes keep working.
  New apps keep importing theme.css (unchanged result).

## 1.0.0-alpha.3 (2026-09-29)

- Button: busy and done draw over the idle content, kept in place and
  hidden, so the width never changes — also when the button first
  renders busy (it used to shrink to the spinner). No width measuring.

## 1.0.0-alpha.2 (2026-09-29)

Metaroom product patterns (spec P0), checked light / ink × en / zh.

- Surfaces: ActionBar (pages register actions; idle / selection / mode,
  Esc steps back; folds by group and past six; responsive, fold handle
  with status dot, drag + remembered position), Menu, CommandPalette
  (async sources, no "No results" until all return), SidePanel (one
  right-hand slot), Dialog sizes 800 / 1120, ConfirmDialog (type to
  confirm), PromptDialog, StepUpDialog.
- Data display: useSelection, FileCard, FileList/FileRow, ListToolbar,
  VirtualList + InfiniteLoader, FolderTree (WAI-ARIA tree, lazy,
  reveal, partial ticks), Breadcrumb, PageHeader, Steps, ActivityTimeline.
- Inputs: SearchField, CopyField, SegmentedControl, ChoiceCards,
  DateInput, FuzzyDateInput, CodeInput, AsyncSelect, RecipientsInput,
  MentionInput.
- Upload and status: Progress, StageProgress, Dropzone, WindowDrop,
  UploadCheck, UploadList, SyncStatus, PulseDot, Skeleton, PageState.
- Button: disabled sinks into the well with grey text (was opacity);
  busy keeps its look. Dialog returns focus to whatever opened it.
- 144 tests (behaviour + axe). Test files no longer ship in the package.

## 1.0.0-alpha.1 (2026-09-29)

All 22 COSX Design System 3.0 primitives, checked against their
design.cosx.co pages in light / ink × English / Chinese.

- Core: Button (six types, grounds, 32/38/44, shortcut and count,
  disabled-with-reason, busy/done in place + `useButtonAction`),
  IconButton, Badge (shape carries urgency; compact dot keeps the
  wording), Tag, Card, Figure, Marker, MetaLabel, Logo, Icon (Lucide),
  Spinner, ThemeProvider (system / light / ink).
- Forms: Field (label, hint, error, prefix/suffix, read-only), Input,
  Textarea, Select (portal, auto placement, keyboard, groups, disabled
  rows, meta, filter above 8), Checkbox (indeterminate), RadioGroup, Switch.
- Tabs (underline, pills), Dialog, Toast (`toast()` + `<Toaster>`),
  Tooltip, Table (sortable, washes for attention/overdue, cards on phones).
- `--brand-field` / `--brand-mark` for workspace brands; the 3.0 ink
  marker rule for `data-mode="ink"`; an `ink:` Tailwind variant.
- 65 tests (behaviour + axe). Spec/source differences and what was
  built: docs/workdocs/2026-09-29_feature-ui-1.0.

## 1.0.0-alpha.0 (2026-09-29)

**A new system — breaking for every 0.x consumer.** 0.x continues on the
`ui-0.x` branch (dist-tag `v0`); stay on `^0.25` until you move.

- COSX Design System 3.0 foundations: the 3.0 token files unchanged
  (`styles.css`), Geist + Noto Sans SC self-hosted (Fontsource, OFL-1.1),
  ink mode via `data-mode="ink"` / `.ink-mode`.
- Tailwind v4 theme (`theme.css`): 3.0 colours, radii, type scale,
  tracking and easings as utilities; Tailwind's own palette, shadows and
  easings removed.
- `cn()` — clsx + tailwind-merge taught the kit's size names.
- Removed: every 0.x component, the `--ck-*` variables and the design
  presets (editorial, neobrutalism, riso, sketch, terminal, ambient,
  bento, pwa). Components return in the next alphas on Radix.

## 0.25.0 (2026-09-08)

- **fix(primitives)**: `Chip` no longer steals focus on mousedown — the
  label button and the × button call `preventDefault()` in
  `onMouseDown` (the action stays on `onClick`). A host with an inline
  editor open for another chip no longer sees the editor blur (commit +
  unmount) swallow the first click.
- **feat(primitives)**: `MultiCombobox` gains `layout?: "stacked" |
  "inline"` (default `stacked` — 0.24.0 behaviour unchanged). `inline`
  is a mail-client "To" field: one Input-like frame
  (`.ck-multi-combobox-field`, `:focus-within` ring, `:has([aria-invalid])`
  critical border + revealed `invalidHint` line, `:has(:disabled)` dim)
  whose `<ul role="list">` is the flex-wrap row — chips as `<li>`s, the
  bare search input in a last presentational `<li>` — so typing
  continues after the last chip and wraps with it; the label renders
  above as an eyebrow, the dropdown spans the frame, the invalid hint is
  `aria-describedby`-linked to the input, editor + hint stay below.
  Clicking the frame's empty area focuses the input. Testids unchanged
  (`-entries` is the `<ul>` inside the frame); new `${testid}-field` on
  the frame.
- **feat(primitives)**: `Combobox` gains `bare?: boolean` (input without
  its own field chrome, root `position: static` + `flex: 1 1 140px` so a
  host-drawn `position: relative` frame anchors the dropdown; no label /
  error text rendered), `inputId?: string` (for a host `<label
  htmlFor>`) and `inputDescribedBy?: string` (merged into the input's
  `aria-describedby`). `Input` gains `bare?: boolean` (only the `<input
  class="ck-input ck-input--bare">`, no wrapper / label / helper / error
  / chrome; a boosted-specificity rule in `styles/index.css` strips the
  chrome presets' `!important` input styling). `Input` now spreads
  `...rest` before its `error`-derived `aria-invalid` / `aria-describedby`
  (so `error` stays authoritative; a consumer `aria-describedby` is
  merged with the helper/error id rather than replaced).
- **fix(combobox)**: the 150 ms blur timer no longer closes the list /
  auto-commits when the input has been re-focused within the delay
  (e.g. a host frame click handing focus straight back).

## 0.24.0 (2026-09-08)

- **feat(combobox)**: `clearOnCommit?: boolean` — after `onCommit`
  fires, the input resets to "" and the dropdown closes instead of
  echoing the committed text (multi-value mode; default false, the
  single-value behaviour is unchanged). `Combobox` is now
  `forwardRef<ComboboxHandle>` with `ComboboxHandle = { focus(); clear() }`
  (`clear` for parents rejecting a duplicate commit).
- **feat(primitives)**: New `<Chip>` — pill for one selected value
  (recipient, filter, token): `--ck-bg-muted` slab, 13px sans, tones
  `neutral` / `accent` / `warning` / `critical`, `selected`, `disabled`,
  optional `onClick` (label becomes a button) and `onRemove` (× button,
  `removeLabel` aria-label, default "Remove"). Root
  `<span class="ck-chip" data-ck-chip data-tone data-selected data-disabled>`
  is the styling hook for chrome presets — no per-chrome CSS in this
  release. Deliberately NOT `ck-tag` (the uppercase mono status label).
- **feat(primitives)**: New `<MultiCombobox>` — `Combobox` in
  `clearOnCommit` mode + a `<ul role="list">` of `Chip`s + an optional
  inline editor slot (`renderEntryEditor`, mounts under the row for the
  entry with `editing: true`) + a `hint` line. Backspace in the EMPTY
  search input removes the last entry (`backspaceRemovesLast`, default
  true; scoped to the embedded input so editors are unaffected). Value is
  parent-owned via `entries` / `onCommit` / `onRemoveEntry`; paste /
  comma splitting is the consumer's job inside `onCommit`. Forwards
  `MultiComboboxHandle` (= `ComboboxHandle`). Testids:
  `${testid}-combobox-input` / `-dropdown` / `-free-entry`,
  `${testid}-entries`, `${testid}-entry-${key}`, `${testid}-editor`.
- **feat(layout)**: `LeftNavRail` gains `footerTop?: ReactNode` — a
  block pinned between the scrolling nav body and the footer rule,
  always visible above the divider. Graduated from product-meta's local
  pnpm patch (its agent drawer trigger), which meta can now drop.

## 0.23.2 (2026-08-19)

- **fix(hooks)**: `useKeyboardHotkey` calls `e.preventDefault()` once
  every guard passes — a hotkey that opens a dialog with an
  autofocused input no longer sees its own keystroke inserted as text.

## 0.21.0 (2026-08-10)
- **feat(dialogs)**: `Modal` gains `phonePresentation?: "center" | "page" | "sheet"` — how the modal presents on PHONE viewports (no effect elsewhere). `"page"` renders full-screen and slides in from the right like a pushed native page (for content dialogs the user enters to work in); `"sheet"` rises from the bottom edge (light pickers / short forms); `"center"` (default) keeps today's card. New full-distance motion primitives `ck-anim-page-push` / `ck-anim-sheet-up` back it, both killed under `prefers-reduced-motion`. Backward compatible: omit the prop and nothing changes. Graduated from product-meta's matter split dialogs (fact detail / evidence ruling), whose in-dialog "document takes over + Back" phone flow nests naturally inside a pushed page.

## 0.23.1 (2026-08-19)

- **fix(select)**: `fit="auto"` triggers size to the WIDEST option
  (invisible same-cell sizer) instead of the current selection — the
  popover matches trigger width, so long options no longer truncate
  after picking a short one.
## 0.23.0 (2026-08-19)

- **feat(combobox)**: `searchOnFocus?: boolean` — run `search("")` on
  focus so clicking the field presents the option list before any
  typing (select-with-search for small known sets). Off by default.
## 0.22.0 (2026-08-19)

- SegmentedControl: unfilled track — hairline border delimits the
  group, the raised selected segment carries the contrast. The
  muted-filled track read as a heavy block on warm canvases.
## 0.20.0 (2026-07-28)
- **feat(command)**: `CommandItem` gains an optional `disabled?: boolean`. A disabled row still renders (dimmed) but is skipped by arrow-key nav, never auto-selected (the default highlight lands on the first enabled row), ignores hover/click, and `run` never fires on it. For "coming soon" teasers — distinct from `secret`, which hides the row entirely. Backward compatible: omit it and rows behave exactly as before.

## 0.19.0 (2026-07-28)
- **feat(command)**: `<CommandPalette>` gains an optional `onQueryChange?: (query: string) => void` prop — fires on every keystroke and on the reset-to-empty when the palette opens. Lets a consumer drive an ASYNC command source (debounce → fetch → register results via `useCommandSource`) that the built-in client-side filter can't provide. Backward compatible: omit it and the palette behaves exactly as before. Unblocks product-meta's global document search in the ⌘K palette.

## 0.18.1 (2026-07-23)
- fix(hooks): useKeyboardHotkey honors `data-hotkey-passthrough="true"` containers — hotkeys stay live when focus sits in an editable the user never types into (canvas spreadsheet focus traps)

# Changelog

## 0.13.0 (2026-07-17)

- **feat(primitives)**: New `<CopyField>` — read-only value field with an embedded Copy button inside the frame (mirrors `Input`'s suffix-addon chrome: 36px height, muted slab, hairline divider). Value renders mono + ellipsized; Copy flips to "Copied ✓" for a beat (`copiedForMs`, default 1500ms) and writes via the Clipboard API with a silent select-the-text fallback for non-secure origins. For share links, signing URLs, tokens, API keys — anywhere the next action is overwhelmingly "copy this". Graduated from product-meta's Signing tab where the URL box + separate COPY button read as two disconnected controls.

## 0.11.0 (2026-07-14)

- **feat(layout)**: New `<SidePanel>` — right-docked, backdrop-less panel that slides in from the right edge and pushes main content left via `--ck-sidepanel-width` (stamped on `:root` while open). For editors, activity feeds, share managers, and other admin surfaces where the reader should keep interacting with the main content while the panel is open (Notion / Linear / Slack right-panel UX). Distinct from `<RightSidebarPanel>` (scoped floating card at edge offset): SidePanel is full-height and reshapes layout via a CSS var; RightSidebarPanel is a smaller ephemeral card. Portal-mounted to `document.body` (escapes transform ancestors), `role="complementary"`, ESC-to-close, focus lands on the close button (no focus trap — main surface stays interactive). Prototyped in product-meta's block_doc editor; graduated after Ben validated the API against the Edit document surface. Layout consumers opt into the push-left by summing `var(--ck-sidepanel-width, 0px)` into their right inset.

## 0.10.4 (2026-07-09)

- **fix(actionbar)**: Admin mode is now session-only (was persisted to `localStorage` under `<storageKey>:admin`). Two problems the persistence caused:
  - Page reload → session came back in elevated state without an explicit user opt-in.
  - Cross-doc navigation → user turned admin on for Doc A, opened Doc B, and landed in admin mode carrying nothing but a red-tinted bar (bug Ben spotted on the block_doc viewer).
- **fix(actionbar)**: Auto-reset admin mode when the set of `adminOnly` item keys changes. Consumers that call `useActionBarItems` with different items on a new route reliably clear the elevated state — no per-page "reset on unmount" wiring needed. Same-page updates (item labels change, hint keys change) don't reset because the *key* set stays constant.

## 0.10.3 (2026-07-09)

- **feat(actionbar)**: New `hiddenInAdmin?: boolean` on `ActionBarItem`. Symmetric counterpart to `adminOnly` — pages that want an exclusive "different toolset" UX (block_doc viewer's Manage share + Activity + History replacing Share) mark their regular items `hiddenInAdmin: true` so they clear when the shield toggle flips on. Pages that want the additive layering shape just leave it unset. Per-item flag so different consumers on the same page can pick independently.

## 0.10.2 (2026-07-09)

- **fix(actionbar)**: Restore shield glyph on the admin-mode toggle (better semantic weight than the sliders variant tried in 0.10.1). Still borderless / transparent bg — no outer ring, just the icon.
- **feat(actionbar)**: Softer motion when entering / exiting admin mode. Bar background + border tint now transition on a spring curve (260 ms, `cubic-bezier(0.34, 1.56, 0.64, 1)`), the shield icon picks up a 1.06× scale bump alongside its stroke-colour shift, and admin items animate in with a translate + scale spring on reveal. Toggle-off is instant (React unmount) — future release may add a matching exit transition if needed.

## 0.10.1 (2026-07-09)

- **fix(actionbar)**: Admin-mode toggle drops its bordered-circle chrome so the button reads with the same visual weight as neighbouring items (Theme icon, Share icon, etc.). Now: transparent bg, no border, muted stroke by default, accent-coloured icon when active. Glyph swapped from shield → sliders (two tracks with knobs) so the affordance reads as "reveal more controls" instead of "security/protected" — matches what admin mode actually does.

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
