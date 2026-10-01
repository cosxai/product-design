import { Button, PulseDot, cn } from '@cosxai/ui';
import { useEffect, useRef, type ComponentProps, type ReactNode } from 'react';

import { AgentAvatar, AttachmentChip, PersonAvatar, TextButton } from './parts';

/** Body type of an answer: 15/1.7, Chinese 16/1.8. */
export const bodyText = 'text-body leading-[1.7] [&:lang(zh)]:text-[16px] [&:lang(zh)]:leading-[1.8]';

/**
 * Conversation — the column of messages, system lines and cards. A live
 * log: new messages are announced politely. The portal page and the Ops
 * Agent drawer both use it.
 */
export function Conversation({ className, ...rest }: ComponentProps<'div'>) {
  return <div role="log" className={cn('flex flex-col gap-6 font-sans text-fg', className)} {...rest} />;
}

export type MessageAttachment = { id?: string | undefined; name: string; size?: number | undefined };

export type UserMessageProps = ComponentProps<'div'> & {
  /** Files sent with the message; they sit above the bubble. */
  attachments?: MessageAttachment[] | undefined;
};

/** UserMessage — the user's words: a linen bubble, right-aligned, 75% wide at most. */
export function UserMessage({ attachments, className, children, ...rest }: UserMessageProps) {
  return (
    <div className={cn('flex flex-col items-end gap-2', className)} {...rest}>
      {attachments && attachments.length > 0 && (
        <div className="flex max-w-[75%] flex-wrap justify-end gap-1.5">
          {attachments.map((a) => (
            <AttachmentChip key={a.id ?? a.name} name={a.name} size={a.size} />
          ))}
        </div>
      )}
      <div className={cn('max-w-[75%] rounded-lg bg-sunk px-4 py-3 break-words whitespace-pre-wrap text-fg', bodyText, 'leading-[1.6]')}>{children}</div>
    </div>
  );
}

export type AgentMessageState = 'done' | 'thinking' | 'writing' | 'stopped' | 'failed' | 'out-of-scope';

export type AgentMessageLabels = {
  /** @default "Esc to stop" */
  escToStop: string;
  /** @default "Stopped by you" */
  stopped: string;
  /** @default "Continue" */
  continue: string;
  /** @default "Retry" */
  retry: string;
  /** @default "Continue without it" */
  skip: string;
  /** @default "Ask the team instead" */
  askTeam: string;
  /** Screen-reader name of the Agent. @default "Agent" */
  agent: string;
};

const AGENT_LABELS: AgentMessageLabels = {
  escToStop: 'Esc to stop',
  stopped: 'Stopped by you',
  continue: 'Continue',
  retry: 'Retry',
  skip: 'Continue without it',
  askTeam: 'Ask the team instead',
  agent: 'Agent',
};

export type AgentMessageProps = ComponentProps<'article'> & {
  /** @default "done" */
  state?: AgentMessageState | undefined;
  /** <AgentSteps>, above the answer. */
  steps?: ReactNode;
  /** thinking: what it is doing now ("Reading 3 documents…"). */
  activity?: ReactNode;
  /** thinking: a grey line under the activity (Searching “family trust” in …). */
  activityDetail?: ReactNode;
  /** writing: Esc (anywhere on the page) or "Esc to stop" calls this. */
  onStop?: (() => void) | undefined;
  /** stopped: Continue. */
  onContinue?: (() => void) | undefined;
  /** failed: which step failed and why ("Couldn't read Cap table.xlsx: the file is password protected."). */
  error?: ReactNode;
  /** failed: Retry. */
  onRetry?: (() => void) | undefined;
  /** failed: Continue without it. */
  onSkip?: (() => void) | undefined;
  /** out-of-scope: Ask the team instead. */
  onAskTeam?: (() => void) | undefined;
  /** Under the answer: its action row, result cards, confirmation cards, Hand to the team. */
  footer?: ReactNode;
  labels?: Partial<AgentMessageLabels> | undefined;
  /** Who is answering, in the gutter: `<MetaAvatar state={…} size={30} track={false} />`, its state
   *  following the answer. Decorative — the article is labelled. @default AgentAvatar */
  avatar?: ReactNode;
};

/**
 * AgentMessage — an answer. No bubble: it sits on the page beside the ink
 * tile. The body is any node (the host renders markdown). States: thinking
 * (pulse + what it is doing), writing (streamed, Esc stops), stopped (kept,
 * can continue), failed (which step, why, a way on), out-of-scope (what it
 * can see, and Ask the team).
 */
