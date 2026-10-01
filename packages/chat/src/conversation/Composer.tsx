import { IconButton, Menu, MenuCheckboxItem, MenuContent, MenuTrigger, Popover, PopoverContent, PopoverTrigger, cn } from '@cosxai/ui';
import { ArrowUp, BriefcaseBusiness, ChevronDown, Paperclip, Plus, Square, SquareCheck, type LucideIcon } from 'lucide-react';
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type ComponentProps,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { AttachmentChip } from './parts';

export type ComposerAttachment = {
  id: string;
  name: string;
  /** Bytes. */
  size?: number | undefined;
  /** 0–1 while uploading. Send waits until every file is ready. */
  progress?: number | undefined;
};

export type ComposerCommand = {
  /** /task */
  cmd: string;
  /** Hand over as a task */
  description: ReactNode;
};

export type ComposerScope = { id: string; label: string };

export type ComposerMessage = {
  text: string;
  asTask: boolean;
  /** Ids of the attachments sent with it. */
  attachments: string[];
};

export type ComposerLabels = {
  /** @default "Ask a question or hand over a task…" */
  placeholder: string;
  /** Placeholder while the Agent writes. @default "Agent is answering · you can type the next message" */
  writingPlaceholder: string;
  /** The textarea's name. @default "Message" */
  message: string;
  /** @default "As a task" */
  asTask: string;
  /** @default "Attach files" */
  attach: string;
  /** @default "Remove" */
  remove: string;
  /** @default "Send" */
  send: string;
  /** @default "Stop" */
  stop: string;
  /** @default "Scope" */
  scope: string;
  /** Name of the slash-command list. @default "Commands" */
  commands: string;
  /** The leading "+" button. */
  add: string;
};

const LABELS: ComposerLabels = {
  placeholder: 'Ask a question or hand over a task…',
  writingPlaceholder: 'Agent is answering · you can type the next message',
  message: 'Message',
  asTask: 'As a task',
  attach: 'Attach files',
  remove: 'Remove',
  send: 'Send',
  stop: 'Stop',
  scope: 'Scope',
  commands: 'Commands',
  add: 'Add files or context',
};

export type ComposerProps = Omit<ComponentProps<'div'>, 'children' | 'defaultValue' | 'onChange' | 'placeholder' | 'autoFocus'> & {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  /** Enter (or ⌘/Ctrl+Enter) or the Send button. The text is cleared after. */
  onSend?: ((message: ComposerMessage) => void) | undefined;
  /** The Agent is writing: Send becomes Stop; typing the next message stays allowed. */
  writing?: boolean | undefined;
  onStop?: (() => void) | undefined;
  /** What the Agent can see (Harbour Series A). */
  scope?: string | undefined;
  /** Other scopes to pick from; shows a menu on the scope tag. */
  scopes?: ComposerScope[] | undefined;
  onScopeChange?: ((id: string) => void) | undefined;
  /** The scope tag's icon. @default BriefcaseBusiness */
  scopeIcon?: LucideIcon | undefined;
  /** The host's own scope picker (a project list with search), in a popover from the scope tag.
   *  Wins over `scopes`. Close it after a pick with PopoverClose, or control it with scopePickerOpen. */
  scopePicker?: ReactNode;
  scopePickerOpen?: boolean | undefined;
  onScopePickerOpenChange?: ((open: boolean) => void) | undefined;
  /** A leading "+" opening a menu the host renders (MenuItem children). As a function it gets
   *  `pickFiles`, which opens the file chooser (onAddFiles receives the files).
   *  With a "+" the paperclip is hidden unless showAttachButton. */
  addMenu?: ReactNode | ((api: { pickFiles: () => void }) => ReactNode);
  /** A leading "+" that calls this instead of opening a menu. */
  onAdd?: (() => void) | undefined;
  /** Show the paperclip beside a "+". @default false with addMenu / onAdd, else true */
  showAttachButton?: boolean | undefined;
  /** Before the send button, small and grey: "Enter to send". */
  hint?: ReactNode;
  /** Shows the "As a task" toggle. @default true */
  showAsTask?: boolean | undefined;
  asTask?: boolean | undefined;
  defaultAsTask?: boolean | undefined;
  onAsTaskChange?: ((asTask: boolean) => void) | undefined;
  /** Files added so far; the host uploads them. */
  attachments?: ComposerAttachment[] | undefined;
  /** Files from the attach button, a paste or a drop. Unset: no attaching. */
  onAddFiles?: ((files: File[]) => void) | undefined;
  onRemoveAttachment?: ((id: string) => void) | undefined;
  /** The file input's accept. */
  accept?: string | undefined;
  /** Typing "/" at the start opens these. */
  commands?: ComposerCommand[] | undefined;
  /** A command was picked (its text is put in the composer). */
  onCommand?: ((cmd: string) => void) | undefined;
  /** enter: Enter sends, Shift+Enter breaks the line · mod-enter: ⌘/Ctrl+Enter sends. ⌘/Ctrl+Enter always sends. @default "enter" */
  sendKey?: 'enter' | 'mod-enter' | undefined;
  disabled?: boolean | undefined;
  /** Shows the text but nothing can be typed or sent. */
  readOnly?: boolean | undefined;
  autoFocus?: boolean | undefined;
  labels?: Partial<ComposerLabels> | undefined;
};

