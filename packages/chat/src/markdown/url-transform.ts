/*
 * Adapted from Craft Agents (https://github.com/craft-ai-agents/craft-agents-oss),
 * packages/ui/src/components/markdown/url-transform.ts.
 * Copyright 2026 Craft Docs Ltd. Licensed under the Apache License 2.0.
 * Modified by COSINE X LTD, 2026: the anchor keeps its raw target for the
 * host's link resolver (in-app targets) instead of file-path routing.
 */
import { defaultUrlTransform, type UrlTransform } from 'react-markdown';

/**
 * ReactMarkdown's default transform strips javascript:/data:/vbscript: and
 * unknown schemes before components see them. Anchors keep the raw target so
 * the custom <a> can offer it to the host's resolver (an in-app scheme such
 * as `cosx://document/…`); the <a> sanitises it again before any DOM href is
 * written. Every other URL-bearing attribute keeps the default sanitising.
 */
export const markdownUrlTransform: UrlTransform = (value, key, node) => {
  const tagName = typeof node === 'object' && node && 'tagName' in node ? String((node as { tagName?: unknown }).tagName) : '';
  if (key === 'href' && tagName === 'a') return value;
  return defaultUrlTransform(value);
};
