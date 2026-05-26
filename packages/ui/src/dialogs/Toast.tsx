import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ToastOptions } from "./types";

interface ToastItem extends ToastOptions {
  id: number;
}

// Toast stack — fixed bottom-right corner. Each toast auto-dismisses
// after durationMs (default 4000). Stack grows upward.

const KIND_BG = {
  info: "var(--ck-bg-surface)",
  success: "var(--ck-success-muted)",
  error: "var(--ck-critical-muted)",
};
const KIND_BORDER = {
  info: "var(--ck-border-strong)",
  success: "var(--ck-success)",
  error: "var(--ck-critical)",
};
const KIND_TEXT = {
  info: "var(--ck-text-primary)",
  success: "var(--ck-success)",
  error: "var(--ck-critical)",
};

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  return createPortal(
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 110,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 360,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <ToastRow key={t.id} item={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>,
    document.body,
  );
}

function ToastRow({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const kind = item.kind ?? "info";
  const duration = item.durationMs ?? 4000;
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);
  return (
    <div
      className="ck-anim-slide-left"
      style={{
        pointerEvents: "auto",
        padding: "12px 14px",
        background: KIND_BG[kind],
        border: `1px solid ${KIND_BORDER[kind]}`,
        borderRadius: "var(--ck-radius-md)",
        boxShadow: "var(--ck-shadow-2)",
        color: KIND_TEXT[kind],
        font: "400 13px/1.4 var(--ck-font-sans)",
        cursor: "pointer",
      }}
      onClick={onDismiss}
    >
      {item.message}
    </div>
  );
}

export type { ToastItem };
