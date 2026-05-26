import { useContext } from "react";
import { DialogsContext } from "./dialogs-context";

export function useDialogs() {
  const ctx = useContext(DialogsContext);
  if (!ctx) throw new Error("useDialogs must be used within <DialogsProvider>");
  return ctx;
}
