/*
 * Adapted from Craft Agents (https://github.com/craft-ai-agents/craft-agents-oss),
 * packages/ui/src/components/markdown/Markdown.tsx.
 * Copyright 2026 Craft Docs Ltd. Licensed under the Apache License 2.0.
 * Modified by COSINE X LTD, 2026: one mode, restyled to the COSX Design
 * System 3.0 (14/15px sizes, CJK leading, hairline tables and quotes);
 * raw HTML (rehype-raw), preview blocks (datatable, spreadsheet, pdf, html,
 * mermaid, image, diff, json), collapsible sections, block ids, raw-URL and
 * file-path linkification and i18n removed; links go through a host
 * resolver or open externally without opener; images render as links;
 * citation markers render as Citation chips.
 */
import { memo, useMemo, type ComponentProps, type JSX } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { cn } from '@cosxai/ui';

import { Citation, type CitationLabels, type Citations } from '../Citation';
import { CodeBlock, InlineCode, type CodeBlockLabels } from './CodeBlock';
import { resolveMarkdownLink, type LinkResolver } from './link-target';
import { MARKDOWN_MATH_OPTIONS } from './math-options';
import { remarkCitations } from './remark-citations';
import { wrapWithSafeProxy } from './safe-components';
import { markdownUrlTransform } from './url-transform';

export type MarkdownLabels = CodeBlockLabels & {
  /** A task-list checkbox's accessible name. @default "Task" */
  task?: string | undefined;
};

export type MarkdownProps = {
  /** The markdown source. Re-renders cheaply while it streams. */
  children: string;
  /** `body` 15px for answers and documents (Chinese 16/1.8); `ui` 14px for product surfaces (drawers, cards). @default "body" */
  size?: 'body' | 'ui' | undefined;
  /** The answer's sources. `[[n]]` (or `[^n]`) with a number here renders a Citation chip; other numbers stay text. */
  citations?: Citations | undefined;
  citationLabels?: CitationLabels | undefined;
  /**
   * Offered every link's target first. Return a function to open it inside
   * the app (a document, a contact, `cosx://…`); return nothing and the link
   * opens as a URL — http(s) in a new tab without opener. Unsafe schemes
   * (javascript:, data:, file:) render as text.
   */
  resolveLink?: LinkResolver | undefined;
  labels?: MarkdownLabels | undefined;
  className?: string | undefined;
  id?: string | undefined;
};

type El<T extends keyof JSX.IntrinsicElements> = ComponentProps<T> & { node?: unknown };

const linkClass =
  'rounded-xs font-medium text-fg underline decoration-fg/35 decoration-1 underline-offset-[3px] outline-none transition-[text-decoration-color] duration-[120ms] ease-standard hover:decoration-fg focus-visible:shadow-(--focus-ring)';

