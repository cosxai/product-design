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

// Stage 2 — product patterns
export { ActionBar, ActionBarProvider, arrange, formatShortcut, useActionBarActivity, useActionBarHidden, useActionBarItems, useActionBarMode, useActionBarSelection, type ActionBarAction, type ActionBarLabels, type ActionBarMode, type ActionBarPresentation, type ActionBarProps, type ActionBarProviderProps, type ActionBarSelection, type ActionBarState } from './components/ActionBar';
export { ActivityTimeline, initialsOf, type ActivityEvent, type ActivityGroup, type ActivityTimelineProps } from './components/ActivityTimeline';
export { AsyncSelect, type AsyncSelectProps } from './components/AsyncSelect';
export { Breadcrumb, type BreadcrumbItem, type BreadcrumbProps } from './components/Breadcrumb';
export { ChoiceCards, type Choice, type ChoiceCardsProps } from './components/ChoiceCards';
export { CodeInput, type CodeInputProps } from './components/CodeInput';
export { CommandPalette, useCommandPaletteHotkey, type CommandItem, type CommandPaletteLabels, type CommandPaletteProps, type CommandSource } from './components/CommandPalette';
export { ConfirmDialog, PromptDialog, StepUpDialog, type ConfirmDialogProps, type PromptDialogProps, type StepUpDialogProps } from './components/ConfirmDialog';
export { CopyField, type CopyFieldProps } from './components/CopyField';
export { DateInput, FuzzyDateInput, type DateInputProps, type DatePrecision, type FuzzyDateInputProps } from './components/DateInput';
export { Dropzone, refusedText, type DropzoneLabels, type DropzoneProps } from './components/Dropzone';
export { FileCard, type FileCardProps, type FileCardState } from './components/FileCard';
export { FileList, FileRow, type FileListProps, type FileRowProps } from './components/FileRow';
export { FolderTree, type FolderTreeProps, type TreeNode } from './components/FolderTree';
export { type ListItem } from './components/inputs-listbox';
export { ListToolbar, type ListFilter, type ListToolbarLabels, type ListToolbarProps, type ListView, type SearchScope } from './components/ListToolbar';
export { MentionInput, mentionAt, type Mention, type MentionInputProps } from './components/MentionInput';
export { Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuItem, MenuSeparator, MenuSub, MenuSubContent, MenuSubTrigger, MenuTrigger, type MenuCheckboxItemProps, type MenuContentProps, type MenuItemProps, type MenuSubTriggerProps } from './components/Menu';
export { PageHeader, type PageHeaderFigure, type PageHeaderProps } from './components/PageHeader';
export { PageNotice, PageState, type PageNoticeProps, type PageStateKind, type PageStateProps } from './components/PageState';
export { Progress, progressStep, type ProgressProps, type ProgressSegment } from './components/Progress';
export { PulseDot, type PulseDotProps } from './components/PulseDot';
export { RecipientsInput, type Recipient, type RecipientStatus, type RecipientsInputProps } from './components/RecipientsInput';
export { SearchField, type SearchFieldProps } from './components/SearchField';
export { SegmentedControl, type Segment, type SegmentedControlProps } from './components/SegmentedControl';
export { SidePanel, SidePanelProvider, SidePanelSlot, useSidePanel, type SidePanelProps } from './components/SidePanel';
export { Skeleton, SkeletonCards, SkeletonList, SkeletonViewer, type SkeletonProps, type SkeletonViewerProps } from './components/Skeleton';
export { StageProgress, type Stage, type StageProgressProps } from './components/StageProgress';
export { checkFiles, formatBytes, hasFiles, readDataTransfer, type DroppedFile, type FileRules, type Rejected, type RejectReason } from './components/status-files';
export { Steps, type Step, type StepState, type StepsProps } from './components/Steps';
export { SyncStatus, type SyncState, type SyncStatusProps } from './components/SyncStatus';
export { UploadCheck, groupByFolder, type UploadCheckLabels, type UploadCheckProps } from './components/UploadCheck';
export { UploadFolderRow, UploadList, UploadRow, useBeforeUnloadWhile, type UploadItem, type UploadRowLabels, type UploadRowProps, type UploadState } from './components/UploadList';
export { useSelection, type Selection, type SelectionOptions } from './components/useSelection';
export { InfiniteLoader, VirtualList, type InfiniteLoaderProps, type VirtualListProps } from './components/VirtualList';
export { WindowDrop, useWindowDrop, type WindowDropProps } from './components/WindowDrop';
