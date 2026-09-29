import { Upload } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Icon } from './Icon';
import { hasFiles, readDataTransfer, type DroppedFile } from './status-files';

type WindowDropContextValue = {
  /** Files are being dragged over the window: every drop target lights up. */
  dragging: boolean;
  /** A local zone under the pointer names its folder here (null on leave). */
  setHoverTarget: (target: string | null) => void;
};

const WindowDropContext = createContext<WindowDropContextValue>({ dragging: false, setHoverTarget: () => {} });

/** Inside a WindowDrop: whether files are being dragged over the window. */
export function useWindowDrop(): WindowDropContextValue {
  return useContext(WindowDropContext);
}

export type WindowDropProps = {
  children: ReactNode;
  /** Where a drop anywhere goes: the current folder, or "My uploads". */
  target: string;
  /** A drop outside any local zone. */
  onDrop: (items: DroppedFile[], target: string) => void;
  /** Read-only page: no layer — a line says you can only view here. */
  readOnly?: boolean | undefined;
  /** Force the layer open (previews, screenshots). */
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  labels?: { release?: (target: string) => string; viewOnly?: string; close?: string } | undefined;
};

const dialogOpen = () => typeof document !== 'undefined' && document.querySelector('[role="dialog"], [role="alertdialog"]') !== null;

/**
 * WindowDrop — the whole window accepts a drop while files are dragged in
 * (only files: text, links or cards dragged on the page never trigger it).
 * A layer above the page, below dialogs, names where the files will go;
 * hovering a folder or a local Dropzone changes that wording. It leaves at
 * once when the drag exits the window, on Esc, or after the drop.
 */
export function WindowDrop({ children, target, onDrop, readOnly = false, open, onOpenChange, labels }: WindowDropProps) {
  const [dragging, setDragging] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);
  const depth = useRef(0);

  const set = useCallback(
    (v: boolean) => {
      setDragging(v);
      if (!v) setHoverTarget(null);
      onOpenChange?.(v);
    },
    [onOpenChange],
  );

  useEffect(() => {
    const enter = (e: DragEvent) => {
      if (!hasFiles(e.dataTransfer) || dialogOpen()) return;
      depth.current += 1;
      if (depth.current === 1) set(true);
    };
    const over = (e: DragEvent) => {
      if (!hasFiles(e.dataTransfer) || dialogOpen()) return;
      e.preventDefault(); // allow the drop
      if (e.dataTransfer) e.dataTransfer.dropEffect = readOnly ? 'none' : 'copy';
    };
    const leave = (e: DragEvent) => {
      if (!hasFiles(e.dataTransfer)) return;
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) set(false);
    };
    const drop = (e: DragEvent) => {
      if (!hasFiles(e.dataTransfer)) return;
      e.preventDefault();
      depth.current = 0;
      set(false);
      if (readOnly || !e.dataTransfer) return;
      void readDataTransfer(e.dataTransfer).then((items) => items.length && onDrop(items, target));
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        depth.current = 0;
        set(false);
      }
    };
    window.addEventListener('dragenter', enter);
    window.addEventListener('dragover', over);
    window.addEventListener('dragleave', leave);
    window.addEventListener('drop', drop);
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('dragenter', enter);
      window.removeEventListener('dragover', over);
      window.removeEventListener('dragleave', leave);
      window.removeEventListener('drop', drop);
      window.removeEventListener('keydown', key);
    };
  }, [onDrop, readOnly, set, target]);

  const shown = open ?? dragging;
  const release = labels?.release ?? ((t: string) => `Release to upload to ${t}`);

  return (
    <WindowDropContext.Provider value={{ dragging: shown, setHoverTarget }}>
      {children}
      {shown && (
        <div
          data-window-drop
          role="presentation"
          onClick={() => set(false)}
          className="pointer-events-none fixed inset-0 z-40 flex items-end justify-center bg-page/60 p-6 font-sans"
        >
          <div
            role="status"
            aria-live="polite"
            className={cn(
              'pointer-events-auto flex items-center gap-3 rounded-lg px-5 py-4 text-body font-medium',
              readOnly ? 'bg-ink text-linen' : 'border-2 border-ink bg-brand-field text-ink',
            )}
          >
            {!readOnly && <Icon icon={Upload} size={18} />}
            {readOnly ? (labels?.viewOnly ?? 'You can only view here') : release(hoverTarget ?? target)}
          </div>
        </div>
      )}
    </WindowDropContext.Provider>
  );
}
