import { Button, IconButton, cn } from '@cosxai/ui';
import { Check, SquareCheck, UserRoundPlus, X } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';

import { SystemLine } from './parts';

export type ConfirmationState = 'pending' | 'confirming' | 'done' | 'dismissed';

export type ConfirmationCardLabels = {
  /** @default "Needs your confirmation" */
  needs: string;
  /** @default "Nothing is sent until you confirm." */
  footnote: string;
  /** Replaces the eyebrow once done. @default "Done" */
  done: string;
  /** The line left after dismissing. @default "Not sent" */
  dismissed: string;
  /** @default "Dismiss" */
  dismiss: string;
};

const LABELS: ConfirmationCardLabels = {
  needs: 'Needs your confirmation',
  footnote: 'Nothing is sent until you confirm.',
  done: 'Done',
  dismissed: 'Not sent',
  dismiss: 'Dismiss',
};

export type ConfirmationCardProps = Omit<ComponentProps<'section'>, 'title'> & {
  /** Send NDA reminders to 4 investors? */
  title: ReactNode;
  /** @default "pending" */
  state?: ConfirmationState | undefined;
  /** The primary action (Send 4 reminders). */
  confirmLabel: ReactNode;
  onConfirm: () => void;
  /** The secondary action (Review drafts). */
  secondaryLabel?: ReactNode;
  onSecondary?: (() => void) | undefined;
  /** Shows a close button; the host sets state="dismissed". */
  onDismiss?: (() => void) | undefined;
  /** What happened, shown once done (4 reminders sent). @default labels.done */
  doneText?: ReactNode;
  labels?: Partial<ConfirmationCardLabels> | undefined;
};

/**
 * ConfirmationCard — anything that leaves the workspace or can't be undone
 * (send, share, sign, delete) is drafted by the Agent and runs only after
 * the user confirms here. Ink outline, distinct from result cards. The host
 * drives state: pending → confirming (busy) → done, or dismissed.
 */
export function ConfirmationCard({
  title,
  state = 'pending',
  confirmLabel,
  onConfirm,
  secondaryLabel,
  onSecondary,
  onDismiss,
  doneText,
  labels: labelsProp,
  className,
  children,
  ...rest
}: ConfirmationCardProps) {
  const labels = { ...LABELS, ...labelsProp };
  const titleId = useId();

  if (state === 'dismissed') {
    return (
      <section aria-labelledby={titleId} className={cn('max-w-[520px] rounded-lg border border-rule px-4 py-3 text-small text-fg-secondary', className)} {...rest}>
        {labels.dismissed} · <span id={titleId}>{title}</span>
      </section>
    );
  }

  const done = state === 'done';
  const busy = state === 'confirming';
  return (
    <section
      aria-labelledby={titleId}
      aria-busy={busy || undefined}
      className={cn('relative flex max-w-[520px] flex-col gap-1.5 rounded-lg border p-4 text-fg', done ? 'border-rule' : 'border-fg', className)}
      {...rest}
    >
      {done ? (
        <div role="status" className="flex items-center gap-1.5 text-meta font-medium text-fg">
          <Check size={13} strokeWidth={2.25} aria-hidden />
          {doneText ?? labels.done}
        </div>
      ) : (
        <div className="text-meta text-fg-secondary">{labels.needs}</div>
      )}
      <h3 id={titleId} className={cn('m-0 text-body leading-[1.4] font-medium', onDismiss && !done && 'pr-8')}>
        {title}
      </h3>
      {children != null && <div className={cn('text-small leading-[1.6]', 'text-fg-secondary')}>{children}</div>}
      {!done && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 pt-2">
          <Button size="sm" state={busy ? 'busy' : 'idle'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
          {secondaryLabel && (
            <Button variant="secondary" size="sm" onClick={onSecondary} disabled={busy}>
              {secondaryLabel}
            </Button>
          )}
          <span className="text-meta text-fg-secondary">{labels.footnote}</span>
        </div>
      )}
      {onDismiss && !done && <IconButton icon={X} label={labels.dismiss} size="sm" onClick={onDismiss} disabled={busy} className="absolute top-2.5 right-2.5" />}
    </section>
  );
}

export type HandOverProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** idle: the button · busy: creating the task · done: the system line. @default "idle" */
  state?: 'idle' | 'busy' | 'done' | undefined;
  onHandOver: () => void;
  /** Once done: T-128. */
  taskId?: string | undefined;
  /** Once done: who has it. */
  assignee?: string | undefined;
  labels?: Partial<{ handOver: string; handed: (taskId: string, assignee: string | undefined) => string }> | undefined;
};

/**
 * HandOver — every answer can go to the team: "Hand to the team" becomes a
 * task, and a system line records it ("Task T-128 created · handed to Sam
 * Ortiz"). Replies still appear in this conversation.
 */
export function HandOver({ state = 'idle', onHandOver, taskId, assignee, labels, className, ...rest }: HandOverProps) {
  const handed = labels?.handed ?? ((id: string, who: string | undefined) => (who ? `Task ${id} created · handed to ${who}` : `Task ${id} created`));
  if (state === 'done' && taskId) {
    return (
      <SystemLine icon={<SquareCheck size={13} strokeWidth={1.75} aria-hidden />} className={className} {...rest}>
        {handed(taskId, assignee)}
      </SystemLine>
    );
  }
  return (
    <div className={cn('flex', className)} {...rest}>
      <Button variant="secondary" size="sm" iconLeft={<UserRoundPlus size={14} strokeWidth={1.75} aria-hidden />} state={state === 'busy' ? 'busy' : 'idle'} onClick={onHandOver}>
        {labels?.handOver ?? 'Hand to the team'}
      </Button>
    </div>
  );
}
