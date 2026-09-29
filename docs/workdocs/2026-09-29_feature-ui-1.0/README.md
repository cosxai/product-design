# Feature: @cosxai/ui 1.0 — the COSX Design System 3.0 in React

**Branch**: `main` (owner instruction: direct). 0.x maintenance: branch `ui-0.x`.
**Created**: 2026-09-29
**Status**: In Progress

## Overview
Rebuild `@cosxai/ui` as the implementation of COSX Design System 3.0
(design.cosx.co). Tailwind v4 + Radix. The Claude Design projects are the
design source: "COSX Design System 3.0" (tokens, 22 component sources with
types and usage notes) and "MetaRoom 设计系统重做" (the site: 42 pages of
variants, states and usage; the MetaRoom component spec; page prototypes).
Each component is checked against its design.cosx.co page.

## Decisions (owner, 2026-09-29)
- Package name stays `@cosxai/ui`, major bump. 0.x on `ui-0.x`, dist-tag `v0`; alphas under `next`.
- Icons: Lucide. Ink (dark) mode in the first release. Complete status = grey/ink dot (spec as is). Product name (MetaRoom vs COSX) only affects copy.
- 0.x presets (editorial, neobrutalism, riso, sketch, terminal, …) are not carried over.
- Agent conversation components go to a separate `@cosxai/chat`.
- Interaction details the spec does not state follow Radix defaults and WAI-ARIA; differences from the spec are listed for design review.

## Plan

### Stage 0 — foundations (1.0.0-alpha.0)
- [x] publish-ui: dist-tag by version (prerelease → next, 0.x → v0, 1.x → latest)
- [x] apps/docs (ui.cosx.co) on the published 0.25.0, not the workspace package
- [x] branch `ui-0.x`
- [x] 3.0 tokens unchanged in `src/tokens/`; self-hosted fonts; `styles.css`
- [x] Tailwind v4 `theme.css`; test that theme names never contradict tokens; real Tailwind build check
- [x] `cn()`
- [ ] publish 1.0.0-alpha.0 (tag `ui-v1.0.0-alpha.0`) and verify dist-tags

### Stage 1 — the 22 primitives (alpha.1…)
Logo, Icon, IconButton, MetaLabel, Marker, Figure, Button, Badge, Tag, Card ·
Field, Input, Textarea, Select, Checkbox, Radio, Switch · Tabs · Dialog,
Toast, Tooltip · Table. Plus a ThemeProvider (system / light / ink).
Per component: types, behaviour tests (Testing Library), axe, screenshots
light + ink × en + zh compared with its design.cosx.co page.
Select / Popover / Menu / Tooltip: `placement="auto"` (spec proposal).

### Stage 2 — product patterns (MetaRoom spec P0) — done, 1.0.0-alpha.2
Four forked sub-agents in parallel (A surfaces, B data display, C inputs, D upload/status), integrated and re-checked:
- A: ActionBar (+ provider and hooks: items, selection, mode, hidden, activity), Menu, CommandPalette, SidePanel (+ provider/slot), Dialog sizes xl 800 / split 1120 + focus returns to the opener, ConfirmDialog / PromptDialog / StepUpDialog — 19 tests
- B: useSelection, FileCard, FileList/FileRow, ListToolbar, VirtualList + InfiniteLoader, FolderTree, Breadcrumb, PageHeader, Steps, ActivityTimeline — 18 tests
- C: SearchField, CopyField, SegmentedControl, ChoiceCards, DateInput + FuzzyDateInput, CodeInput, AsyncSelect, RecipientsInput, MentionInput — 20 tests
- D: Progress, StageProgress, Dropzone, WindowDrop, UploadCheck, UploadList/Row, SyncStatus, PulseDot, Skeleton, PageState/PageNotice — 22 tests
- Whole package: 144 tests. My review caught the disabled look (now the well) and busy looking disabled.

Deferred from stage 2: marquee drag-select, drag-and-drop moves (tree/cards), tree multi-select + virtualisation, grid arrow keys, list toolbar phone layout; action bar keyboard move, fold hint, per-page default fold, phone bottom strip for selection, context menu (P2); date range, tag input, money input, wizard, brand-colour picker (§19); mention list at the caret + highlighted tokens + remote people search; AsyncSelect joined search card; folder drop targets during upload; camera capture on phones; drag-over type check; UploadCheck deeper than one level. Nothing below 500px wide was screenshotted (headless Chrome floor).

