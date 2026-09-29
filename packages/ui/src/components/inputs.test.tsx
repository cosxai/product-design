import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { a11y } from '../../test/a11y';
import { AsyncSelect } from './AsyncSelect';
import { ChoiceCards } from './ChoiceCards';
import { CodeInput } from './CodeInput';
import { CopyField } from './CopyField';
import { DateInput, FuzzyDateInput } from './DateInput';
import { Field } from './Field';
import { formatDate, parseDate, toIso } from './inputs-date';
import type { ListItem } from './inputs-listbox';
import { MentionInput, mentionAt } from './MentionInput';
import { RecipientsInput, type Recipient } from './RecipientsInput';
import { SearchField } from './SearchField';
import { SegmentedControl } from './SegmentedControl';

afterEach(() => vi.useRealTimers());

const timed = () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  return userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
};

describe('SearchField', () => {
  it('debounces, aborts the request in flight, and shows the count', async () => {
    const user = timed();
    const signals: AbortSignal[] = [];
    const onSearch = vi.fn((q: string, signal: AbortSignal) => {
      signals.push(signal);
      return new Promise<number>((resolve) => setTimeout(() => resolve(q.length), 500));
    });
    render(<SearchField aria-label="Search this folder" onSearch={onSearch} />);
    const box = screen.getByRole('searchbox', { name: 'Search this folder' });
    await user.type(box, 'cap');
    expect(onSearch).not.toHaveBeenCalled();
    act(() => void vi.advanceTimersByTime(250));
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status', { name: 'Searching' })).toBeInTheDocument();
    await user.type(box, ' table');
    expect(signals[0]!.aborted).toBe(true);
    act(() => void vi.advanceTimersByTime(250));
    expect(onSearch).toHaveBeenCalledTimes(2);
    await act(async () => void vi.advanceTimersByTime(500));
    expect(screen.getByText('9 results')).toBeInTheDocument();
  });

  it('clears with the button and with Esc; / focuses it', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>elsewhere</button>
        <SearchField aria-label="Search" shortcut defaultValue="q3" />
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
    screen.getByText('elsewhere').focus();
    await user.keyboard('/');
    expect(screen.getByRole('searchbox')).toHaveFocus();
    await user.keyboard('abc{Escape}');
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });
});

