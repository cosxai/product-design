import { cva } from 'class-variance-authority';

/**
 * The shared frame of text controls (Input, Textarea, Select trigger):
 * sunk to linen, a --rule edge, ink edge + focus ring on focus, the one
 * red on error, well + grey text when disabled. Single-line heights are
 * fixed at 32 · 38 · 44 (Textarea overrides with h-auto).
 */
export const controlFrame = cva(
  [
    'flex w-full items-center gap-2 rounded-md border font-sans text-fg',
    'transition-[border-color,background-color] duration-[120ms] ease-standard',
  ],
  {
    variants: {
      variant: {
        default: 'border-rule bg-sunk focus-within:border-fg focus-within:shadow-(--focus-ring)',
        borderless:
          'border-transparent bg-transparent hover:bg-hover focus-within:border-fg focus-within:bg-sunk focus-within:shadow-(--focus-ring)',
      },
      size: {
        sm: 'h-8 px-2.5 text-[13px]',
        md: 'h-[38px] px-2.5 text-[13px]',
        lg: 'h-11 px-3 text-[15px]',
      },
      invalid: { true: 'border-error focus-within:border-error', false: '' },
      disabled: { true: 'cursor-not-allowed border-rule-soft bg-well text-fg-secondary', false: '' },
      readOnly: { true: 'border-rule-soft', false: '' },
    },
    defaultVariants: { variant: 'default', size: 'md', invalid: false, disabled: false, readOnly: false },
  },
);

/** The bare native element inside the frame. */
export const controlInner =
  'min-w-0 flex-1 border-none bg-transparent p-0 font-sans text-inherit outline-none placeholder:text-fg-secondary disabled:cursor-not-allowed';
