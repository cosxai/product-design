import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Plus, Upload } from 'lucide-react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { a11y } from '../../test/a11y';
import {
  ActionBar,
  ActionBarProvider,
  arrange,
  formatShortcut,
  useActionBarActivity,
  useActionBarItems,
  useActionBarMode,
  useActionBarSelection,
  type ActionBarAction,
} from './ActionBar';
import { Button } from './Button';
import { CommandPalette, type CommandSource } from './CommandPalette';
import { ConfirmDialog, PromptDialog, StepUpDialog } from './ConfirmDialog';
import { Menu, MenuContent, MenuGroup, MenuItem, MenuSeparator, MenuTrigger } from './Menu';
import { SidePanel, SidePanelProvider, SidePanelSlot, useSidePanel } from './SidePanel';

const act_ = (id: string, extra: Partial<ActionBarAction> = {}): ActionBarAction => ({ id, label: id, onSelect: vi.fn(), ...extra });

function Page({ actions }: { actions: ActionBarAction[] }) {
  useActionBarItems('page', actions);
  return null;
}

describe('ActionBar', () => {
  it('shows registered actions and hides when the page withdraws them', () => {
    const view = render(
      <ActionBarProvider storageKey={null}>
        <Page actions={[act_('New', { icon: Plus, shortcut: 'n' }), act_('Upload', { icon: Upload })]} />
        <ActionBar presentation="full" />
      </ActionBarProvider>,
    );
    expect(screen.getByRole('toolbar', { name: 'Actions' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New/ })).toBeInTheDocument();
    view.rerender(
      <ActionBarProvider storageKey={null}>
        <ActionBar presentation="full" />
      </ActionBarProvider>,
    );
    expect(screen.queryByRole('toolbar')).toBeNull();
  });

  it('runs a shortcut while folded, but not from inside a text field', async () => {
    const onNew = vi.fn();
    render(
      <ActionBarProvider storageKey={null} defaultFolded>
        <Page actions={[act_('New', { onSelect: onNew, shortcut: 'n' })]} />
        <input aria-label="Search" />
        <ActionBar />
      </ActionBarProvider>,
    );
    expect(screen.queryByRole('toolbar')).toBeNull();
    expect(screen.getByRole('button', { name: 'Show the action bar' })).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'n' });
    expect(onNew).toHaveBeenCalledOnce();
    await userEvent.type(screen.getByLabelText('Search'), 'n');
    expect(onNew).toHaveBeenCalledOnce();
  });

  it('\\ folds and unfolds', () => {
    render(
      <ActionBarProvider storageKey={null}>
        <Page actions={[act_('New')]} />
        <ActionBar presentation={undefined} />
      </ActionBarProvider>,
    );
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: '\\' });
    expect(screen.queryByRole('toolbar')).toBeNull();
    fireEvent.keyDown(document.body, { key: '\\' });
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('swaps to the selection and to a mode; Esc steps back mode → selection → idle', () => {
    function Harness() {
      const [count, setCount] = useState(3);
      const [mode, setMode] = useState(true);
      useActionBarItems('page', [act_('New')]);
      useActionBarSelection('list', { count, actions: [act_('Share'), act_('Delete')], onClear: () => setCount(0) });
      useActionBarMode('viewer', mode ? { name: 'Comment', actions: [act_('Resolve all')], onDone: () => setMode(false) } : null);
      return <ActionBar presentation="full" />;
    }
    render(
      <ActionBarProvider storageKey={null}>
        <Harness />
      </ActionBarProvider>,
    );
    const bar = () => screen.getByRole('toolbar');
    expect(bar()).toHaveAttribute('data-state', 'mode');
    expect(screen.getByText('Comment')).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(bar()).toHaveAttribute('data-state', 'selection');
    expect(screen.getByText('3 selected')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'New' })).toBeNull();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(bar()).toHaveAttribute('data-state', 'idle');
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
  });

  it('a selection unfolds a folded bar; back in idle it folds again', () => {
    function Harness() {
      const [count, setCount] = useState(0);
      useActionBarItems('page', [act_('Select', { shortcut: 's', onSelect: () => setCount(2) })]);
      useActionBarSelection('list', { count, actions: [act_('Move')], onClear: () => setCount(0) });
      return <ActionBar />;
    }
    render(
      <ActionBarProvider storageKey={null} defaultFolded>
        <Harness />
      </ActionBarProvider>,
    );
    expect(screen.queryByRole('toolbar')).toBeNull();
    act(() => void fireEvent.keyDown(document.body, { key: 's' }));
    expect(screen.getByRole('toolbar')).toHaveAttribute('data-state', 'selection');
    act(() => void fireEvent.keyDown(document.body, { key: 'Escape' }));
    expect(screen.queryByRole('toolbar')).toBeNull();
    expect(screen.getByRole('button', { name: 'Show the action bar' })).toBeInTheDocument();
  });

  it('folds more than two actions of a kind into one group, and past the limit into More', () => {
    const a = [act_('a'), act_('b', { group: 'Export' }), act_('c', { group: 'Export' }), act_('d', { group: 'Export' }), act_('e')];
    const e = arrange(a, 6, 'More');
    expect(e.map((x) => (x.kind === 'action' ? x.action.id : `[${x.label}:${x.actions.map((y) => y.id).join('')}]`))).toEqual(['a', '[Export:bcd]', 'e']);
    const many = arrange(['1', '2', '3', '4', '5', '6', '7', '8'].map((id) => act_(id)), 6, 'More');
    expect(many).toHaveLength(6);
    expect(many[5]).toMatchObject({ kind: 'group', label: 'More' });
    expect((many[5] as { actions: ActionBarAction[] }).actions.map((x) => x.id)).toEqual(['6', '7', '8']);
  });

  it('formats shortcuts', () => {
    expect(formatShortcut('n')).toBe('N');
    expect(formatShortcut('shift+s')).toBe('⇧S');
  });

  it('the folded handle carries the activity for screen readers', () => {
    function Busy() {
      useActionBarItems('page', [act_('New')]);
      useActionBarActivity('sync', 'Importing 2 batches');
      return <ActionBar presentation="folded" />;
    }
    render(
      <ActionBarProvider storageKey={null}>
        <Busy />
      </ActionBarProvider>,
    );
    expect(screen.getByRole('button', { name: 'Show the action bar · Importing 2 batches' })).toBeInTheDocument();
  });

  it('arrow keys move along the toolbar; passes axe', async () => {
    const { container } = render(
      <ActionBarProvider storageKey={null}>
        <Page actions={[act_('New', { icon: Plus }), act_('Upload', { icon: Upload })]} />
        <ActionBar presentation="full" />
      </ActionBarProvider>,
    );
    screen.getByRole('button', { name: 'New' }).focus();
    fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: 'Upload' })).toHaveFocus();
    expect(await a11y(container)).toHaveNoViolations();
  });

  it('icons-only buttons keep their names', () => {
    render(
      <ActionBarProvider storageKey={null}>
        <Page actions={[act_('Upload', { icon: Upload, shortcut: 'u' })]} />
        <ActionBar presentation="icons" />
      </ActionBarProvider>,
    );
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
  });
});

