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