### Stage 2 — original scope (MetaRoom spec P0)
Action bar, upload, file card + list row, folder tree, list toolbar,
breadcrumb, status badges, page states, side panel, command palette.

### Stage 3 — `@cosxai/chat` — done, 1.0.0-alpha.0 (with @cosxai/ui 1.0.0-alpha.3)
Craft's conversation components restyled to "Agent conversation" (design.cosx.co/pattern-agent, MetaRoom spec §14). Two forked sub-agents, integrated and re-checked:
- A: Markdown (GFM, maths, code with lazy highlighting + copy, safe components, link resolver), `[[n]]` citations → Citation chip + source card, ScopeLine / SourcesList — 16 tests. Six files adapted from Craft Agents (Apache-2.0; headers + NOTICE).
- B: Conversation, User / Agent / Staff messages (writing, stopped, failed), AgentSteps, result cards (documents, people, task, draft), ConfirmationCard + HandOver, Composer (attachments, scope, commands, "as a task"), AgentDrawer — 23 tests.
- Integration: the citation card renders in a portal with fixed placement (it was clipped inside the drawer); Tab order kept as if it sat after the chip. Button busy/done now overlay the hidden idle content (a button mounted busy no longer shrinks to the spinner).
- First publish of `@cosxai/chat` is by hand (npm needs the package to exist before a trusted publisher can be added); then add publish-chat.yml as trusted publisher; later releases tag `chat-v*`.

### Stage 4 — design.cosx.co on Astro
Static pages, view transitions, interactive examples as islands on the
real components; preview URL until parity with the 42 exported pages,
then switch. After the switch, design changes are ported from Claude
Design by hand (the export sync retires).

How (decided when starting the stage):
- `apps/design-next` (Astro, static output, React integration), Worker `design-next` on workers.dev as the preview; on the switch it takes over `apps/design` / Worker `design`.
- The export's pages are *converted once* by `scripts/convert.mjs` into source that is then edited by hand: each `.dc.html` becomes a JSX template (`{{ path }}` → `{v.path}`, `sc-if` → `&&`, `sc-for` → `.map`, `dc-import` → the converted partial, `x-import` of a 3.0 component → an adapter over the @cosxai/ui component) plus its logic class kept verbatim (a small `DCLogic` shim gives it React state). Same markup and behaviour as the export, no in-browser Babel or template parsing.
- Language: every page is built twice, `/button` (English) and `/zh/button`; the Worker serves the Chinese build at the clean URL when the visitor chose Chinese (cookie), so URLs stay as they are. Theme: `data-mode="ink"` set before paint from the stored choice.
- Pages whose logic has its own state (playgrounds) hydrate; the rest ship no page script.
- Parity check: screenshots of every page, export vs Astro, light / ink × en / zh.

