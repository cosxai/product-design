# COSX Design System 3.0

Brand, voice, visual foundations, components, deck and social templates for **COSINE X LIMITED**. Version 3 is a new system, not a revision: warm white paper, ink type, one yellow in three strengths, regular-weight headlines that work by scale, a highlighter marker on the finding, rounded sections, and a dark page where yellow becomes the voice.

> **Sources.** (1) The attached folder `Design System 3.0/` — an amber-era draft (readme, DESIGN.md, OPEN.md, tokens, specimens). Its palette structure, voice and deck grid carry forward; its amber, serif and square rules were superseded by the client's own social graphics. Kept verbatim in `source/` and `specimens/`. (2) Three social-media graphics supplied by the client (`uploads/01-regulation-gap.png`, `03-age-of-the-market.png`, `05-segments.png`) — marker highlights, waffle/column/treemap blocks. (3) Two website sections supplied by the client (`uploads/pasted-1789485701688-0.png`, `pasted-1789485712237-0.png`) — the palette ground truth: the yellow `#FFE3A0` sampled from the section fields, linen page, 24px section corners, regular-weight headlines. (4) The previous COSX design system project — component inventory and structure only. No Figma or product codebase was supplied.

---

## Cosine X

COSX is the AI back office for regulated professional services. Casework, diligence and reporting, run by agents in a workspace built for confidential data. COSX builds the agents, runs them inside the practice and returns finished output. It also publishes research: the UK Immigration Technology Landscape (117 organisations, verified September 2026) is the running example throughout this system.

**Brand essence:** infrastructure, clarity, control, confidence — warm, not loud.
**Values:** traceable · confidential by construction · accountable · plain.
**Surfaces:** social and research graphics · decks · marketing · product UI (the workspace).

---

## Content fundamentals

- **Register.** Direct, confident, plain. Short sentences. The headline is the finding, stated as a fact with the number in it.
- **Person.** Speak about the firm and the work, not about "us". Address the reader as the firm. Never chummy.
- **Casing.** Sentence case for headlines and body. Mono caps with `.14em` tracking for labels, status, identifiers, page numbers. Never title case.
- **English.** British. Dates as 12 August 2026, money as £1.2m, time as 08:30 to 18:30.
- **Numbers carry the weight.** A headline names the number; the marker sits under the phrase that holds it. Every figure is sourced or removed. Empty cells take a dash, never a zero.
- **Method notes are part of the piece.** Every graphic carries a footer note saying where the data came from and what it does not claim ("It is not a finding that an organisation is unregulated").
- **Never.** No hype adjectives, no exclamation marks, no emoji. The middle dot ` · ` is the only ornament. No takeaway lines.

Examples:

    Headline    Of the 47 organisations that deal with immigration clients directly, [20 name no regulator]
    Lede        Every organisation in the landscape that delivers advice. One square is one organisation.
    Legend      Publishes an IAA or SRA registration  27
    Footer      The full research: cosx.co · 117 organisations, verified September 2026
    Button      Publish register        (verb + object, sentence case)

---

## Visual foundations

**The one-line version.** Linen and paper are the page, ink is every letter, yellow is the only thing that is neither — pale as a ground, warm as a mark, and never a letter on paper.

