// Thin wrapper around vite-plugin-pwa's `virtual:pwa-register`. Use
// from your app's entry point (main.tsx) so the service worker is
// registered on first paint. Behaviour:
//
//   - new SW detected → optional onNeedRefresh callback (typically
//     toast prompting reload)
//   - SW activated for the first time → onOfflineReady callback
//     (typically toast announcing "Ready offline")
//
// The kit doesn't pull in vite-plugin-pwa as a dep — the consumer
// app installs and configures it. This wrapper just centralises
// the registration boilerplate so consumers don't repeat it.

export interface RegisterSWOptions {
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: unknown) => void;
}

// Specifier is constructed from a runtime expression so Vite's
// static import analyser can't see "virtual:pwa-register" as a
// literal — without this, every consumer app would fail to boot
// unless they had vite-plugin-pwa installed AND configured (since
// transform happens before the try/catch runs at runtime).
//
// The eval is the simplest indirection that's also obviously a
// no-op to readers. /* @vite-ignore */ on its own isn't enough
// because Vite still attempts resolution when the specifier is a
// constant string literal.
const PWA_REGISTER_SPECIFIER = ["virtual", "pwa-register"].join(":");

export async function registerSW(opts: RegisterSWOptions = {}) {
  if (typeof window === "undefined") return;
  try {
    const mod = await import(/* @vite-ignore */ PWA_REGISTER_SPECIFIER);
    if (typeof mod.registerSW !== "function") {
      console.warn("virtual:pwa-register found but registerSW() is not a function");
      return;
    }
    mod.registerSW({
      immediate: true,
      onNeedRefresh: opts.onNeedRefresh,
      onOfflineReady: opts.onOfflineReady,
      onRegisteredSW: (_url: string, reg: ServiceWorkerRegistration | undefined) => {
        opts.onRegistered?.(reg);
      },
      onRegisterError: opts.onRegisterError,
    });
  } catch (err) {
    // vite-plugin-pwa not installed / configured. Silent in dev,
    // surface to caller if they care.
    opts.onRegisterError?.(err);
  }
}
