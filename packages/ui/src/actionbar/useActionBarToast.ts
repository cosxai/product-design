import { useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { ActionBarContext } from "./actionbar-context";
import type { ReactNode } from "react";

// Push a transient bubble into the bar's toast slot — rendered above
// the bar (following it when dragged), themed via
// `.ck-actionbar-toast`, suppressed while the panel is open. The
// CONSUMER owns the lifetime: pass the node to show, `null` to hide
// (typically driven by a setTimeout in the consumer).
//
// RETURNS a ReactNode the consumer MUST render (a portal into the
// bar's toast container, or null while hidden). Same portal-host
// contract as useActionBarPanel: only the boolean "active" flag goes
// through context state, so a fresh JSX identity per render can't
// re-render-loop. Pairs with useActionBarPanel for the notification-
// center pattern (design#13).
export function useActionBarToast(content: ReactNode | null): ReactNode {
  const ctx = useContext(ActionBarContext);
  if (!ctx) {
    throw new Error("useActionBarToast must be used within <ActionBarProvider>");
  }
  const { setToastActive, toastHost } = ctx;
  const active = content != null;
  useEffect(() => {
    setToastActive(active);
    return () => {
      setToastActive(false);
    };
  }, [setToastActive, active]);
  if (!active || toastHost === null) return null;
  return createPortal(content, toastHost);
}
