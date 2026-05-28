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
- React 19 peer dep; Tailwind v4 tokens via `--ck-*` CSS variables
- Ships source TS (no build step) — consumers' bundlers handle TS
- shadcn-style distribution: consumers may import individual
  components OR copy source files directly

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
`cosxai/product-meta/.claude/rules/`. Changes that aren't TS-vs-Go
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
│   └── docs/                  showcase site
└── .claude/rules/             the rules above
```

## Reference

- `migration-plan/` (separate repo)
- `migration-plan/04-meta-frontend.md` — how meta consumes this kit
