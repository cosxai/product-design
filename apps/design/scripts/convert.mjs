// One-off converter: Claude Design export (.dc.html) → editable JSX source.
//
//   node scripts/convert.mjs [Page …]      (default: every page)
//
// Read the export (apps/design/public/*.dc.html and the spec folders,
// retired after the switch — in git history before the commit that
// replaced apps/design) and wrote src/site/<Name>.jsx. The output is the
// source from then on, edited by hand. Kept as the record of how the
// pages were converted; to reuse it, restore the export to EXPORT.
//
// It mirrors the export runtime (support.js) rule for rule:
//   {{ expr }}   expr = path (a.b, a[b]) · literal · !x · x === y — resolved
//                against the render values; sc-for adds `as` and $index
//   sc-if        value truthy → children
//   sc-for       list × children, scope + { [as]: item, $index }
//   dc-import    another converted file (Site Header …), wrapped in the
//                runtime's .sc-host div with the position part of its style
//   x-import     a COSX 3.0 component → the @cosxai/ui adapter in dc/ds.jsx
//   style-hover  a generated class with the declarations !important
//   <helmet>     inline <style> kept; token / bundle links dropped (the
//                tokens come from @cosxai/ui, identical files)

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFragment } from 'parse5';
import { format } from 'prettier';

const here = dirname(fileURLToPath(import.meta.url));
const EXPORT = join(here, '../export');
const OUT = join(here, '../src/site');

// ---- sources ---------------------------------------------------------------

/** Every page and partial in the export: { name, file }. */
function sources() {
  const out = [];
  for (const dir of ['', 'pages', 'ui-spec', 'metaroom-auth']) {
    for (const f of readdirSync(join(EXPORT, dir))) {
      if (!f.endsWith('.dc.html')) continue;
      out.push({ name: f.replace(/\.dc\.html$/, ''), file: join(EXPORT, dir, f), dir });
    }
  }
  return out;
}

/** "Site Header" → SiteHeader; "Spec Sections EN" → SpecSectionsEN. */
export function componentName(name) {
  const n = name.replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^./, (c) => c.toUpperCase());
  return /^[0-9]/.test(n) ? `P${n}` : n;
}

// ---- the runtime's pre-parse encoding (support.js encodeCase) --------------

const ATTRS = `(?:[^>"']|"[^"]*"|'[^']*')*`;
const IMPORT_SELF_CLOSE_RE = new RegExp('<(x-import|dc-import)(' + ATTRS + ')/>', 'gi');
const CAMEL = 'sc-camel-';
const CAMEL_ATTR_RE = /(\s)([a-z]+[A-Z][A-Za-z0-9]*)(\s*=)/g;
const RAW_WRAP = { select: 'sc-raw-select', table: 'sc-raw-table', tbody: 'sc-raw-tbody', thead: 'sc-raw-thead', tfoot: 'sc-raw-tfoot', tr: 'sc-raw-tr', td: 'sc-raw-td', th: 'sc-raw-th', caption: 'sc-raw-caption' };
const RAW_UNWRAP = Object.fromEntries(Object.entries(RAW_WRAP).map(([k, v]) => [v, k]));

// Real tags in the export; anything else after "<" is text the browser
// would have mis-read as a tag (a code sample's "Array<string | …>").
const KNOWN_TAGS = new Set(('a abbr aside b blockquote br button caption code col colgroup dd del details div dl dt em figcaption figure footer form ' +
  'h1 h2 h3 h4 h5 h6 header hr i img input kbd label legend li link main mark meta nav ol optgroup option p pre q s section select small ' +
  'span strong style sub summary sup script table tbody td template textarea tfoot th thead time tr u ul video audio source ' +
  'svg path g circle rect line polyline polygon ellipse defs lineargradient radialgradient stop text tspan clippath mask use symbol title desc pattern image foreignobject filter').split(' '));

function escapeStrayTags(html) {
  return html.replace(/<([A-Za-z][A-Za-z0-9-]*)/g, (m, t) => (KNOWN_TAGS.has(t.toLowerCase()) || /^(sc-|dc-|x-)/i.test(t) || t.toLowerCase() === 'helmet' ? m : '&lt;' + t));
}