describe('Menu', () => {
  it('opens from the keyboard, groups, shortcuts, disabled reason', async () => {
    const onPrefs = vi.fn();
    render(
      <Menu>
        <MenuTrigger asChild>
          <Button>Account</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuGroup label="Customer">
            <MenuItem shortcut="⌘," onSelect={onPrefs}>
              Preferences
            </MenuItem>
            <MenuItem disabledReason="Admins only">Workspace admin</MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem destructive>Sign out</MenuItem>
        </MenuContent>
      </Menu>,
    );
    screen.getByRole('button', { name: 'Account' }).focus();
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    expect(screen.getByRole('menuitem', { name: /Workspace admin/ })).toHaveAttribute('data-disabled');
    expect(screen.getByText('Admins only')).toBeInTheDocument();
    await userEvent.keyboard('{Enter}');
    expect(onPrefs).toHaveBeenCalledOnce();
    expect(menu).not.toBeInTheDocument();
  });
});

describe('CommandPalette', () => {
  it('shows fast results first, keeps the spinner until every source returns, only then says nothing matches', async () => {
    let slowResolve!: (v: []) => void;
    const onOpen = vi.fn();
    const sources: CommandSource[] = [
      { id: 'titles', label: 'Documents · titles', search: async () => [{ id: 'cap', title: 'Cap table.xlsx', onSelect: onOpen }] },
      { id: 'full', label: 'Full text', search: () => new Promise((r) => (slowResolve = r)) },
    ];
    render(<CommandPalette open onOpenChange={() => {}} sources={sources} debounce={0} actions={(q) => [{ id: 'ask', title: `Ask the Agent about “${q}”`, onSelect: () => {} }]} />);
    await userEvent.type(screen.getByRole('combobox'), 'cap');
    expect(await screen.findByText('Cap table.xlsx')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Searching' })).toBeInTheDocument();
    expect(screen.getByText(/arriving/)).toBeInTheDocument();
    expect(screen.getByText('Ask the Agent about “cap”')).toBeInTheDocument();
    await act(async () => slowResolve([]));
    await waitFor(() => expect(screen.queryByRole('status', { name: 'Searching' })).toBeNull());
    await userEvent.keyboard('{Enter}');
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it('says nothing matches only after all sources are empty', async () => {
    let resolve!: (v: []) => void;
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        debounce={0}
        sources={[
          { id: 'a', label: 'A', search: async () => [] },
          { id: 'b', label: 'B', search: () => new Promise((r) => (resolve = r)) },
        ]}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'zz');
    await waitFor(() => expect(screen.getByRole('status', { name: 'Searching' })).toBeInTheDocument());
    expect(screen.queryByText(/Nothing matches/)).toBeNull();
    await act(async () => resolve([]));
    expect(await screen.findByText('Nothing matches “zz”.')).toBeInTheDocument();
  });
});

describe('SidePanel', () => {
  function Layout() {
    const { open } = useSidePanel();
    return (
      <div className="flex">
        <main>
          <button onClick={() => open('share')}>Share</button>
          <button onClick={() => open('agent')}>Agent</button>
        </main>
        <SidePanelSlot />
        <SidePanel id="share" title="Share · Cap table.xlsx">
          people
        </SidePanel>
        <SidePanel id="agent" title="Agent">
          chat
        </SidePanel>
      </div>
    );
  }
  it('one slot: opening one closes the other; Esc closes', async () => {
    render(
      <SidePanelProvider>
        <Layout />
      </SidePanelProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Share' }));
    expect(screen.getByRole('complementary', { name: 'Share · Cap table.xlsx' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Agent' }));
    expect(screen.queryByRole('complementary', { name: 'Share · Cap table.xlsx' })).toBeNull();
    expect(screen.getByRole('complementary', { name: 'Agent' })).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(screen.queryByRole('complementary')).toBeNull();
  });
});

describe('ConfirmDialog', () => {
  it('stays off until the word is typed, then runs and closes', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onOpenChange = vi.fn();
    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Revoke this share and 4 forwards?"
        description="Anna and the 4 people she forwarded it to lose access now."
        confirmLabel="Revoke share"
        destructive
        confirmWord="revoke"
        onConfirm={onConfirm}
      />,
    );
    const primary = screen.getByRole('button', { name: 'Revoke share' });
    expect(primary).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Type revoke to confirm'), 'revo');
    expect(primary).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Type revoke to confirm'), 'ke');
    expect(primary).toBeEnabled();
    await userEvent.click(primary);
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('keeps a failure in the dialog', async () => {
    render(<ConfirmDialog open onOpenChange={() => {}} title="Delete forever?" confirmLabel="Delete forever" onConfirm={() => Promise.reject(new Error('The folder is system-managed.'))} />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete forever' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('The folder is system-managed.');
  });

  it('returns focus to what opened it; passes axe', async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Revoke</Button>
          <ConfirmDialog open={open} onOpenChange={setOpen} title="Revoke this share?" confirmLabel="Revoke share" onConfirm={() => {}} />
        </>
      );
    }
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Revoke' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog');
    expect(await a11y(dialog)).toHaveNoViolations();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(trigger).toHaveFocus();
  });
});

describe('PromptDialog', () => {
  it('selects the current value, validates, submits the trimmed value', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <PromptDialog
        open
        onOpenChange={() => {}}
        title="Rename folder"
        label="Folder name"
        defaultValue="Legal"
        confirmLabel="Rename"
        validate={(v) => (v.includes('/') ? 'A name can’t contain /.' : null)}
        onSubmit={onSubmit}
      />,
    );
    const input = screen.getByLabelText('Folder name') as HTMLInputElement;
    await waitFor(() => expect(input).toHaveFocus());
    expect([input.selectionStart, input.selectionEnd]).toEqual([0, 5]);
    await userEvent.keyboard('Legal/2026{Enter}');
    expect(await screen.findByText('A name can’t contain /.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.clear(input);
    await userEvent.type(input, '  Legal 2026 {Enter}');
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('Legal 2026'));
  });
});

describe('StepUpDialog', () => {
  it('offers the passkey, then the code instead', async () => {
    const onPasskey = vi.fn().mockRejectedValue(new Error('The passkey was cancelled.'));
    const onCode = vi.fn().mockResolvedValue(undefined);
    const onOpenChange = vi.fn();
    render(<StepUpDialog open onOpenChange={onOpenChange} description="Deleting a workspace needs a fresh check." onPasskey={onPasskey} onCode={onCode} />);
    await userEvent.click(screen.getByRole('button', { name: 'Use passkey' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('The passkey was cancelled.');
    await userEvent.click(screen.getByRole('button', { name: 'Use authenticator code instead' }));
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    expect(confirm).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Authenticator code'), '12a3456');
    expect(confirm).toBeEnabled();
    await userEvent.click(confirm);
    await waitFor(() => expect(onCode).toHaveBeenCalledWith('123456'));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });
});
