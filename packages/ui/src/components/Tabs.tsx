import * as TabsPrimitive from '@radix-ui/react-tabs';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { formatCount } from './Button';

export type TabsVariant = 'underline' | 'pills';

export type TabItem = {
  value: string;
  label: ReactNode;
  /** An attention count after the label: a small yellow badge, hidden at zero. */
  count?: number | undefined;
  disabled?: boolean | undefined;
};

const VariantContext = createContext<TabsVariant>('underline');

export type TabsProps = Omit<ComponentProps<typeof TabsPrimitive.Root>, 'onValueChange' | 'onChange' | 'children'> & {
  /** underline for product UI · pills for marketing sections (active one on the brand field). @default "underline" */
  variant?: TabsVariant | undefined;
  /** Called with the new tab's value. Keep the active tab in the URL so refresh and sharing keep it. */
  onChange?: ((value: string) => void) | undefined;
  /** Shorthand: renders the tab list from these. Two to seven; beyond that use More or a side menu. */
  items?: TabItem[] | undefined;
  /** Accessible name of the tab list (with `items`). */
  label?: string | undefined;
  /** TabPanels (and, without `items`, a TabList). */
  children?: ReactNode;
};

/**
 * Tabs — switch between views of the same object (Overview, Documents,
 * Parties). Switching changes no data; segments change how the same
 * content shows, tabs change the content. Arrow keys move, Home/End jump
 * (Radix Tabs).
 */
export function Tabs({ variant = 'underline', onChange, items, label, className, children, ...rest }: TabsProps) {
  return (
    <VariantContext.Provider value={variant}>
      <TabsPrimitive.Root {...(onChange ? { onValueChange: onChange } : {})} className={cn('flex flex-col', className)} {...rest}>
        {items && (
          <TabList aria-label={label}>
            {items.map((it) => (
              <Tab key={it.value} value={it.value} count={it.count} disabled={it.disabled}>
                {it.label}
              </Tab>
            ))}
          </TabList>
        )}
        {children}
      </TabsPrimitive.Root>
    </VariantContext.Provider>
  );
}

export type TabListProps = ComponentProps<typeof TabsPrimitive.List>;

export function TabList({ className, ...rest }: TabListProps) {
  const variant = useContext(VariantContext);
  return (
    <TabsPrimitive.List
      className={cn(variant === 'pills' ? 'flex gap-2.5 [counter-reset:cosx-tab]' : 'flex gap-0.5 border-b border-rule', className)}
      {...rest}
    />
  );
}

export type TabProps = ComponentProps<typeof TabsPrimitive.Trigger> & {
  count?: number | undefined;
};

export function Tab({ className, children, count, ...rest }: TabProps) {
  const variant = useContext(VariantContext);
  const shown = count === undefined ? null : formatCount(count);
  const badge = shown && (
    <span className="min-w-[18px] rounded-pill bg-brand-mark px-1.5 text-[11px] leading-[18px] font-semibold text-ink tabular-nums">
      {shown}
    </span>
  );

  if (variant === 'pills') {
    return (
      <TabsPrimitive.Trigger
        className={cn(
          'group flex flex-1 cursor-pointer items-center gap-3 rounded-md border-0 bg-sunk px-[18px] py-3.5 text-left font-sans text-ui font-medium text-fg outline-none',
          'transition-colors duration-[120ms] ease-standard focus-visible:shadow-(--focus-ring)',
          'data-[state=active]:bg-brand-field data-[state=active]:text-ink',
          'disabled:cursor-not-allowed disabled:opacity-40',
          '[counter-increment:cosx-tab] before:text-meta before:font-normal before:text-fg-secondary before:content-[counter(cosx-tab,decimal-leading-zero)] data-[state=active]:before:text-ink',
          className,
        )}
        {...rest}
      >
        {children}
        {badge && ' '}
        {badge}
      </TabsPrimitive.Trigger>
    );
  }

  return (
    <TabsPrimitive.Trigger
      className={cn(
        '-mb-px inline-flex cursor-pointer items-center gap-2 border-0 border-b-2 border-transparent bg-transparent px-3 py-2.5 font-sans text-small text-fg-secondary outline-none',
        'transition-colors duration-[120ms] ease-standard hover:text-fg focus-visible:shadow-(--focus-ring)',
        'data-[state=active]:border-fg data-[state=active]:font-medium data-[state=active]:text-fg',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...rest}
    >
      {children}
      {badge && ' '}
      {badge}
    </TabsPrimitive.Trigger>
  );
}

export type TabPanelProps = ComponentProps<typeof TabsPrimitive.Content>;

export function TabPanel({ className, ...rest }: TabPanelProps) {
  return <TabsPrimitive.Content className={cn('pt-4 outline-none focus-visible:shadow-(--focus-ring)', className)} {...rest} />;
}