describe('CopyField', () => {
  const setClipboard = (writeText: (t: string) => Promise<void>) =>
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

  it('copies and confirms in place', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    setClipboard(writeText);
    render(<CopyField label="Share link" value="https://portal.example.com/s/abc" />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith('https://portal.example.com/s/abc');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('when copying fails, selects the text and says how to copy by hand', async () => {
    const user = userEvent.setup();
    setClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    render(<CopyField label="Share link" value="https://portal.example.com/s/abc" />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    const input = screen.getByRole('textbox', { name: 'Share link' }) as HTMLInputElement;
    expect(input).toHaveFocus();
    expect(input.selectionEnd! - input.selectionStart!).toBe(input.value.length);
    expect(screen.getByText(/Press (⌘|Ctrl\+)C to copy/)).toBeInTheDocument();
    expect(input).toHaveAccessibleDescription(/to copy/);
  });
});

describe('SegmentedControl and ChoiceCards', () => {
  it('arrows move and choose, skipping a disabled segment that explains itself', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="View"
        onChange={onChange}
        segments={[
          { value: 'list', label: 'List' },
          { value: 'map', label: 'Map', disabled: true, reason: 'Needs at least one party' },
          { value: 'board', label: 'Board' },
        ]}
      />,
    );
    expect(screen.getByRole('radio', { name: 'List' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Map, Needs at least one party' })).toBeDisabled();
    await user.tab();
    await user.keyboard('{ArrowRight>}');
    expect(onChange).toHaveBeenLastCalledWith('board');
    expect(screen.getByRole('radio', { name: 'Board' })).toBeChecked();
  });

  it('choice cards are radios with a title and a description', async () => {
    render(
      <ChoiceCards
        aria-label="What to add"
        choices={[
          { value: 'person', title: 'Add a person', description: 'An applicant, dependant or signatory.' },
          { value: 'org', title: 'Add an organisation', description: 'An employer, sponsor or fund.' },
        ]}
      />,
    );
    const org = screen.getByRole('radio', { name: /Add an organisation/ });
    await userEvent.setup().click(org);
    expect(org).toBeChecked();
  });
});

describe('dates', () => {
  it('parses the formats people type', () => {
    const iso = (t: string, partial = false) => {
      const p = parseDate(t, { partial });
      return p ? toIso(p) : null;
    };
    expect(iso('12/03/2019')).toBe('2019-03-12');
    expect(iso('2019-03-12')).toBe('2019-03-12');
    expect(iso('12 Mar 2019')).toBe('2019-03-12');
    expect(iso('March 12, 2019')).toBe('2019-03-12');
    expect(iso('2019年3月12日')).toBe('2019-03-12');
    expect(iso('31/02/2019')).toBeNull();
    expect(iso('2019-03')).toBeNull();
    expect(iso('2019-03', true)).toBe('2019-03');
    expect(iso('Mar 2019', true)).toBe('2019-03');
    expect(iso('2019', true)).toBe('2019');
    expect(formatDate({ year: 2019, month: 3, day: 12 })).toBe('12 Mar 2019');
    expect(formatDate({ year: 2019, month: 3 }, 'zh')).toBe('2019 年 3 月');
  });

  it('DateInput reads typed text on blur and shows it back', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateInput label="Share expires" onChange={onChange} />);
    const box = screen.getByRole('textbox', { name: 'Share expires' });
    await user.type(box, '12/03/2019');
    await user.tab();
    expect(onChange).toHaveBeenCalledWith('2019-03-12');
    expect(box).toHaveValue('12 Mar 2019');
  });

  it('DateInput explains unreadable text instead of changing the value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateInput label="Share expires" onChange={onChange} />);
    const box = screen.getByRole('textbox', { name: 'Share expires' });
    await user.type(box, 'next tuesday');
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).toHaveAccessibleDescription(/12 Mar 2019/);
  });

  it('DateInput picks from the calendar', async () => {
    const onChange = vi.fn();
    render(<DateInput label="Share expires" value="2026-10-31" onChange={onChange} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Choose a date' }));
    const dialog = await screen.findByRole('dialog', { name: 'Choose a date' });
    const day = Array.from(dialog.querySelectorAll('button')).find((b) => b.textContent === '14');
    await userEvent.setup().click(day!);
    expect(onChange).toHaveBeenCalledWith('2026-10-14');
  });

  it('FuzzyDateInput keeps partial dates, coarsens by precision, and still reports what it cannot read', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Field label="Date of entry">
        <FuzzyDateInput onChange={onChange} />
      </Field>,
    );
    const box = screen.getByRole('textbox', { name: 'Date of entry' });
    await user.type(box, 'Mar 2019{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('2019-03', { valid: true });
    expect(box).toHaveValue('2019-03');
    expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();

    await user.clear(box);
    await user.type(box, '12/03/2019');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith('2019-03-12', { valid: true });
    expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked();

    // Coarser drops the rest.
    await user.click(screen.getByRole('radio', { name: 'Year' }));
    expect(onChange).toHaveBeenLastCalledWith('2019', { valid: true });
    expect(box).toHaveValue('2019');

    await user.clear(box);
    await user.type(box, 'spring 19{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('spring 19', { valid: false });
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).toHaveAccessibleDescription(/Year required/);
  });
});

describe('CodeInput', () => {
  it('pasting the code fills every cell and completes', () => {
    const onComplete = vi.fn();
    render(<CodeInput onComplete={onComplete} />);
    const cells = screen.getAllByRole('textbox');
    expect(cells).toHaveLength(6);
    fireEvent.paste(cells[0]!, { clipboardData: { getData: () => '482 130' } });
    expect(onComplete).toHaveBeenCalledWith('482130');
    expect(cells.map((c) => (c as HTMLInputElement).value).join('')).toBe('482130');
  });

  it('typing moves on, Backspace moves back, letters are refused in numeric mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CodeInput length={4} onChange={onChange} />);
    const cells = screen.getAllByRole('textbox');
    await user.click(cells[0]!);
    await user.keyboard('4x8');
    expect(cells[2]).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('48');
    await user.keyboard('{Backspace}');
    expect(cells[1]).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('4');
  });

  it('counts down to resend', () => {
    vi.useFakeTimers();
    const onResend = vi.fn();
    render(<CodeInput resendIn={2} onResend={onResend} />);
    expect(screen.getByText('Resend in 2 s')).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(1000));
    act(() => void vi.advanceTimersByTime(1000));
    fireEvent.click(screen.getByRole('button', { name: 'Send a new code' }));
    expect(onResend).toHaveBeenCalled();
  });
});

