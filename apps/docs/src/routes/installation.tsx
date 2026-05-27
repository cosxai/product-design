export function InstallationPage() {
  return (
    <>
      <h1>Installation</h1>
      <p className="docs-summary">
        Internal-only for now. Consume via the workspace or copy
        source files directly — both supported.
      </p>

      <h2>1. Workspace (during development)</h2>
      <p>
        Inside this monorepo, the docs app imports the library through
        pnpm's workspace protocol:
      </p>
      <pre><code>{`// apps/docs/package.json
"dependencies": {
  "@cosxai/ui": "workspace:*"
}`}</code></pre>

      <h2>2. Copy source files (shadcn-style)</h2>
      <p>
        When you've graduated the kit to its own repo, pull individual
        components into a consumer project by copying them under{" "}
        <code>src/components/ui/</code>. The kit avoids opinionated
        bundling so each file is paste-friendly.
      </p>

      <h2>3. Required peer deps</h2>
      <pre><code>{`pnpm add react@^19 react-dom@^19`}</code></pre>

      <h2>4. Import the stylesheet</h2>
      <p>One CSS import at your app root pulls in fonts, tokens, and base.</p>
      <pre><code>{`// main.tsx
import "@cosxai/ui/styles.css";`}</code></pre>

      <h2>5. Wrap in &lt;ThemeProvider&gt;</h2>
      <pre><code>{`import { ThemeProvider } from "@cosxai/ui";

createRoot(root).render(
  <ThemeProvider defaultTheme="system">
    <App />
  </ThemeProvider>,
);`}</code></pre>

      <h2>6. Add the pre-mount script (optional, recommended)</h2>
      <p>
        Drop this inline in <code>index.html</code>'s <code>&lt;head&gt;</code>{" "}
        so dark sessions don't flash white during React hydration:
      </p>
      <pre><code>{`<script>
  (function(){try{
    var t=localStorage.getItem("ck-theme");
    if(t!=="light"&&t!=="dark")
      t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
    document.documentElement.setAttribute("data-ck-theme",t);
  }catch(e){}})();
</script>`}</code></pre>
      <p>
        The kit also exports <code>getInlineThemeScript()</code> which
        returns this string — useful in SSR or build-time HTML
        generation.
      </p>
    </>
  );
}
