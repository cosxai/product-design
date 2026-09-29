import { KeyRound } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

import { Button } from './Button';
import { Dialog, DialogClose, DialogContent } from './Dialog';
import { Icon } from './Icon';
import { Input } from './Input';
import { useButtonAction } from './useButtonAction';

function errorText(e: unknown): string {
  if (e instanceof Error) return e.message;
  return typeof e === 'string' ? e : 'Something went wrong. Try again.';
}

type Base = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A question or an action: "Revoke this share and 4 forwards?" */
  title: ReactNode;
  /** The consequence, in plain words: "Anna and the 4 people she forwarded it to lose access now." */
  description?: ReactNode;
  /** @default "Cancel" */
  cancelLabel?: string | undefined;
};

export type ConfirmDialogProps = Base & {
  /** The primary repeats the verb: "Revoke share", never "OK". */
  confirmLabel: string;
  /** Destructive: the primary is the red button. */
  destructive?: boolean | undefined;
  /** Type-to-confirm: the primary stays off until this word is typed (for what can't be undone at scale). */
  confirmWord?: string | undefined;
  /** Label of the type-to-confirm input. @default `Type ${confirmWord} to confirm` */
  confirmWordLabel?: ReactNode;
  /** Runs on confirm. While it runs the primary is busy; on success the dialog closes; a failure is shown in place. */
  onConfirm: () => Promise<unknown> | unknown;
};

/**
 * ConfirmDialog — a destructive or weighty action, confirmed before it
 * happens (never undone after the fact). The primary names the action;
 * with confirmWord the person types it first. Failures stay in the dialog.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel,
  destructive = false,
  confirmWord,
  confirmWordLabel,
  onConfirm,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState('');
  const action = useButtonAction(async () => {
    await onConfirm();
    onOpenChange(false);
  });
  useEffect(() => {
    if (!open) setTyped('');
  }, [open]);
  const armed = !confirmWord || typed.trim().toLowerCase() === confirmWord.toLowerCase();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="sm"
        title={title}
        description={description}
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </DialogClose>
            <Button
              variant={destructive ? 'danger' : 'primary'}
              disabled={!armed}
              state={action.state === 'done' ? 'busy' : action.state}
              onClick={() => void action.run()}
            >
              {confirmLabel}
            </Button>
          </>
        }
      >
        {confirmWord && (
          <Input
            label={confirmWordLabel ?? `Type ${confirmWord} to confirm`}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
        )}
        {action.error !== null && (
          <p role="alert" className="mt-3 mb-0 text-small text-error-text">
            {errorText(action.error)}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export type PromptDialogProps = Base & {
  /** The field's label: "Folder name". */
  label: ReactNode;
  defaultValue?: string | undefined;
  /** "Rename", "Create folder". */
  confirmLabel: string;
  /** Return the problem in words, or null when fine. Checked on submit and then as they type. */
  validate?: ((value: string) => string | null) | undefined;
  /** Receives the trimmed value. Busy while it runs; closes on success; a failure shows under the field. */
  onSubmit: (value: string) => Promise<unknown> | unknown;
};

/** PromptDialog — one value asked for (rename, new folder). The current
 *  value is selected on open so typing replaces it; Enter submits. */
export function PromptDialog({ open, onOpenChange, title, description, cancelLabel = 'Cancel', label, defaultValue = '', confirmLabel, validate, onSubmit }: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const [problem, setProblem] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const input = useRef<HTMLInputElement | null>(null);
  const formId = useId();
  const action = useButtonAction(async (v: string) => {
    await onSubmit(v);
    onOpenChange(false);
  });

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      setProblem(null);
      setTouched(false);
    }
  }, [open, defaultValue]);

  const check = (v: string) => validate?.(v.trim()) ?? (v.trim() ? null : 'Enter a name.');
  const shownError = problem ?? (action.error !== null ? errorText(action.error) : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="sm"
        title={title}
        description={description}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          input.current?.focus();
          input.current?.select();
        }}
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </DialogClose>
            <Button type="submit" form={formId} state={action.state === 'done' ? 'busy' : action.state}>
              {confirmLabel}
            </Button>
          </>
        }
      >
        <form
          id={formId}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            const p = check(value);
            setProblem(p);
            if (!p) void action.run(value.trim());
          }}
        >
          <Input
            ref={input}
            label={label}
            value={value}
            error={shownError ?? undefined}
            onChange={(e) => {
              setValue(e.target.value);
              if (touched) setProblem(check(e.target.value));
            }}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export type StepUpDialogProps = Omit<Base, 'title'> & {
  /** @default "Confirm it's you" */
  title?: ReactNode;
  /** @default "Use passkey" */
  passkeyLabel?: string | undefined;
  /** @default "Use authenticator code instead" */
  codeLabel?: string | undefined;
  /** @default "Authenticator code" */
  codeFieldLabel?: ReactNode;
  /** @default "Confirm" */
  confirmLabel?: string | undefined;
  /** Starts the passkey ceremony; resolves when verified (the dialog closes), throws to show why not. */
  onPasskey: () => Promise<unknown>;
  /** Checks a 6-digit authenticator code; resolves when verified, throws to show why not. Omit when there is no authenticator. */
  onCode?: ((code: string) => Promise<unknown>) | undefined;
};

/** StepUpDialog — a fresh check before a sensitive action (deleting a
 *  workspace): passkey first, an authenticator code as the alternative.
 *  UI only — the ceremony is the caller's. */
export function StepUpDialog({
  open,
  onOpenChange,
  title = "Confirm it's you",
  description,
  cancelLabel = 'Cancel',
  passkeyLabel = 'Use passkey',
  codeLabel = 'Use authenticator code instead',
  codeFieldLabel = 'Authenticator code',
  confirmLabel = 'Confirm',
  onPasskey,
  onCode,
}: StepUpDialogProps) {
  const [useCode, setUseCode] = useState(false);
  const [code, setCode] = useState('');
  const passkey = useButtonAction(async () => {
    await onPasskey();
    onOpenChange(false);
  });
  const byCode = useButtonAction(async (c: string) => {
    await onCode?.(c);
    onOpenChange(false);
  });
  useEffect(() => {
    if (!open) {
      setUseCode(false);
      setCode('');
    }
  }, [open]);
  const err = useCode ? byCode.error : passkey.error;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="sm"
        title={title}
        description={description}
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </DialogClose>
            {useCode ? (
              <Button disabled={!/^\d{6}$/.test(code)} state={byCode.state === 'done' ? 'busy' : byCode.state} onClick={() => void byCode.run(code)}>
                {confirmLabel}
              </Button>
            ) : (
              <Button iconLeft={<Icon icon={KeyRound} />} state={passkey.state === 'done' ? 'busy' : passkey.state} onClick={() => void passkey.run()}>
                {passkeyLabel}
              </Button>
            )}
          </>
        }
      >
        {useCode ? (
          <Input
            label={codeFieldLabel}
            value={code}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            autoFocus
          />
        ) : (
          onCode && (
            <button
              type="button"
              onClick={() => setUseCode(true)}
              className="cursor-pointer border-0 bg-transparent p-0 font-sans text-small text-fg underline underline-offset-3 outline-none focus-visible:shadow-(--focus-ring)"
            >
              {codeLabel}
            </button>
          )
        )}
        {err !== null && (
          <p role="alert" className="mt-3 mb-0 text-small text-error-text">
            {errorText(err)}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
