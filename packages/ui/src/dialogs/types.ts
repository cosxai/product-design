import type { ReactNode } from "react";

export interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  // Renders the confirm button as the critical tone.
  danger?: boolean;
  // When set, the user must type this string into a confirmation
  // field before confirm is enabled. Case-insensitive.
  confirmationText?: string;
}

export interface PromptOptions {
  title: string;
  message?: ReactNode;
  defaultValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  // Returning a string treats it as a validation error message;
  // returning null/undefined accepts the input.
  validate?: (value: string) => string | null | undefined;
}

export interface ToastOptions {
  kind?: "info" | "success" | "error";
  message: ReactNode;
  durationMs?: number;
}

export interface DialogsApi {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  prompt: (opts: PromptOptions) => Promise<string | null>;
  toast: (opts: ToastOptions) => void;
}
