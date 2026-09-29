# Product-design

The `@cosxai/ui` design system + the `apps/docs/` showcase.
Published to npm (public registry) as `@cosxai/ui`. Consumed by
`product-meta` (the metaroom platform SPA) and future product-*
SPAs.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `pnpm dev` | `apps/docs` Vite dev server (component showcase) |
| `pnpm build` | Build docs site |
| `pnpm typecheck` | tsc --noEmit across all packages |
| `pnpm --filter @cosxai/ui typecheck` | UI lib only |

## Release flow

```bash
# bump version
vim packages/ui/package.json   # 0.1.0 → 0.2.0
git commit -am "release(ui): v0.2.0"
git tag ui-v0.2.0
git push origin main --tags
# .github/workflows/publish-ui.yml fires via npm Trusted Publishing
# verify: npm view @cosxai/ui version
```

Trusted Publisher config (one-time, set up on npmjs.com → cosxai
org → Trusted Publishers): GitHub Actions / cosxai /
product-design / publish-ui.yml.

## Project Overview

- pnpm monorepo: `packages/ui` (the kit) + `apps/docs` (showcase)
- **@cosxai/ui 1.x** (main): the COSX Design System 3.0 — tokens in
  `packages/ui/src/tokens/` (copied unchanged from the Claude Design
  project), Tailwind v4 theme (`theme.css`), components on Radix. Plan:
  `docs/workdocs/2026-09-29_feature-ui-1.0/`. The design is design.cosx.co.
- **0.x** (`--ck-*` kit + presets): branch `ui-0.x`, dist-tag `v0`.
- React 19 peer dep; ships source TS (no build step)

## Rules & Standards

Detailed guidelines in `.claude/rules/`:

- **Git Workflow**: `.claude/rules/git-workflow.md` — branches,
  conventional commits, release flow
- **Workdocs**: `.claude/rules/workdocs.md` — feature tracking
- **Code Style**: `.claude/rules/code-style.md` — TS strict,
  forwardRef pattern, CSS namespace
- **Documentation**: `.claude/rules/documentation.md` — JSDoc,
  docs route per component

Cross-repo coherence: these rules mirror
`cosxai/product-mesh/.claude/rules/` and
`cosxai/product-meta-legacy/.claude/rules/`. Changes that aren't TS-vs-Go
specific should land in all three.

## Repository structure

```
product-design/
├── packages/
│   └── ui/                    @cosxai/ui (published to npm)
│       ├── src/
│       │   ├── index.ts          umbrella export
│       │   ├── primitives/       Button, Card, Tag, Input, ...
│       │   ├── layout/           Shell, Topbar, LeftNavRail, ...
│       │   ├── actionbar/        ActionBar + sub-components
│       │   ├── command/          CommandPalette
│       │   ├── dialogs/          Modal / Drawer
│       │   ├── theme/            ThemeProvider + tokens
│       │   ├── hooks/            shared hooks
│       │   ├── editorial/        editorial design preset
│       │   ├── neobrutalism/     ditto
│       │   ├── ambient/          ditto
│       │   └── ...               (more presets)
│       └── package.json
├── apps/
│   ├── docs/                  0.x showcase (ui.cosx.co, Worker ui-docs)
│   └── design/                design.cosx.co on Astro + @cosxai/ui (Worker design)
└── .claude/rules/             the rules above
```

## Reference

- `migration-plan/` (separate repo)
- `migration-plan/04-meta-frontend.md` — how meta consumes this kit
