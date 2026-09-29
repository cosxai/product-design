import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { a11y } from '../test/a11y';
import { Citation, type Citations } from './Citation';
import { Markdown } from './markdown/Markdown';
import { ScopeLine, SourcesList } from './Sources';

const citations: Citations = {
  1: { title: 'Contacts', location: 'Harbour Series A' },
  2: {
    title: 'Shareholder agreement v3',
    page: 14,
    excerpt: '…a Permitted Transferee includes a trust of which the Shareholder is the settlor…',
    onOpen: vi.fn(),
  },
  3: { title: 'Shareholder agreement v3', page: 15, href: '/documents/sha-v3#page=15' },
};

describe('Markdown · GFM', () => {
  it('renders tables with a head row and task lists as read-only checkboxes', async () => {
    const { container } = render(
      <Markdown>{['| Investor | Shares |', '| --- | ---: |', '| Anna Kowalski | 1,200 |', '', '- [x] Send NDA', '- [ ] Chase Maria', '', '~~old~~ new'].join('\n')}</Markdown>,
    );
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Investor', 'Shares']);
    expect(within(table).getByRole('cell', { name: '1,200' })).toHaveStyle({ textAlign: 'right' });

    const boxes = screen.getAllByRole('checkbox', { name: 'Task' });
    expect(boxes).toHaveLength(2);
    expect(boxes[0]).toBeChecked();
    expect(boxes[1]).not.toBeChecked();
    expect(boxes[0]).toBeDisabled();
    expect(container.querySelector('del')).toHaveTextContent('old');
    expect(await a11y(container)).toHaveNoViolations();
  });

  it('keeps single-dollar amounts as text and renders $$ maths with KaTeX', () => {
    const { container } = render(<Markdown>{'Raise $2M–$4M.\n\n$$\na^2 + b^2 = c^2\n$$'}</Markdown>);
    expect(container).toHaveTextContent('Raise $2M–$4M.');
    expect(container.querySelector('.katex-display')).not.toBeNull();
  });
});

