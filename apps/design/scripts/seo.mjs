// Search and share metadata for every page.
//
//   pnpm build && pnpm exec astro preview --port 4321 &   then
//   node scripts/seo.mjs meta     page section / title / intro → src/seo.json (then edit by hand)
//   node scripts/seo.mjs og       share images → public/og/<slug>.png (after a rebuild)
//
// Both drive a headless Chrome over the DevTools protocol.

import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const BASE = 'http://localhost:4321';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const routes = JSON.parse(readFileSync(join(here, '../src/routes.json'), 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function chrome() {
  const proc = spawn(CHROME, ['--headless=new', '--remote-debugging-port=9340', '--hide-scrollbars', '--user-data-dir=/tmp/cosx-seo-chrome', 'about:blank'], { stdio: 'ignore' });
  let targets;
  for (let i = 0; i < 40 && !targets; i++) {
    try { targets = await (await fetch('http://127.0.0.1:9340/json')).json(); } catch { await sleep(250); }
  }
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable');
  return {
    send,
    async open(url, wait = 800) { await send('Page.navigate', { url }); await sleep(wait); },
    async eval(expression) { return (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.result?.value; },
    close() { ws.close(); proc.kill(); },
  };
}

// The name each page has in the site's navigation.
const NAMES = {
  '/brand-injection': 'Brand injection', '/checkbox': 'Checkbox and switch', '/data-display': 'Data display', '/overlays': 'Overlays and menus',
  '/avatars': 'Avatars and members', '/share-dialog': 'Share dialog', '/kanban': 'Board', '/editing': 'Editing and signing', '/form-extensions': 'Form extensions',
  '/bilingual': 'Chinese and English', '/pattern-navigation': 'Navigation', '/pattern-action-bar': 'Action bar', '/pattern-agent': 'Agent conversation',
  '/pattern-status': 'Status', '/template-sign-in': 'Sign in', '/template-settings': 'Settings', '/template-list': 'Lists', '/template-viewer': 'Viewer',
  '/spacing': 'Spacing and shape', '/yellow': 'The yellow', '/marker': 'The marker',
  '/pages/metaroom-auth': 'MetaRoom sign-in', '/pages/metaroom-customer-portal': 'MetaRoom customer portal', '/pages/metaroom-ops-workbench': 'MetaRoom Ops workbench',
  '/ui-spec/metaroom-components': 'MetaRoom components', '/ui-spec/metaroom-navigation': 'MetaRoom navigation', '/metaroom-auth/metaroom-sign-in': 'MetaRoom sign-in prototype',
};

/** About 155 characters, cut at a word. */
const clip = (t) => (t.length <= 158 ? t : t.slice(0, 155).replace(/\s+\S*$/, '') + '…');

const slugOf = (path) => (path === '/' ? 'home' : path.slice(1).replace(/\//g, '-'));

async function meta() {
  const c = await chrome();
  const out = {};
  for (const r of routes) {
    await c.open(`${BASE}/p${r.path === '/' ? '/home' : r.path}`);
    const m = await c.eval(`(() => {
      const h = document.querySelector('h1');
      if (!h) return null;
      const kids = [...h.parentElement.children];
      const i = kids.indexOf(h);
      const before = kids.slice(0, i).map((k) => k.innerText.trim()).filter(Boolean).pop() || '';
      const after = kids.slice(i + 1).map((k) => k.innerText.trim()).find((t) => t.length > 40) || '';
      return { eyebrow: before, h1: h.innerText.trim(), lede: after };
    })()`);
    const section = (m?.eyebrow || '').split('·')[0].trim();
    const h1 = (m?.h1 || '').replace(/\s+/g, ' ');
    const lede = (m?.lede || '').replace(/\s+/g, ' ');
    // Component pages title with the name ("Button"); the others with a
    // finding ("Paper, ink and one yellow") — the image takes the short name.
    const sentence = h1.length > 28 ? h1 : '';
    const home = r.name === 'Home';
    out[r.path] = {
      slug: slugOf(r.path),
      title: home ? 'COSX Design System' : NAMES[r.path] ?? r.name,
      ogTitle: home ? 'COSX Design System' : NAMES[r.path] ?? r.name,
      section: home ? 'Brand · Components · Patterns' : section,
      ogLine: home ? 'Warm white paper, ink type and one yellow.' : sentence || lede,
      description: clip([sentence, lede].filter(Boolean).join('. ').replace(/\.\./g, '.')),
      index: r.site,
    };
    console.log(r.path, '→', out[r.path].ogTitle, '|', out[r.path].description.slice(0, 60));
  }
  c.close();
  writeFileSync(join(here, '../src/seo.json'), JSON.stringify(out, null, 2) + '\n');
}

async function og() {
  const seo = JSON.parse(readFileSync(join(here, '../src/seo.json'), 'utf8'));
  const c = await chrome();
  await c.send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
  mkdirSync(join(here, '../public/og'), { recursive: true });
  for (const m of Object.values(seo)) {
    await c.open(`${BASE}/og/${m.slug}`, 700);
    await c.eval('document.fonts.ready.then(() => true)');
    const shot = await c.send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
    writeFileSync(join(here, `../public/og/${m.slug}.png`), Buffer.from(shot.result.data, 'base64'));
    console.log('og', m.slug);
  }
  c.close();
}

/** PNG icons from favicon.svg (Chrome renders the SVG). */
async function icons() {
  const c = await chrome();
  mkdirSync(join(here, '../public/icons'), { recursive: true });
  const svg = readFileSync(join(here, '../public/favicon.svg'), 'utf8');
  for (const [name, size, pad] of [['icon-32', 32, 0], ['apple-touch-icon', 180, 0], ['icon-512', 512, 0]]) {
    await c.send('Emulation.setDeviceMetricsOverride', { width: size, height: size, deviceScaleFactor: 1, mobile: false });
    await c.send('Page.navigate', { url: 'data:text/html,' + encodeURIComponent(`<body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg style="display:block;width:${size - pad * 2}px;height:${size - pad * 2}px;margin:${pad}px" `)}</body>`) });
    await sleep(300);
    await c.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    const shot = await c.send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: size, height: size, scale: 1 } });
    writeFileSync(join(here, `../public/icons/${name}.png`), Buffer.from(shot.result.data, 'base64'));
  }
  c.close();
}

const step = process.argv[2];
if (step === 'icons') await icons();
else if (step === 'meta') await meta();
else if (step === 'og') await og();
else console.error('usage: node scripts/seo.mjs meta|og|icons');
