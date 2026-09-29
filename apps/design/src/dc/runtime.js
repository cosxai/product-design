// The export runtime's contract, in plain React. Converted pages keep their
// logic class (`class Logic extends DCLogic`) as Claude Design wrote it;
// useLogic gives it React state. Render values = props merged with
// logic.renderVals(), as in support.js.

import { useEffect, useReducer, useRef } from 'react';

export class DCLogic {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this.__host = null;
  }
  setState(update, cb) {
    this.__host?.set(update, cb);
  }
  forceUpdate() {
    this.__host?.force();
  }
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  renderVals() {
    return {};
  }
}

/** Keeps the visitor's language and theme for the next page (the Worker reads it). */
function remember(state) {
  if (typeof document === 'undefined') return;
  const pref = `${state.lang === 'zh' ? 'zh' : 'en'}-${state.theme === 'dark' ? 'ink' : 'light'}`;
  document.cookie = `cosx-site=${pref}; path=/; max-age=31536000; samesite=lax`;
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en-GB';
}

/**
 * The logic instance for a component, with `props.__state` (the page
 * variant: lang, theme) laid over its initial state so the server render
 * and the first client render agree.
 */
export function useLogic(Logic, props) {
  const [, force] = useReducer((x) => x + 1, 0);
  const ref = useRef(null);
  if (!ref.current) {
    const l = new Logic(props);
    if (props.__state) l.state = { ...l.state, ...props.__state };
    ref.current = l;
  }
  const l = ref.current;
  const prevProps = useRef(props);
  l.props = props;
  l.__host = {
    set(update, cb) {
      const next = typeof update === 'function' ? update(l.state, l.props) : update;
      if (!next) return;
      const before = l.state;
      l.state = { ...l.state, ...next };
      if ((next.lang !== undefined && next.lang !== before.lang) || (next.theme !== undefined && next.theme !== before.theme)) remember(l.state);
      force();
      if (cb) queueMicrotask(cb);
    },
    force,
  };
  useEffect(() => {
    l.componentDidMount();
    return () => l.componentWillUnmount();
  }, [l]);
  useEffect(() => {
    if (prevProps.current !== props) l.componentDidUpdate(prevProps.current);
    prevProps.current = props;
  });
  const { __state, ...rest } = props;
  return { ...rest, ...l.renderVals() };
}

/** "a: b; c: d" → a style object (styles given whole as a render value). */
export function css(v) {
  if (v == null || typeof v !== 'string') return v ?? undefined;
  const o = {};
  for (const decl of v.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    o[prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = decl.slice(i + 1).trim();
  }
  return o;
}

const HOST = new Set(['position', 'left', 'right', 'top', 'bottom', 'inset', 'width', 'height', 'zIndex', 'transform']);

/** The part of an import's style the runtime keeps on its host element. */
export function hostStyle(style) {
  if (!style) return undefined;
  const out = {};
  for (const [k, val] of Object.entries(style)) if (HOST.has(k)) out[k] = val;
  return Object.keys(out).length ? out : undefined;
}

export const cx = (...c) => c.filter(Boolean).join(' ');

/** sc-for over anything: non-arrays render nothing. */
export const list = (v) => (Array.isArray(v) ? v : []);

/** {{ value }} in text: booleans and null render nothing. */
export const show = (v) => (v === null || v === undefined || typeof v === 'boolean' ? null : v);
