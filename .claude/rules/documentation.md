# Documentation Rules

> Synced with mesh + meta `.claude/rules/documentation.md`.

## Bilingual is optional in product-design

Same policy as meta: EN required for all docs / JSDoc, CN optional
suffixed `_cn.md`. Apply the bilingual policy aggressively only on
mesh (where it IS required).

## Component JSDoc

Every exported component / hook has a block-comment explaining:

1. WHAT it is (one sentence)
2. WHY it exists (one sentence)
3. When to compose it with (other components)
4. Visual reference (link to docs route if available)

```tsx
/**
 * Button — primitive interactive element. Variants `primary`
 * (filled) / `secondary` (outlined) / `ghost` (transparent).
 *
 * Compose with: ActionBarButton (toolbar), CommandPalette items,
 * Dialog footer actions.
 *
 * Visual: see docs/components/button.
 *
 * Forwards ref to the underlying <button>. Spreads `...rest` so
 * consumers can pass data-* / aria-* / className.
 */
```

## Docs app

`apps/docs/` is the showcase. Every new component gets a route in
`apps/docs/src/routes/components/<name>.tsx` with:

1. Title + 1-paragraph intro
2. Live examples for each variant
3. Props table (auto-generated from TS types if possible, else
   hand-written markdown)
4. Composition examples (showing it inside an ActionBar / Dialog /
   etc.)

## Release notes

Each release tag carries a brief CHANGELOG note. Keep
`packages/ui/CHANGELOG.md` short — bullet list per version:

```markdown
## 0.2.0 (2026-06-15)
- feat: new Tabs primitive
- fix: Tooltip ref forwarding under exactOptionalPropertyTypes
- breaking: Button.variant 'destructive' renamed to 'danger'
```

Breaking changes need a major bump unless we're pre-1.0 (then a
minor bump is fine but document migration).

## ADR

Cross-repo design decisions (theming model, distribution strategy)
land in `migration-plan/adr/` if they cross repos. Component-internal
decisions go in workdocs (`docs/workdocs/.../design.md`).

## Reference

- meta `.claude/rules/documentation.md`
- mesh `.claude/rules/documentation.md`
