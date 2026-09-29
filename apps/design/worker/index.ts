// design.cosx.co (Astro build) — serves dist/ at the site's clean URLs.
//
// Each site page is built four times (language × theme, src/lib/variants.js)
// under /p/<route>/[zh|ink|zh-ink]; the visitor's choice lives in the
// `cosx-site` cookie (set by the page when they switch), so /button stays
// /button in every language and the first paint is already right.
// Old export file URLs (/Button.dc.html, /ui-spec/MetaRoom Components.dc.html)
// redirect to their clean path; /terms is the terms of use.

import routes from "../src/routes.json" with { type: "json" };

type Env = { ASSETS: Fetcher };
type Route = { name: string; path: string; site: boolean; file: string };

const byPath = new Map((routes as Route[]).map((r) => [r.path, r]));
const byFile = new Map((routes as Route[]).map((r) => [r.file.toLowerCase(), r]));

/** The route a clean path names ("/Button/" → Button), if any. */
export function routeAt(pathname: string): Route | undefined {
  const p = decodeURIComponent(pathname).replace(/\/+$/, "").toLowerCase() || "/";
  return byPath.get(p);
}

/** The route an old export file URL names, if any. */
export function routeOfFile(pathname: string): Route | undefined {
  return byFile.get(decodeURIComponent(pathname).toLowerCase());
}

/** Which build of a page to serve for a `cosx-site` cookie value. */
export function variantFor(cookie: string | null): "" | "zh" | "ink" | "zh-ink" {
  const m = /(?:^|;\s*)cosx-site=(en|zh)-(light|ink)/.exec(cookie ?? "");
  if (!m) return "";
  const lang = m[1] === "zh" ? "zh" : "";
  const ink = m[2] === "ink" ? "ink" : "";
  return [lang, ink].filter(Boolean).join("-") as "" | "zh" | "ink" | "zh-ink";
}

/** The built file for a route and variant. */
export function fileFor(route: Route, variant: string): string {
  const base = route.path === "/" ? "/p/home" : `/p${route.path}`;
  return `${base}${route.site && variant ? `/${variant}` : ""}/index.html`;
}

/** Hashed build files never change; pages revalidate (they differ by cookie). */
export function cacheControlFor(pathname: string): string {
  if (pathname.startsWith("/_astro/")) return "public, max-age=31536000, immutable";
  return "public, max-age=600, stale-while-revalidate=86400";
}

function withHeaders(res: Response, headers: Record<string, string>): Response {
  if (!res.ok) return res;
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(headers)) out.headers.set(k, v);
  return out;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const old = routeOfFile(url.pathname);
    if (old) return Response.redirect(new URL(old.path, url).toString(), 301);
    if (url.pathname === "/home" || url.pathname === "/home/") return Response.redirect(new URL("/", url).toString(), 301);
    if (url.pathname === "/terms" || url.pathname === "/terms/") {
      const res = await env.ASSETS.fetch(new Request(new URL("/terms.html", url), request));
      return withHeaders(res, { "Cache-Control": cacheControlFor(url.pathname) });
    }

    const route = routeAt(url.pathname);
    if (route) {
      const res = await env.ASSETS.fetch(new Request(new URL(fileFor(route, variantFor(request.headers.get("Cookie"))), url), request));
      return withHeaders(res, { "Cache-Control": "private, no-cache", Vary: "Cookie" });
    }
    if (url.pathname.startsWith("/p/")) return new Response("Not found", { status: 404 });
    const res = await env.ASSETS.fetch(request);
    return withHeaders(res, { "Cache-Control": cacheControlFor(url.pathname) });
  },
} satisfies ExportedHandler<Env>;
