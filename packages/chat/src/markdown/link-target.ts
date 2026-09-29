/*
 * Adapted from Craft Agents (https://github.com/craft-ai-agents/craft-agents-oss),
 * packages/ui/src/components/markdown/link-target.ts.
 * Copyright 2026 Craft Docs Ltd. Licensed under the Apache License 2.0.
 * Modified by COSINE X LTD, 2026: file-path and file:// routing removed; a
 * link is either claimed by the host's resolver (in-app), an external URL
 * opened safely, or neutralised to text when its scheme is unsafe.
 */
import { defaultUrlTransform } from 'react-markdown';

/** Offered every link's raw target. Return a function to open it in the app (the link then opens in place); return nothing to treat it as an ordinary URL. */
export type LinkResolver = (href: string) => (() => void) | null | undefined | void;

export type ResolvedMarkdownLink =
  /** The host claimed it. `href` is the sanitised target when it is a real URL (so ⌘-click and copying still work). */
  | { kind: 'app'; open: () => void; href: string | undefined }
  /** http(s): a new tab, without opener or referrer. */
  | { kind: 'external'; href: string }
  /** Relative, #fragment, mailto:, tel: — the browser's own handling. */
  | { kind: 'plain'; href: string }
  /** javascript:, data:, file:, vbscript:, unknown schemes: rendered as text. */
  | { kind: 'text' };

const EXTERNAL = /^(?:https?:)?\/\//i;

/** Classifies a markdown link target for rendering. */
export function resolveMarkdownLink(raw: string, resolve?: LinkResolver | undefined): ResolvedMarkdownLink {
  const target = raw.trim();
  const safe = target ? defaultUrlTransform(target) : '';
  const open = target ? resolve?.(target) : undefined;
  if (typeof open === 'function') return { kind: 'app', open, href: safe || undefined };
  if (!safe) return { kind: 'text' };
  return EXTERNAL.test(safe) ? { kind: 'external', href: safe } : { kind: 'plain', href: safe };
}
