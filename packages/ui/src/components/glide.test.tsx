import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { cn } from '../lib/cn';
import { FolderTree, type TreeNode } from './FolderTree';
import { SegmentedControl } from './SegmentedControl';
import { GlideIndicator, glideTransition, useGlide, type GlideAxis } from './useGlide';

// jsdom has no layout: items are laid out from data-x / data-y (40×38 cells),
// the container is 400×300 at the origin, and the block reads back its insets.
const W = 400;
const H = 300;
function rectOf(el: HTMLElement): DOMRect {
  if (el.hasAttribute('data-glide-indicator')) {
    const c = el.parentElement!;
    const left = parseFloat(el.style.left) - c.scrollLeft;
    const top = parseFloat(el.style.top) - c.scrollTop;
    const width = W - parseFloat(el.style.left) - parseFloat(el.style.right);
    const height = H - parseFloat(el.style.top) - parseFloat(el.style.bottom);
    return DOMRect.fromRect({ x: left, y: top, width, height });
  }
  if (el.dataset.x !== undefined) {
    const c = el.closest<HTMLElement>('[data-box]')!;
    return DOMRect.fromRect({ x: Number(el.dataset.x) - c.scrollLeft, y: Number(el.dataset.y) - c.scrollTop, width: 40, height: 38 });
  }
  return DOMRect.fromRect({ x: 0, y: 0, width: W, height: H });
}

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    return rectOf(this);
  });
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (this: HTMLElement) {
    return this.hasAttribute('data-box') ? W : 0;
  });
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (this: HTMLElement) {
    return this.hasAttribute('data-box') ? H : 0;
  });
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function List({ value, axis = 'y', keys = ['a', 'b', 'c', 'd', 'e'] }: { value: string | null; axis?: GlideAxis; keys?: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const glide = useGlide(ref, value, { axis });
  return (
    <div ref={ref} data-box="" data-testid="box" className="overflow-auto">
      <GlideIndicator glide={glide} />
      {keys.map((k, i) => (
        <div
          key={k}
          data-glide-key={k}
          data-testid={k}
          data-x={axis === 'x' ? i * 50 : 10}
          data-y={axis === 'y' ? 12 + i * 42 : 3}
          className={cn('rounded-md', k === value && !glide.active && 'bg-brand-field')}
        />
      ))}
    </div>
  );
}

const e2y = () => screen.getByTestId('e').getBoundingClientRect().top;
const block = () => document.querySelector<HTMLElement>('[data-glide-indicator]')!;
const insets = () => {
  const s = block().style;
  return [s.left, s.top, s.right, s.bottom];
};

describe('useGlide', () => {
  it('sits on the selection at first paint without animating; the item drops its own field', () => {
    render(<List value="b" />);
    expect(block().style.transition).toBe('none');
    expect(block().style.opacity).toBe('1');
    // b: x 10, y 54, 40×38 → right 400-50, bottom 300-92
    expect(insets()).toEqual(['10px', '54px', '350px', '208px']);
    expect(screen.getByTestId('b').className).not.toContain('bg-brand-field');
    expect(block().getAttribute('aria-hidden')).toBe('true');
  });

  it('down the column: the bottom edge leads, the top follows 50ms later and longer for a farther jump', () => {
    const { rerender } = render(<List value="a" />);
    rerender(<List value="b" />);
    expect(block().style.transition).toBe(glideTransition('y', true, 1));
    expect(block().style.transition.startsWith('bottom 200ms cubic-bezier(.16,1,.3,1), top 300ms cubic-bezier(.16,1,.3,1) 50ms')).toBe(true);
    rerender(<List value="e" />);
    // three items on: 300 + 40×2
    expect(block().style.transition.startsWith('bottom 200ms cubic-bezier(.16,1,.3,1), top 380ms')).toBe(true);
    // it lands exactly on e
    expect(insets()).toEqual(['10px', '180px', '350px', '82px']);
  });

  it('back up the column: the top edge leads', () => {
    const { rerender } = render(<List value="d" />);
    rerender(<List value="a" />);
    expect(block().style.transition.startsWith('top 200ms cubic-bezier(.16,1,.3,1), bottom 380ms')).toBe(true);
  });

  it('along a row: right leads going right, left leads going left; cross edges 240ms', () => {
    const { rerender } = render(<List axis="x" value="a" />);
    rerender(<List axis="x" value="c" />);
    expect(block().style.transition).toBe(
      'right 200ms cubic-bezier(.16,1,.3,1), left 340ms cubic-bezier(.16,1,.3,1) 50ms, top 240ms cubic-bezier(.16,1,.3,1), bottom 240ms cubic-bezier(.16,1,.3,1), border-radius 200ms cubic-bezier(.16,1,.3,1)',
    );
    rerender(<List axis="x" value="b" />);
    expect(block().style.transition.startsWith('left 200ms')).toBe(true);
  });

  it('a fast second click turns from where the block is now, not from the last target', () => {
    const { rerender } = render(<List axis="x" value="c" />);
    rerender(<List axis="x" value="e" />);
    // Mid-flight the block is still near c (x 100): fake it at x 150 (d).
    block().style.left = '150px';
    block().style.right = `${W - 190}px`;
    // b (x 50) is behind it → leading edge is the left one
    rerender(<List axis="x" value="b" />);
    expect(block().style.transition.startsWith('left 200ms')).toBe(true);
    expect(insets()[0]).toBe('50px');
  });

  it('the stretch is capped at six items', () => {
    expect(glideTransition('x', true, 40)).toContain('left 540ms');
    expect(glideTransition('x', true, 1)).toContain('left 300ms');
  });

  it('reduced motion jumps', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), addEventListener() {}, removeEventListener() {} }));
    const { rerender } = render(<List value="a" />);
    rerender(<List value="e" />);
    expect(block().style.transition).toBe('none');
    expect(insets()[1]).toBe('180px');
  });

  it('the same selection in a new place snaps (the list changed above it)', () => {
    const { rerender } = render(<List value="c" />);
    rerender(<List value="c" keys={['z', 'a', 'b', 'c', 'd']} />);
    expect(block().style.transition).toBe('none');
    expect(insets()[1]).toBe('138px');
  });

  it('lives in the scrolled content: insets add the scroll offset', () => {
    const { rerender } = render(<List value="a" />);
    const box = screen.getByTestId('box');
    Object.defineProperty(box, 'scrollTop', { value: 100, configurable: true });
    // e sits at y 80 in the viewport, 180 in the content
    expect(e2y()).toBe(80);
    rerender(<List value="e" />);
    expect(insets()[1]).toBe('180px');
  });

  it('no selection (or it is not rendered): hidden, and items paint their own', () => {
    const { rerender } = render(<List value="nope" />);
    expect(block().style.opacity).toBe('0');
    rerender(<List value="b" />);
    expect(block().style.opacity).toBe('1');
    expect(block().style.transition).toBe('none');
    rerender(<List value={null} />);
    expect(block().style.opacity).toBe('0');
  });
});

