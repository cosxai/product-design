import type { LucideIcon, LucideProps } from 'lucide-react';

import { cn } from '../lib/cn';

export type IconProps = Omit<LucideProps, 'ref'> & {
  /** A Lucide icon component: `import { Share2 } from 'lucide-react'`. */
  icon: LucideIcon;
  /** Accessible name. Without it the icon is decorative (aria-hidden). */
  label?: string | undefined;
  /** px. 14–16 inside controls, 16–20 on its own. @default 16 */
  size?: number | undefined;
};

/**
 * Icon — a Lucide line icon in currentColor. Lucide is the system's icon
 * set (3.0 flagged it as a substitute; confirmed for 1.0). Status is never
 * an icon — it is a Badge.
 */
export function Icon({ icon: Glyph, label, size = 16, className, strokeWidth = 1.75, ...rest }: IconProps) {
  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
      className={cn('shrink-0', className)}
      {...rest}
    />
  );
}
