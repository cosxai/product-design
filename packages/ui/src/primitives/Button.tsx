import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

// Minimal Phase-0 stub so the docs app has something concrete to
// import — proves the workspace bridge + hot-reload. Phase 3
// replaces this with the full variant + size + loading-state
// implementation backed by the .rd-btn styles.

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn("ck-btn", `ck-btn--${variant}`, className)}
    >
      {children}
    </button>
  );
}
