// The COSX 3.0 components the export's pages use, drawn by @cosxai/ui.
// Each adapter takes the 3.0 props as the pages pass them (Claude Design's
// Button, Icon name="check", IconButton size={28} …) and renders the kit's
// component, so the site shows the real library.

import {
  Badge as UIBadge,
  Button as UIButton,
  Checkbox as UICheckbox,
  Dialog as UIDialog,
  DialogContent,
  Icon as UIIcon,
  IconButton as UIIconButton,
  Input as UIInput,
  Select as UISelect,
  Switch as UISwitch,
  Table as UITable,
  Tabs as UITabs,
  ToastCard,
} from '@cosxai/ui';

import { iconFor } from './icons';

const sizeOf = (n, sm, lg) => (n == null ? undefined : n <= sm ? 'sm' : n >= lg ? 'lg' : 'md');

/** Icon name="file-text" size={14} — the Lucide glyph by name. */
export function Icon({ name, size = 16, color, style, strokeWidth }) {
  const glyph = iconFor(name);
  if (!glyph) return null;
  return <UIIcon icon={glyph} size={size} style={{ ...(color ? { color } : null), ...style }} {...(strokeWidth ? { strokeWidth } : null)} />;
}

export function Button({ variant, size, ground, disabled, iconLeft, iconRight, onClick, style, children, ...rest }) {
  return (
    <UIButton variant={variant} size={size} ground={ground} disabled={disabled || undefined} iconLeft={iconLeft} iconRight={iconRight} onClick={onClick} style={style} {...rest}>
      {children}
    </UIButton>
  );
}

/** 3.0 sizes the square in px (26–44); the kit has sm 32 · md 38 · lg 44 — the exact size is kept. */
export function IconButton({ name, label, variant, size, disabled, onClick, style }) {
  const glyph = iconFor(name);
  const px = typeof size === 'number' ? size : undefined;
  return (
    <UIIconButton
      icon={glyph ?? (() => null)}
      label={label ?? name ?? ''}
      variant={variant === 'ghost' || variant === 'outline' || variant === 'solid' ? variant : undefined}
      size={sizeOf(px, 32, 44)}
      disabled={disabled || undefined}
      onClick={onClick}
      style={px ? { width: px, height: px, ...style } : style}
    />
  );
}

export function Badge({ status, appearance, children, label }) {
  return (
    <UIBadge status={status} appearance={appearance}>
      {children ?? label ?? null}
    </UIBadge>
  );
}

export function Checkbox({ checked, onChange, label, description, disabled, ...rest }) {
  return <UICheckbox checked={checked} onChange={onChange} label={label} description={description} disabled={disabled || undefined} aria-label={rest['aria-label']} />;
}

export function Switch({ checked, onChange, label, description, disabled, ...rest }) {
  return <UISwitch checked={checked} onChange={onChange} label={label} description={description} disabled={disabled || undefined} aria-label={rest['aria-label'] ?? (typeof label === 'string' ? undefined : 'Switch')} />;
}

export function Input({ label, hint, placeholder, value, defaultValue, onChange, onKeyDown, invalid, disabled, suffix, readOnly, type, autocomplete, autoComplete }) {
  return (
    <UIInput
      label={label}
      hint={invalid ? undefined : hint}
      error={invalid ? hint : undefined}
      invalid={invalid || undefined}
      placeholder={placeholder}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled || undefined}
      readOnly={readOnly || undefined}
      suffix={suffix}
      type={type}
      autoComplete={autoComplete ?? autocomplete}
    />
  );
}

export function Select({ options, value, onChange, placeholder, invalid, disabled, searchable, ...rest }) {
  return (
    <UISelect
      options={options ?? []}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      invalid={invalid || undefined}
      disabled={disabled || undefined}
      searchable={searchable || undefined}
      aria-label={rest['aria-label'] ?? placeholder ?? 'Select'}
    />
  );
}

export function Tabs({ items, value, onChange, variant }) {
  return <UITabs items={items ?? []} value={value} onChange={onChange} variant={variant} />;
}

export function Table({ columns, rows, dense, onRowClick }) {
  return <UITable columns={columns ?? []} rows={rows ?? []} dense={dense} onRowClick={onRowClick} />;
}

/** A toast as a specimen on the page (not queued). */
export function Toast({ status, title, action, open = true, onClose }) {
  if (!open) return null;
  return <ToastCard status={status} title={title} action={action} onClose={onClose} />;
}

const WIDTH = [
  [400, 'sm'],
  [520, 'md'],
  [640, 'lg'],
  [800, 'xl'],
];

export function Dialog({ open, title, eyebrow, width, onClose, footer, children }) {
  const size = typeof width === 'number' ? (WIDTH.find(([w]) => width <= w)?.[1] ?? 'split') : undefined;
  return (
    <UIDialog open={Boolean(open)} onOpenChange={(o) => (o ? null : onClose?.())}>
      <DialogContent title={title} eyebrow={eyebrow} footer={footer} size={size}>
        {children}
      </DialogContent>
    </UIDialog>
  );
}