- **Colour.** Light end: `--paper #FEFDFB` (page), `--linen #F5F2EC` (sunk 1), `--sunk-2 #ECE9E3`, `--sunk-3 #E3E0DA`. Dark end: `--ink #111111`, `--ink-raised #1B1B1B`. Two greys, never swapped: `--grey #696969` on paper, `--grey-inverse #9E9E9E` on ink. Structure is ink at 10% / 6%.
- **The yellow.** One hue, 85 in OKLCH, and an area rule. **Field** `--yellow #FFE3A0` (L .92 C .09) is for large areas: a section ground, the selected tab, a panel on ink. **Accent** `--yellow-accent #FFD166` (L .89 C .14) is the same hue with more chroma, for small areas: the marker, chart blocks and bars, the 4px rules, status dots. **On ink the rule flips**: headline type, the marker block and the button are small against the dark ground and take the accent — the field there reads as cream and changes the style; it is reserved for panels. Small areas need more chroma to read as the same colour as a large field; at field size the accent would shout, and at block size the field goes pale. Lemon (hue 95) is never used — the hue shift is what made it clash. `--yellow-light #FFF1D6` for row washes, `--yellow-hover #F7D98F` for hover on a field fill; the ladder `--yellow-1 … 5` runs near-paper → field (4) → accent (5) for treemaps and single-hue series. Nothing in a chart is darker than the accent. No yellow ever writes a letter on paper.
- **Contrast is ink's job.** Where a louder colour used to sit — the primary button, the deep end of a ladder — ink sits now. On paper and on the yellow the primary button is solid ink; on ink it is the yellow. Emphasis on the yellow itself is an ink underline, not a second yellow.
- **The marker.** The signature. An accent-yellow highlighter stroke in the lower 60% of the line behind the phrase that carries the finding (`.marker` class or the `Marker` component). One per headline. On ink there is no band: the headline is linen and the finding is set in accent yellow — the yellow itself is the highlighter there. Nothing light reads on a yellow band, and ink type vanishes outside it, so a band on ink is never legible. Optional `draw` animation on entry.
- **Charts.** Ink is the base, accent yellow is the finding. Waffle squares, columns and treemap blocks all take the 8px radius; the gap between blocks does the work of a hairline. Two classes at most per chart; more than two uses the intensity ladder, not new hues.
- **Product status — product UI only.** Yellow, ink and one red: `attention` is a yellow-accent fill with ink text, `error` (overdue) is the one red `#E0362F`, `progress` is an ink outline, `complete` is a grey dot. Shape does the work extra hues used to do. Row washes exist for attention (`--yellow-32`) and error only. The blue and green tokens remain in `colors.css` for legacy surfaces but no component uses them. These never appear on brand, marketing or deck surfaces.
- **Type.** One family. Geist for everything: headlines at 500 with tight tracking (size does the work), body 15px at 1.6 (14px in product UI), UI at 500, labels and metadata at 12px 500 in `--grey`, sentence case, untracked. Figures are tabular. Geist Mono is retired — the caps-and-tracking label language read as a terminal against the rounded, warm surfaces; `--font-mono` resolves to the sans so old surfaces keep working.

### Chinese (中文)
- **Face.** Noto Sans SC (the same design as Source Han Sans / 思源黑体), from Google Fonts, falling back to PingFang SC and Microsoft YaHei. Latin, digits and ASCII punctuation stay in Geist through the mixed stack `--font-sans-cjk`.
- **Weights.** 400 body, 500 headings — the same as the Latin. Never 700; no synthetic bold or italic. Emphasis is the marker or 500.
- **Metrics.** Body 16/1.8 (Latin + 1px), headings 1.3, display 1.2. Tracking 0 everywhere — never the Latin's negative tracking. Line length 30–38 hanzi (`--measure-cjk`).
- **Labels.** 12px / 500 / grey, untracked, exactly like the Latin labels. No spaced-out 「业 务 领 域」 style — that belongs to systems with uppercase Latin labels.
- **Marker.** The band starts at 50% (Latin 40%) because hanzi fill the em box. On ink, no band: the finding is set in accent yellow.
- **Mixed setting.** Full-width punctuation; `text-autospace` adds a quarter-space between hanzi and Latin/digits. Dates as 2026 年 9 月 23 日. Figures in Geist tabular, tracking 0.
- **Bilingual.** Chinese leads; English follows at 0.72em in grey. A figure appears once. Buttons are never bilingual — pick the page language.
- **Switching.** All rules hang off `:lang(zh)`; set `lang="zh-CN"` on the page or element. Cards: group "Type · 中文".
- **Elevation.** No shadows. Inputs sink to linen; overlays are page colour lifted by `--scrim`; hover is `--hover`, darker never lighter.
- **Shape.** A radius ladder: 4px checkboxes, 6px tags and badges, 8px buttons, inputs and chart blocks, 16px panels, cards and dialogs, 24px whole sections and page-level fields, pill on dots and switch tracks. Rules are 1px, 4px (the yellow rule under the wordmark, under an eyebrow, under a figure) or 8px. No left-border accent rules on rows or callouts; a wash and the wording carry the state.
- **Layout.** Pages are stacked sections with 24px corners inset on the linen page — paper, yellow field, ink — each opening with a mono index eyebrow (`03 / Who we serve`) and one headline. 72px margins on every artboard (1080×1350 social, 1280×720 deck). Whitespace separates first. One primary action per view.
- **Backgrounds.** Flat paper or flat ink. No gradients, glow, glass, texture or noise. No pure black.
- **The ink page.** Cover, section and statement slides; the dark band of a marketing page. Linen headline with the finding in accent yellow; linen body, `--grey-inverse` secondary, accent button with ink text; a field-yellow panel may sit on it.
- **Motion.** "Paper settling." Two registers. *State*: colour, border, opacity on hover/focus/toggle at 120/180/320ms, flat easing. *Entry*: one choreographed settle when a surface appears — rows rise 10px, chart blocks scale .92→1 in reading order, columns grow from the baseline, the yellow strip wipes left→right, figures count up over 1.4s, the marker draws after the headline lands, the selected pill glides rather than blinks. Each element ≤ 640ms, 70ms stagger, whole sequence ≤ 1.4s, ease-out only (`cubic-bezier(.16,1,.3,1)`). The finding always arrives last. Nothing bounces, springs or loops; nothing moves on scroll. Helpers in `motion.css`: `.rise .settle .grow .wipe .glide .marker.draw` with `--i` for stagger.
- **Hover** deepens one lightness step (yellow → `--yellow-hover`, ink → `--ink-raised`; `--rule` border → ink). Never lifts or scales. **Focus** is a 2px ink ring at 3px offset on paper, a yellow ring on ink. Secondary text on the yellow is ink at 70%, never `--grey`. **Disabled** sinks to `--sunk-2` with grey text.
- **Imagery.** Photography is allowed on marketing sections: warm, natural light, paper and desks, no people's faces, cropped into 16px-radius blocks beside a field panel. Never on decks, social graphics or product UI.

