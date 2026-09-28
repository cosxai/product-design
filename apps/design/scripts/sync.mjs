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
const PARTIALS = new Set(["Site Header", "Site Nav"]);

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

// Our own additions (favicon, terms page).
cpSync(join(app, "static"), out, { recursive: true });

// Vendor the runtime's CDN scripts.
const vendor = join(out, "vendor");
mkdirSync(vendor, { recursive: true });
const supportPath = join(out, "support.js");
let support = readFileSync(supportPath, "utf8");
const cdn = [...support.matchAll(/var (\w+)_URL = "(https:\/\/unpkg\.com\/[^"]+)";\s*var \1_SRI = "(sha384-[^"]+)";/g)];
if (cdn.length === 0) throw new Error("support.js: no unpkg URLs found — the runtime changed, review sync.mjs");
for (const [, name, url, sri] of cdn) {
  const file = url.split("/").pop();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const body = Buffer.from(await res.arrayBuffer());
  const got = "sha384-" + createHash("sha384").update(body).digest("base64");
  if (got !== sri) throw new Error(`${name}: ${url} does not match the SRI hash in support.js`);
  writeFileSync(join(vendor, file), body);
  support = support.replace(url, `/vendor/${file}`);
  console.log(`vendored ${name} → /vendor/${file}`);
}
writeFileSync(supportPath, support);

pages.sort();
writeFileSync(join(app, "src", "pages.json"), JSON.stringify(pages, null, 2) + "\n");
console.log(`synced ${pages.length} pages from ${src}`);
