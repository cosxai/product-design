import { act, render, renderHook, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { a11y } from '../../test/a11y';
import { ActivityTimeline, initialsOf } from './ActivityTimeline';
import { Breadcrumb } from './Breadcrumb';
import { FileCard } from './FileCard';
import { FileList, FileRow } from './FileRow';
import { FolderTree, type TreeNode } from './FolderTree';
import { ListToolbar } from './ListToolbar';
import { PageHeader } from './PageHeader';
import { Steps } from './Steps';
import { useSelection } from './useSelection';
import { InfiniteLoader } from './VirtualList';

const ids = ['a', 'b', 'c', 'd', 'e'];

describe('useSelection', () => {
  it('toggles with ⌘, selects a range with ⇧, and a plain click opens when nothing is selected', () => {
    const { result } = renderHook(() => useSelection({ ids }));
    let handled = false;
    act(() => {
      handled = result.current.handleClick('b', { shiftKey: false, metaKey: false, ctrlKey: false });
    });
    expect(handled).toBe(false); // opens
    act(() => void result.current.handleClick('b', { shiftKey: false, metaKey: true, ctrlKey: false }));
    expect([...result.current.selected]).toEqual(['b']);
    act(() => void result.current.handleClick('d', { shiftKey: true, metaKey: false, ctrlKey: false }));
    expect([...result.current.selected].sort()).toEqual(['b', 'c', 'd']);
    // In selection mode a plain click toggles.
    expect(result.current.selectionMode).toBe(true);
    act(() => void result.current.handleClick('c', { shiftKey: false, metaKey: false, ctrlKey: false }));
    expect(result.current.isSelected('c')).toBe(false);
  });

  it('⌘A selects all, Esc clears, typing in a field is left alone', () => {
    function List() {
      const s = useSelection({ ids });
      return (
        <div tabIndex={0} onKeyDown={s.onKeyDown} data-testid="list">
          <input aria-label="filter" />
          <span data-testid="count">{s.count}</span>
        </div>
      );
    }
    render(<List />);
    const list = screen.getByTestId('list');
    list.focus();
    act(() => void list.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', metaKey: true, bubbles: true })));
    expect(screen.getByTestId('count')).toHaveTextContent('5');
    act(() => void list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    const input = screen.getByLabelText('filter');
    act(() => void input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', metaKey: true, bubbles: true })));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});

describe('FileCard', () => {
  it('opens from the card, but the tick, the star and inline actions never open it', async () => {
    const onOpen = vi.fn();
    const onStar = vi.fn();
    const onTick = vi.fn();
    const onRerender = vi.fn();
    render(
      <FileCard
        title="Site plan.dwg"
        state="failed"
        stateLabel="Render failed"
        onRerender={onRerender}
        onOpen={onOpen}
        onStarredChange={onStar}
        onSelectedChange={onTick}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Star' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select' }));
    await userEvent.click(screen.getByRole('button', { name: 'Re-render' }));
    expect(onStar).toHaveBeenCalledWith(true);
    expect(onTick).toHaveBeenCalledWith(true);
    expect(onRerender).toHaveBeenCalledOnce();
    expect(onOpen).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Site plan.dwg' }));
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it('in selection mode the whole card toggles (Space too) and says it is pressed', async () => {
    function Card() {
      const [on, setOn] = useState(false);
      return <FileCard title="Cap table.xlsx" selectionMode selected={on} onSelectedChange={setOn} onOpen={() => {}} />;
    }
    render(<Card />);
    const card = screen.getByRole('button', { name: 'Cap table.xlsx' });
    expect(card).toHaveAttribute('aria-pressed', 'false');
    card.focus();
    await userEvent.keyboard(' ');
    expect(card).toHaveAttribute('aria-pressed', 'true');
  });

  it('passes axe', async () => {
    const { container } = render(
      <div>
        <FileCard title="Shareholder agreement v3" type="PDF" statusLabel="Signed" status="complete" meta="Updated 2 hours ago" comments={4} onStarredChange={() => {}} onSelectedChange={() => {}} />
        <FileCard title="Link · Term sheet" kind="link" meta="Points to Legal / 2026" onRemoveLink={() => {}} />
      </div>,
    );
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe('FileRow and ListToolbar', () => {
  it('row: star never opens, name opens; list passes axe', async () => {
    const onOpen = vi.fn();
    const { container } = render(
      <FileList label="Documents" columns={{ name: 'Name', state: 'State', updated: 'Updated' }}>
        <FileRow name="Loan agreement.pdf" statusLabel="Password" status="attention" tone="attention" updated="in Legal / 2026" onOpen={onOpen} onStarredChange={() => {}} />
      </FileList>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Star' }));
    expect(onOpen).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Loan agreement.pdf' }));
    expect(onOpen).toHaveBeenCalledOnce();
    expect(await a11y(container)).toHaveNoViolations();
  });

  it('toolbar: says the search scope and switches it, removes filters, switches view', async () => {
    const onScope = vi.fn();
    const onRemove = vi.fn();
    const onView = vi.fn();
    const { container } = render(
      <ListToolbar
        query="agreement"
        onQueryChange={() => {}}
        onScopeChange={onScope}
        filters={[{ id: 'signed', label: 'Signed' }]}
        onFilterRemove={onRemove}
        view="list"
        onViewChange={onView}
        counts="2 folders · 14 documents"
      />,
    );
    expect(screen.getByText(/Searching this folder and its subfolders/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'This folder only' }));
    expect(onScope).toHaveBeenCalledWith('folder');
    await userEvent.click(screen.getByRole('button', { name: 'Remove filter Signed' }));
    expect(onRemove).toHaveBeenCalledWith('signed');
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('radio', { name: 'Cards' }));
    expect(onView).toHaveBeenCalledWith('cards');
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe('InfiniteLoader', () => {
  const original = globalThis.IntersectionObserver;
  afterEach(() => {
    globalThis.IntersectionObserver = original;
  });

  it('asks for more 200px early, and stops when there is no more', () => {
    let options: IntersectionObserverInit | undefined;
    let fire: (() => void) | undefined;
    globalThis.IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback, o?: IntersectionObserverInit) {
        options = o;
        fire = () => cb([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    } as unknown as typeof IntersectionObserver;
    const onLoadMore = vi.fn();
    const { rerender, container } = render(<InfiniteLoader hasMore onLoadMore={onLoadMore} />);
    expect(options?.rootMargin).toBe('0px 0px 200px 0px');
    act(() => fire!());
    expect(onLoadMore).toHaveBeenCalledOnce();
    rerender(<InfiniteLoader hasMore={false} onLoadMore={onLoadMore} />);
    expect(container).toBeEmptyDOMElement();
  });
});

const tree: TreeNode[] = [
  {
    id: 'room',
    label: 'Harbour data room',
    children: [
      {
        id: 'legal',
        label: 'Legal',
        children: [
          { id: 'sha', label: 'Shareholder agreements', meta: 12 },
          { id: 'side', label: 'Side letters', meta: 4 },
        ],
      },
      { id: 'fin', label: 'Financials', hasChildren: true },
    ],
  },
];

describe('FolderTree', () => {
  it('is a tree: arrows move, Right expands and steps in, Left steps out, Enter opens', async () => {
    const onSelect = vi.fn();
    render(<FolderTree label="Folders" nodes={tree} defaultExpandedIds={['room']} onSelect={onSelect} />);
    const room = screen.getByRole('treeitem', { name: /Harbour data room/ });
    expect(room).toHaveAttribute('aria-expanded', 'true');
    room.focus();
    await userEvent.keyboard('{ArrowDown}');
    const legal = screen.getByRole('treeitem', { name: /^Legal/ });
    expect(legal).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(legal).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('treeitem', { name: /Shareholder agreements/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(legal).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('treeitem', { name: /Financials/ })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(room).toHaveFocus();
    await userEvent.keyboard('s{Enter}');
    expect(onSelect).toHaveBeenCalledWith('sha');
  });

  it('the chevron expands without opening; lazy children load with a spinner', async () => {
    const onSelect = vi.fn();
    let resolve!: (n: TreeNode[]) => void;
    const loadChildren = vi.fn(() => new Promise<TreeNode[]>((r) => (resolve = r)));
    render(<FolderTree label="Folders" nodes={tree} defaultExpandedIds={['room']} onSelect={onSelect} loadChildren={loadChildren} />);
    const fin = screen.getByRole('treeitem', { name: /Financials/ });
    await userEvent.click(fin.querySelector('[aria-hidden] svg')!.parentElement!);
    expect(onSelect).not.toHaveBeenCalled();
    expect(loadChildren).toHaveBeenCalledWith('fin');
    expect(fin).toHaveAttribute('aria-busy', 'true');
    expect(within(fin).getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    await act(async () => resolve([{ id: 'q3', label: 'Q3 accounts' }]));
    expect(screen.getByRole('treeitem', { name: /Q3 accounts/ })).toBeInTheDocument();
  });

  it('revealId expands the ancestors and focuses the folder', async () => {
    render(<FolderTree label="Folders" nodes={tree} revealId="side" />);
    await waitFor(() => expect(screen.getByRole('treeitem', { name: /Side letters/ })).toBeInTheDocument());
    expect(screen.getByRole('treeitem', { name: /^Legal/ })).toHaveAttribute('aria-expanded', 'true');
  });

  it('checkbox mode: partial ticks on parents, Space ticks a whole branch', async () => {
    function Ticks() {
      const [checked, setChecked] = useState<string[]>(['sha']);
      return <FolderTree label="Folders" nodes={tree} defaultExpandedIds={['room', 'legal']} checkedIds={checked} onCheckedChange={setChecked} />;
    }
    render(<Ticks />);
    const legal = screen.getByRole('treeitem', { name: /^Legal/ });
    expect(legal).toHaveAttribute('aria-checked', 'mixed');
    legal.focus();
    await userEvent.keyboard(' ');
    expect(legal).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('treeitem', { name: /Side letters/ })).toHaveAttribute('aria-checked', 'true');
  });

  it('passes axe', async () => {
    const { container } = render(<FolderTree label="Folders" nodes={tree} defaultExpandedIds={['room', 'legal']} selectedId="sha" />);
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe('Breadcrumb', () => {
  const items = [{ label: 'Harbour data room', href: '#' }, { label: 'Series A', href: '#' }, { label: 'Legal', href: '#' }, { label: 'Shareholder agreement v3', tag: 'PDF' }];

  it('folds the middle beyond four segments; the current page is not a link', async () => {
    render(<Breadcrumb root={<span>MetaRoom</span>} items={items} />);
    expect(screen.getByRole('link', { name: 'Legal' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Series A' })).toBeNull();
    const current = screen.getByText('Shareholder agreement v3').closest('li')!;
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(within(current).queryByRole('link')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Show hidden folders' }));
    expect(await screen.findByRole('menuitem', { name: 'Series A' })).toBeInTheDocument();
  });

  it('does not fold at four or fewer', async () => {
    const { container } = render(<Breadcrumb items={items.slice(1)} />);
    expect(screen.queryByRole('button', { name: 'Show hidden folders' })).toBeNull();
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe('PageHeader, Steps, ActivityTimeline', () => {
  it('header: title is the heading, figures are a list of terms', async () => {
    const { container } = render(
      <PageHeader eyebrow="Project · Series A" title="Harbour data room" note="Syncing · 6,831 items" noteDot figures={[{ value: '214', label: 'Documents' }]} />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Harbour data room' })).toBeInTheDocument();
    expect(await a11y(container)).toHaveNoViolations();
  });

  it('steps: the current step is marked and each state is read out', async () => {
    const { container } = render(
      <Steps
        steps={[
          { title: 'Fill in investor form', state: 'done', detail: 'Done 22 Sep' },
          { title: 'Sign the NDA', state: 'current', detail: 'Current step' },
          { title: 'Open the data room', state: 'upcoming' },
          { title: 'Financial model', state: 'blocked', detail: 'Blocked · opens at the Term sheet stage' },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[3]).toHaveTextContent(/Financial model, Blocked/);
    expect(await a11y(container)).toHaveNoViolations();
  });

  it('timeline: groups under headings, times are <time>, initials handle Chinese names', async () => {
    expect(initialsOf('Anna Kowalski')).toBe('AK');
    expect(initialsOf('王志远')).toBe('王');
    const { container } = render(
      <ActivityTimeline
        groups={[
          { label: 'Today', events: [{ id: '1', actor: { name: 'Anna Kowalski' }, action: 'viewed Cap table.xlsx for 6 min', time: '14:02', dateTime: '2026-09-29T14:02', detail: 'pages 2–4 most' }] },
          { label: 'Yesterday', events: [{ id: '2', actor: { name: '王志远' }, action: 'signed the NDA', time: '17:15' }] },
          { label: 'Earlier', events: [] },
        ]}
      />,
    );
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Today', 'Yesterday']);
    expect(container.querySelector('time')).toHaveAttribute('datetime', '2026-09-29T14:02');
    expect(await a11y(container)).toHaveNoViolations();
  });
});
