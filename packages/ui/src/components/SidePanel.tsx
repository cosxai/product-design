import { X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../lib/cn';
import { IconButton } from './IconButton';

type SlotContext = {
  /** The panel in the slot, if any. */
  openId: string | null;
  open: (id: string) => void;
  close: (id?: string) => void;
  slot: HTMLElement | null;
  setSlot: (el: HTMLElement | null) => void;
};

const SidePanelContext = createContext<SlotContext | null>(null);

/**
 * SidePanelProvider — the page's one right-hand slot. Opening a panel
 * closes whatever held the slot (Share and the Agent drawer never show
 * together). Place <SidePanelSlot/> beside the main content.
 */
export function SidePanelProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const open = useCallback((id: string) => setOpenId(id), []);
  const close = useCallback((id?: string) => setOpenId((cur) => (id === undefined || cur === id ? null : cur)), []);
  const value = useMemo(() => ({ openId, open, close, slot, setSlot }), [openId, open, close, slot]);
  return <SidePanelContext.Provider value={value}>{children}</SidePanelContext.Provider>;
}

/** The slot's state and controls. */
export function useSidePanel() {
  const ctx = useContext(SidePanelContext);
  if (!ctx) throw new Error('useSidePanel needs a <SidePanelProvider>');
  const { openId, open, close } = ctx;
  return { openId, open, close };
}

/** Where the open panel renders: a flex sibling of the main content, so it pushes the content (no overlay). */
export function SidePanelSlot({ className, ...rest }: ComponentProps<'div'>) {
  const ctx = useContext(SidePanelContext);
  const setSlot = ctx?.setSlot;
  return <div ref={setSlot} className={cn('flex h-full shrink-0', className)} {...rest} />;
}

const WIDTH = { sm: 'sm:w-[360px]', md: 'sm:w-[480px]', lg: 'sm:w-[640px]' } as const;

export type SidePanelProps = Omit<ComponentProps<'aside'>, 'title'> & {
  /** The panel's id in the slot. */
  id: string;
  title: ReactNode;
  /** A line above the title (the item it is about). */
  eyebrow?: ReactNode;
  /** 360 · 480 · 640. @default "sm" */
  width?: keyof typeof WIDTH | undefined;
  /** Pinned at the bottom (New share). */
  footer?: ReactNode;
  /** @default "Close" */
  closeLabel?: string | undefined;
  onClose?: (() => void) | undefined;
};

/**
 * SidePanel — detail beside the page (sharing, properties, the Agent).
 * No scrim and no focus trap: the page stays usable; it pushes the content
 * aside. Esc closes it (unless a dialog is open above). On phones it pushes
 * in full screen. Renders only while it holds the slot.
 */
export function SidePanel({ id, title, eyebrow, width = 'sm', footer, closeLabel = 'Close', onClose, className, children, ...rest }: SidePanelProps) {
  const ctx = useContext(SidePanelContext);
  if (!ctx) throw new Error('SidePanel needs a <SidePanelProvider>');
  const { openId, close, slot } = ctx;
  const isOpen = openId === id;
  const titleId = useId();

  const dismiss = useCallback(() => {
    close(id);
    onClose?.();
  }, [close, id, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]')) return;
      dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, dismiss]);

  if (!isOpen || !slot) return null;
  return createPortal(
    <aside
      aria-labelledby={titleId}
      className={cn(
        'flex h-full flex-col border-l border-rule bg-page font-sans text-fg',
        'max-sm:fixed max-sm:inset-0 max-sm:z-40 max-sm:w-full max-sm:border-l-0',
        WIDTH[width],
        className,
      )}
      {...rest}
    >
      <header className="flex items-start gap-3 border-b border-rule px-5 py-4">
        <div className="min-w-0 flex-1">
          {eyebrow && <div className="mb-1 text-meta font-medium text-fg-secondary">{eyebrow}</div>}
          <h2 id={titleId} className="m-0 truncate text-[16px] leading-[1.3] font-medium">
            {title}
          </h2>
        </div>
        <IconButton icon={X} label={closeLabel} size="sm" onClick={dismiss} className="-mt-1 -mr-2" />
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-ui">{children}</div>
      {footer && <footer className="border-t border-rule px-5 py-3.5">{footer}</footer>}
    </aside>,
    slot,
  );
}
