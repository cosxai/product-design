/*
 * Adapted from Craft Agents (https://github.com/craft-ai-agents/craft-agents-oss),
 * packages/ui/src/components/markdown/CodeBlock.tsx.
 * Copyright 2026 Craft Docs Ltd. Licensed under the Apache License 2.0.
 * Modified by COSINE X LTD, 2026: Shiki is imported lazily and highlights
 * with paper and ink colours at once (CSS variables, switched by
 * markdown.css), so the cache no longer depends on the theme; the
 * ShikiThemeContext, terminal/minimal modes and i18n are gone (labels are
 * props); restyled to 3.0 (bg-sunk, 8px radius, no border or shadow) with a
 * copy button that is always reachable by keyboard.
 */
import { Check, Copy } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@cosxai/ui';

export type CodeBlockLabels = {
  /** @default "Copy code" */
  copy?: string | undefined;
  /** @default "Copied" */
  copied?: string | undefined;
  /** Shown for a block with no language. @default "Plain text" */
  plainText?: string | undefined;
};

export type CodeBlockProps = {
  code: string;
  /** From the fence (```ts). Aliases (ts, py, sh, yml) resolve; unknown languages stay plain. */
  language?: string | undefined;
  labels?: CodeBlockLabels | undefined;
  className?: string | undefined;
};

// Common aliases to Shiki language names.
const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  sh: 'bash',
  zsh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  rb: 'ruby',
  rs: 'rust',
  kt: 'kotlin',
  'objective-c': 'objc',
};

/** Paper and ink themes in one pass: spans carry --shiki-light / --shiki-dark, markdown.css picks one. */
const THEMES = { light: 'github-light', dark: 'github-dark' } as const;

type Shiki = typeof import('shiki');
let shikiModule: Promise<Shiki> | null = null;
/** Shiki (and its grammars) load on the first code block, never with the page. */
const loadShiki = () => (shikiModule ??= import('shiki'));

// Small LRU of highlighted HTML: streaming re-renders the same blocks often.
const highlightCache = new Map<string, string>();
const CACHE_MAX_SIZE = 200;

async function highlight(code: string, lang: string): Promise<string> {
  const key = `${lang}:${code}`;
  const cached = highlightCache.get(key);
  if (cached) return cached;
  const { codeToHtml, bundledLanguages } = await loadShiki();
  const html = await codeToHtml(code, { lang: lang in bundledLanguages ? lang : 'text', themes: THEMES, defaultColor: false });
  if (highlightCache.size >= CACHE_MAX_SIZE) {
    const first = highlightCache.keys().next().value;
    if (first !== undefined) highlightCache.delete(first);
  }
  highlightCache.set(key, html);
  return html;
}

/**
 * CodeBlock — a fenced code block: the language and a copy button above,
 * the code on the sunk ground. Renders as plain text at once and swaps in
 * the Shiki highlighting when it is ready (or never, for unknown languages
 * and when Shiki fails to load).
 */
export function CodeBlock({ code, language, labels, className }: CodeBlockProps) {
  const lang = (() => {
    const lower = (language ?? '').toLowerCase();
    return LANGUAGE_ALIASES[lower] ?? lower;
  })();
  const [html, setHtml] = useState<string | null>(() => highlightCache.get(`${lang}:${code}`) ?? null);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!lang || lang === 'text' || lang === 'plaintext') {
      setHtml(null);
      return;
    }
    let cancelled = false;
    highlight(code, lang).then(
      (out) => !cancelled && setHtml(out),
      () => !cancelled && setHtml(null),
    );
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard refused (permissions, insecure context): nothing to confirm.
    }
  }, [code]);

  const copyLabel = labels?.copy ?? 'Copy code';
  const copiedLabel = labels?.copied ?? 'Copied';
  const title: ReactNode = lang && lang !== 'text' ? lang : (labels?.plainText ?? 'Plain text');

  return (
    <div className={cn('cx-md-code group/code my-3 overflow-hidden rounded-md bg-sunk first:mt-0 last:mb-0', className)} data-language={lang || undefined}>
      <div className="flex h-8 items-center justify-between pr-1 pl-3">
        <span className="text-meta text-fg-secondary">{title}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? copiedLabel : copyLabel}
          title={copyLabel}
          className="inline-grid size-6 cursor-pointer place-items-center rounded-xs border-0 bg-transparent p-0 text-fg-secondary outline-none transition-colors duration-[120ms] ease-standard hover:bg-hover hover:text-fg focus-visible:shadow-(--focus-ring)"
        >
          {copied ? <Check size={14} strokeWidth={1.75} aria-hidden /> : <Copy size={14} strokeWidth={1.75} aria-hidden />}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? copiedLabel : ''}
        </span>
      </div>
      <div className="overflow-x-auto px-3 pb-3">
        {html ? (
          <div className="cx-md-shiki" data-highlighted="" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="cx-md-pre">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

/** InlineCode — `code` in running text. */
export function InlineCode({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return <code className={cn('cx-md-inline-code rounded-xs bg-sunk px-[0.3em] py-[0.1em] text-[0.88em]', className)}>{children}</code>;
}
