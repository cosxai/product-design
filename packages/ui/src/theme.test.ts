import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The Tailwind theme must agree with the 3.0 tokens it is built on.

const dir = join(__dirname);
const read = (f: string) => readFileSync(join(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

/** Declarations of every `:root { … }` block (light values; ink mode excluded). */
function rootVars(css: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const block of css.matchAll(/:root\s*\{([^}]*)\}/g)) {
    for (const d of (block[1] ?? '').matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out.set(d[1]!, d[2]!.trim());
  }
  return out;
}

// Effective token values, in styles.css import order (later wins).
const order = ['colors', 'typography', 'typography-cjk', 'spacing', 'elevation', 'motion', 'compat'].map((f) => `tokens/${f}.css`);
order.push('brand.css', 'fonts.css');
const tokens = new Map<string, string>();
for (const f of order) for (const [k, v] of rootVars(read(f))) tokens.set(k, v);

const theme = new Map<string, string>();
for (const d of read('theme-base.css').matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
  if (d[2]!.trim() !== 'initial') theme.set(d[1]!, d[2]!.trim());
}

const norm = (v: string) => v.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ',').trim();
function resolve(v: string, seen = new Set<string>()): string {
  return v.replace(/var\((--[\w-]+)\)/g, (_, name: string) => {
    if (seen.has(name)) throw new Error(`cycle at ${name}`);
    const t = tokens.get(name);
    return t === undefined ? `var(${name})` : resolve(t, new Set([...seen, name]));
  });
}

describe('theme.css against the 3.0 tokens', () => {
  it('references only variables the tokens define', () => {
    const missing = [...theme.values()]
      .flatMap((v) => [...v.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]!))
      .filter((n) => !tokens.has(n));
    expect(missing).toEqual([]);
  });

  it('never gives a 3.0 variable name a different value', () => {
    const clashes = [...theme]
      .filter(([k]) => tokens.has(k))
      .filter(([k, v]) => norm(resolve(v)) !== norm(resolve(tokens.get(k)!)))
      .map(([k, v]) => `${k}: theme ${v} ≠ tokens ${tokens.get(k)}`);
    expect(clashes).toEqual([]);
  });

  it('keeps font sizes off the 3.0 colour names', () => {
    expect([...theme.keys()].filter((k) => k.startsWith('--text-') && tokens.has(k))).toEqual([]);
  });

  it('puts the self-hosted fonts first', () => {
    expect(tokens.get('--font-sans')).toMatch(/^"Geist Variable"/);
    expect(tokens.get('--font-sans-cjk')).toMatch(/"Noto Sans SC Variable"/);
  });
});
