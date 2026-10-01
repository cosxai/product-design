import { forwardRef, useEffect, useRef, useState, type ComponentProps } from 'react';

import { cn } from '../lib/cn';
import { initialsOf } from './ActivityTimeline';

export type AvatarSize = 20 | 24 | 28 | 32 | 36 | 40 | 52;

// Initials size per avatar size (Metaroom Agent / Account: 22→9, 28→10,
// 32→11, 40→13, 52→16).
const TYPE: Record<AvatarSize, number> = { 20: 9, 24: 9, 28: 10, 32: 11, 36: 12, 40: 13, 52: 16 };

export type AvatarProps = Omit<ComponentProps<'span'>, 'children'> & {
  /** The person's name: gives the initials (two Latin initials, or the first hanzi). */
  name: string;
  /** Their photo; the initials show while it is unset or when it fails to load. */
  src?: string | undefined;
  /** Initials to use instead of ones taken from `name`. */
  initials?: string | undefined;
  /** px. @default 32 */
  size?: AvatarSize | undefined;
  /** chrome (a grey disc) · brand (the workspace's field colour, for "you"). @default "chrome" */
  tone?: 'chrome' | 'brand' | undefined;
  /** An ink ring with a gap — the avatar's menu is open, or it is the current tab.
   *  The gap takes `--avatar-ring-gap` (default the page colour); set it to the ground behind. */
  ring?: boolean | undefined;
  /** Accessible name. Without it the avatar is decorative: the name sits beside it. */
  label?: string | undefined;
};

/**
 * Avatar — a person: their photo, or their initials on a round disc. Sizes
 * 20–52 as the Metaroom app uses them (rail account 32, phone tab 24, lists
 * 28–40, profile 52). For the Agent use MetaAvatar (@cosxai/chat); for a
 * workspace, WorkspaceMark.
 *
 * Compose with: AppRail `account` slot (inside a button), BottomTabs item
 * `avatar`, list rows beside the person's name (decorative there).
 *
 * Forwards ref to the root <span>; spreads `...rest` onto it.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, initials, size = 32, tone = 'chrome', ring = false, label, className, style, ...rest },
  ref,
) {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  useEffect(() => setFailed(false), [src]);
  // A server-rendered page can fail the image before React is listening.
  useEffect(() => {
    const el = img.current;
    if (el?.complete && el.naturalWidth === 0) setFailed(true);
  }, [src]);
  const photo = Boolean(src) && !failed;
  return (
    <span
      ref={ref}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      data-tone={tone}
      className={cn(
        'inline-grid shrink-0 place-items-center overflow-hidden rounded-pill font-sans leading-none font-semibold select-none',
        tone === 'brand' ? 'bg-brand-field text-ink' : 'bg-chrome text-fg',
        ring && 'shadow-[0_0_0_2px_var(--avatar-ring-gap,var(--bg-page)),0_0_0_4px_var(--text-primary)]',
        className,
      )}
      style={{ width: size, height: size, fontSize: TYPE[size] ?? Math.round(size * 0.32), ...style }}
      {...rest}
    >
      {photo ? (
        <img ref={img} src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} />
      ) : (
        (initials ?? initialsOf(name))
      )}
    </span>
  );
});
