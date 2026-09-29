import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';
import { LOOP, WORDMARK } from './logo-art';

export type LogoProps = Omit<ComponentProps<'span'>, 'children'> & {
  /** wordmark · icon (the loop) · tile (the loop on the yellow square). @default "wordmark" */
  variant?: 'wordmark' | 'icon' | 'tile' | undefined;
  /** ink on paper, linen and the yellow; white on ink. Never recoloured beyond these. Unset: ink, white in ink mode. */
  tone?: 'ink' | 'white' | undefined;
  /** The standard lockup: a 4px accent-yellow rule beneath the wordmark. */
  rule?: boolean | undefined;
  /** px height. @default 28 */
  height?: number | undefined;
  /** Accessible name. @default "COSX" */
  alt?: string | undefined;
};

function Art({ art, height, title }: { art: typeof WORDMARK | typeof LOOP; height: number; title: string }) {
  const [, , w, h] = art.viewBox.split(' ').map(Number) as [number, number, number, number];
  return (
    <svg viewBox={art.viewBox} height={height} width={Math.round((height * w) / h)} role="img" aria-label={title} fill="currentColor" className="block shrink-0">
      {art.paths.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}

/**
 * Logo — the COSX wordmark, the CO loop, or the yellow tile (app icon,
 * avatar, favicon). Colour comes from the ground, never from the mark: the
 * mark is ink or white, never yellow, never two-tone.
 */
export function Logo({ variant = 'wordmark', tone, rule = false, height = 28, alt = 'COSX', className, ...rest }: LogoProps) {
  if (variant === 'tile') {
    return (
      <span
        className={cn('inline-grid shrink-0 place-items-center bg-yellow text-ink', className)}
        style={{ width: height, height, borderRadius: Math.round(height * 0.22) }}
        {...rest}
      >
        <Art art={LOOP} height={height} title={alt} />
      </span>
    );
  }
  const colour = tone === 'white' ? 'text-white' : tone === 'ink' ? 'text-ink' : 'text-ink ink:text-white';
  const art = <Art art={variant === 'icon' ? LOOP : WORDMARK} height={height} title={alt} />;
  if (!rule || variant === 'icon') {
    return (
      <span className={cn('inline-flex', colour, className)} {...rest}>
        {art}
      </span>
    );
  }
  return (
    <span className={cn('inline-flex flex-col items-start', colour, className)} style={{ gap: Math.round(height * 0.45) }} {...rest}>
      {art}
      <span aria-hidden className="h-1 w-full rounded-[2px] bg-yellow-accent" />
    </span>
  );
}
