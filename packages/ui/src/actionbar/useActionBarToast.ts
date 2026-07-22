import { useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { ActionBarContext } from "./actionbar-context";

// Push a transient bubble into the bar's toast slot — rendered above
// the bar (following it when dragged), themed via
// `.ck-actionbar-toast`. The CONSUMER owns the lifetime: pass the
// node to show, `null` to hide (typically driven by a setTimeout in
// the consumer). Pairs with useActionBarPanel for the notification-
// center pattern (design#13).
export function useActionBarToast(content: ReactNode | null) {
  const ctx = useContext(ActionBarContext);
  if (!ctx) {
    throw new Error("useActionBarToast must be used within <ActionBarProvider>");
  }
  const { setToast } = ctx;
  useEffect(() => {
    setToast(content ?? null);
    return () => {
      setToast(null);
    };
  }, [setToast, content]);
}
