import { ChevronRight } from 'lucide-react';
import { forwardRef, useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Spinner } from './Spinner';

export type WorkspaceMarkProps = {
  name: string;
  /** The workspace's logo; its initial on the yellow when unset or it fails to load. */
  logoUrl?: string | undefined;
  /** px. @default 36 */
  size?: number | undefined;
};

/** WorkspaceMark — a workspace's logo, or its initial on the brand yellow. */
export function WorkspaceMark({ name, logoUrl, size = 36 }: WorkspaceMarkProps) {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  // A server-rendered page can fail the image before React is listening:
  // onError never fires, so look once it is.
  useEffect(() => {
    const el = img.current;
    if (el?.complete && el.naturalWidth === 0) setFailed(true);
  }, [logoUrl]);
  if (logoUrl && !failed) {
    return <img ref={img} src={logoUrl} alt="" aria-hidden style={{ width: size, height: size }} className="shrink-0 rounded-[8px] object-cover" onError={() => setFailed(true)} />;
  }
  return (
    <span aria-hidden style={{ width: size, height: size }} className="grid shrink-0 place-items-center rounded-[8px] bg-brand-field text-[13px] font-semibold text-ink">
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

export type WorkspaceRowProps = Omit<ComponentProps<'button'>, 'children'> & {
  name: string;
  /** The second line: the workspace's short name or address. */
  detail?: ReactNode;
  logoUrl?: string | undefined;
  /** Being opened: a spinner in place of the chevron. */
  busy?: boolean | undefined;
};

/**
 * WorkspaceRow — one workspace in a chooser: mark, name, detail, chevron.
 * The whole row is the button; `busy` shows it opening (disable the others).
 */
export const WorkspaceRow = forwardRef<HTMLButtonElement, WorkspaceRowProps>(function WorkspaceRow(
  { name, detail, logoUrl, busy = false, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-busy={busy || undefined}
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 rounded-[12px] border-0 bg-page px-3.5 py-3 text-left text-fg shadow-[inset_0_0_0_1px_var(--rule)] outline-none transition-colors duration-[120ms] hover:bg-hover focus-visible:shadow-(--focus-ring) disabled:cursor-default',
        className,
      )}
      {...rest}
    >
      <WorkspaceMark name={name} logoUrl={logoUrl} />
      <span className="flex min-w-0 flex-1 flex-col leading-[1.35]">
        <span className="truncate text-[14px] font-medium">{name}</span>
        {detail && <span className="truncate text-[12px] text-fg-secondary">{detail}</span>}
      </span>
      {busy ? <Spinner size={16} /> : <ChevronRight size={16} aria-hidden className="text-fg-secondary" />}
    </button>
  );
});