describe('SegmentedControl glide', () => {
  it('one brand-field block, md is 44px (38px segments); the selection moves it', async () => {
    const { container } = render(
      <SegmentedControl
        aria-label="Show"
        defaultValue="recent"
        segments={[
          { value: 'recent', label: 'Recent' },
          { value: 'starred', label: 'Starred' },
          { value: 'all', label: 'All' },
        ]}
      />,
    );
    const indicator = container.querySelector<HTMLElement>('[data-glide-indicator]')!;
    expect(indicator.className).toContain('bg-brand-field');
    const recent = screen.getByRole('radio', { name: 'Recent' });
    expect(recent.className).toContain('h-[38px]');
    expect(recent.className).not.toContain('bg-brand-field');
    await userEvent.click(screen.getByRole('radio', { name: 'All' }));
    expect(screen.getByRole('radio', { name: 'All' })).toBeChecked();
    expect(indicator.style.opacity).toBe('1');
  });

  it('compact is 34px (28px segments)', () => {
    render(<SegmentedControl aria-label="Show" size="compact" segments={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />);
    expect(screen.getByRole('radio', { name: 'A' }).className).toContain('h-7');
  });
});

describe('FolderTree in a gliding sidebar', () => {
  // Rows stack 34px apart in document order (nav buttons, then the tree's rows).
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.hasAttribute('data-glide-indicator')) return rectOf(this);
      const key = this.getAttribute('data-glide-key');
      const box = this.closest<HTMLElement>('[data-box]');
      if (key !== null && box) {
        const i = Array.from(box.querySelectorAll('[data-glide-key]')).indexOf(this);
        return DOMRect.fromRect({ x: 0, y: i * 34, width: 200, height: 34 });
      }
      return DOMRect.fromRect({ x: 0, y: 0, width: W, height: H });
    });
  });

  const nodes: TreeNode[] = [
    {
      id: 'room',
      label: 'Harbour data room',
      children: [
        { id: 'legal', label: 'Legal', children: [{ id: 'sha', label: 'Shareholder agreements' }, { id: 'side', label: 'Side letters' }] },
        { id: 'fin', label: 'Financials' },
      ],
    },
  ];

  function Sidebar({ value }: { value: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const glide = useGlide(ref, value, { axis: 'y' });
    return (
      <div ref={ref} data-box="" className="overflow-y-auto">
        <GlideIndicator glide={glide} />
        <nav>
          {['recent', 'all'].map((k) => (
            <button key={k} type="button" data-glide-key={k} className={cn(k === value && !glide.active && 'bg-brand-field')}>
              {k}
            </button>
          ))}
        </nav>
        <FolderTree label="Folders" nodes={nodes} defaultExpandedIds={['room', 'legal']} selectedId={value} glide={glide} />
      </div>
    );
  }

  const row = (name: RegExp) => screen.getByRole('treeitem', { name }).firstElementChild as HTMLElement;

  it('rows carry data-glide-key; the selected row leaves its field to the block but keeps ink and weight', () => {
    render(<Sidebar value="fin" />);
    const fin = row(/^Financials/);
    expect(fin).toHaveAttribute('data-glide-key', 'fin');
    expect(fin.className).not.toContain('bg-brand-field');
    expect(fin.className).toContain('font-medium');
    expect(fin.className).toContain('text-ink');
    // the nested row is found: recent, all, room, legal, sha, side, fin → 7th
    expect(block().style.opacity).toBe('1');
    expect(block().style.top).toBe(`${6 * 34}px`);
  });

  it('without glide the selected row paints its own field', () => {
    render(<FolderTree label="Folders" nodes={nodes} defaultExpandedIds={['room']} selectedId="fin" />);
    expect(row(/^Financials/).className).toContain('bg-brand-field');
  });

  it('glides from a nav button down into the tree', () => {
    const { rerender } = render(<Sidebar value="recent" />);
    rerender(<Sidebar value="sha" />);
    expect(block().style.transition.startsWith('bottom 200ms')).toBe(true);
    expect(block().style.top).toBe(`${4 * 34}px`);
  });

  it('collapsing a folder above the selection snaps the block to the row\'s new place', async () => {
    render(<Sidebar value="fin" />);
    expect(block().style.top).toBe(`${6 * 34}px`);
    screen.getByRole('treeitem', { name: /^Legal/ }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('treeitem', { name: /^Legal/ })).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(block().style.top).toBe(`${4 * 34}px`));
    expect(block().style.transition).toBe('none');
  });
});
