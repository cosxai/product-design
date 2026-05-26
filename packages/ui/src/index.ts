// Entry point — re-exports everything consumers need.
// Components, hooks, theme, and helpers are organised under
// /primitives, /layout, /actionbar, /command, /dialogs, /hooks,
// /theme, /pwa, /lib. As the kit grows, each phase adds exports
// here. Consumers pull individual modules (`import { Button }
// from "@cosx/ui"`) or copy source files directly per the
// shadcn-style distribution model.

export * from "./primitives";
export * from "./lib/cn";
export * from "./lib/time-utils";
export * from "./theme";
export * from "./hooks";
export * from "./layout";
export * from "./dialogs";
export * from "./actionbar";
export * from "./command";
export * from "./pwa";
export * from "./editorial";
export * from "./neobrutalism";
export * from "./ambient";
export * from "./terminal";
export * from "./bento";
export * from "./frutiger";
export * from "./riso";
export * from "./sketch";