---

## Open Graph images

1200×630, one per shared page. Template: `templates/og-image/OgImage.dc.html`; card: `guidelines/brand-og.card.html`. Source: the COSX site-v2 project, `site-v2/OG Images.html`.

- **Grid.** Padding 64 × 72. Left column: kind line (22px, 500, grey) at the top, headline pinned to the bottom, footer under a 1px rule. Right panel, when present: 420px wide, 24px radius, 56px gutter.
- **Headline.** 60px / 500 / 1.06 / −.025em, max 17ch; 68px and 22ch when there is no right panel. The finding carries the marker (band on paper, linen and yellow; yellow type on ink — same rule as everywhere).
- **Footer.** Wordmark at 26px left; `date · cosx.co` right, 20px/500. White wordmark on ink.
- **Right panel.** *Figure*: one number at 132px with a 64×6 rule and a 22px label — for research and case studies; the panel takes a contrasting ground — `panel="default"`: paper and linen → yellow, yellow → paper, ink → ink-raised with a yellow rule; `panel="alt"`: paper, linen and yellow → ink with a yellow rule, ink → yellow. Sixteen combinations in all; see `guidelines/brand-og-matrix.card.html`. *Photo*: the article's own header image, cropped to 420×502. *None*: type only, for announcements.
- **Ground by content.** Research → paper. Case study → yellow. News with a photo → linen or paper. Company or product announcement → ink. Status colours never appear.
- **Copy.** The kind line is `Section · Topic`. The title is the article title verbatim; the marked phrase must be a substring of it.

## Iconography

- No icon set is specified. Meaning is carried by type, the marker, blocks and status dots.
- Where a UI needs a glyph, `Icon` wraps **Lucide** from CDN (flagged substitute), 14–16px, `currentColor`.
- Status is a 9px coloured dot plus wording, never an icon. No emoji, no unicode glyphs as icons. The logo is not an icon.

## Logo

