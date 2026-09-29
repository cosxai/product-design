import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../lib/cn';
import { Logo } from './Logo';

export type AuthLayoutProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Top left: the product lockup (a Logo tile and the product name). */
  brand: ReactNode;
  /** Top right: usually a ThemeSwitch. */
  headerEnd?: ReactNode;
  /** The step, centred in a 400px column. */
  children: ReactNode;
  /** One line under the step: who to ask when stuck. */
  help?: ReactNode;
  /** The foot: links on the left, the language on the right. */
  footer?: ReactNode;
  /** The yellow panel's text (an AuthPanel). Dropped below 900px. */
  panel?: ReactNode;
};

/**
 * AuthLayout — the sign-in page (Metaroom sign-in, design.cosx.co): the step
 * on the left under the product lockup, the yellow panel on the right saying
 * what this step is for. The panel drops when the layout is narrower than
 * 900px (a container query, so a narrow window or pane works too).
 */
export function AuthLayout({ brand, headerEnd, children, help, footer, panel, className, ...rest }: AuthLayoutProps) {
  return (
    <div className={cn('@container flex h-full w-full font-sans text-fg', className)} {...rest}>
      <div className="flex min-w-0 flex-1 flex-col px-12 pt-12 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[15px] font-medium">{brand}</div>
          {headerEnd}
        </div>
        <main className="flex flex-1 items-center py-8">
          <div className="mx-auto flex w-full max-w-[400px] flex-col gap-8">
            {children}
            {help && <p className="m-0 text-[12px] leading-[1.6] text-fg-secondary">{help}</p>}
          </div>
        </main>
        {footer && <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[12px] text-fg-secondary">{footer}</div>}
      </div>
      {panel && (
        <aside className="hidden w-[min(560px,45%)] shrink-0 p-6 @min-[900px]:flex">
          <div className="flex flex-1 flex-col justify-between gap-8 overflow-hidden rounded-[24px] bg-brand-field p-14 text-ink">{panel}</div>
        </aside>
      )}
    </div>
  );
}

export type AuthPanelProps = {
  /** Small line above: "Your workspaces", "Security". */
  eyebrow: ReactNode;
  /** The statement's plain start: "Every workspace you belong to, ". */
  lead: ReactNode;
  /** Its highlighted end: "under one sign-in." */
  mark: ReactNode;
  /** One sentence under it. */
  sub?: ReactNode;
  /** Top of the panel. @default the COSX wordmark */
  logo?: ReactNode;
};

/** AuthPanel — the yellow panel's text: wordmark on top, the statement at the foot. */
export function AuthPanel({ eyebrow, lead, mark, sub, logo }: AuthPanelProps) {
  return (
    <>
      {logo ?? <Logo height={22} tone="ink" />}
      <div className="flex flex-col gap-4">
        <span className="text-[13px] font-medium text-[rgba(17,17,17,.7)]">{eyebrow}</span>
        <p className="m-0 text-[34px] leading-[1.22] font-medium tracking-[-.02em] text-pretty">
          {lead}
          <span className="box-decoration-clone bg-[linear-gradient(transparent_45%,var(--brand-mark)_45%,var(--brand-mark)_95%,transparent_95%)]">{mark}</span>
        </p>
        {sub && <p className="m-0 text-[15px] leading-[1.6] text-[rgba(17,17,17,.7)]">{sub}</p>}
      </div>
    </>
  );
}

export type AuthStepHeadProps = {
  /** An AuthIconTile, a Spinner, a workspace mark. */
  icon?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
};

/** AuthStepHead — a step's icon, title and one explanation. */
export function AuthStepHead({ icon, title, children }: AuthStepHeadProps) {
  return (
    <div className="flex flex-col gap-5">
      {icon}
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[30px] leading-[1.2] font-medium tracking-[-.015em]">{title}</h1>
        {children && <p className="m-0 text-[15px] leading-[1.6] text-fg-secondary">{children}</p>}
      </div>
    </div>
  );
}

export type AuthIconTileProps = {
  children: ReactNode;
  /** plain: a step; yellow: done; error: it didn't work. @default "plain" */
  tone?: 'plain' | 'yellow' | 'error' | undefined;
};

/** AuthIconTile — the 56px tile holding a step's icon. */
export function AuthIconTile({ children, tone = 'plain' }: AuthIconTileProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-14 place-items-center rounded-[14px]',
        tone === 'plain' && 'bg-sunk text-fg',
        tone === 'yellow' && 'bg-brand-field text-ink',
        tone === 'error' && 'bg-error-wash text-error-text',
      )}
    >
      {children}
    </span>
  );
}