describe('AsyncSelect', () => {
  const people: ListItem[] = [
    { value: 'hv', label: 'Harbour Ventures', meta: 'Customer · 3 projects' },
    { value: 'hf', label: 'Hardwick Family Office', meta: 'Customer' },
  ];

  it('drops a stale answer and offers Create', async () => {
    const user = timed();
    const search = vi.fn((q: string) =>
      new Promise<ListItem[]>((resolve) => setTimeout(() => resolve(people.filter((p) => p.label.toLowerCase().startsWith(q.toLowerCase()))), q.length === 1 ? 900 : 100)),
    );
    const onCreate = vi.fn();
    render(<AsyncSelect aria-label="Customer" search={search} onCreate={onCreate} />);
    const box = screen.getByRole('combobox', { name: 'Customer' });
    await user.type(box, 'H');
    act(() => void vi.advanceTimersByTime(260));
    await user.type(box, 'ar');
    act(() => void vi.advanceTimersByTime(260));
    await act(async () => void vi.advanceTimersByTime(1000));
    const list = await screen.findByRole('listbox');
    expect(list).toHaveTextContent('Harbour Ventures');
    expect(list).toHaveTextContent('Create “Har”');
    expect(search).toHaveBeenCalledTimes(2);
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onCreate).toHaveBeenCalledWith('Har');
  });

  it('the choice becomes a clearable card; errors offer Retry', async () => {
    const user = timed();
    let fail = true;
    const search = vi.fn(() => (fail ? Promise.reject(new Error('down')) : Promise.resolve(people)));
    const onChange = vi.fn();
    render(<AsyncSelect aria-label="Customer" search={search} onChange={onChange} />);
    await user.type(screen.getByRole('combobox'), 'Ha');
    await act(async () => void vi.advanceTimersByTime(300));
    fail = false;
    await user.click(await screen.findByRole('button', { name: 'Retry' }));
    await act(async () => void vi.advanceTimersByTime(300));
    await user.click(await screen.findByRole('option', { name: /Harbour Ventures/ }));
    expect(onChange).toHaveBeenCalledWith(people[0]);
    await user.click(screen.getByRole('button', { name: 'Clear Harbour Ventures' }));
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

describe('RecipientsInput', () => {
  it('splits a pasted list, marks the bad one, edits it in place, Backspace removes the last', async () => {
    const user = userEvent.setup();
    let latest: Recipient[] = [];
    render(<RecipientsInput aria-label="To" onChange={(r) => (latest = r)} verify={(e) => (e.endsWith('.io') ? 'unverified' : 'valid')} />);
    const box = screen.getByRole('textbox', { name: 'To' });
    await user.click(box);
    await user.paste('anna@example.com, wei.example.com; sam@example.io');
    expect(latest.map((r) => r.status)).toEqual(['valid', 'invalid', 'unverified']);
    await user.click(screen.getByRole('button', { name: /wei\.example\.com, not a valid address/ }));
    const edit = screen.getByDisplayValue('wei.example.com');
    await user.clear(edit);
    await user.type(edit, 'wei@example.com{Enter}');
    expect(latest.map((r) => `${r.email}:${r.status}`)).toEqual(['anna@example.com:valid', 'wei@example.com:valid', 'sam@example.io:unverified']);
    await user.click(screen.getByRole('textbox', { name: 'To' }));
    await user.keyboard('{Backspace}');
    expect(latest).toHaveLength(2);
  });
});

describe('MentionInput', () => {
  const people: ListItem[] = [
    { value: 'u1', label: 'Wei Li', meta: 'Member' },
    { value: 'u2', label: '王志远', meta: 'Customer' },
  ];

  it('finds the @query at the caret', () => {
    expect(mentionAt('Hi @We', 6)).toEqual({ start: 3, query: 'We' });
    expect(mentionAt('mail a@b', 8)).toBeNull();
    expect(mentionAt('@Wei Li done', 12)).toBeNull();
  });

  it('@ opens people, Enter inserts, ⌘Enter sends with the mentions', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<MentionInput aria-label="Comment" people={people} onSubmit={onSubmit} />);
    const box = screen.getByRole('textbox', { name: 'Comment' });
    await user.type(box, 'Can you confirm, @We');
    expect(await screen.findByRole('option', { name: /Wei Li/ })).toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(box).toHaveValue('Can you confirm, @Wei Li ');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    await user.keyboard('page 4?{Meta>}{Enter}{/Meta}');
    expect(onSubmit).toHaveBeenCalledWith('Can you confirm, @Wei Li page 4?', [{ value: 'u1', label: 'Wei Li' }]);
  });
});

describe('axe', () => {
  it('passes on the group', async () => {
    const { container } = render(
      <div>
        <Field label="Search this folder">
          <SearchField />
        </Field>
        <CopyField label="Share link" value="https://portal.example.com/s/abc" />
        <SegmentedControl aria-label="View" segments={[{ value: 'a', label: 'List' }, { value: 'b', label: 'Board' }]} />
        <ChoiceCards aria-label="What to add" choices={[{ value: 'p', title: 'Add a person' }, { value: 'o', title: 'Add an organisation' }]} />
        <DateInput label="Share expires" value="2026-10-31" />
        <Field label="Date of entry">
          <FuzzyDateInput />
        </Field>
        <Field label="Verification code">
          <CodeInput />
        </Field>
        <Field label="Customer">
          <AsyncSelect search={() => Promise.resolve([])} />
        </Field>
        <Field label="To">
          <RecipientsInput defaultValue={[{ email: 'anna@example.com', status: 'valid' }, { email: 'bad', status: 'invalid' }]} />
        </Field>
        <Field label="Comment">
          <MentionInput people={[]} />
        </Field>
      </div>,
    );
    expect(await a11y(container)).toHaveNoViolations();
  });
});
