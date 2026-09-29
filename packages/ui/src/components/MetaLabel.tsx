import type { ComponentProps, ElementType, ReactNode } from 'react';

import { cn } from '../lib/cn';

export type MetaLabelProps = Omit<ComponentProps<'div'>, 'children'> & {
  children: ReactNode;
  /** grey (default) · ink · inverse (grey on ink) · linen · yellow (legal only on an ink ground). */
  tone?: 'grey' | 'ink' | 'inverse' | 'linen' | 'yellow' | undefined;
  /** 11.5 · 12 · 13.5px. @default "md" */
  size?: 'sm' | 'md' | 'lg' | undefined;
  /** A rule beneath: hair (1px) or yellow (4px). */
  rule?: 'hair' | 'yellow' | undefined;
  as?: ElementType | undefined;
};

const TONE = { grey: 'text-fg-secondary', ink: 'text-fg', inverse: 'text-grey-inverse', linen: 'text-linen', yellow: 'text-yellow-accent' };
const SIZE = { sm: 'text-[11.5px]', md: 'text-meta', lg: 'text-small' };

/** MetaLabel — eyebrows, metadata, page numbers: 12px 500 grey, sentence
 *  case, no caps, no tracking. */
export function MetaLabel({ children, tone = 'grey', size = 'md', rule, as: Tag = 'div', className, ...rest }: MetaLabelProps) {
  return (
    <Tag
      className={cn(
        'font-sans leading-[1.4] font-medium',
        TONE[tone],
        SIZE[size],
        rule && 'pb-2.5',
        rule === 'hair' && 'border-b border-rule',
        rule === 'yellow' && 'border-b-4 border-yellow-accent',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
