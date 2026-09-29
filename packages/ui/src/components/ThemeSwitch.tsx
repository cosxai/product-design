import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { useRef, useState, type ComponentProps } from 'react';

import { cn } from '../lib/cn';
import { useTheme, type ThemeMode } from './ThemeProvider';

export type ThemeSwitchLabels = {
  /** @default "Theme" */
  group?: string | undefined;
  /** @default "Theme: match system" */
  system?: string | undefined;
  /** @default "Theme: light" */
  light?: string | undefined;
  /** @default "Theme: dark" */
  ink?: string | undefined;
};

export type ThemeSwitchProps = Omit<ComponentProps<'div'>, 'onChange' | 'children'> & {
  /** The choice. Unset: the ThemeProvider's. */
  value?: ThemeMode | undefined;
  /** Unset: the ThemeProvider's setter. */
  onChange?: ((mode: ThemeMode) => void) | undefined;
  labels?: ThemeSwitchLabels | undefined;
  /** Start opened (documentation specimens); it folds once the pointer leaves. */
  defaultOpen?: boolean | undefined;
};

/** A click on an option only picks it once the switch has been open this long. */
const PICK_AFTER_MS = 800;

/**
 * ThemeSwitch — match system · light · dark, folded to the current choice.
 * Hovering or focusing opens all three. A click anywhere steps to the next;
 * a click on an option picks it only once the switch has been open a moment,
 * so the first tap on touch (which opens it) steps instead of landing on
 * whatever slid under the finger.
 */
export function ThemeSwitch({ value, onChange, labels, defaultOpen = false, className, ...rest }: ThemeSwitchProps) {
  const theme = useTheme();
  const mode = value ?? theme.mode;
  const setMode = onChange ?? theme.setMode;
  const [open, setOpen] = useState(defaultOpen);
  const openedAt = useRef(0);
  const show = () => {
    if (open) return;
    openedAt.current = Date.now();
    setOpen(true);
  };
  const options: Array<[ThemeMode, LucideIcon, string]> = [
    ['system', Monitor, labels?.system ?? 'Theme: match system'],
    ['light', Sun, labels?.light ?? 'Theme: light'],
    ['ink', Moon, labels?.ink ?? 'Theme: dark'],
  ];
  const cycle = () => {
    const i = options.findIndex(([v]) => v === mode);
    setMode(options[(i + 1) % options.length]![0]);
  };
  return (
    <div
      role="radiogroup"
      aria-label={labels?.group ?? 'Theme'}
      className={cn('inline-flex cursor-pointer rounded-[10px] bg-sunk p-[3px] transition-[gap] duration-[180ms] ease-standard', open ? 'gap-0.5' : 'gap-0', className)}
      onClick={cycle}
      onMouseEnter={show}
      onMouseLeave={() => setOpen(false)}
      onFocus={show}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setOpen(false)}
      {...rest}
    >
      {options.map(([v, Glyph, label]) => {
        const on = mode === v;
        const shown = open || on;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={label}
            title={label}
            tabIndex={shown ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation();
              if (open && Date.now() - openedAt.current > PICK_AFTER_MS) setMode(v);
              else cycle();
            }}
            className={cn(
              'grid h-7 cursor-pointer place-items-center overflow-hidden rounded-[8px] border-0 p-0 outline-none transition-[width,opacity] duration-[180ms] ease-standard focus-visible:shadow-(--focus-ring)',
              shown ? 'w-[30px] opacity-100' : 'w-0 opacity-0',
              on ? 'bg-page text-fg' : 'bg-transparent text-fg-secondary',
            )}
          >
            <Glyph size={15} strokeWidth={1.75} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
