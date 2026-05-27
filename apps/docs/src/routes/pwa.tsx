import { InstallPromptBanner } from "@cosxai/ui";

export function PwaPage() {
  return (
    <>
      <h1>PWA scaffolding</h1>
      <p className="docs-summary">
        The kit ships the install prompt UI, a service-worker
        registration helper, and a manifest template. The actual
        plugin (<code>vite-plugin-pwa</code>) and your brand assets
        (icons, splash images) are consumer-supplied — the kit is
        deliberately unopinionated about both.
      </p>

      <h2>1. Install the plugin</h2>
      <pre><code>{`pnpm add -D vite-plugin-pwa`}</code></pre>

      <h2>2. Configure vite.config.ts</h2>
      <pre><code>{`import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        // Copy from @cosxai/ui's manifest.template.json,
        // fill in your name / colours / icon paths.
        name: "Your App Name",
        short_name: "AppName",
        theme_color: "#0B0D12",
        background_color: "#0B0D12",
        display: "standalone",
        orientation: "portrait",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});`}</code></pre>

      <h2>3. Register the service worker</h2>
      <p>
        From your app's entry point (<code>main.tsx</code>):
      </p>
      <pre><code>{`import { registerSW, useDialogs } from "@cosxai/ui";

// Inside a top-level component where useDialogs() is available,
// or call registerSW() with your own callbacks.
registerSW({
  onOfflineReady: () => toast({ kind: "success", message: "Ready offline." }),
  onNeedRefresh: () => toast({ kind: "info", message: "Update available — refresh." }),
});`}</code></pre>
      <p>
        The helper dynamically imports{" "}
        <code>virtual:pwa-register</code> so the kit itself doesn't
        depend on vite-plugin-pwa. If the plugin isn't configured,
        the call is a silent no-op.
      </p>

      <h2>4. Generate icons + splash images</h2>
      <p>
        Use <code>pwa-asset-generator</code> against a single source
        SVG / PNG — it produces every iOS / Android / favicon
        permutation including the apple-touch-startup-images that
        give iOS a proper PWA splash screen.
      </p>
      <pre><code>{`npx pwa-asset-generator ./brand-source.svg ./public \\
  --background "#0B0D12" \\
  --opaque false \\
  --maskable false \\
  --favicon \\
  --html ./index.html`}</code></pre>
      <p>
        It rewrites <code>index.html</code> with the right{" "}
        <code>&lt;link rel="apple-touch-startup-image"&gt;</code>{" "}
        chain — that's the only way to get a native-feeling splash
        on iOS (manifest splash settings are ignored by Safari).
      </p>

      <h2>5. Install prompt banner</h2>
      <p>
        Drop <code>&lt;InstallPromptBanner /&gt;</code> anywhere in
        your tree. It listens for{" "}
        <code>beforeinstallprompt</code>, renders a dismissable
        bottom banner when the browser is willing to install, and
        triggers the prompt on click. Dismissal persists in
        localStorage so it doesn't nag.
      </p>
      <pre><code>{`<InstallPromptBanner
  title="Install Metaroom"
  message="Add to your home screen for offline access + a faster shell."
/>`}</code></pre>
      <p>
        Live on this page (only renders if the browser fires
        <code>beforeinstallprompt</code> — typically Chromium on a
        served domain, not localhost):
      </p>
      <InstallPromptBanner
        title="Install @cosxai/ui docs"
        message="Demo of the kit's banner — only shows on a real PWA-eligible page."
      />
      <p style={{ fontSize: 13, color: "var(--ck-text-tertiary)" }}>
        iOS Safari doesn't fire <code>beforeinstallprompt</code>.
        For that platform, detect it and render your own "Tap
        share → Add to Home Screen" instructions instead.
      </p>

      <h2>What the kit doesn't ship</h2>
      <ul style={{ font: "400 14px/1.7 var(--ck-font-sans)", color: "var(--ck-text-secondary)" }}>
        <li>The vite-plugin-pwa dependency itself (you choose the version)</li>
        <li>Icon / splash source images (brand-specific)</li>
        <li>Service worker caching strategies (workbox config is per-app)</li>
        <li>Offline data sync (no opinion — Dexie, RxDB, etc.)</li>
      </ul>
    </>
  );
}
