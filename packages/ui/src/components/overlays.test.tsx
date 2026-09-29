import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { a11y } from '../../test/a11y';
import { Button } from './Button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './Dialog';
import { Table, type TableSort } from './Table';
import { TabPanel, Tabs } from './Tabs';
import { Toaster, toast } from './Toast';
import { Tooltip } from './Tooltip';


describe('Tabs', () => {
  const items = [
    { value: 'overview', label: 'Overview' },
    { value: 'documents', label: 'Documents', count: 3 },
    { value: 'parties', label: 'Parties', count: 0 },
  ];

  it('arrow keys move and aria-selected follows; onChange reports the value', async () => {
    const onChange = vi.fn();
    render(
      <Tabs items={items} defaultValue="overview" onChange={onChange} label="Project">
        <TabPanel value="overview">Overview panel</TabPanel>
        <TabPanel value="documents">Documents panel</TabPanel>
        <TabPanel value="parties">Parties panel</TabPanel>
      </Tabs>,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(tabs[0]!);
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(onChange).toHaveBeenLastCalledWith('documents');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Documents panel');
    await userEvent.keyboard('{End}');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('count shows as a badge, hidden at zero', () => {
    render(<Tabs items={items} defaultValue="overview" label="Project" />);
    expect(screen.getByRole('tab', { name: 'Documents 3' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Parties' })).toBeInTheDocument();
  });

  it('passes axe (both variants)', async () => {
    const { container } = render(
      <div>
        <Tabs items={items} defaultValue="overview" label="Underline">
          <TabPanel value="overview">a</TabPanel>
        </Tabs>
        <Tabs variant="pills" items={items} defaultValue="documents" label="Pills">
          <TabPanel value="documents">b</TabPanel>
        </Tabs>
      </div>,
    );
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe('Dialog', () => {
  function Revoke() {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Revoke share</Button>
        </DialogTrigger>
        <DialogContent
          size="sm"
          title="Revoke this share?"
          description="Anna loses access now."
          footer={
            <>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button variant="danger">Revoke share</Button>
            </>
          }
        />
      </Dialog>
    );
  }

  it('is labelled by its title and described by its consequence', async () => {
    render(<Revoke />);
    await userEvent.click(screen.getByRole('button', { name: 'Revoke share' }));
    const dialog = screen.getByRole('dialog', { name: 'Revoke this share?' });
    expect(dialog).toHaveAccessibleDescription('Anna loses access now.');
  });

  it('traps focus, closes on Esc and returns focus to the trigger', async () => {
    render(<Revoke />);
    const trigger = screen.getByRole('button', { name: 'Revoke share' });
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
    for (let i = 0; i < 6; i++) {
      await userEvent.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('passes axe while open', async () => {
    render(<Revoke />);
    await userEvent.click(screen.getByRole('button', { name: 'Revoke share' }));
    expect(await a11y(document.body)).toHaveNoViolations();
  });
});

describe('Toast', () => {
  afterEach(() => {
    act(() => toast.reset());
    vi.useRealTimers();
  });

  it('is announced in a live region and leaves after 4s (8s with an action)', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast({ title: 'Link copied.' });
      toast({ title: '3 files moved to Archive.', status: 'complete', action: { label: 'Undo', onClick: () => {} } });
    });
    // Radix announces toasts through a status live region.
    expect(document.querySelector('[role="status"][aria-live]')).not.toBeNull();
    expect(screen.getByText('Link copied.')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4100));
    expect(screen.queryByText('Link copied.')).not.toBeInTheDocument();
    expect(screen.getByText('3 files moved to Archive.')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByText('3 files moved to Archive.')).not.toBeInTheDocument();
  });

  it('shows the same error once per 30 seconds and at most three at once', () => {
    render(<Toaster />);
    act(() => {
      expect(toast({ title: "Couldn't rename the folder.", status: 'error' })).not.toBeNull();
      expect(toast({ title: "Couldn't rename the folder.", status: 'error' })).toBeNull();
      toast({ title: 'One.' });
      toast({ title: 'Two.' });
      toast({ title: 'Three.' });
    });
    expect(screen.queryByText("Couldn't rename the folder.")).not.toBeInTheDocument();
    expect(screen.getByText('Three.')).toBeInTheDocument();
  });

  it('never takes focus', () => {
    render(
      <>
        <button>Work</button>
        <Toaster />
      </>,
    );
    screen.getByRole('button', { name: 'Work' }).focus();
    act(() => void toast({ title: 'Link copied.' }));
    expect(screen.getByRole('button', { name: 'Work' })).toHaveFocus();
  });
});

describe('Tooltip', () => {
  it('opens on keyboard focus as well as hover', async () => {
    render(
      <Tooltip content="Downloads are off for this share">
        <button>Share</button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Share' })).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Downloads are off for this share');
  });

  it('opens on hover', async () => {
    render(
      <Tooltip content="Star" delay={0}>
        <button>☆</button>
      </Tooltip>,
    );
    await userEvent.hover(screen.getByRole('button'));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Star');
  });
});

describe('Table', () => {
  type Row = { id: string; status?: 'attention' | 'error'; task: string; docs: number };
  const rows: Row[] = [
    { id: 'T-119', task: 'Translate the term sheet', docs: 1 },
    { id: 'T-122', status: 'error', task: 'Prepare the data room index', docs: 20 },
    { id: 'T-131', status: 'attention', task: 'Sign the engagement letter', docs: 2 },
  ];
  const columns = [
    { key: 'task', label: 'Task', sortable: true },
    { key: 'docs', label: 'Docs', align: 'right' as const, sortable: true },
  ];

  function Sorted({ onRowClick }: { onRowClick: (r: Row) => void }) {
    const [sort, setSort] = useState<TableSort>({ key: 'task', direction: 'asc' });
    return <Table caption="Review queue" columns={columns} rows={rows} sort={sort} onSortChange={setSort} onRowClick={onRowClick} />;
  }

  it('sorting sets aria-sort on the header', async () => {
    render(<Sorted onRowClick={() => {}} />);
    const [task, docs] = screen.getAllByRole('columnheader');
    expect(task).toHaveAttribute('aria-sort', 'ascending');
    expect(docs).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(within(docs!).getByRole('button', { name: 'Docs' }));
    expect(docs).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.click(within(docs!).getByRole('button', { name: 'Docs' }));
    expect(docs).toHaveAttribute('aria-sort', 'descending');
  });

  it('rows open on click and on Enter from the keyboard', async () => {
    const onRowClick = vi.fn();
    render(<Sorted onRowClick={onRowClick} />);
    const row = screen.getByRole('row', { name: /Prepare the data room index/ });
    await userEvent.click(row);
    expect(onRowClick).toHaveBeenLastCalledWith(rows[1]);
    row.focus();
    await userEvent.keyboard('{Enter}');
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it('rows needing a person take a wash; the title can be a real link', () => {
    render(<Table columns={columns} rows={rows} rowHref={(r) => `/tasks/${r.id}`} />);
    expect(screen.getByRole('row', { name: /data room/ }).className).toMatch(/bg-error-wash/);
    expect(screen.getByRole('row', { name: /engagement letter/ }).className).toMatch(/bg-attention-wash/);
    expect(screen.getByRole('link', { name: 'Sign the engagement letter' })).toHaveAttribute('href', '/tasks/T-131');
  });

  it('empty and loading', () => {
    const { rerender } = render(<Table columns={columns} rows={[]} empty="No tasks yet." />);
    expect(screen.getByText('No tasks yet.')).toBeInTheDocument();
    rerender(<Table columns={columns} rows={[]} loading />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
  });

  it('passes axe', async () => {
    const { container } = render(<Sorted onRowClick={() => {}} />);
    expect(await a11y(container)).toHaveNoViolations();
  });
});
