# Code Style Rules (TypeScript / React)

> **1.x (main) supersedes the 0.x parts below** — `ck-` classes and
> `--ck-*` variables are 0.x only (branch `ui-0.x`). In 1.x: style with
> Tailwind utilities from `packages/ui/src/theme.css` (`bg-page`,
> `text-fg`, `rounded-md`, `text-ui` …) merged with `cn()`; raw values
> only through 3.0 variables (`var(--bg-page)`); never Tailwind's default
> palette, shadows or easings (removed from the theme). Interactive
> primitives build on Radix. Each component is checked against its
> design.cosx.co page.

product-design ships the `@cosxai/ui` design system, consumed by
product-meta + future product-* SPAs. Code style mirrors meta's
rules with a few design-system-specific additions.

## TypeScript baseline

- `strict: true` + `exactOptionalPropertyTypes: true` + `noUncheckedIndexedAccess: true`
- No `any`. Use `unknown` + type guard.
- `type` over `interface` UNLESS declaration merging is needed.
- Optional props: declare as `T | undefined` so consumers can spread
  `{ active: undefined }` without breaking the strict-optional check.

## Component file pattern

```
src/<bucket>/<Component>.tsx
```

Each component:

```tsx
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../lib/cn';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | undefined;   // declare undefined
  children: ReactNode;
  // ... other props
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'primary', children, ...rest }, ref) {
    return (
      <button ref={ref} className={cn('ck-btn', `ck-btn-${variant}`)} {...rest}>
        {children}
      </button>
    );
  },
);
```

Rules:

1. **`forwardRef` for all interactive elements** — consumers
   sometimes need refs for focus management.
2. **Default variant in parameter destructuring** — `?:` + default
   value, never optional chain on the prop itself.
3. **Spread `...rest` onto the root element** — consumers expect
   to be able to pass `data-*`, `aria-*`, `style`, `className`.
4. **CSS class names prefixed `ck-`** — shared namespace; avoid
   leakage into consumer apps.

## Naming

| Element | Convention | Example |
|---|---|---|
| Component file | PascalCase + `.tsx` | `ActionBarButton.tsx` |
| Hook file | camelCase + `.ts` | `useNavRailState.ts` |
| Utility file | kebab-case + `.ts` | `cn.ts`, `time-utils.ts` |
| CSS class | `ck-<component>-<variant>` | `ck-btn-primary` |
| CSS variable | `--ck-<token>` | `--ck-accent`, `--ck-bg-surface` |
| Type | PascalCase | `ButtonProps`, `NavItemProps` |

## Exports

Each bucket has `index.ts` that re-exports both the component and
its props type:

```ts
export { Button } from './Button';
export type { ButtonProps, ButtonVariant } from './Button';
```

The umbrella `src/index.ts` re-exports the bucket. Don't break this
chain — consumers do `import { Button } from '@cosxai/ui'`.

## Imports

Same ordering as meta (`eslint-plugin-import`):

```ts
// 1. node / npm
import { forwardRef } from 'react';

// 2. cross-bucket within @cosxai/ui (relative)
import { cn } from '../lib/cn';

// 3. type imports at end of their group
import type { ReactNode } from 'react';
```

## CSS variables

`--ck-*` namespace is the contract. Consumers stamp them via
`<BrandProvider>` (meta side) or in their global stylesheet.

| Variable | Default |
|---|---|
| `--ck-bg-app` | `#fafafa` |
| `--ck-bg-surface` | `#fff` |
| `--ck-text-primary` | `#111` |
| `--ck-text-secondary` | `#666` |
| `--ck-border-subtle` | `#eee` |
| `--ck-accent` | `#4f46e5` |
| `--ck-accent-fg` | `#fff` |

Components reference these via `var(--ck-accent, #4f46e5)` —
ALWAYS include the fallback so the kit renders standalone.

## TODOs

Every `// TODO` must reference a GH issue:

```ts
// TODO(design#42): forward refs through Tooltip's cloneElement wrapper
```

## Reference

- mesh `.claude/rules/code-style.md`
- meta `.claude/rules/code-style.md`
- `migration-plan/04-meta-frontend.md` — how meta consumes this kit
