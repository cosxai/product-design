/*
 * Adapted from Craft Agents (https://github.com/craft-ai-agents/craft-agents-oss),
 * packages/ui/src/components/markdown/safe-components.tsx.
 * Copyright 2026 Craft Docs Ltd. Licensed under the Apache License 2.0.
 * Modified by COSINE X LTD, 2026: restyled with the 3.0 tokens; code style.
 */
import type { FC, ReactNode } from 'react';
import type { Components } from 'react-markdown';

/**
 * Safe component handling for react-markdown.
 *
 * A tag name React cannot create (`<sq+qr>`) crashes the whole render. Raw
 * HTML is off in @cosxai/chat, so such names only arrive through plugins;
 * the proxy still guards every lookup and renders them as text.
 */

/** Renders an invalid HTML-like tag as its text. */
export const UnknownTag: FC<{ tagName: string; children?: ReactNode }> = ({ tagName, children }) => (
  <span className="text-fg-secondary">
    {`<${tagName}>`}
    {children}
    {`</${tagName}>`}
  </span>
);

/** Valid lowercase HTML tags: div, span, h1. */
const VALID_HTML_TAG = /^[a-z][a-z0-9]*$/;
/** Valid PascalCase React components. */
const VALID_COMPONENT_NAME = /^[A-Z][a-zA-Z0-9_]*$/;

/** True for tag names React/HTML can render. */
export function isValidTagName(tagName: string): boolean {
  return VALID_HTML_TAG.test(tagName) || VALID_COMPONENT_NAME.test(tagName);
}

function shouldUseFallback(prop: string | symbol, target: object): boolean {
  if (typeof prop === 'symbol') return false;
  if (prop in target) return false;
  return !isValidTagName(prop);
}

/** Returned for invalid tags so hasOwnProperty is true (the value comes from `get`). */
const INVALID_TAG_DESCRIPTOR: PropertyDescriptor = { configurable: true, enumerable: true, value: undefined, writable: true };

/**
 * Wraps a components map: defined components pass through, valid tag names
 * fall back to React, invalid ones render as text via UnknownTag.
 */
export function wrapWithSafeProxy(components: Partial<Components>): Partial<Components> {
  const fallbackCache = new Map<string, FC<{ children?: ReactNode }>>();

  return new Proxy(components, {
    get(target, prop) {
      if (typeof prop === 'symbol') return Reflect.get(target, prop);
      if (prop in target) return target[prop as keyof typeof target];
      if (!shouldUseFallback(prop, target)) return undefined;

      if (!fallbackCache.has(prop)) {
        const Fallback: FC<{ children?: ReactNode }> = ({ children }) => <UnknownTag tagName={prop}>{children}</UnknownTag>;
        Fallback.displayName = `UnknownTag(${prop})`;
        fallbackCache.set(prop, Fallback);
      }
      return fallbackCache.get(prop);
    },

    has(target, prop) {
      if (typeof prop === 'symbol') return Reflect.has(target, prop);
      return prop in target || shouldUseFallback(prop, target);
    },

    // hast-util-to-jsx-runtime checks components with hasOwnProperty, which
    // calls getOwnPropertyDescriptor, not the `has` trap.
    getOwnPropertyDescriptor(target, prop) {
      if (typeof prop === 'symbol') return Reflect.getOwnPropertyDescriptor(target, prop);
      const descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
      if (descriptor) return descriptor;
      return shouldUseFallback(prop, target) ? INVALID_TAG_DESCRIPTOR : undefined;
    },
  });
}
