#!/usr/bin/env node
// Sync the design system site from a Claude Design export into public/.
//
//   node scripts/sync.mjs <export-dir>
//
// <export-dir> is the unpacked "MetaRoom 设计系统重做" project export
// (it holds site/, _ds/ and assets/). The site pages keep their relative
// paths (./support.js, ../_ds/…, ../assets/…), so they are copied to the
// ROOT of public/ with _ds/ and assets/ beside them — every relative
// path then resolves at the site root.
//
// Changes made on the way in (and only these):
//   - support.js loads React, ReactDOM and Babel from unpkg; those URLs
//     are pointed at /vendor/ (same files, same SRI hashes) so the site
//     does not depend on a public CDN. The files are fetched once and
//     verified against the SRI hash baked into support.js.
//   - src/pages.json lists the pages, which the Worker maps to clean URLs.
//
// Nothing else is edited: the site stays exactly as designed.

import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, "..");
const out = join(app, "public");
const src = process.argv[2];
if (!src || !existsSync(join(src, "site"))) {
  console.error("usage: node scripts/sync.mjs <export-dir>   (the directory holding site/, _ds/, assets/)");
  process.exit(1);
}

// Partials imported by pages, not pages themselves.
const PARTIALS = new Set(["Site Header", "Site Nav", "Spec Sections", "Spec Sections EN"]);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Site pages + runtime at the root; the authoring template stays out.
const pages = [];
for (const f of readdirSync(join(src, "site"))) {
  if (f === "_gen.js") continue;
  cpSync(join(src, "site", f), join(out, f));
  const m = f.match(/^(.+)\.dc\.html$/);
  if (m && !PARTIALS.has(m[1])) pages.push(m[1]);
}
cpSync(join(src, "_ds"), join(out, "_ds"), {
  recursive: true,
  filter: (p) => !p.endsWith("_adherence.oxlintrc.json"),
});
cpSync(join(src, "assets"), join(out, "assets"), { recursive: true });
// The site links into the MetaRoom spec and page prototypes (../ui-spec/…,
// ../pages/…); they are served as they are, under their folder names.
for (const dir of ["ui-spec", "pages", "metaroom-auth"]) {
  if (existsSync(join(src, dir))) cpSync(join(src, dir), join(out, dir), { recursive: true });
}

// Our own additions (favicon, terms page).
cpSync(join(app, "static"), out, { recursive: true });

// Vendor the runtime's CDN scripts.
const vendor = join(out, "vendor");
mkdirSync(vendor, { recursive: true });
const supportPath = join(out, "support.js");
let support = readFileSync(supportPath, "utf8");
const cdn = [...support.matchAll(/var (\w+)_URL = "(https:\/\/unpkg\.com\/[^"]+)";\s*var \1_SRI = "(sha384-[^"]+)";/g)];
if (cdn.length === 0) throw new Error("support.js: no unpkg URLs found — the runtime changed, review sync.mjs");
const preload = [];
for (const [, name, url, sri] of cdn) {
  // Versioned file name (react@18.3.1…) so the long cache below is safe.
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  // react-18.3.1 · babel-standalone-7.29.0 — no "@": the asset server
  // redirects it to %40, an extra round trip on every page.
  const pkg = (parts[0].startsWith("@") ? `${parts[0].slice(1)}-${parts[1]}` : parts[0]).replace("@", "-");
  const file = `${pkg}-${parts.at(-1)}`; // react-18.3.1-react.production.min.js
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const body = Buffer.from(await res.arrayBuffer());
  const got = "sha384-" + createHash("sha384").update(body).digest("base64");
  if (got !== sri) throw new Error(`${name}: ${url} does not match the SRI hash in support.js`);
  writeFileSync(join(vendor, file), body);
  support = support.replace(url, `/vendor/${file}`);
  // React is needed by every page; Babel only for JSX imports (lazy).
  if (name !== "BABEL") preload.push({ href: `/vendor/${file}`, integrity: sri });
  console.log(`vendored ${name} → /vendor/${file}`);
}
writeFileSync(supportPath, support);

// The company's name is COSINE X LTD; the export still says "COSINE X
// LIMITED" in places (page footers, voice examples). Corrected here until
// the Claude Design source is.
let nameFixes = 0;
const fixName = (dir) => {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) { if (f.name !== "vendor") fixName(p); continue; }
    if (!/\.(html|js|md|css)$/.test(f.name)) continue;
    const text = readFileSync(p, "utf8");
    const next = text.replaceAll("COSINE X LIMITED", "COSINE X LTD");
    if (next !== text) { writeFileSync(p, next); nameFixes++; }
  }
};
fixName(out);
console.log(`company name → COSINE X LTD in ${nameFixes} files`);

