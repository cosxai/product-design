import type { ComponentProps, ElementType, ReactNode } from 'react';

import { cn } from '../lib/cn';

export type MarkerProps = Omit<ComponentProps<'span'>, 'children'> & {
  children: ReactNode;
  /** On an ink ground there is no band: the phrase is set in accent yellow. */
  onInk?: boolean | undefined;
  /** Draw the band in after the headline lands (motion.css; still with reduced motion). */
  draw?: boolean | undefined;
  as?: ElementType | undefined;
};

/**
 * Marker — the highlighter behind the phrase that carries the finding.
 * One per headline. The band sits in the lower part of the line and is
 * cloned across line breaks; Chinese starts it lower (typography-cjk.css).
 * Styling comes from the design system's own .marker rules.
 */
export function Marker({ children, onInk = false, draw = false, as: Tag = 'span', className, ...rest }: MarkerProps) {
  return (
    <Tag className={cn('marker', onInk && 'on-ink', draw && !onInk && 'draw', className)} {...rest}>
      {children}
    </Tag>
  );
}
