import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { DialogsContext } from "./dialogs-context";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";
import { Button } from "../primitives/Button";
import { Input } from "../primitives/Input";
import { ToastStack, type ToastItem } from "./Toast";
import type {
  ConfirmOptions,
  PromptOptions,
  ToastOptions,
  DialogsApi,
} from "./types";

// Single mount point. Hosts the imperative confirm/prompt/toast
// API used by useDialogs(). Promise-based so call sites flow
// naturally:
//
//   const ok = await dialogs.confirm({ title: "Delete?", danger: true });
//   if (!ok) return;
//   await api.deleteThing();
//
// Toast queue handles its own dismiss timer (see Toast.tsx).

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}
interface PromptState extends PromptOptions {
  resolve: (value: string | null) => void;
}

export function DialogsProvider({ children }: { children: ReactNode }) {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [promptState, setPromptState] = useState<PromptState | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);

  const confirm = useCallback(
    (opts: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setConfirmState({ ...opts, resolve });
      }),
    [],
  );

  const prompt = useCallback(
    (opts: PromptOptions) =>
      new Promise<string | null>((resolve) => {
        setPromptState({ ...opts, resolve });
      }),
    [],
  );

  const toast = useCallback((opts: ToastOptions) => {
    const id = ++toastIdRef.current;
    setToasts((t) => [...t, { ...opts, id }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const api = useMemo<DialogsApi>(
    () => ({ confirm, prompt, toast }),
    [confirm, prompt, toast],
  );

  return (
    <DialogsContext.Provider value={api}>
      {children}
      {confirmState && (
        <ConfirmDialog
          state={confirmState}
          onDone={(v) => {
            confirmState.resolve(v);
            setConfirmState(null);
          }}
        />
      )}
      {promptState && (
        <PromptDialog
          state={promptState}
          onDone={(v) => {
            promptState.resolve(v);
            setPromptState(null);
          }}
        />
      )}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </DialogsContext.Provider>
  );
}

// ---------- Confirm dialog ----------

function ConfirmDialog({
  state,
  onDone,
}: {
  state: ConfirmState;
  onDone: (value: boolean) => void;
}) {
  const [typed, setTyped] = useState("");
  const needsTyped = !!state.confirmationText;
  const canConfirm =
    !needsTyped ||
    typed.trim().toLowerCase() === state.confirmationText!.trim().toLowerCase();
  return (
    <Modal open onClose={() => onDone(false)}>
      <ModalHeader title={state.title} onClose={() => onDone(false)} />
      {(state.message || needsTyped) && (
        <ModalBody>
          {state.message && (
            <div
              style={{
                font: "400 14px/1.5 var(--ck-font-sans)",
                color: "var(--ck-text-secondary)",
              }}
            >
              {state.message}
            </div>
          )}
          {needsTyped && (
            <div style={{ marginTop: 16 }}>
              <Input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder={state.confirmationText}
                helper={`Type "${state.confirmationText}" to confirm.`}
              />
            </div>
          )}
        </ModalBody>
      )}
      <ModalFooter>
        <Button variant="ghost" onClick={() => onDone(false)}>
          {state.cancelLabel ?? "Cancel"}
        </Button>
        <Button
          variant="primary"
          onClick={() => onDone(true)}
          disabled={!canConfirm}
          style={
            state.danger
              ? {
                  background: "var(--ck-critical)",
                  color: "var(--ck-text-inverse)",
                }
              : undefined
          }
        >
          {state.confirmLabel ?? "Confirm"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// ---------- Prompt dialog ----------

function PromptDialog({
  state,
  onDone,
}: {
  state: PromptState;
  onDone: (value: string | null) => void;
}) {
  const [value, setValue] = useState(state.defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const submit = () => {
    const err = state.validate?.(value);
    if (err) {
      setError(err);
      return;
    }
    onDone(value);
  };
  return (
    <Modal open onClose={() => onDone(null)}>
      <ModalHeader title={state.title} onClose={() => onDone(null)} />
      <ModalBody>
        {state.message && (
          <div
            style={{
              font: "400 14px/1.5 var(--ck-font-sans)",
              color: "var(--ck-text-secondary)",
              marginBottom: 12,
            }}
          >
            {state.message}
          </div>
        )}
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder={state.placeholder}
          error={error}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          autoFocus
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={() => onDone(null)}>
          {state.cancelLabel ?? "Cancel"}
        </Button>
        <Button variant="primary" onClick={submit}>
          {state.confirmLabel ?? "OK"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