- Wordmark **COSX**, the CO a single continuous cosine-infinity loop; the icon is the loop alone. Files in `assets/`: `logo-wordmark.svg`, `logo-wordmark-white.svg`, `logo-icon.svg`, `logo-icon-white.svg`, PNG originals.
- **Colour comes from the ground, never from the mark.** Ink on paper, linen and the yellow; white on ink. Never on the accent. **The mark is never yellow** and never two-tone. Two sanctioned ways to put the brand colour next to the mark: (1) the **yellow tile** — the loop SVG at 78% of the tile (the artwork carries ~17% internal padding, so about 50% visible width) on a field-yellow square with a 22% radius, for app icons, avatars, favicons and social profiles (Brand → Yellow tile; `Logo variant="tile"`); (2) the **lockup rule** — a 4px accent-yellow rule beneath the wordmark (Brand → Wordmark lockup; `Logo rule`). Clear space ≥ the cap height of the loop. When the bare loop sits above a headline (deck cover, close), its visible height is 0.6× the headline size, left-aligned with it, 40px above. Minimum lockup width 100px. Never redrawn, stretched, shadowed or outlined.

---

## Index

Root: `styles.css` (imports only — link this) · `SKILL.md` · `thumbnail.html`.

- `templates/og-image/` — 1200×630 Open Graph template (grounds × figure / photo / none).
- `skills/design-system-from-zero/` — the method distilled from this build: discovery, colour as material (OKLCH), one type family, the signature, shape/motion, surfaces, process; intake and ship checklists. Portable to Claude Code as an Agent Skill.

- `tokens/` — `fonts.css`, `colors.css`, `typography.css` (includes `.marker`), `spacing.css`, `elevation.css`, `motion.css` (includes `.rise`, `.marker.draw`), `compat.css` (older names → current values).
- `assets/` — logo SVGs and PNG originals.
- `guidelines/` — 26 specimen cards: Brand (9), Colors (7), Type (5), Spacing (5).
- `components/` — 22 primitives in five groups (below), each with `.d.ts` and `.prompt.md`; one `*.card.html` per group.
- `templates/` — three social graphics (1080×1350) as Design Components: `social-waffle/`, `social-columns/`, `social-treemap/`. Data-driven; consuming projects copy one and change the numbers.
- `slides/` — ten 1280×720 deck templates + `README.md`.
- `ui_kits/workspace/` — the product surface: an obligations register.
- `source/` — the amber-era draft's DESIGN.md, OPEN.md and its five specimen HTML files, kept for reference only.

## Components

- **`components/core/`** — Logo, Icon, IconButton, MetaLabel, Marker, Figure, Button, Badge, Tag, Card
- **`components/forms/`** — Field, Input, Textarea, Select (styled listbox with an optional filter, grouped rows and meta text), Checkbox, Radio, Switch
- **`components/navigation/`** — Tabs
- **`components/feedback/`** — Dialog, Toast, Tooltip
- **`components/data/`** — Table

Notes. `Button` primary is ink on paper and on the yellow, and the yellow on ink (`ground` prop); `variant="yellow"` forces a yellow fill. `Card` is the panel (paper, `sunk`, `field` or `ink` ground; 16px radius, 24px for a section; no shadow). `Tabs variant="pills"` is the marketing tab row with the active tab on the field. `Badge` carries the four product statuses; complete defaults to a dot. `Figure` is the stat treatment (bold figure, 40px yellow rule, mono label). `Marker` is the headline highlight.

**Intentional additions:** `Marker` (the brand's signature emphasis, from the client's graphics), `Table` (the product's main surface), `Figure` (the shared stat treatment).

---

## Decisions taken in 3.0 (superseding the draft)

- Field `#FFE3A0` and accent `#FFD166` — one hue, split by area — replace the draft's amber `#FEAA21`, the social graphics' lemon `#F4D54A` and the interim mark/deep pair. `--amber`, `--yellow-field`, `--yellow-mark`, `--yellow-deep` resolve into them.
- Geist 500 replaces Newsreader for display; scale, not weight, carries the hierarchy. Two fonts, not three.
- Radius ladder 4/6/8/16/24 replaces square. Rules are 4px, not 3px.
- Status colours brightened to sit with the new yellow.
- Iconography: Lucide as a flagged substitute until a set is chosen.

## Caveats

- Fonts are served from Google Fonts; supply licensed binaries to self-host.
- Print yellow and categorical charts (more than one hue) remain undecided. Photography is sanctioned for marketing only; supply real images — none are included.
- The workspace kit recreates the single register specimen; other views are left blank.
