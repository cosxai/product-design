import * as MenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';

/** Menu root: open / onOpenChange, or uncontrolled with MenuTrigger. */
export const Menu = MenuPrimitive.Root;
/** The element that opens it (asChild onto a Button or IconButton). */
export const MenuTrigger = MenuPrimitive.Trigger;
export const MenuSub = MenuPrimitive.Sub;

const surface = cn(
  'z-[60] min-w-[200px] overflow-hidden rounded-lg border border-rule bg-page p-1.5 font-sans text-ui text-fg outline-none',
  'max-h-(--radix-dropdown-menu-content-available-height)',
);

export type MenuContentProps = ComponentProps<typeof MenuPrimitive.Content>;

/** MenuContent — renders in a portal (never clipped), flips to fit. No shadow: a hairline on the page colour. */
export function MenuContent({ className, sideOffset = 6, collisionPadding = 8, align = 'start', ...rest }: MenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content sideOffset={sideOffset} collisionPadding={collisionPadding} align={align} className={cn(surface, className)} {...rest} />
    </MenuPrimitive.Portal>
  );
}

const itemBase = cn(
  'relative flex min-h-8 cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 outline-none select-none',
  'data-highlighted:bg-hover data-disabled:cursor-not-allowed data-disabled:opacity-40',
);

export type MenuItemProps = Omit<ComponentProps<typeof MenuPrimitive.Item>, 'children'> & {
  children: ReactNode;
  icon?: ReactNode;
  /** Shortcut hint, right-aligned (⌘,). */
  shortcut?: string | undefined;
  /** Red text: sign out, delete. Place it last, after a separator. */
  destructive?: boolean | undefined;
  /** Why it is unavailable: shown under the label (disables the item). */
  disabledReason?: ReactNode;
  /** A second line (a workspace's role). */
  description?: ReactNode;
};

/** MenuItem — one action. Keyboard: arrows, Home/End, typeahead, Enter (Radix). */
export function MenuItem({ children, icon, shortcut, destructive, disabledReason, description, disabled, className, ...rest }: MenuItemProps) {
  return (
    <MenuPrimitive.Item disabled={disabled || Boolean(disabledReason)} className={cn(itemBase, destructive && 'text-error-text', className)} {...rest}>
      {icon && <span className="grid size-4 shrink-0 place-items-center text-fg-secondary">{icon}</span>}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">{children}</span>
        {(disabledReason || description) && <span className="text-meta text-fg-secondary">{disabledReason ?? description}</span>}
      </span>
      {shortcut && <kbd className="ml-4 font-sans text-meta font-medium text-fg-secondary">{shortcut}</kbd>}
    </MenuPrimitive.Item>
  );
}

export type MenuCheckboxItemProps = Omit<ComponentProps<typeof MenuPrimitive.CheckboxItem>, 'children'> & { children: ReactNode; shortcut?: string | undefined };

/** A toggle in a menu; checked shows a tick. */
export function MenuCheckboxItem({ children, shortcut, className, ...rest }: MenuCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem className={cn(itemBase, 'pl-8', className)} {...rest}>
      <MenuPrimitive.ItemIndicator className="absolute left-2.5 grid size-4 place-items-center">
        <Check size={14} strokeWidth={2} aria-hidden />
      </MenuPrimitive.ItemIndicator>
      <span className="flex-1 truncate">{children}</span>
      {shortcut && <kbd className="ml-4 font-sans text-meta font-medium text-fg-secondary">{shortcut}</kbd>}
    </MenuPrimitive.CheckboxItem>
  );
}

/** A labelled group of items (Customer / Member when switching workspaces). */
export function MenuGroup({ label, children }: { label?: ReactNode; children: ReactNode }) {
  return (
    <MenuPrimitive.Group>
      {label && <MenuPrimitive.Label className="px-2.5 pt-2 pb-1 text-meta font-medium text-fg-secondary">{label}</MenuPrimitive.Label>}
      {children}
    </MenuPrimitive.Group>
  );
}

export function MenuSeparator({ className }: { className?: string | undefined }) {
  return <MenuPrimitive.Separator className={cn('mx-1 my-1.5 h-px bg-rule', className)} />;
}

export type MenuSubTriggerProps = Omit<ComponentProps<typeof MenuPrimitive.SubTrigger>, 'children'> & { children: ReactNode; icon?: ReactNode };

/** Opens a nested menu (right arrow / Enter; left arrow closes). */
export function MenuSubTrigger({ children, icon, className, ...rest }: MenuSubTriggerProps) {
  return (
    <MenuPrimitive.SubTrigger className={cn(itemBase, 'data-[state=open]:bg-hover', className)} {...rest}>
      {icon && <span className="grid size-4 shrink-0 place-items-center text-fg-secondary">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      <ChevronRight size={14} aria-hidden className="text-fg-secondary" />
    </MenuPrimitive.SubTrigger>
  );
}

export function MenuSubContent({ className, sideOffset = 4, ...rest }: ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent sideOffset={sideOffset} collisionPadding={8} className={cn(surface, className)} {...rest} />
    </MenuPrimitive.Portal>
  );
}