describe('Markdown · code', () => {
  it('shows a plain block at once, then the Shiki highlighting', async () => {
    const { container } = render(<Markdown>{'```ts\nconst n: number = 1;\n```'}</Markdown>);
    expect(container.querySelector('pre.cx-md-pre')).toHaveTextContent('const n: number = 1;');
    expect(container.querySelector('[data-highlighted]')).toBeNull();

    await waitFor(() => expect(container.querySelector('[data-highlighted]')).not.toBeNull(), { timeout: 15000 });
    const highlighted = container.querySelector('[data-highlighted]')!;
    expect(highlighted).toHaveTextContent('const n: number = 1;');
    // Paper and ink colours both ride on the tokens.
    expect(highlighted.innerHTML).toContain('--shiki-light');
    expect(highlighted.innerHTML).toContain('--shiki-dark');
  }, 20000);

  it('copies the code and confirms it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Markdown labels={{ copy: 'Copy code', copied: 'Copied' }}>{'```\nnpm i @cosxai/chat\n```'}</Markdown>);
    expect(screen.getByText('Plain text')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(writeText).toHaveBeenCalledWith('npm i @cosxai/chat');
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('renders inline code inside the sentence', () => {
    const { container } = render(<Markdown>{'Run `pnpm test` first.'}</Markdown>);
    expect(container.querySelector('p > code')).toHaveTextContent('pnpm test');
  });
});

describe('Markdown · links', () => {
  it('neutralises unsafe URLs to text', () => {
    const { container } = render(<Markdown>{'[click me](javascript:alert(1)) and [data](data:text/html,hi)'}</Markdown>);
    expect(screen.queryByRole('link')).toBeNull();
    expect(container).toHaveTextContent('click me and data');
    expect(container.innerHTML).not.toContain('javascript:');
  });

  it('opens external links in a new tab without opener', () => {
    render(<Markdown>{'See [the spec](https://design.cosx.co/pattern-agent).'}</Markdown>);
    const link = screen.getByRole('link', { name: 'the spec' });
    expect(link).toHaveAttribute('href', 'https://design.cosx.co/pattern-agent');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('hands in-app targets to the resolver', async () => {
    const open = vi.fn();
    const resolveLink = vi.fn((href: string) => (href.startsWith('cosx://') ? open : undefined));
    render(<Markdown resolveLink={resolveLink}>{'Open [the cap table](cosx://document/42).'}</Markdown>);
    await userEvent.click(screen.getByRole('button', { name: 'the cap table' }));
    expect(resolveLink).toHaveBeenCalledWith('cosx://document/42');
    expect(open).toHaveBeenCalledOnce();
  });

  it('renders images as links, never fetching them', () => {
    const { container } = render(<Markdown>{'![Q3 chart](https://example.com/q3.png)'}</Markdown>);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByRole('link', { name: 'Q3 chart' })).toHaveAttribute('href', 'https://example.com/q3.png');
  });
});

describe('Citations', () => {
  const answer = 'Four investors have not signed. [[1]] Transfers to a family trust are allowed. [[2]] The threshold is 75%. [^3] See also [[7]].';

  it('renders known markers as chips and unknown numbers as text', () => {
    const { container } = render(<Markdown citations={citations}>{answer}</Markdown>);
    expect(screen.getByRole('button', { name: 'Source 1' })).toHaveTextContent('1');
    expect(screen.getByRole('button', { name: 'Source 2' })).toHaveTextContent('2');
    expect(screen.getByRole('link', { name: 'Source 3' })).toHaveAttribute('href', '/documents/sha-v3#page=15');
    expect(container).toHaveTextContent('See also [[7]].');
    expect(container.querySelectorAll('[data-citation]')).toHaveLength(3);
  });

  it('leaves markers in code alone and drops footnote definitions it turned into citations', () => {
    const { container } = render(<Markdown citations={citations}>{'Use `[[1]]` to cite. [^2]\n\n[^2]: Shareholder agreement'}</Markdown>);
    expect(container.querySelector('code')).toHaveTextContent('[[1]]');
    expect(screen.getByRole('button', { name: 'Source 2' })).toBeInTheDocument();
    expect(container.querySelector('section')).toBeNull();
  });

  it('shows the source card on focus and closes it on Escape', async () => {
    const { container } = render(<Markdown citations={citations}>{answer}</Markdown>);
    const chip = screen.getByRole('button', { name: 'Source 2' });
    act(() => chip.focus());
    const card = screen.getByRole('group', { name: 'Source 2' });
    expect(card).toHaveTextContent('Shareholder agreement v3');
    expect(card).toHaveTextContent('p. 14');
    expect(card).toHaveTextContent('“…a Permitted Transferee includes');
    expect(chip).toHaveAttribute('aria-describedby', card.id);
    // Portalled, so an overflow container (the Agent drawer) cannot clip it.
    expect(container.contains(card)).toBe(false);
    expect(await a11y(container)).toHaveNoViolations();
    expect(await a11y(card)).toHaveNoViolations();

    // Tab reaches the card's action; it opens the source at the page.
    await userEvent.tab();
    const action = within(card).getByRole('button', { name: 'Open at page 14' });
    expect(action).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(chip).toHaveFocus();
    await userEvent.tab();
    expect(action).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(citations[2]!.onOpen).toHaveBeenCalledOnce();
    expect(screen.queryByRole('group', { name: 'Source 2' })).toBeNull();

    act(() => chip.focus());
    expect(screen.getByRole('group', { name: 'Source 2' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('group', { name: 'Source 2' })).toBeNull();
    expect(chip).toHaveFocus();
  });

  it('shows the source card on hover', async () => {
    vi.useFakeTimers();
    try {
      render(<Markdown citations={citations}>{answer}</Markdown>);
      fireEvent.mouseEnter(screen.getByRole('button', { name: 'Source 1' }).parentElement!);
      act(() => vi.advanceTimersByTime(250));
      const card = screen.getByRole('group', { name: 'Source 1' });
      expect(card).toHaveTextContent('Contacts');
      expect(card).toHaveTextContent('Harbour Series A');
      fireEvent.mouseLeave(card);
      act(() => vi.advanceTimersByTime(200));
      expect(screen.queryByRole('group', { name: 'Source 1' })).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('opens the source when the chip itself is clicked', async () => {
    const onOpen = vi.fn();
    render(<Citation n={4} source={{ title: 'Cap table.xlsx', location: 'Row 12', onOpen }} labels={{ source: (n) => `来源 ${n}` }} />);
    await userEvent.click(screen.getByRole('button', { name: '来源 4' }));
    expect(onOpen).toHaveBeenCalledOnce();
  });
});

describe('SourcesList and ScopeLine', () => {
  it('lists every source in number order with its location', async () => {
    const { container } = render(<SourcesList citations={{ 3: citations[3]!, 1: citations[1]!, 2: citations[2]! }} />);
    const list = screen.getByRole('list', { name: 'Sources' });
    const items = within(list).getAllByRole('listitem');
    expect(items.map((li) => li.textContent)).toEqual(['1Contacts · Harbour Series A', '2Shareholder agreement v3 · p. 14', '3Shareholder agreement v3 · p. 15']);
    await userEvent.click(within(items[1]!).getByRole('button'));
    expect(citations[2]!.onOpen).toHaveBeenCalled();
    expect(within(items[2]!).getByRole('link')).toHaveAttribute('href', '/documents/sha-v3#page=15');
    expect(await a11y(container)).toHaveNoViolations();
  });

  it('says how many sources and the scope', () => {
    render(
      <>
        <ScopeLine count={3} scope="Harbour Series A only" />
        <ScopeLine count={1} />
        <ScopeLine count={2} scope="仅限 Harbour Series A" sourcesLabel={(n) => `${n} 个来源`} />
      </>,
    );
    expect(screen.getByText('3 sources · Harbour Series A only')).toBeInTheDocument();
    expect(screen.getByText('1 source')).toBeInTheDocument();
    expect(screen.getByText('2 个来源 · 仅限 Harbour Series A')).toBeInTheDocument();
  });
});
