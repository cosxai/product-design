import * as RadioPrimitive from '@radix-ui/react-radio-group';
import { useState, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { definedAria } from './inputs-aria';

export type Choice = {
  value: string;
  title: ReactNode;
  description?: ReactNode;
  /** A glyph at the start (an Icon). */
  icon?: ReactNode;
  disabled?: boolean | undefined;
};

export type ChoiceCardsProps = {
  choices: Choice[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  /** Cards per row on wide screens; they stack on phones. @default 2 */
  columns?: 2 | 3 | undefined;
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  className?: string | undefined;
};

/**
 * ChoiceCards — a few weighty options, each a card with a title and a
 * sentence (Add a person · Add an organisation). Radio semantics; the
 * chosen card sits on the brand colour with an ink edge.
 */
export function ChoiceCards({ choices, value, defaultValue, onChange, columns = 2, className, ...aria }: ChoiceCardsProps) {
  const [own, setOwn] = useState(defaultValue);
  const current = value ?? own;
  return (
    <RadioPrimitive.Root
      value={current ?? ''}
      onValueChange={(v) => {
        if (value === undefined) setOwn(v);
        onChange?.(v);
      }}
      loop
      {...definedAria(aria)}
      className={cn('grid grid-cols-1 gap-3', columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2', className)}
    >
      {choices.map((c) => (
        <RadioPrimitive.Item
          key={c.value}
          value={c.value}
          disabled={c.disabled}
          className={cn(
            'group flex cursor-pointer items-start gap-3 rounded-lg border border-rule bg-page p-4 text-left font-sans text-fg outline-none',
            'transition-[background-color,border-color] duration-[120ms] ease-standard hover:border-fg focus-visible:shadow-(--focus-ring)',
            'data-[state=checked]:border-fg data-[state=checked]:bg-hover',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-rule',
          )}
        >
          {c.icon && <span className="mt-0.5 flex shrink-0">{c.icon}</span>}
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-ui font-medium">{c.title}</span>
            {c.description && <span className="text-meta leading-normal text-fg-secondary">{c.description}</span>}
          </span>
        </RadioPrimitive.Item>
      ))}
    </RadioPrimitive.Root>
  );
}
