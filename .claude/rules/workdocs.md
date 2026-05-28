# Workdocs Rule

> Synced with mesh + meta `.claude/rules/workdocs.md`.

## Purpose

New components or non-trivial bug fixes get a workdocs directory
under `docs/workdocs/` for planning + history. Survives merge.

## Directory Structure

```
docs/workdocs/
└── YYYY-MM-DD_<branch-name-kebab>/
    ├── README.md       plan + checkboxes
    ├── design.md       design rationale (optional)
    └── notes.md        working notes (optional)
```

## Template

```markdown
# Component: <Name>

**Branch**: `feature/<name>`
**Created**: YYYY-MM-DD
**Status**: In Progress | Completed | Blocked | Archived

## Overview
What is this component, what does it solve.

## Implementation Plan

### Phase 1: Design
- [ ] Confirm API surface (props + ref forwarding)
- [ ] Sketch visual (Figma / Storybook page if used)
- [ ] Identify peer components affected

### Phase 2: Implementation
- [ ] Source files under `packages/ui/src/<bucket>/`
- [ ] Type-export from bucket index + umbrella
- [ ] Docs page under `apps/docs/src/routes/components/`

### Phase 3: Validate
- [ ] `pnpm typecheck` workspace
- [ ] Visual review against the existing kit
- [ ] Check `product-meta` consumers (will they need an update?)

### Phase 4: Release
- [ ] Bump `packages/ui/package.json` version (semver-correct)
- [ ] Tag `ui-v<version>` + push
- [ ] Verify npm registry updated (`npm view @cosxai/ui version`)
- [ ] Notify product-meta to bump dep + regen
```

## Rules

1. **Create BEFORE implementation**
2. **Update checkboxes as you progress**
3. **Commit workdocs WITH feature commits** — same PR
4. **Keep after merge** — historical record

## Status values

| Status | Meaning |
|---|---|
| `In Progress` | Active work |
| `Blocked` | Document the blocker |
| `Completed` | Released; historical record |
| `Archived` | Removed / replaced; add reason |
