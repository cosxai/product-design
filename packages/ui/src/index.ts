/**
 * @cosxai/ui 1.x — the COSX Design System 3.0 in React.
 *
 * Foundations: import "@cosxai/ui/styles.css" (tokens + fonts) and, in a
 * Tailwind v4 app, "@cosxai/ui/theme.css". Plan and status:
 * docs/workdocs/2026-09-29_feature-ui-1.0.
 */
export { cn } from './lib/cn';

export { Badge, type BadgeAppearance, type BadgeProps, type BadgeStatus } from './components/Badge';
export { Button, formatCount, type ButtonGround, type ButtonProps, type ButtonState, type ButtonVariant } from './components/Button';
export { Card, type CardProps } from './components/Card';
export { Figure, type FigureProps } from './components/Figure';
export { Icon, type IconProps } from './components/Icon';
export { IconButton, type IconButtonProps } from './components/IconButton';
export { Logo, type LogoProps } from './components/Logo';
export { Marker, type MarkerProps } from './components/Marker';
export { MetaLabel, type MetaLabelProps } from './components/MetaLabel';
export { Spinner, type SpinnerProps } from './components/Spinner';
export { Tag, type TagProps } from './components/Tag';
export { ThemeProvider, useTheme, type ThemeMode, type ThemeProviderProps } from './components/ThemeProvider';
export { useButtonAction, type ButtonAction } from './components/useButtonAction';

export { Checkbox, type CheckboxProps } from './components/Checkbox';
export { Dialog, DialogClose, DialogContent, DialogTrigger, type DialogContentProps } from './components/Dialog';
export { Field, useField, type FieldContextValue, type FieldProps } from './components/Field';
export { Input, type InputProps } from './components/Input';
export { RadioGroup, type RadioGroupProps, type RadioOption } from './components/Radio';
export { Select, type SelectOption, type SelectProps } from './components/Select';
export { Switch, type SwitchProps } from './components/Switch';
export { Table, type TableColumn, type TableProps, type TableRowBase, type TableSort, type TableSortDirection } from './components/Table';
export { Tab, TabList, TabPanel, Tabs, type TabItem, type TabListProps, type TabPanelProps, type TabProps, type TabsProps, type TabsVariant } from './components/Tabs';
export { Textarea, type TextareaProps } from './components/Textarea';
export { Toaster, toast, type ToasterProps, type ToastLabels, type ToastOptions, type ToastStatus } from './components/Toast';
export { Tooltip, TooltipProvider, type TooltipProps } from './components/Tooltip';