function encodeCase(html) {
  html = escapeStrayTags(html);
  html = html.replace(IMPORT_SELF_CLOSE_RE, (_, t, a) => '<' + t + a + '></' + t + '>');
  html = html.replace(/<helmet(\s|>)/gi, '<sc-helmet$1').replace(/<\/helmet\s*>/gi, '</sc-helmet>');
  html = html.replace(CAMEL_ATTR_RE, (_, sp, name, eq) => sp + CAMEL + name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()) + eq);
  for (const [real, alias] of Object.entries(RAW_WRAP)) html = html.replace(new RegExp('(</?)' + real + '(?=[\\s>])', 'gi'), '$1' + alias);
  return html;
}

const kebabToCamel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// ---- expressions -----------------------------------------------------------

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*/;
const NUMBER_RE = /^-?\d+(\.\d+)?$/;

function parensWrapWhole(e) {
  let d = 0;
  for (let i = 0; i < e.length - 1; i++) {
    if (e[i] === '(') d++;
    else if (e[i] === ')' && --d === 0) return false;
  }
  return true;
}
function topLevelEquality(e) {
  let d = 0;
  for (let i = 0; i < e.length; i++) {
    const c = e[i];
    if (c === '[' || c === '(') d++;
    else if (c === ']' || c === ')') d--;
    else if (d === 0 && (c === '=' || c === '!') && e[i + 1] === '=') {
      if (i > 0 && (e[i - 1] === '=' || e[i - 1] === '!')) continue;
      if (!e.slice(0, i).trim()) continue;
      return { index: i, op: e[i + 2] === '=' ? c + '==' : c + '=' };
    }
  }
  return null;
}

/** A template expression as JS against the scope variable `s`. */
export function expr(src, s) {
  const e = String(src).trim();
  if (!e) return 'undefined';
  if (e[0] === '(' && e.at(-1) === ')' && parensWrapWhole(e)) return expr(e.slice(1, -1), s);
  const eq = topLevelEquality(e);
  if (eq) return `(${expr(e.slice(0, eq.index), s)} ${eq.op} ${expr(e.slice(eq.index + eq.op.length), s)})`;
  if (e[0] === '!') return `!${expr(e.slice(1), s)}`;
  if (['true', 'false', 'null', 'undefined'].includes(e)) return e;
  if (NUMBER_RE.test(e)) return String(Number(e));
  if (e.length >= 2 && (e[0] === '"' || e[0] === "'") && e.at(-1) === e[0]) return JSON.stringify(e.slice(1, -1));
  return path(e, s);
}

function path(e, s) {
  const head = e.match(IDENT_RE);
  if (!head) return 'undefined';
  let out = `${s}.${head[0]}`;
  let i = head[0].length;
  while (i < e.length) {
    if (e[i] === '.') {
      const m = e.slice(i + 1).match(IDENT_RE) || e.slice(i + 1).match(/^\d+/);
      if (!m) return 'undefined';
      out += /^\d/.test(m[0]) ? `?.[${m[0]}]` : `?.${m[0]}`;
      i += 1 + m[0].length;
    } else if (e[i] === '[') {
      let d = 1, j = i + 1;
      for (; j < e.length && d > 0; j++) {
        if (e[j] === '[') d++;
        else if (e[j] === ']' && --d === 0) break;
      }
      out += `?.[${expr(e.slice(i + 1, j), s)}]`;
      i = j + 1;
    } else return 'undefined';
  }
  return out;
}

