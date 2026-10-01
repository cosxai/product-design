import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileText, MessageCircle, SquareCheck } from 'lucide-react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { a11y } from '../../test/a11y';
import { AppRail, AppRailSlot, type AppRailItem } from './AppRail';
import { Avatar } from './Avatar';
import { BottomSheet } from './BottomSheet';
import { BottomTabs, type BottomTabItem } from './BottomTabs';
import { Button } from './Button';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from './Popover';

describe('Popover', () => {
  function Files() {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Files</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Files in this conversation">
          <button type="button">Cap table.xlsx</button>
        </PopoverContent>
      </Popover>
    );
  }

  it('opens on the trigger, closes on Esc and returns focus', async () => {
    render(<Files />);
    const trigger = screen.getByRole('button', { name: 'Files' });
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Files in this conversation' })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('renders in a portal by default, in place with inline', async () => {
    const { container, rerender } = render(
      <Popover open>
        <PopoverAnchor>
          <span>row</span>
        </PopoverAnchor>
        <PopoverContent aria-label="Card">x</PopoverContent>
      </Popover>,
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Card' })).toBeInTheDocument();
    rerender(
      <Popover open>
        <PopoverAnchor>
          <span>row</span>
        </PopoverAnchor>
        <PopoverContent inline aria-label="Card">
          x
        </PopoverContent>
      </Popover>,
    );
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it('passes axe open', async () => {
    render(<Files />);
    await userEvent.click(screen.getByRole('button', { name: 'Files' }));
    expect(await a11y(document.body)).toHaveNoViolations();
  });
});

describe('Avatar', () => {
  it('shows initials, decorative by default; label makes it an image', () => {
    const { rerender, container } = render(<Avatar name="Li Wei" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveTextContent('LW');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.style.width).toBe('32px');
    expect(el.style.fontSize).toBe('11px');
    rerender(<Avatar name="王志远" size={52} label="王志远" />);
    const img = screen.getByRole('img', { name: '王志远' });
    expect(img).toHaveTextContent('王');
    expect(img.style.fontSize).toBe('16px');
  });

  it('shows the photo, and falls back to initials when it fails', () => {
    const { container } = render(<Avatar name="Anna Kowalski" src="/a.png" size={28} />);
    const photo = container.querySelector('img')!;
    expect(photo).toHaveAttribute('src', '/a.png');
    fireEvent.error(photo);
    expect(container.querySelector('img')).toBeNull();
    expect(container.firstElementChild).toHaveTextContent('AK');
  });

  it('brand tone and ring', () => {
    const { container } = render(<Avatar name="Li Wei" tone="brand" ring />);
    const el = container.firstElementChild!;
    expect(el.className).toContain('bg-brand-field');
    expect(el.className).toContain('shadow-');
  });

  it('passes axe', async () => {
    const { container } = render(
      <div>
        <Avatar name="Li Wei" />
        <Avatar name="Sam Ortiz" label="Sam Ortiz" size={40} />
      </div>,
    );
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe('BottomSheet', () => {
  function Switcher({ onOpenChange }: { onOpenChange?: (o: boolean) => void }) {
    const [open, setOpen] = useState(false);
    return (
      <BottomSheet
        title="Switch workspace"
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          onOpenChange?.(o);
        }}
        trigger={<Button>Switch</Button>}
      >
        <button type="button">Halden Capital</button>
      </BottomSheet>
    );
  }

  it('opens with a title, traps focus on the sheet, Esc closes and focus returns', async () => {
    render(<Switcher />);
    const trigger = screen.getByRole('button', { name: 'Switch' });
    await userEvent.click(trigger);
    const sheet = screen.getByRole('dialog', { name: 'Switch workspace' });
    expect(sheet).toHaveFocus();
    expect(sheet.style.paddingBottom).toContain('safe-area-inset-bottom');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('a drag down past the threshold closes; a short one snaps back', async () => {
    const onOpenChange = vi.fn();
    render(<Switcher onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Switch' }));
    const sheet = screen.getByRole('dialog');
    const handle = sheet.querySelector('[data-sheet-drag]')!;

    // Short: 30px, slowly.
    const now = vi.spyOn(performance, 'now');
    now.mockReturnValue(0);
    fireEvent.pointerDown(handle, { button: 0, clientY: 500, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientY: 530, pointerId: 1 });
    expect(sheet.style.transform).toBe('translateY(30px)');
    now.mockReturnValue(1000);
    fireEvent.pointerUp(handle, { clientY: 530, pointerId: 1 });
    expect(sheet.style.transform).toBe('');
    expect(onOpenChange).not.toHaveBeenCalledWith(false);

    // Long: 200px.
    now.mockReturnValue(2000);
    fireEvent.pointerDown(handle, { button: 0, clientY: 500, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientY: 700, pointerId: 1 });
    now.mockReturnValue(3000);
    act(() => {
      fireEvent.pointerUp(handle, { clientY: 700, pointerId: 1 });
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    now.mockRestore();
  });

  it('a quick flick closes', async () => {
    const onOpenChange = vi.fn();
    render(<Switcher onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Switch' }));
    const handle = screen.getByRole('dialog').querySelector('[data-sheet-drag]')!;
    const now = vi.spyOn(performance, 'now');
    now.mockReturnValue(0);
    fireEvent.pointerDown(handle, { button: 0, clientY: 500, pointerId: 1 });
    now.mockReturnValue(40);
    fireEvent.pointerUp(handle, { clientY: 540, pointerId: 1 });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    now.mockRestore();
  });

  it('has a screen-reader close button', async () => {
    render(<Switcher />);
    await userEvent.click(screen.getByRole('button', { name: 'Switch' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('passes axe open', async () => {
    render(<BottomSheet title="Language" description="Used across COSX" defaultOpen><button type="button">English</button></BottomSheet>);
    expect(screen.getByRole('dialog', { name: 'Language' })).toHaveAccessibleDescription('Used across COSX');
    expect(await a11y(document.body)).toHaveNoViolations();
  });
});

const tabItems: BottomTabItem[] = [
  { key: 'agent', icon: MessageCircle, label: 'Agent' },
  { key: 'tasks', icon: SquareCheck, label: 'Tasks', count: 2, disabled: true },
  { key: 'docs', icon: FileText, label: 'Docs', count: 4 },
  { key: 'me', label: 'Me', count: 3, avatar: <Avatar name="Li Wei" size={24} /> },
];

describe('BottomTabs', () => {
  it('marks the current tab, changes on press, reports disabled presses', async () => {
    const onChange = vi.fn();
    const onDisabledSelect = vi.fn();
    render(<BottomTabs label="Modules" items={tabItems} value="agent" onChange={onChange} onDisabledSelect={onDisabledSelect} />);
    expect(screen.getByRole('navigation', { name: 'Modules' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agent' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: 'Docs (4)' }));
    expect(onChange).toHaveBeenCalledWith('docs');
    const tasks = screen.getByRole('button', { name: 'Tasks' });
    expect(tasks).toHaveAttribute('aria-disabled', 'true');
    expect(tasks.className).toContain('opacity-40');
    await userEvent.click(tasks);
    expect(onDisabledSelect).toHaveBeenCalledWith('tasks');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('active pill uses the brand field; the avatar tab rings when current', () => {
    const { rerender } = render(<BottomTabs label="Modules" items={tabItems} value="agent" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Agent' }).firstElementChild!.className).toContain('bg-brand-field');
    rerender(<BottomTabs label="Modules" items={tabItems} value="me" onChange={() => {}} />);
    const me = screen.getByRole('button', { name: 'Me (3)' });
    expect(me.querySelector('.shadow-\\[0_0_0_1\\.5px_var\\(--text-primary\\)\\]')).not.toBeNull();
  });

  it('passes axe', async () => {
    const { container } = render(<BottomTabs label="Modules" items={tabItems} value="agent" onChange={() => {}} />);
    expect(await a11y(container)).toHaveNoViolations();
  });
});

const railItems: AppRailItem[] = [
  { key: 'agent', icon: MessageCircle, label: 'Agent', dot: true },
  { key: 'tasks', icon: SquareCheck, label: 'My tasks', disabled: true, disabledHint: 'My tasks · Coming soon' },
  { key: 'docs', icon: FileText, label: 'Documents', count: 120 },
];

describe('AppRail', () => {
  it('is a nav of buttons; current has aria-current; keyboard reaches every item', async () => {
    const onChange = vi.fn();
    const onDisabledSelect = vi.fn();
    render(
      <AppRail
        label="Modules"
        items={railItems}
        value="agent"
        onChange={onChange}
        onDisabledSelect={onDisabledSelect}
        workspace={<AppRailSlot label="Switch workspace">H</AppRailSlot>}
        account={
          <AppRailSlot label="Account" shape="round" active>
            <Avatar name="Li Wei" />
          </AppRailSlot>
        }
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'Modules' });
    expect(screen.getByRole('button', { name: 'Agent' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Agent' }).className).toContain('bg-brand-field');
    expect(nav.querySelector('[data-dot]')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Documents (99+)' })).toBeInTheDocument();

    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Switch workspace' })).toHaveFocus();
    await userEvent.tab();
    await userEvent.tab();
    const tasks = screen.getByRole('button', { name: 'My tasks' });
    expect(tasks).toHaveFocus();
    expect(tasks).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Enter}');
    expect(onDisabledSelect).toHaveBeenCalledWith('tasks');
    await userEvent.tab();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith('docs');
    expect(screen.getByRole('button', { name: 'Account' }).className).toContain('shadow-');
  });

  it('a disabled item\'s tooltip uses the caller\'s wording', async () => {
    render(<AppRail label="Modules" items={railItems} value="agent" onChange={() => {}} />);
    await userEvent.tab();
    await userEvent.tab();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('My tasks · Coming soon');
  });

  it('passes axe', async () => {
    const { container } = render(
      <AppRail
        label="Modules"
        items={railItems}
        value="agent"
        onChange={() => {}}
        workspace={<AppRailSlot label="Switch workspace">H</AppRailSlot>}
        account={
          <AppRailSlot label="Account" shape="round">
            <Avatar name="Li Wei" />
          </AppRailSlot>
        }
      />,
    );
    expect(await a11y(container)).toHaveNoViolations();
  });
});
