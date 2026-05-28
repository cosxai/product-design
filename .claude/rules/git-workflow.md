# Git Workflow Rules

> Synced with `cosxai/product-mesh` and `cosxai/product-meta`
> `.claude/rules/git-workflow.md` — keep coherent across the three
> repos.

## Branch Management

**CRITICAL**: Never work directly on `main`.

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<name>` | `feature/ui-add-tabs-component` |
| Bug fix | `fix/<name>` | `fix/button-disabled-color` |
| Hotfix | `hotfix/<name>` | `hotfix/dropdown-overflow` |
| Chore | `chore/<name>` | `chore/bump-tailwind-v4-2` |
| Release | `release/ui-v<semver>` | `release/ui-v0.2.0` (drives publish workflow) |

## Commit Convention

Conventional Commits.

| Prefix | Purpose |
|--------|---------|
| `feat:` | New component / token / preset |
| `fix:` | Bug fix |
| `test:` | Adding / updating tests |
| `chore:` | Maintenance |
| `build:` | Build / bundler / CI changes |
| `docs:` | Documentation |
| `refactor:` | Code refactor (no behaviour change) |
| `release:` | Version bump (also tag `ui-v<semver>` to trigger publish workflow) |

Format:

```
<type>(<scope>): <imperative description>

feat(actionbar): add ActionBarMenu trigger
fix(tooltip): align ref forwarding with exactOptionalPropertyTypes
release(ui): v0.2.0
```

## Development Workflow

### 0. Pre-flight
```bash
git checkout main
git pull origin main
git checkout -b feature/<name>
```

### 1. Implement
- Add component under `packages/ui/src/<bucket>/`
- Export from the bucket index + the umbrella `src/index.ts`
- Document in the docs app (`apps/docs/src/routes/`) if user-facing

### 2. Test
- `pnpm typecheck` (workspace)
- `pnpm --filter @cosxai/ui typecheck` (focused)
- (M2+) component tests via storybook + vitest

### 3. Release (for breaking changes / new components)
1. Bump `packages/ui/package.json` `version`
2. Commit: `release(ui): v0.X.0`
3. Tag: `git tag ui-v0.X.0`
4. Push: `git push origin main --tags`
5. `.github/workflows/publish-ui.yml` runs via npm Trusted
   Publishing → `@cosxai/ui` on npmjs.com is updated
6. Notify product-meta to bump its dep version + regen

## Pull Request Guidelines

1. Title is a sentence, not a bullet list
2. Body has:
   - **Summary** — what + why
   - **Visual** — screenshot or storybook link (for visual components)
   - **Test plan** — what you ran
   - **Consumers affected** — note if product-meta / others need a
     change
3. Breaking API changes need a major bump + migration notes
4. Branch lives until merge; delete on merge
