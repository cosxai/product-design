import { useEffect, useState } from "react";
import { Button } from "../primitives/Button";

// Surfaces the browser's PWA install affordance — `beforeinstallprompt`
// is the Chromium-side hook that fires when a site qualifies for
// install. Without intervention browsers eventually suppress it; we
// catch the event, render a dismissable banner, and trigger the
// prompt only when the user clicks Install.
//
// Dismissal persists in localStorage so the banner doesn't reappear
// on every page load after the user said no thanks.
//
// iOS Safari doesn't fire beforeinstallprompt at all — for that
// platform you need to show your own "Tap share → Add to Home
// Screen" instructions. Detect via `iosSafari` prop or your own
// heuristic and render a different banner if needed.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface InstallPromptBannerProps {
  // Heading text.
  title?: string;
  // Body text below the heading.
  message?: string;
  installLabel?: string;
  dismissLabel?: string;
  // localStorage key for the dismissal flag.
  storageKey?: string;
  // Called after the user installs (accepted) or dismisses.
  onResolve?: (outcome: "accepted" | "dismissed") => void;
}

export function InstallPromptBanner({
  title = "Install this app",
  message = "Add it to your home screen for a faster, full-screen experience.",
  installLabel = "Install",
  dismissLabel = "Not now",
  storageKey = "ck-install-prompt-dismissed",
  onResolve,
}: InstallPromptBannerProps) {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem(storageKey) === "1";
  });

  useEffect(() => {
    if (dismissed) return;
    const onBefore = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBefore);
    return () => window.removeEventListener("beforeinstallprompt", onBefore);
  }, [dismissed]);

  const dismiss = () => {
    window.localStorage.setItem(storageKey, "1");
    setDismissed(true);
    setEvt(null);
    onResolve?.("dismissed");
  };

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    const choice = await evt.userChoice;
    setEvt(null);
    if (choice.outcome === "accepted") {
      window.localStorage.setItem(storageKey, "1");
      setDismissed(true);
    }
    onResolve?.(choice.outcome);
  };

  if (dismissed || !evt) return null;

  return (
    <div
      role="region"
      aria-label="Install app"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: `calc(16px + var(--ck-tabbar-height, 0px))`,
        zIndex: 90,
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
        background: "var(--ck-bg-surface)",
        border: "1px solid var(--ck-border-subtle)",
        borderRadius: "var(--ck-radius-md)",
        boxShadow: "var(--ck-shadow-2)",
        padding: "14px 16px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        fontFamily: "var(--ck-font-sans)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            font: "500 14px/1.3 var(--ck-font-sans)",
            color: "var(--ck-text-primary)",
            marginBottom: 2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            font: "400 12px/1.4 var(--ck-font-sans)",
            color: "var(--ck-text-tertiary)",
          }}
        >
          {message}
        </div>
      </div>
      <Button variant="ghost" onClick={dismiss}>
        {dismissLabel}
      </Button>
      <Button variant="primary" onClick={install}>
        {installLabel}
      </Button>
    </div>
  );
}
