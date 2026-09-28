import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * cn — join class names and let the later Tailwind class win on conflict
 * (`cn('p-2', cond && 'p-4')` → `p-4`).
 *
 * tailwind-merge only knows Tailwind's default scales; the kit's theme
 * (theme.css) replaces font sizes with its own names, taught here so
 * `text-ui` and `text-fg` are not mistaken for each other (one is a
 * size, one a colour).
 */
const merge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['meta', 'small', 'ui', 'body', 'h3', 'lede', 'title', 'figure', 'h2', 'h1', 'display'],
      radius: ['xs', 'sm', 'md', 'lg', 'xl', 'pill'],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}