function createComponents(options: {
  citations: Citations | undefined;
  citationLabels: CitationLabels | undefined;
  resolveLink: LinkResolver | undefined;
  labels: MarkdownLabels | undefined;
}): Partial<Components> {
  const { citations, citationLabels, resolveLink, labels } = options;
  const heading = 'mt-5 mb-2 font-medium tracking-heading text-fg first:mt-0';

  return {
    a: ({ href, children, node: _node, ...rest }: El<'a'>) => {
      const link = resolveMarkdownLink(href ?? '', resolveLink);
      switch (link.kind) {
        case 'app':
          return link.href ? (
            <a
              {...rest}
              href={link.href}
              className={linkClass}
              onClick={(e) => {
                // ⌘/Ctrl/Shift-click keeps the browser's new tab or window.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                link.open();
              }}
            >
              {children}
            </a>
          ) : (
            <button type="button" onClick={link.open} className={cn(linkClass, 'cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-[length:inherit]')}>
              {children}
            </button>
          );
        case 'external':
          return (
            <a {...rest} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {children}
            </a>
          );
        case 'plain':
          return (
            <a {...rest} href={link.href} className={linkClass}>
              {children}
            </a>
          );
        default:
          // Unsafe scheme: the text stays, the link goes.
          return <span data-link-removed="">{children}</span>;
      }
    },

    // Remote images are not fetched from an answer (tracking, exfiltration
    // through the URL): they render as a link to the image.
    img: ({ src, alt }: El<'img'>) => {
      const link = resolveMarkdownLink(typeof src === 'string' ? src : '', resolveLink);
      const text = alt || (typeof src === 'string' ? src : '');
      if (link.kind === 'text') return <span>{alt}</span>;
      if (link.kind === 'app') {
        return (
          <button type="button" onClick={link.open} className={cn(linkClass, 'cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-[length:inherit]')}>
            {text}
          </button>
        );
      }
      return (
        <a href={link.href} target={link.kind === 'external' ? '_blank' : undefined} rel="noopener noreferrer" className={linkClass}>
          {text}
        </a>
      );
    },

    code: ({ className, children, node: _node, ...rest }: El<'code'>) => {
      const lang = /language-([\w+#.-]+)/.exec(className ?? '')?.[1];
      const text = String(children ?? '');
      // A fenced block has a language class or spans lines; the rest is inline.
      if (lang || text.includes('\n')) return <CodeBlock code={text.replace(/\n$/, '')} language={lang} labels={labels} />;
      return <InlineCode {...rest}>{children}</InlineCode>;
    },
    // CodeBlock draws its own frame.
    pre: ({ children }: El<'pre'>) => <>{children}</>,

    span: ({ node: _node, children, ...rest }: El<'span'> & { 'data-citation'?: string }) => {
      const n = rest['data-citation'];
      const source = n !== undefined ? citations?.[Number(n)] : undefined;
      if (n !== undefined && source) return <Citation n={Number(n)} source={source} labels={citationLabels} />;
      return <span {...rest}>{children}</span>;
    },

    p: ({ children }: El<'p'>) => <p className="my-3 first:mt-0 last:mb-0">{children}</p>,
    ul: ({ children, className }: El<'ul'>) => (
      <ul className={cn('my-3 list-disc pl-6 first:mt-0 last:mb-0 marker:text-fg-secondary', className?.includes('contains-task-list') && 'list-none pl-0')}>{children}</ul>
    ),
    ol: ({ children, start }: El<'ol'>) => (
      <ol start={start} className="my-3 list-decimal pl-6 first:mt-0 last:mb-0 marker:text-fg-secondary marker:tabular-nums">
        {children}
      </ol>
    ),
    li: ({ children, className }: El<'li'>) => (
      <li className={cn('my-1 pl-0.5 [&>ol]:my-1 [&>p]:my-1 [&>ul]:my-1', className?.includes('task-list-item') && 'flex items-baseline gap-2 pl-0 [&>ul]:w-full')}>{children}</li>
    ),
    input: ({ type, checked }: El<'input'>) =>
      type === 'checkbox' ? (
        <input
          type="checkbox"
          checked={Boolean(checked)}
          readOnly
          disabled
          aria-label={labels?.task ?? 'Task'}
          className="relative top-[2px] m-0 size-[14px] shrink-0 accent-(--text-primary)"
        />
      ) : null,

    table: ({ children }: El<'table'>) => (
      <div className="my-4 overflow-x-auto first:mt-0 last:mb-0">
        <table className="w-full border-collapse text-[13px] leading-normal">{children}</table>
      </div>
    ),
    thead: ({ children }: El<'thead'>) => <thead>{children}</thead>,
    tbody: ({ children }: El<'tbody'>) => <tbody>{children}</tbody>,
    tr: ({ children }: El<'tr'>) => <tr>{children}</tr>,
    th: ({ children, style }: El<'th'>) => (
      <th scope="col" style={style} className="border-b border-rule bg-sunk px-3 py-2 text-left align-bottom text-meta font-medium whitespace-nowrap text-fg-secondary">
        {children}
      </th>
    ),
    td: ({ children, style }: El<'td'>) => (
      <td style={style} className="border-b border-rule-soft px-3 py-2 align-top tabular-nums">
        {children}
      </td>
    ),

    h1: ({ children }: El<'h1'>) => <h1 className={cn(heading, 'text-h3 leading-[1.3]')}>{children}</h1>,
    h2: ({ children }: El<'h2'>) => <h2 className={cn(heading, 'text-[16px] leading-[1.35]')}>{children}</h2>,
    h3: ({ children }: El<'h3'>) => <h3 className={cn(heading, 'text-[1em] leading-[1.4]')}>{children}</h3>,
    h4: ({ children }: El<'h4'>) => <h4 className={cn(heading, 'text-[1em] leading-[1.4] text-fg-secondary')}>{children}</h4>,
    h5: ({ children }: El<'h5'>) => <h5 className={cn(heading, 'text-[1em] text-fg-secondary')}>{children}</h5>,
    h6: ({ children }: El<'h6'>) => <h6 className={cn(heading, 'text-[1em] text-fg-secondary')}>{children}</h6>,
    blockquote: ({ children }: El<'blockquote'>) => (
      <blockquote className="my-3 border-l border-rule pl-4 text-fg-secondary first:mt-0 last:mb-0">{children}</blockquote>
    ),
    hr: () => <hr className="my-5 h-px border-0 bg-rule-soft" />,
    strong: ({ children }: El<'strong'>) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: El<'em'>) => <em className="italic">{children}</em>,
    del: ({ children }: El<'del'>) => <del className="text-fg-secondary">{children}</del>,
    // GFM footnotes that are not citations.
    sup: ({ children, node: _node, ...rest }: El<'sup'>) => (
      <sup {...rest} className="text-[0.75em]">
        {children}
      </sup>
    ),
    section: ({ children, node: _node, ...rest }: El<'section'>) => (
      <section {...rest} className={cn(rest.className, 'mt-5 border-t border-rule-soft pt-3 text-small text-fg-secondary [&_h2]:sr-only')}>
        {children}
      </section>
    ),
  };
}

/**
 * Markdown — renders an Agent answer or a document's markdown in the 3.0
 * type: GFM (tables, task lists, strikethrough), code blocks highlighted by
 * Shiki, KaTeX math ($$…$$; a single $ stays currency), safe links
 * and citation chips. Import "@cosxai/chat/markdown.css" once.
 *
 * Compose with: SourcesList and ScopeLine under the answer, from the same
 * `citations` map.
 *
 * Visual: design.cosx.co/pattern-agent.
 */
function MarkdownImpl({ children, size = 'body', citations, citationLabels, resolveLink, labels, className, id }: MarkdownProps) {
  const components = useMemo(
    () => wrapWithSafeProxy(createComponents({ citations, citationLabels, resolveLink, labels })),
    [citations, citationLabels, resolveLink, labels],
  );
  const known = useMemo(() => new Set(Object.keys(citations ?? {}).map(Number)), [citations]);
  const remarkPlugins = useMemo(
    () => [remarkGfm, [remarkMath, MARKDOWN_MATH_OPTIONS], [remarkCitations, { known }]] as NonNullable<ComponentProps<typeof ReactMarkdown>['remarkPlugins']>,
    [known],
  );

  return (
    <div
      id={id}
      className={cn(
        'cx-md min-w-0 font-sans break-words text-fg',
        size === 'body'
          ? 'text-body leading-[1.7] [&:lang(zh)]:text-[16px] [&:lang(zh)]:leading-[1.8]'
          : 'text-ui leading-[1.6] [&:lang(zh)]:leading-[1.75]',
        className,
      )}
    >
      <ReactMarkdown components={components} remarkPlugins={remarkPlugins} rehypePlugins={[rehypeKatex]} urlTransform={markdownUrlTransform}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

export const Markdown = memo(MarkdownImpl);
Markdown.displayName = 'Markdown';

