// design.cosx.co — the COSX Design System site.
//
// The pages are the Claude Design export, served unchanged from
// public/ (scripts/sync.mjs). This Worker only adds what a public site
// needs around them:
//   - clean URLs: /button serves Button.dc.html, / serves Home; a
//     browser navigating to an old file URL is redirected to its clean
//     one. The page runtime fetches its own and its partials' files
//     (Site Header.dc.html …) by file name, so those requests are
//     served as files, never redirected — only top-level navigations
//     (Sec-Fetch-Dest: document) are.
//   - a title, the site icon and the copyright notice on every page.
//   - /terms, the terms of use.

import pages from "./pages.json" with { type: "json" };

type Env = { ASSETS: Fetcher };

const HOME = "Home";
const SITE = "COSX Design System";

/** Button → button, "Pattern Action Bar" → pattern-action-bar. */
export function slugOf(page: string): string {
  return page.trim().toLowerCase().replace(/\s+/g, "-");
}

const bySlug = new Map(pages.map((p) => [slugOf(p), p]));

/** The clean path of a page ("/" for Home). */
export function pathOf(page: string): string {
  return page === HOME ? "/" : `/${slugOf(page)}`;
}

/** Which page a clean path names, if any. */
export function pageAt(pathname: string): string | undefined {
  const p = pathname.replace(/\/+$/, "");
  if (p === "") return HOME;
  if (!p.startsWith("/") || p.slice(1).includes("/")) return undefined;
  const page = bySlug.get(p.slice(1).toLowerCase());
  return page === HOME ? undefined : page; // Home lives at "/", not /home
}

/** The page an old file URL names (Button.dc.html), if any. */
export function pageOfFile(pathname: string): string | undefined {
  const m = decodeURIComponent(pathname).match(/^\/([^/]+)\.dc\.html$/);
  if (!m?.[1]) return undefined;
  return bySlug.get(slugOf(m[1]));
}

const LEGAL_STYLE = `
.cosx-legal{font-family:var(--font-sans-cjk,system-ui,sans-serif);font-size:12px;line-height:1.6;color:var(--grey,#696969);
  max-width:1280px;margin:0 auto;padding:24px 24px 40px;display:flex;flex-wrap:wrap;gap:4px 16px;justify-content:space-between}
.cosx-legal a{color:inherit;text-underline-offset:3px}
.cosx-legal a:hover{color:var(--ink,#111)}
`;

// Built per request: outside a request the Workers clock reads the
// epoch, so a module-level year would print 1970.
function legalHTML(): string {
  return `<footer class="cosx-legal" role="contentinfo">
<span>© ${new Date().getUTCFullYear()} COSINE X LIMITED. All rights reserved. 保留所有权利。</span>
<span><a href="/terms">Terms of use · 使用条款</a></span>
</footer>`;
}

function decorate(res: Response, page: string): Response {
  const title = page === HOME ? SITE : `${page} · ${SITE}`;
  return new HTMLRewriter()
    .on("head", {
      element(el) {
        el.append(
          `<title>${title}</title>` +
            `<meta name="description" content="Brand, foundations, components and product patterns of COSX.">` +
            `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` +
            `<style>${LEGAL_STYLE}</style>`,
          { html: true },
        );
      },
    })
    .on("body", {
      element(el) {
        el.append(legalHTML(), { html: true });
      },
    })
    .transform(res);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const navigating = request.headers.get("Sec-Fetch-Dest") === "document";

    const filePage = pageOfFile(url.pathname);
    if (filePage && navigating) {
      return Response.redirect(new URL(pathOf(filePage), url).toString(), 301);
    }
    if (url.pathname === "/home" || url.pathname === "/home/") {
      return Response.redirect(new URL("/", url).toString(), 301);
    }
    if (url.pathname === "/terms" || url.pathname === "/terms/") {
      return env.ASSETS.fetch(new Request(new URL("/terms.html", url), request));
    }

    const page = pageAt(url.pathname);
    if (page) {
      const file = new URL(`/${encodeURIComponent(page)}.dc.html`, url);
      const res = await env.ASSETS.fetch(new Request(file, request));
      return res.ok ? decorate(res, page) : res;
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
