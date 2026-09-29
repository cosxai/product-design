import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';

const card = cva('overflow-hidden transition-[background-color,border-color] duration-[120ms] ease-standard', {
  variants: {
    ground: {
      page: 'bg-page text-fg',
      sunk: 'bg-sunk text-fg',
      field: 'bg-brand-field text-ink',
      ink: 'bg-ink text-linen ink:bg-ink-raised',
    },
    radius: { panel: 'rounded-lg', section: 'rounded-xl' },
    outline: { true: 'border border-rule', false: '' },
    interactive: { true: 'cursor-pointer outline-none hover:border-fg focus-visible:shadow-(--focus-ring)', false: '' },
    accent: { true: 'border-t-4 border-t-yellow-accent', false: '' },
  },
  compoundVariants: [{ interactive: true, ground: 'page', class: 'hover:bg-hover' }],
  defaultVariants: { ground: 'page', radius: 'panel', interactive: false, accent: false },
});

export type CardProps = ComponentProps<'div'> & {
  /** page (paper) · sunk (linen) · field (the brand yellow) · ink. @default "page" */
  ground?: 'page' | 'sunk' | 'field' | 'ink' | undefined;
  /** panel 16px · section 24px (whole page-level sections). @default "panel" */
  radius?: 'panel' | 'section' | undefined;
  /** Hairline edge. Defaults to on for page, off for the other grounds. */
  outline?: boolean | undefined;
  /** Clickable card: hover wash + ink edge. Use asChild to make it the link or button. */
  interactive?: boolean | undefined;
  /** A 4px accent rule along the top. */
  accent?: boolean | undefined;
  asChild?: boolean | undefined;
};

/** Card — a rounded region of the page. No shadow: depth is cut into the page. */
export function Card({ ground = 'page', radius, outline, interactive, accent, asChild, className, ...rest }: CardProps) {
  const Comp = asChild ? Slot : 'div';
  return <Comp className={cn(card({ ground, radius, outline: outline ?? ground === 'page', interactive, accent }), className)} {...rest} />;
}
