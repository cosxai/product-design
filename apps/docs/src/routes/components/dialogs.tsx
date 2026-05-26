import { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, useDialogs } from "@cosx/ui";

export function DialogsPage() {
  const { confirm, prompt, toast } = useDialogs();
  const [customOpen, setCustomOpen] = useState(false);

  return (
    <>
      <h1>Modals + Dialogs</h1>
      <p className="docs-summary">
        Two layers. <code>&lt;Modal&gt;</code> is the low-level
        primitive — portal + backdrop + slots — for any custom
        full-screen overlay. <code>useDialogs()</code> wraps the most
        common three (confirm / prompt / toast) into an imperative
        Promise-based API so call sites flow naturally without
        managing local open state.
      </p>

      <h2>useDialogs — confirm</h2>
      <div
        style={{
          padding: 16,
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
          borderRadius: "var(--ck-radius-md)",
          marginBottom: 16,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="secondary"
          onClick={async () => {
            const ok = await confirm({
              title: "Discard changes?",
              message:
                "You have unsaved edits. Discarding will lose them.",
              confirmLabel: "Discard",
              danger: true,
            });
            toast({
              kind: ok ? "info" : "info",
              message: ok ? "Discarded." : "Cancelled.",
            });
          }}
        >
          Confirm (danger)
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            const ok = await confirm({
              title: "Delete repository?",
              message: "This is irreversible.",
              confirmationText: "delete",
              confirmLabel: "Delete",
              danger: true,
            });
            toast({
              kind: ok ? "error" : "info",
              message: ok ? "Deleted." : "Cancelled.",
            });
          }}
        >
          Confirm (typed)
        </Button>
      </div>

      <h2>useDialogs — prompt</h2>
      <div
        style={{
          padding: 16,
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
          borderRadius: "var(--ck-radius-md)",
          marginBottom: 16,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="secondary"
          onClick={async () => {
            const name = await prompt({
              title: "Set your name",
              message: "This is shown on every comment you post.",
              placeholder: "e.g. Ben Z",
            });
            if (name) toast({ kind: "success", message: `Hello, ${name}.` });
          }}
        >
          Prompt
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            const email = await prompt({
              title: "Invite by email",
              placeholder: "name@cosx.co",
              validate: (v) =>
                /.+@.+\..+/.test(v) ? null : "That's not a valid address.",
            });
            if (email) toast({ kind: "success", message: `Invited ${email}.` });
          }}
        >
          Prompt (validated)
        </Button>
      </div>

      <h2>useDialogs — toast</h2>
      <div
        style={{
          padding: 16,
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
          borderRadius: "var(--ck-radius-md)",
          marginBottom: 16,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="ghost"
          onClick={() => toast({ kind: "info", message: "Saved." })}
        >
          Info toast
        </Button>
        <Button
          variant="ghost"
          onClick={() => toast({ kind: "success", message: "Invite sent." })}
        >
          Success toast
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            toast({ kind: "error", message: "Network error. Try again." })
          }
        >
          Error toast
        </Button>
      </div>
      <p style={{ fontSize: 13, color: "var(--ck-text-tertiary)" }}>
        Auto-dismiss after 4 s by default. Click a toast to dismiss
        early. Stack grows upward from the bottom-right corner.
      </p>

      <h2>Modal — raw primitive</h2>
      <p>
        For dialogs that don't fit confirm/prompt (multi-field forms,
        configuration sheets, file pickers), build directly on{" "}
        <code>&lt;Modal&gt;</code>.
      </p>
      <Button variant="secondary" onClick={() => setCustomOpen(true)}>
        Open custom modal
      </Button>
      <Modal open={customOpen} onClose={() => setCustomOpen(false)}>
        <ModalHeader
          title="Custom modal"
          subtitle="Backed by the <Modal> primitive — portal, backdrop, Esc, click-outside."
          onClose={() => setCustomOpen(false)}
        />
        <ModalBody>
          <p style={{ margin: "0 0 12px", color: "var(--ck-text-secondary)" }}>
            Body content scrolls when it overflows. The footer below
            stays pinned.
          </p>
          {Array.from({ length: 15 }).map((_, i) => (
            <p
              key={i}
              style={{ margin: "8px 0", color: "var(--ck-text-tertiary)", fontSize: 13 }}
            >
              Filler line {i + 1}
            </p>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setCustomOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setCustomOpen(false)}>
            Done
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