// Copyright notice in each page's own footer (where "COSINE X LTD ·
// cosx.co" stood), switching with the site language like the rest of
// the footer ({{ dz }} / {{ de }}), linking the terms of use.
const year = new Date().getFullYear();
const span = (v, text) => `<span style="display: {{ ${v} }}; line-height: inherit; letter-spacing: inherit;">${text}</span>`;
const notice =
  `<span>` +
  span("dz", `© ${year} COSINE X LTD 保留所有权利 · <a href="/terms">使用条款</a>`) +
  span("de", `© ${year} COSINE X LTD. All rights reserved. · <a href="/terms">Terms of use</a>`) +
  `</span>`;
let notices = 0;
for (const f of readdirSync(out).filter((f) => f.endsWith(".dc.html"))) {
  const p = join(out, f);
  const html = readFileSync(p, "utf8");
  const next = html.replaceAll("<span>COSINE X LTD · cosx.co</span>", notice);
  if (next !== html) { writeFileSync(p, next); notices++; }
}
if (notices !== pages.length) throw new Error(`copyright notice placed in ${notices} of ${pages.length} pages — the footer changed, review sync.mjs`);
console.log(`copyright notice in ${notices} page footers`);

// Default language: English. The site keeps the choice per visitor in
// localStorage (key cosx-site-lang); only the fallback changes here.
let langDefaults = 0;
for (const f of readdirSync(out).filter((f) => f.endsWith(".dc.html"))) {
  const p = join(out, f);
  const html = readFileSync(p, "utf8");
  const next = html.replaceAll("pref('cosx-site-lang', 'zh')", "pref('cosx-site-lang', 'en')");
  if (next !== html) {
    writeFileSync(p, next);
    langDefaults++;
  }
}
console.log(`default language → en in ${langDefaults} files`);

// Links point at clean URLs, so a click is one request, not a 301 plus
// one — and the browser can prerender the target (see src/index.ts).
// The site writes its links as literal file names ('Button.dc.html',
// href="Home.dc.html"); partials are imported by name, never linked.
const cleanPath = (p) => (p === "Home" ? "/" : `/${p.trim().toLowerCase().replace(/\s+/g, "-")}`);
let linkFiles = 0;
for (const f of readdirSync(out).filter((f) => f.endsWith(".dc.html"))) {
  const p = join(out, f);
  let html = readFileSync(p, "utf8");
  const before = html;
  for (const page of pages) {
    for (const q of ["'", '"']) {
      html = html.replaceAll(`${q}${page}.dc.html${q}`, `${q}${cleanPath(page)}${q}`);
      html = html.replaceAll(`${q}${page}.dc.html#`, `${q}${cleanPath(page)}#`);
    }
  }
  if (html !== before) {
    writeFileSync(p, html);
    linkFiles++;
  }
}
console.log(`links → clean URLs in ${linkFiles} files`);

// Files every page needs, preloaded from <head> by the Worker so they
// download in parallel instead of one after another.
// Per page: only the partials that page (or a partial it imports)
// actually pulls in — not every partial on every page.
const importsOf = (name) =>
  [...readFileSync(join(out, `${name}.dc.html`), "utf8").matchAll(/<dc-import[^>]*\sname="([^"]+)"/g)].map((m) => m[1]);
const partialsByPage = {};
for (const page of pages) {
  const seen = new Set();
  const walk = (name) => {
    for (const dep of importsOf(name)) {
      if (!PARTIALS.has(dep) || seen.has(dep)) continue;
      seen.add(dep);
      walk(dep);
    }
  };
  walk(page);
  partialsByPage[page] = [...seen].map((n) => `/${encodeURIComponent(n)}.dc.html`);
}
const ds = readdirSync(join(out, "_ds"))[0];
writeFileSync(
  join(app, "src", "preload.json"),
  JSON.stringify({ scripts: preload, fetches: partialsByPage, bundle: `/_ds/${ds}/_ds_bundle.js` }, null, 2) + "\n",
);

pages.sort();
writeFileSync(join(app, "src", "pages.json"), JSON.stringify(pages, null, 2) + "\n");
console.log(`synced ${pages.length} pages from ${src}`);