/** An attribute value: literal string, one expression, or a template. */
function attrValue(raw, s) {
  const whole = raw.match(/^\s*\{\{([\s\S]+?)\}\}\s*$/);
  if (whole) return { js: expr(whole[1], s), dynamic: true };
  if (raw.includes('{{')) {
    const parts = raw.split(/\{\{([\s\S]+?)\}\}/g);
    const js = '`' + parts.map((p, i) => (i & 1 ? '${' + expr(p, s) + ' ?? ""}' : p.replace(/[`\\$]/g, (c) => '\\' + c))).join('') + '`';
    return { js, dynamic: true };
  }
  return { js: JSON.stringify(raw), dynamic: false, literal: raw };
}

// ---- style -----------------------------------------------------------------

/** "a: b; --c: {{ d }}" → JS object literal source. */
function styleObject(raw, s) {
  const whole = raw.match(/^\s*\{\{([\s\S]+?)\}\}\s*$/);
  if (whole) return `css(${expr(whole[1], s)})`;
  const props = [];
  for (const decl of splitDecls(raw)) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const key = prop.startsWith('--') ? prop : kebabToCamel(prop);
    const v = attrValue(decl.slice(i + 1).trim(), s);
    props.push(`${JSON.stringify(key)}: ${v.js}`);
  }
  return `{ ${props.join(', ')} }`;
}

/** Split declarations on ";" outside {{ }}, quotes and parentheses. */
function splitDecls(css) {
  const out = [];
  let cur = '', depth = 0, q = null;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (q) { if (c === q) q = null; cur += c; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (css.startsWith('{{', i)) { depth++; cur += '{{'; i++; continue; }
    if (css.startsWith('}}', i)) { depth--; cur += '}}'; i++; continue; }
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ';' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

// ---- DOM attribute names (React spelling) ---------------------------------

const EVENT = /^on/;
const HTML_ATTR = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', colspan: 'colSpan', rowspan: 'rowSpan', readonly: 'readOnly',
  maxlength: 'maxLength', minlength: 'minLength', autocomplete: 'autoComplete', autofocus: 'autoFocus', crossorigin: 'crossOrigin',
  srcset: 'srcSet', contenteditable: 'contentEditable', spellcheck: 'spellCheck', enterkeyhint: 'enterKeyHint', inputmode: 'inputMode',
  datetime: 'dateTime', frameborder: 'frameBorder', allowfullscreen: 'allowFullScreen', novalidate: 'noValidate', accesskey: 'accessKey',
  'accept-charset': 'acceptCharset', 'http-equiv': 'httpEquiv', referrerpolicy: 'referrerPolicy', playsinline: 'playsInline', autoplay: 'autoPlay',
  'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', 'xmlns:xlink': 'xmlnsXlink', defaultvalue: 'defaultValue', defaultchecked: 'defaultChecked',
};
const EVENT_MAP = { onclick: 'onClick', onchange: 'onChange', oninput: 'onInput', onsubmit: 'onSubmit', onkeydown: 'onKeyDown', onkeyup: 'onKeyUp', onmouseenter: 'onMouseEnter', onmouseleave: 'onMouseLeave', onfocus: 'onFocus', onblur: 'onBlur', ondoubleclick: 'onDoubleClick', ondragover: 'onDragOver', ondragleave: 'onDragLeave', ondragenter: 'onDragEnter', ondrop: 'onDrop', onpointerdown: 'onPointerDown', onpointerup: 'onPointerUp', onpointermove: 'onPointerMove' };

function domAttrName(name, svg) {
  let key = name;
  if (key.startsWith(CAMEL)) key = kebabToCamel(key.slice(CAMEL.length));
  if (HTML_ATTR[key]) return HTML_ATTR[key];
  if (EVENT.test(key) && key.length > 2) return EVENT_MAP[key] || 'on' + key[2].toUpperCase() + key.slice(3);
  if (key.startsWith('aria-') || key.startsWith('data-')) return key;
  if (svg && key.includes('-')) return kebabToCamel(key);
  return key;
}

// ---- JSX emit --------------------------------------------------------------

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
// JSX trims text around line breaks and decodes entities; HTML keeps the
// text and collapses whitespace in the browser. Anything JSX would read
// differently goes in as a string.
const INLINE_TEXT_ESC = (t) => (/[\n\r\t&{}<>]|^\s|\s$/.test(t) ? `{${JSON.stringify(t)}}` : t);
const HOST_STYLE = new Set(['position', 'left', 'right', 'top', 'bottom', 'inset', 'width', 'height', 'z-index', 'transform']);

// Every site page's helmet carries this rule; it lives in styles/site.css.
const COMMON_HELMET_CSS = 'html, body { margin: 0; background: var(--paper); -webkit-font-smoothing: antialiased; } a { color: inherit; text-underline-offset: 3px; } a:hover { color: var(--text-secondary); }';

class Emitter {
  constructor(name) {
    this.name = name;
    this.imports = new Set(); // partial component names
    this.ds = new Set(); // DS adapters used
    this.hover = []; // [class, css]
    this.scopeN = 0;
    this.css = [];
    this.warnings = [];
  }

  children(node, s, ind) {
    return node.childNodes.map((c) => this.node(c, s, ind)).filter((x) => x != null && x !== '');
  }

  node(n, s, ind) {
    if (n.nodeName === '#text') return this.text(n.value, s);
    if (n.nodeName === '#comment') return null;
    const tag = n.tagName;
    if (tag === 'sc-helmet') { this.helmet(n); return null; }
    if (tag === 'sc-if') return this.scIf(n, s, ind);
    if (tag === 'sc-for') return this.scFor(n, s, ind);
    if (tag === 'dc-import') return this.dcImport(n, s, ind);
    if (tag === 'x-import') return this.xImport(n, s, ind);
    if (tag === 'template') { this.warnings.push('<template> dropped'); return null; }
    return this.element(n, s, ind);
  }

  text(t, s) {
    if (!t.includes('{{')) {
      // The runtime drops whitespace-only text without a space (newlines, tabs).
      if (!t.trim() && !t.includes(' ')) return null;
      // Whitespace between elements: one space is what the browser shows.
      return t.trim() ? INLINE_TEXT_ESC(t) : `{' '}`;
    }
    return t.split(/\{\{([\s\S]+?)\}\}/g).map((p, i) => (i & 1 ? `{show(${expr(p, s)})}` : p ? INLINE_TEXT_ESC(p) : '')).join('');
  }

  scIf(n, s, ind) {
    const cond = attrValue(attr(n, 'value') ?? '', s).js;
    return `{${cond} ? (<>${this.join(this.children(n, s, ind + 1), ind + 1)}</>) : null}`;
  }

  scFor(n, s, ind) {
    const list = attrValue(attr(n, 'list') ?? '', s).js;
    const as = attr(n, 'as') || 'item';
    const s2 = `s${++this.scopeN}`;
    const it = `${as.replace(/[^A-Za-z0-9_$]/g, '_')}$`;
    const body = this.join(this.children(n, s2, ind + 1), ind + 1);
    return `{list(${list}).map((${it}, $i) => { const ${s2} = { ...${s}, ${JSON.stringify(as)}: ${it}, $index: $i }; return (<Fragment key={$i}>${body}</Fragment>); })}`;
  }

  props(n, s, kind) {
    const out = [];
    let style = null;
    for (const { name, value } of n.attrs) {
      if (name === 'hint-size' || name === 'hint-placeholder-count' || name === 'hint-placeholder-val') continue;
      // dc-import: name / component pick the file; x-import: the global
      // picks the component and `name` stays a prop (Icon name="check").
      if (kind === 'dc-import' && (name === 'name' || name === 'component')) continue;
      if (kind === 'x-import' && (name === 'component' || name === 'component-from-global-scope' || name === 'from')) continue;
      if (name === 'style') { style = value; continue; }
      if (name.startsWith('style-')) {
        const cls = `h${this.name.length}${(this.hover.length).toString(36)}`;
        this.hover.push([cls, name.slice(6), value]);
        out.push(['__hover', JSON.stringify(cls)]);
        continue;
      }
      let key;
      if (kind === 'dom') key = domAttrName(name, n.namespaceURI === 'http://www.w3.org/2000/svg');
      else {
        key = name.startsWith(CAMEL) ? kebabToCamel(name.slice(CAMEL.length)) : name;
        if (key.includes('-') && !(kind === 'x-import' && (key.startsWith('aria-') || key.startsWith('data-')))) key = kebabToCamel(key);
      }
      const v = attrValue(value, s);
      if (kind === 'dom' && (key === 'value' || key === 'checked') && v.dynamic) {
        out.push([key, `${v.js} ?? ${key === 'checked' ? 'false' : '""'}`]);
        continue;
      }
      out.push([key, v.js, v]);
    }
    return { props: out, style };
  }

  renderProps(props) {
    const hover = props.filter(([k]) => k === '__hover').map(([, v]) => JSON.parse(v));
    let rest = props.filter(([k]) => k !== '__hover');
    if (hover.length) {
      const cls = rest.find(([k]) => k === 'className');
      rest = rest.filter(([k]) => k !== 'className');
      const parts = [...(cls ? [cls[1]] : []), ...hover.map((h) => JSON.stringify(h))];
      rest.push(['className', parts.length === 1 ? parts[0] : `cx(${parts.join(', ')})`]);
    }
    return rest.map(([k, js, v]) => {
      if (k === 'dcProps') return `{...${js}}`;
      if (v && !v.dynamic && /^[a-zA-Z]/.test(k) && !/["\\{}&]/.test(v.literal) && !v.literal.includes('\n')) return `${k}="${v.literal}"`;
      return `${k}={${js}}`;
    }).join(' ');
  }

  element(n, s, ind) {
    const tag = RAW_UNWRAP[n.tagName] || n.tagName;
    const { props, style } = this.props(n, s, 'dom');
    if (style != null) props.push(['style', styleObject(yellowInk(style), s)]);
    const attrs = this.renderProps(props);
    const open = `<${tag}${attrs ? ' ' + attrs : ''}`;
    if (VOID.has(tag)) return `${open} />`;
    const content = tag === 'style' || tag === 'script' ? `{${JSON.stringify(textOf(n))}}` : this.join(this.children(n.content || n, s, ind + 1), ind + 1);
    if (tag === 'style' || tag === 'script') return `${open} dangerouslySetInnerHTML={{ __html: ${JSON.stringify(textOf(n))} }} />`;
    return content ? `${open}>${content}</${tag}>` : `${open} />`;
  }

  dcImport(n, s, ind) {
    const target = attr(n, 'name') || attr(n, 'component') || '';
    const C = componentName(target);
    this.imports.add(C);
    const { props, style } = this.props(n, s, 'dc-import');
    const kids = this.join(this.children(n, s, ind + 1), ind + 1);
    const host = style != null ? hostStyle(style, s) : null;
    const attrs = this.renderProps(props);
    const inner = `<${C}${attrs ? ' ' + attrs : ''}${kids ? `>${kids}</${C}>` : ' />'}`;
    return `<div className="sc-host"${host ? ` style={${host}}` : ''}>${inner}</div>`;
  }

  xImport(n, s, ind) {
    const g = attr(n, 'component-from-global-scope') || '';
    const m = g.match(/^COSXDesignSystem30_460d0b\.([A-Za-z]+)$/);
    if (!m) { this.warnings.push(`x-import ${g || attr(n, 'name')} not converted`); return `{/* x-import ${g} */}`; }
    const C = m[1];
    this.ds.add(C);
    const { props, style } = this.props(n, s, 'x-import');
    const kids = this.join(this.children(n, s, ind + 1), ind + 1);
    const attrs = this.renderProps(props);
    const el = `<DS.${C}${attrs ? ' ' + attrs : ''}${kids ? `>${kids}</DS.${C}>` : ' />'}`;
    const host = style != null ? hostStyle(style, s) : null;
    return host ? `<div className="sc-host-x" style={${host}}>${el}</div>` : el;
  }

  helmet(n) {
    for (const c of n.childNodes) {
      if (c.tagName === 'style') {
        const t = textOf(c).trim();
        if (t !== COMMON_HELMET_CSS) this.css.push(t);
      }
      else if (c.tagName === 'link' || c.tagName === 'script' || c.tagName === 'meta' || c.nodeName === '#text' || c.nodeName === '#comment') continue;
      else this.warnings.push(`helmet <${c.tagName}> dropped`);
    }
  }

  join(parts) {
    return parts.join('');
  }
}

/** The runtime keeps only position / size / transform of an import's style on its host. */
function hostStyle(raw, s) {
  if (/^\s*\{\{/.test(raw)) return `hostStyle(css(${expr(raw.match(/\{\{([\s\S]+?)\}\}/)[1], s)}))`;
  const kept = splitDecls(raw).filter((d) => HOST_STYLE.has(d.slice(0, d.indexOf(':')).trim()));
  return kept.length ? styleObject(kept.join(';'), s) : null;
}

/** ds-patches.js #2, applied once: yellow fills keep ink text in ink mode. */
function yellowInk(style) {
  const bg = /background(-color)?\s*:\s*([^;]*)/.exec(style)?.[2] ?? '';
  if (/var\(--(yellow|yellow-accent|yellow-hover|brand-field|brand-mark)\)|#FFE3A0|#FFD166/i.test(bg)) {
    return style.replace(/(^|;)(\s*color\s*:\s*)var\(--text-primary\)/, '$1$2var(--ink)');
  }
  return style;
}

const attr = (n, name) => n.attrs?.find((a) => a.name === name)?.value;
const textOf = (n) => n.childNodes.map((c) => (c.nodeName === '#text' ? c.value : textOf(c))).join('');

// ---- file -------------------------------------------------------------------

function findTag(node, tag) {
  if (node.tagName === tag) return node;
  for (const c of node.childNodes || []) {
    const f = findTag(c, tag);
    if (f) return f;
  }
  return null;
}

export function convert(src, name, rel) {
  const scriptM = src.match(/<script type="text\/x-dc" data-dc-script((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script>/);
  const logicSrc = scriptM ? scriptM[2].trim() : 'class Component extends DCLogic {}';
  const dcM = src.match(/<x-dc>([\s\S]*)<\/x-dc>/);
  if (!dcM) throw new Error(`${name}: no <x-dc>`);
  const frag = parseFragment(encodeCase(dcM[1]));
  const e = new Emitter(name);
  const body = e.join(e.children(frag, 'v', 1));
  const C = componentName(name);

  const logic = logicSrc
    .replace(/class\s+Component\s+extends\s+DCLogic/, 'class Logic extends DCLogic')
    // The 3.0 bundle's global → the adapters; the export's runtime patch hook is gone.
    .replace(/window\.COSXDesignSystem30_460d0b/g, 'DS')
    .replace(/window\.cosxSelectAutoFlip/g, 'undefined');
  if (/\bDS\b/.test(logic)) e.ds.add('*');
  const hoverCss = e.hover.map(([cls, pseudo, css]) => {
    const isEl = pseudo === 'before' || pseudo === 'after';
    const decls = isEl ? css : splitDecls(css).map((d) => d.trim() + ' !important').join(';');
    return `.${cls}${isEl ? '::' : ':'}${pseudo}{${decls}}`;
  });
  const css = [...e.css, ...hoverCss].join('\n');

  const header = [
    `// ${C} — converted once from the Claude Design export (${rel}); edit freely.`,
    /\bReact\./.test(logicSrc) ? `import * as React from 'react';\nimport { Fragment } from 'react';` : `import { Fragment } from 'react';`,
    '',
    `import { DCLogic, css, cx, hostStyle, list, show, useLogic } from '../dc/runtime';`,
    e.ds.size ? `import * as DS from '../dc/ds';` : null,
    ...[...e.imports].sort().map((p) => `import ${p} from './${p}';`),
    '',
  ].filter((x) => x !== null);

  const code = `${header.join('\n')}
/* eslint-disable */
${logic}

export const pageCss = ${JSON.stringify(css)};

export default function ${C}(props) {
  const v = useLogic(Logic, props);
  return (<>${css ? `<style href="${C}" precedence="page">{pageCss}</style>` : ''}${body}</>);
}
`;
  return { code, warnings: e.warnings, C };
}

// ---- routes -----------------------------------------------------------------

/** Files other pages import (Site Header …) — components, not pages. */
const PARTIALS = new Set(sources().flatMap(({ file }) => [...readFileSync(file, 'utf8').matchAll(/<dc-import name="([^"]+)"/g)].map((m) => m[1])));

/** Button → button, "Pattern Action Bar" → pattern-action-bar (the live site's slugs). */
export const slugOf = (name) => name.trim().toLowerCase().replace(/\s+/g, '-');

/** One route file per page: src/pages/p/<dir>/<slug>/[...v].astro. */
function writeRoutes(index) {
  const pages = index.filter((p) => !p.partial);
  const table = [];
  for (const p of pages) {
    const route = [p.dir, slugOf(p.name)].filter(Boolean).join('/');
    const dir = join(here, '../src/pages/p', route);
    mkdirSync(dir, { recursive: true });
    const up = '../'.repeat(route.split('/').length + 2);
    writeFileSync(
      join(dir, '[...v].astro'),
      `---
import Layout from '${up}layouts/Page.astro';
import { variants } from '${up}lib/variants';
import Page from '${up}site/${p.component}.jsx';

export const getStaticPaths = () => variants(${p.site});
const { state } = Astro.props;
---
<Layout title=${JSON.stringify(p.name)} lang={state?.lang}>
  <Page client:load ${p.site ? '__state={state} ' : ''}/>
</Layout>
`,
    );
    table.push({ name: p.name, path: p.name === 'Home' ? '/' : '/' + route, site: p.site, file: p.dir ? `/${p.dir}/${p.name}.dc.html` : `/${p.name}.dc.html` });
  }
  writeFileSync(join(here, '../src/routes.json'), JSON.stringify(table, null, 2) + '\n');
}

// ---- main -------------------------------------------------------------------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const want = new Set(process.argv.slice(2));
  mkdirSync(OUT, { recursive: true });
  const index = [];
  for (const { name, file, dir } of sources()) {
    if (want.size && !want.has(name)) continue;
    const rel = join(dir, basename(file));
    const { code, warnings, C } = convert(readFileSync(file, 'utf8'), name, rel);
    let out = code;
    try {
      out = await format(code, { parser: 'babel', printWidth: 140, singleQuote: true });
    } catch (err) {
      console.warn(`${name}: not formatted (${err.message.split('\n')[0]})`);
    }
    writeFileSync(join(OUT, `${C}.jsx`), out);
    const src = readFileSync(file, 'utf8');
    index.push({ name, component: C, dir, site: src.includes('cosx-site-lang'), partial: PARTIALS.has(name) });
    for (const w of warnings) console.warn(`${name}: ${w}`);
  }
  if (!want.size) {
    writeFileSync(join(OUT, 'index.json'), JSON.stringify(index, null, 2) + '\n');
    writeRoutes(index);
  }
  console.log(`converted ${index.length} files → ${OUT}`);
}

// ---- icons ------------------------------------------------------------------
// 3.0 names icons by Lucide name ("file-text"), sometimes computed in the
// logic ({{ a.icon }}). Every string in the export that is a Lucide name
// gets a named import, so the site bundles only the icons it shows.

export async function writeIcons() {
  const lucide = await import('lucide-react');
  const pascal = (n) => n.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
  const names = new Set();
  for (const { file } of sources()) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/['"]([a-z][a-z0-9]*(?:-[a-z0-9]+)*)['"]/g)) names.add(m[1]);
    for (const m of src.matchAll(/name=["']([a-z][a-z0-9-]*)["']/g)) names.add(m[1]);
  }
  const found = [...names].filter((n) => { const p = pascal(n); return typeof lucide[p] === 'object' || typeof lucide[p] === 'function'; }).sort();
  const lines = [
    '// Every Lucide icon the site names (written by scripts/convert.mjs; add names here by hand).',
    `import { ${found.map((n) => `${pascal(n)}`).join(', ')} } from 'lucide-react';`,
    '',
    'const ICONS = {',
    ...found.map((n) => `  ${JSON.stringify(n)}: ${pascal(n)},`),
    '};',
    '',
    '/** The Lucide component for a 3.0 icon name, or undefined. */',
    'export const iconFor = (name) => (name ? ICONS[name] : undefined);',
    '',
  ];
  writeFileSync(join(here, '../src/dc/icons.js'), lines.join('\n'));
  return found.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.length === 2) {
  console.log(`icons: ${await writeIcons()}`);
}
