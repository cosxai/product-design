import type { LucideIcon } from 'lucide-react';
import { forwardRef, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { formatCount } from './Button';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';

export type AppRailItem = {
  key: string;
  icon: LucideIcon;
  /** The module's name: accessible name and tooltip. */
  label: string;
  /** A count on the corner; hidden at zero (and on a disabled item), 99+ above 99. */
  count?: number | undefined;
  /** A dot on the corner — something new, no number. A count wins. */
  dot?: boolean | undefined;
  /** Not available yet: 40% opacity, aria-disabled (still focusable); a press calls `onDisabledSelect`. */
  disabled?: boolean | undefined;
  /** The tooltip while disabled ("My tasks · Coming soon"); the caller words it. @default label */
  disabledHint?: string | undefined;
};

export type AppRailProps = Omit<ComponentProps<'nav'>, 'onChange' | 'children'> & {
  items: AppRailItem[];
  /** The current module's key. */
  value: string;
  onChange: (key: string) => void;
  /** A disabled item was pressed — say why (a toast: "Coming soon"). */
  onDisabledSelect?: ((key: string) => void) | undefined;
  /** The landmark's accessible name ("Modules"). */
  label: string;
  /** Top slot: the workspace, usually an AppRailSlot holding a 36px WorkspaceMark. */
  workspace?: ReactNode;
  /** Bottom slot: the account, usually an AppRailSlot shape="round" holding a 32px Avatar. */
  account?: ReactNode;
};

/**
 * AppRail — the 60px desktop module rail (Metaroom Agent): the workspace at
 * the top, one 40×38 icon button per module, a flexible gap, the account at
 * the bottom. The current module takes the workspace's field colour
 * (--brand-field); modules not built yet stay visible at 40% with a tooltip
 * that says so. Counts and dots use --brand-mark.
 *
 * Compose with: AppRailSlot + WorkspaceMark / Avatar for the slots, each
 * usually a PopoverTrigger (workspace switcher, account card); BottomTabs is
 * the same navigation on phones.
 *
 * A nav landmark of buttons; the current one has aria-current="page".
 * Forwards ref to the <nav>; spreads `...rest` onto it.
 */
export const AppRail = forwardRef<HTMLElement, AppRailProps>(function AppRail(
  { items, value, onChange, onDisabledSelect, label, workspace, account, className, ...rest },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={label}
      className={cn('flex w-[60px] shrink-0 flex-col items-center gap-1 border-r border-rule bg-sunk py-3.5 font-sans text-fg', className)}
      {...rest}
    >
      {workspace && <div className="mb-3 flex">{workspace}</div>}
      {items.map((it) => {
        const on = it.key === value;
        const count = it.disabled || it.count === undefined ? null : formatCount(it.count);
        return (
          <Tooltip key={it.key} side="right" content={it.disabled ? (it.disabledHint ?? it.label) : it.label}>
            <button
              type="button"
              aria-label={count ? `${it.label} (${count})` : it.label}
              aria-current={on ? 'page' : undefined}
              aria-disabled={it.disabled || undefined}
              onClick={() => (it.disabled ? onDisabledSelect?.(it.key) : onChange(it.key))}
              className={cn(
                'relative grid h-[38px] w-10 shrink-0 cursor-pointer place-items-center rounded-md border-0 p-0 outline-none',
                'transition-colors duration-[120ms] ease-standard focus-visible:shadow-(--focus-ring)',
                on ? 'bg-brand-field text-ink' : 'bg-transparent text-fg',
                !on && !it.disabled && 'hover:bg-hover',
                it.disabled && 'cursor-not-allowed opacity-40',
              )}
            >
              <Icon icon={it.icon} size={17} />
              {count ? (
                <span
                  aria-hidden
                  className="absolute top-1 right-[5px] h-3.5 min-w-3.5 rounded-pill bg-brand-mark px-[3px] text-center text-[9px] leading-[14px] font-bold text-ink tabular-nums"
                >
                  {count}
                </span>
              ) : (
                it.dot && !it.disabled && <span aria-hidden data-dot="" className="absolute top-[7px] right-[9px] size-[7px] rounded-pill bg-brand-mark" />
              )}
            </button>
          </Tooltip>
        );
      })}
      <div className="flex-1" />
      {account && <div className="flex">{account}</div>}
    </nav>
  );
});

export type AppRailSlotProps = Omit<ComponentProps<'button'>, 'aria-label'> & {
  /** Accessible name ("Switch workspace", "Account"). */
  label: string;
  /** tile (the workspace, 9px corners) · round (the account). @default "tile" */
  shape?: 'tile' | 'round' | undefined;
  /** Its popover is open: an ink ring with a gap. Set from the popover's open state. */
  active?: boolean | undefined;
};

/**
 * AppRailSlot — the bare button around the rail's workspace mark or account
 * avatar: no fill of its own, the focus ring, and the ink ring while its
 * popover is open. Works as `PopoverTrigger asChild` (forwards ref and
 * props).
 */
export const AppRailSlot = forwardRef<HTMLButtonElement, AppRailSlotProps>(function AppRailSlot(
  { label, shape = 'tile', active = false, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:shadow-(--focus-ring) disabled:cursor-default',
        shape === 'round' ? 'rounded-pill' : 'rounded-[9px]',
        active && 'shadow-[0_0_0_2px_var(--bg-sunk),0_0_0_4px_var(--text-primary)]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
