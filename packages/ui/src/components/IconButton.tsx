import { cva } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';
import { formatCount } from './Button';
import { Icon } from './Icon';

const iconButton = cva(
  [
    'relative inline-grid shrink-0 place-items-center rounded-md border p-0',
    'transition-[background-color,border-color] duration-[120ms] ease-standard',
    'cursor-pointer outline-none focus-visible:shadow-(--focus-ring)',
    'disabled:cursor-not-allowed disabled:opacity-40',
  ],
  {
    variants: {
      variant: {
        outline: 'border-rule bg-transparent text-fg hover:border-fg',
        ghost: 'border-transparent bg-transparent text-fg hover:bg-hover',
        solid: 'border-ink bg-ink text-linen hover:bg-ink-raised ink:border-yellow-accent ink:bg-yellow-accent ink:text-ink ink:hover:bg-yellow-accent-hover',
      },
      size: { sm: 'size-8', md: 'size-[38px]', lg: 'size-11' },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
);

export type IconButtonProps = Omit<ComponentProps<'button'>, 'children' | 'aria-label'> & {
  icon: LucideIcon;
  /** Required: the accessible name (and the hover title). */
  label: string;
  /** outline (--rule edge) · ghost (hover wash) · solid (ink). @default "ghost" */
  variant?: 'outline' | 'ghost' | 'solid' | undefined;
  /** 32 · 38 · 44. @default "md" */
  size?: 'sm' | 'md' | 'lg' | undefined;
  /** A count badge on the corner; hidden at zero, 99+ above 99. */
  count?: number | undefined;
};

/** IconButton — a square icon-only button. It always carries a label. */
export function IconButton({ icon, label, variant, size, count, className, ...rest }: IconButtonProps) {
  const shown = count === undefined ? null : formatCount(count);
  const glyph = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;
  return (
    <button type="button" aria-label={shown ? `${label} (${shown})` : label} title={label} className={cn(iconButton({ variant, size }), className)} {...rest}>
      <Icon icon={icon} size={glyph} />
      {shown && (
        <span aria-hidden className="absolute -top-1.5 -right-1.5 min-w-[18px] rounded-pill bg-brand-mark px-1 text-[11px] leading-[18px] font-semibold text-ink tabular-nums">
          {shown}
        </span>
      )}
    </button>
  );
}
