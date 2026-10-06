import type { LucideIcon } from 'lucide-react';
import { forwardRef, useImperativeHandle, useRef, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { formatCount } from './Button';
import { Icon } from './Icon';
import { GlideIndicator, useGlide } from './useGlide';

export type BottomTabItem = {
  key: string;
  /** A Lucide icon. Ignored when `avatar` is set. */
  icon?: LucideIcon | undefined;
  label: string;
  /** A count on the corner; hidden at zero (and on a disabled tab), 99+ above 99. */
  count?: number | undefined;
  /** Not available yet: 40% opacity, aria-disabled; a press calls `onDisabledSelect`. */
  disabled?: boolean | undefined;
  /** Shown in place of the icon — the person's Avatar (size 24) on the Me tab. */
  avatar?: ReactNode;
};

export type BottomTabsProps = Omit<ComponentProps<'nav'>, 'onChange' | 'children'> & {
  items: BottomTabItem[];
  /** The current tab's key. */
  value: string;
  onChange: (key: string) => void;
  /** A disabled tab was pressed — say why (a toast: "Coming soon"). */
  onDisabledSelect?: ((key: string) => void) | undefined;
  /** The landmark's accessible name ("Modules"). */
  label: string;
};

/**
 * BottomTabs — the phone's tab bar (Metaroom Agent phone): an icon in a
 * 48×28 pill over an 11px label; the current tab's pill takes the
 * workspace's field colour (--brand-field), a person's avatar gets an ink
 * ring. The field is one shared pill that glides sideways between tabs
 * (useGlide, §07c) — still under reduced motion. Tabs not built yet stay visible at 40% opacity (aria-disabled, still
 * focusable, so a press can explain). The bottom padding clears the home
 * indicator.
 *
 * Compose with: Avatar (size 24) for the Me tab, BottomSheet opened from
 * it; AppRail is the same navigation on desktop.
 *
 * A nav landmark of buttons; the current one has aria-current="page".
 * Forwards ref to the <nav>; spreads `...rest` onto it.
 */
export const BottomTabs = forwardRef<HTMLElement, BottomTabsProps>(function BottomTabs(
  { items, value, onChange, onDisabledSelect, label, className, style, ...rest },
  ref,
) {
  const navRef = useRef<HTMLElement | null>(null);
  useImperativeHandle(ref, () => navRef.current as HTMLElement);
  const glide = useGlide(navRef, value, { axis: 'x' });
  return (
    <nav
      ref={navRef}
      aria-label={label}
      className={cn('flex shrink-0 border-t border-rule bg-page px-2 pt-1.5 font-sans text-fg', className)}
      style={{ paddingBottom: 'max(22px, env(safe-area-inset-bottom, 0px))', ...style }}
      {...rest}
    >
      <GlideIndicator glide={glide} />
      {items.map((it) => {
        const on = it.key === value;
        const count = it.disabled || it.count === undefined ? null : formatCount(it.count);
        return (
          <button
            key={it.key}
            type="button"
            aria-current={on ? 'page' : undefined}
            aria-disabled={it.disabled || undefined}
            aria-label={count ? `${it.label} (${count})` : undefined}
            onClick={() => (it.disabled ? onDisabledSelect?.(it.key) : onChange(it.key))}
            className={cn(
              'relative flex min-h-12 flex-1 cursor-pointer flex-col items-center justify-center gap-[3px] rounded-md border-0 bg-transparent p-0 text-fg outline-none focus-visible:shadow-(--focus-ring)',
              it.disabled && 'cursor-not-allowed opacity-40',
            )}
          >
            <span
              data-glide-key={it.key}
              className={cn(
                'grid h-7 w-12 place-items-center rounded-pill transition-colors duration-[120ms] ease-standard',
                on && cn('text-ink', !glide.active && 'bg-brand-field'),
              )}
            >
              {it.avatar ? (
                <span aria-hidden className={cn('inline-flex rounded-pill', on && 'shadow-[0_0_0_1.5px_var(--text-primary)]')}>
                  {it.avatar}
                </span>
              ) : (
                it.icon && <Icon icon={it.icon} size={18} />
              )}
            </span>
            <span className="text-[11px] leading-none font-medium">{it.label}</span>
            {count && (
              <span
                aria-hidden
                className="absolute top-0.5 left-1/2 ml-2 h-3.5 min-w-3.5 rounded-pill bg-brand-mark px-[3px] text-center text-[9px] leading-[14px] font-bold text-ink tabular-nums"
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
});