const MAX_HEIGHT = 240;

/**
 * Composer — where the user asks or hands over. An autosizing textarea;
 * the scope tag says what the Agent can see; "As a task" hands it to the
 * team. Files come from the button, a paste or a drop. While the Agent
 * writes, Send becomes Stop and the next message can be typed. "/" opens
 * the commands. For the Metaroom Agent layout — "+" (a menu the host
 * renders: `addMenu`, or `onAdd`) · scope tag (`scopePicker` popover) ·
 * spacer · `hint` ("Enter to send") · Send/Stop — set those props.
 */
export function Composer({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSend,
  writing = false,
  onStop,
  scope,
  scopes,
  onScopeChange,
  scopeIcon: ScopeIcon = BriefcaseBusiness,
  scopePicker,
  scopePickerOpen,
  onScopePickerOpenChange,
  addMenu,
  onAdd,
  showAttachButton,
  hint,
  showAsTask = true,
  asTask: asTaskProp,
  defaultAsTask = false,
  onAsTaskChange,
  attachments = [],
  onAddFiles,
  onRemoveAttachment,
  accept,
  commands = [],
  onCommand,
  sendKey = 'enter',
  disabled = false,
  readOnly = false,
  autoFocus,
  labels: labelsProp,
  className,
  ...rest
}: ComposerProps) {
  const labels = { ...LABELS, ...labelsProp };
  const [innerValue, setInnerValue] = useState(defaultValue);
  const value = valueProp ?? innerValue;
  const [innerTask, setInnerTask] = useState(defaultAsTask);
  const asTask = asTaskProp ?? innerTask;
  const [menuDismissed, setMenuDismissed] = useState(false);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const menuId = useId();
  const locked = disabled || readOnly;

  const setValue = (v: string) => {
    if (valueProp === undefined) setInnerValue(v);
    onValueChange?.(v);
    setMenuDismissed(false);
    setActive(0);
  };
  const toggleTask = () => {
    if (asTaskProp === undefined) setInnerTask(!asTask);
    onAsTaskChange?.(!asTask);
  };

  // Autosize: grow with the text up to MAX_HEIGHT, then scroll.
  useLayoutEffect(() => {
    const el = textarea.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  // The slash menu: "/" plus a word at the very start.
  const query = /^\/(\S*)$/.exec(value)?.[1];
  const matches = query === undefined ? [] : commands.filter((c) => c.cmd.replace(/^\//, '').toLowerCase().startsWith(query.toLowerCase()));
  const menuOpen = !locked && !menuDismissed && matches.length > 0;
  const activeIndex = Math.min(active, Math.max(matches.length - 1, 0));

  const uploading = attachments.some((a) => a.progress !== undefined && a.progress < 1);
  const canSend = !locked && !writing && !uploading && (value.trim() !== '' || attachments.length > 0);

  const send = () => {
    if (!canSend) return;
    onSend?.({ text: value.trim(), asTask, attachments: attachments.map((a) => a.id) });
    setValue('');
  };

  const pick = (c: ComposerCommand) => {
    setValue(`${c.cmd} `);
    onCommand?.(c.cmd);
    textarea.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (menuOpen) {
      const n = matches.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((activeIndex + (e.key === 'ArrowDown' ? 1 : n - 1)) % n);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const c = matches[activeIndex];
        if (c) pick(c);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuDismissed(true);
        return;
      }
    }
    if (e.key !== 'Enter') return;
    const mod = e.metaKey || e.ctrlKey;
    if (mod || (sendKey === 'enter' && !e.shiftKey)) {
      e.preventDefault();
      send();
    }
  };

  const pickFiles = () => {
    if (!locked) fileInput.current?.click();
  };

  const addFiles = (files: File[]) => {
    if (files.length && onAddFiles && !locked) onAddFiles(files);
  };
  const onPaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(e.clipboardData?.files ?? []);
    if (files.length && onAddFiles) {
      e.preventDefault();
      addFiles(files);
    }
  };
  const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes('Files');
  const dropProps =
    onAddFiles && !locked
      ? {
          onDragOver: (e: DragEvent<HTMLDivElement>) => {
            if (!hasFiles(e)) return;
            e.preventDefault();
            setDragging(true);
          },
          onDragLeave: (e: DragEvent<HTMLDivElement>) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
          },
          onDrop: (e: DragEvent<HTMLDivElement>) => {
            setDragging(false);
            if (!hasFiles(e)) return;
            e.preventDefault();
            addFiles(Array.from(e.dataTransfer.files));
          },
        }
      : {};

  const chip = 'inline-flex h-7 items-center gap-1.5 rounded-sm px-2 text-meta font-medium outline-none focus-visible:shadow-(--focus-ring)';
  const scopeTag = scope && (
    <>
      <ScopeIcon size={13} strokeWidth={1.75} aria-hidden />
      <span className="max-w-[180px] truncate">{scope}</span>
    </>
  );

  return (
    <div
      data-slash-open={menuOpen || undefined}
      aria-disabled={disabled || undefined}
      className={cn('relative font-sans text-fg', disabled && 'opacity-60', className)}
      {...dropProps}
      {...rest}
    >
      {menuOpen && (
        <ul
          id={menuId}
          role="listbox"
          aria-label={labels.commands}
          className="absolute bottom-full left-0 z-10 m-0 mb-2 flex w-[300px] max-w-full list-none flex-col gap-0.5 rounded-md border border-rule bg-page p-1.5"
        >
          {matches.map((c, i) => (
            <li
              key={c.cmd}
              id={`${menuId}-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(c)}
              className={cn('flex cursor-pointer items-center gap-4 rounded-sm px-2 py-1.5 text-meta', i === activeIndex && 'bg-brand-field text-ink')}
            >
              <span className="w-[80px] shrink-0 text-small font-semibold">{c.cmd}</span>
              <span className="min-w-0 truncate">{c.description}</span>
            </li>
          ))}
        </ul>
      )}
      <div
        className={cn(
          'flex flex-col gap-2.5 rounded-lg bg-sunk px-3.5 pt-3 pb-3',
          dragging && 'shadow-[inset_0_0_0_1.5px_var(--ink)] ink:shadow-[inset_0_0_0_1.5px_var(--linen)]',
        )}
      >
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {attachments.map((a) => (
              <AttachmentChip
                key={a.id}
                name={a.name}
                size={a.size}
                progress={a.progress}
                removeLabel={labels.remove}
                onRemove={onRemoveAttachment && !locked ? () => onRemoveAttachment(a.id) : undefined}
              />
            ))}
          </div>
        )}
        <textarea
          ref={textarea}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          aria-label={labels.message}
          aria-controls={menuOpen ? menuId : undefined}
          aria-activedescendant={menuOpen ? `${menuId}-${activeIndex}` : undefined}
          placeholder={writing ? labels.writingPlaceholder : labels.placeholder}
          className="block min-h-[24px] w-full resize-none border-0 bg-transparent p-0 text-body leading-[1.6] text-fg outline-none placeholder:text-fg-secondary disabled:cursor-not-allowed"
        />
        <div className="flex items-center gap-2">
          {addMenu !== undefined ? (
            <Menu>
              <MenuTrigger asChild disabled={locked}>
                <IconButton icon={Plus} label={labels.add} size="sm" />
              </MenuTrigger>
              <MenuContent side="top">{typeof addMenu === 'function' ? addMenu({ pickFiles }) : addMenu}</MenuContent>
            </Menu>
          ) : (
            onAdd && <IconButton icon={Plus} label={labels.add} size="sm" disabled={locked} onClick={onAdd} />
          )}
          {scope &&
            (scopePicker !== undefined && !locked ? (
              <Popover {...(scopePickerOpen !== undefined ? { open: scopePickerOpen } : {})} {...(onScopePickerOpenChange ? { onOpenChange: onScopePickerOpenChange } : {})}>
                <PopoverTrigger asChild>
                  <button type="button" aria-label={`${labels.scope}: ${scope}`} className={cn(chip, 'cursor-pointer bg-page hover:bg-hover')}>
                    {scopeTag}
                    <ChevronDown size={12} strokeWidth={2} aria-hidden />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" aria-label={labels.scope}>
                  {scopePicker}
                </PopoverContent>
              </Popover>
            ) : scopes && scopes.length > 0 && onScopeChange && !locked ? (
              <Menu>
                <MenuTrigger asChild>
                  <button type="button" aria-label={`${labels.scope}: ${scope}`} className={cn(chip, 'cursor-pointer bg-page hover:bg-hover')}>
                    {scopeTag}
                    <ChevronDown size={12} strokeWidth={2} aria-hidden />
                  </button>
                </MenuTrigger>
                <MenuContent>
                  {scopes.map((s) => (
                    <MenuCheckboxItem key={s.id} checked={s.label === scope} onSelect={() => onScopeChange(s.id)}>
                      {s.label}
                    </MenuCheckboxItem>
                  ))}
                </MenuContent>
              </Menu>
            ) : (
              <span title={`${labels.scope}: ${scope}`} className={cn(chip, 'bg-page')}>
                {scopeTag}
              </span>
            ))}
          {onAddFiles && (
            <>
              {(showAttachButton ?? (addMenu === undefined && !onAdd)) && <IconButton icon={Paperclip} label={labels.attach} size="sm" disabled={locked} onClick={pickFiles} />}
              <input
                ref={fileInput}
                type="file"
                multiple
                hidden
                accept={accept}
                tabIndex={-1}
                onChange={(e) => {
                  addFiles(Array.from(e.target.files ?? []));
                  e.target.value = '';
                }}
              />
            </>
          )}
          {showAsTask && (
            <button
              type="button"
              aria-pressed={asTask}
              disabled={locked}
              onClick={toggleTask}
              className={cn(
                chip,
                'cursor-pointer border disabled:cursor-not-allowed',
                asTask ? 'border-fg bg-page text-fg' : 'border-rule text-fg hover:border-fg',
              )}
            >
              {asTask ? <SquareCheck size={13} strokeWidth={2} aria-hidden /> : <Square size={13} strokeWidth={1.75} aria-hidden />}
              {labels.asTask}
            </button>
          )}
          <span className="flex-1" />
          {hint && <span className="text-[11px] text-fg-secondary">{hint}</span>}
          {writing ? (
            <IconButton icon={Square} label={labels.stop} variant="solid" size="sm" onClick={onStop} disabled={!onStop} className="[&_svg]:fill-current" />
          ) : (
            <IconButton
              icon={ArrowUp}
              label={labels.send}
              variant={canSend ? 'solid' : 'ghost'}
              size="sm"
              disabled={!canSend}
              onClick={send}
              className={cn(!canSend && 'bg-well disabled:opacity-100 text-fg-secondary')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