Progress (2026-09-29):
- [x] Converter, runtime shim, adapters (`ToastCard` added to @cosxai/ui for the toast specimens), Astro build (42 pages × 4 builds + 6 MetaRoom spec pages), Worker with cookie-picked builds and old file-URL redirects — 4 Worker tests
- [x] Parity: every page screenshotted against design.cosx.co in all four builds — all within 8% of pixels, no browser errors; what remains is the kit's own differences (control heights, the icon stroke), i.e. the design-review list. Two global fixes found this way: the export kept the browser's line height and content-box sizing (Tailwind's reset changes both)
- [x] Preview: https://design-next.cosx-584.workers.dev
- [ ] Owner review of the preview → switch design.cosx.co to it (Worker `design` from apps/design-next; apps/design and the export sync retire)
- [ ] Later: split Spec Sections (one ~100 KB gz chunk shared by 27 pages); ship no page script where a page has no state of its own

### Stage 5 — product-meta adopts 1.0
Replace craft's `packages/ui` primitives; desktop dmg + web checked.

## Notes
- 3.0 variable names overlap Tailwind namespaces (`--radius-md`,
  `--ease-out`, `--font-sans`) and one prefix means different things
  (`--text-primary` is a colour in 3.0, `--text-*` a size in Tailwind).
  The theme reuses a 3.0 name only with the same value, and names sizes
  meta/small/ui/body/… — enforced by `theme.test.ts` (it caught
  `--font-cjk` meaning Noto-only in 3.0 on the first run).
- Tokens keep blue/green status colours for legacy surfaces; the theme
  exposes only attention (yellow) and error (red), per the spec.

## Stage 1 progress
- [x] Batch A (core): Logo, Icon, IconButton, MetaLabel, Marker, Figure, Button (+ useButtonAction), Badge, Tag, Card, Spinner, ThemeProvider — 28 tests (behaviour + axe); playground `pnpm --filter @cosxai/ui playground`, checked light/ink × en/zh
- [x] Batch B (forms): Field, Input, Textarea, Select, Checkbox, RadioGroup, Switch — 21 tests
- [x] Batch C: Tabs, Dialog, Toast (+ toast()/Toaster), Tooltip, Table — 16 tests
- [x] 1.0.0-alpha.1: all 22 primitives + ThemeProvider, 65 tests

### Deferred from stage 1 to stage 2
Async search select (single + multi "To" field), verification-code cells, @mention input, copy field, search field (debounce, / and ⌘K), segmented control, choice cards, date + fuzzy date; Dialog split 1120 and wizard 800; type-to-confirm / step-up / prompt dialogs; side panel (360/480/640, one slot with the Agent drawer); table "More" column and row actions; toast placement around the action bar; tooltip fade (no animation utilities yet).

## For design review (spec vs source vs site)
- Control heights: Button page says 32/40/48; the 3.0 source measures ≈32/38/44; the MetaRoom spec says 32 compact · 38 default · 44 mobile. **Built 32/38/44.**
- Disabled: 3.0 readme says "sinks to --sunk-2 with grey text"; the 3.0 Button source uses opacity .4; design.cosx.co draws the disabled confirm button grey on the well. **Resolved in stage 2: sinks into the well with grey text** (readme + site). Busy is not disabled — it keeps its look (spec).
- Complete status: 3.0 source grey dot; MetaRoom spec ink dot. **Built ink dot** (owner decision).
- Ink mode: 3.0 colours switch on data-mode="ink" and .ink-mode, but its marker rules only on .ink-mode. **Kit adds the data-mode rule (src/modes.css).**
- Brand injection (--brand-field / --brand-mark) is in the MetaRoom spec but not in the 3.0 tokens. **Kit defines them (src/brand.css), default the COSX yellow.**
- Checkbox radius: 3.0 source 8px on a 16px box (looks round on the site); 3.0 readme ladder "4px checkboxes". **Built 4px.**
- Control text: 3.0 source 13px; MetaRoom product scale body/rows 14. **Built 13px** (source).
- Select menu radius: Select.jsx comment 12px, code 16px. **Built 16px.**
- Disabled field label: unspecified. **Built dimmed with the control.**
- Dialog corners: Dialog.jsx comment "no radius"; code, site and spec 16px. **Built 16px.**
- Dialog widths: site 400 / 520 / 640; MetaRoom §09 S 400 · M 560 · L 800 · Split 1120. **Built 400/520/640 (site).**
- Toast / Tooltip on an ink page: 3.0 defines only the ink versions. **Kit: toast ink-raised + hairline; tooltip inverts to linen.**
- Table washes on ink: 3.0 washes are light tints, unreadable under linen text. **Kit: accent 15% / error 20% on ink.**
- Table meta columns: source mono 11px, but 3.0 retired mono. **Kit: 12px grey tabular.**
- Pills tabs: source mono index, active on the yellow. **Kit: 12px index, active on --brand-field.**
- Dialog footer: 3.0 Dialog source has a hairline + sunk footer; the spec's feedback illustration puts the buttons on paper. **Kept the source's sunk footer.**
- Action bar folding: site "at most five per state"; spec "more than six fold into More" and also "more than two of a kind". **Built: >2 in a group fold into that group; >6 overall into More (maxActions).**
- Dialog M width: spec 560, site 520. **Kept 520.**
- Card/row titles: spec card shows regular weight. **Built 14px medium** (product rows scale).
- Tree ticks: spec shows checkboxes. **Built aria-checked tree items** (WAI-ARIA multi-select tree), not separate checkboxes.
- Motion durations not in the spec: indeterminate progress 1.4s, pulse dot 2.4s, skeleton 1.6s (Web Animations API, off with reduced motion).
- Determinate progress colour unspecified: **brand-mark, red when failed.** File sizes: **decimal (1000)**, matching the spec's figures.
- Sync dots unspecified: **synced grey · syncing/retrying pulsing brand · error red · paused/unlinked grey ring.**
- Window drop layer unspecified beyond "covers the page": **page dimmed 60%, a yellow card naming the target.** Dotfiles unticked by default.
- FuzzyDateInput: one text field + Day · Month · Year segment (site), not three cells.