export function AgentMessage({
  state = 'done',
  steps,
  activity,
  activityDetail,
  onStop,
  onContinue,
  error,
  onRetry,
  onSkip,
  onAskTeam,
  footer,
  labels: labelsProp,
  avatar,
  className,
  children,
  ...rest
}: AgentMessageProps) {
  const labels = { ...AGENT_LABELS, ...labelsProp };
  const writing = state === 'writing';

  // Esc stops the answer from anywhere on the page. Capture phase and
  // preventDefault, so the Agent drawer (which closes on Esc) stays open;
  // an open slash menu keeps its own Esc.
  const stopRef = useRef(onStop);
  stopRef.current = onStop;
  useEffect(() => {
    if (!writing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented || !stopRef.current) return;
      if (e.target instanceof Element && e.target.closest('[data-slash-open]')) return;
      if (document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"], [role="menu"]')) return;
      e.preventDefault();
      stopRef.current();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [writing]);

  return (
    <article
      aria-label={labels.agent}
      aria-busy={state === 'thinking' || writing || undefined}
      className={cn('grid grid-cols-[auto_minmax(0,1fr)] gap-x-3.5', className)}
      {...rest}
    >
      <div aria-hidden className="flex min-w-7 justify-center self-start">
        {avatar ?? <AgentAvatar />}
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        {steps}
        {state === 'thinking' && (
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center gap-2.5 text-ui font-medium">
              <PulseDot />
              <span>{activity}</span>
            </div>
            {activityDetail && <div className="pl-[19px] text-small text-fg-secondary">{activityDetail}</div>}
          </div>
        )}
        {children != null && children !== false && (
          <div className={cn(bodyText, 'min-w-0 break-words', state === 'stopped' && 'text-fg-secondary', state !== 'thinking' && !steps && 'pt-0.5')}>
            {children}
            {writing && <span aria-hidden className="ml-0.5 inline-block h-[1.1em] w-[1.5px] translate-y-[3px] animate-pulse bg-fg" />}
          </div>
        )}
        {writing && (
          <div>
            <button
              type="button"
              onClick={onStop}
              disabled={!onStop}
              className="cursor-pointer rounded-xs text-meta text-fg-secondary outline-none hover:text-fg focus-visible:shadow-(--focus-ring) disabled:cursor-default"
            >
              {labels.escToStop}
            </button>
          </div>
        )}
        {state === 'stopped' && (
          <div className="flex items-center gap-2 text-meta text-fg-secondary">
            <span>{labels.stopped}</span>
            {onContinue && <TextButton onClick={onContinue}>{labels.continue}</TextButton>}
          </div>
        )}
        {state === 'failed' && (
          <div className="flex flex-col items-start gap-2.5">
            {error && (
              <div role="alert" className="rounded-md bg-error-wash px-3 py-2.5 text-small leading-[1.5] text-ink">
                {error}
              </div>
            )}
            {(onRetry || onSkip) && (
              <div className="flex flex-wrap items-center gap-2">
                {onRetry && (
                  <Button variant="secondary" size="sm" onClick={onRetry}>
                    {labels.retry}
                  </Button>
                )}
                {onSkip && (
                  <Button variant="ghost" size="sm" onClick={onSkip}>
                    {labels.skip}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
        {state === 'out-of-scope' && onAskTeam && (
          <div className="text-meta">
            <TextButton onClick={onAskTeam}>{labels.askTeam}</TextButton>
          </div>
        )}
        {footer}
      </div>
    </article>
  );
}

export type StaffMessageProps = ComponentProps<'article'> & {
  /** Sam Ortiz */
  name: string;
  /** The organisation tag (COSX). */
  org?: ReactNode;
  /** 10:12 */
  time?: ReactNode;
};

/** StaffMessage — a person on the team replying in the conversation. Same side as the Agent, told apart by a real avatar and the org tag. */
export function StaffMessage({ name, org, time, className, children, ...rest }: StaffMessageProps) {
  return (
    <article aria-label={name} className={cn('grid grid-cols-[28px_minmax(0,1fr)] gap-x-3.5', className)} {...rest}>
      <PersonAvatar name={name} />
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-1.5 text-meta text-fg-secondary">
          <span className="text-small font-medium text-fg">{name}</span>
          {org && <span className="rounded-xs bg-sunk px-1 py-px text-[11px] font-semibold tracking-[0.02em] text-fg">{org}</span>}
          {time && <span>· {time}</span>}
        </div>
        <div className={cn(bodyText, 'min-w-0 break-words')}>{children}</div>
      </div>
    </article>
  );
}
