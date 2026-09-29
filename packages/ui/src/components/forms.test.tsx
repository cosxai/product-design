import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { axe } from 'vitest-axe';

import { a11y } from '../../test/a11y';
import { Checkbox } from './Checkbox';
import { Field } from './Field';
import { Input } from './Input';
import { RadioGroup } from './Radio';
import { Select, type SelectOption } from './Select';
import { Switch } from './Switch';
import { Textarea } from './Textarea';


describe('Field, Input, Textarea', () => {
  it('ties label, hint and error to the input', () => {
    render(<Input label="Email" hint="We send the code here" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription('We send the code here');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('an error replaces the hint and sets aria-invalid', () => {
    render(<Input label="Code" hint="6 digits" error="That code has expired. Send a new one." />);
    const input = screen.getByLabelText('Code');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('That code has expired. Send a new one.');
    expect(screen.queryByText('6 digits')).toBeNull();
  });

  it('a Field wraps any control, including a Textarea', () => {
    render(
      <Field label="Note" error="Say what changed.">
        <Textarea />
      </Field>,
    );
    const ta = screen.getByLabelText('Note');
    expect(ta.tagName).toBe('TEXTAREA');
    expect(ta).toHaveAttribute('aria-invalid', 'true');
  });

  it('keeps prefix and suffix inside the frame and types', async () => {
    const onChange = vi.fn();
    render(<Input label="Amount" prefix="£" suffix="GBP" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Amount'), '12');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(screen.getByText('£')).toBeInTheDocument();
  });

  it('disabled and read-only are native', () => {
    render(
      <>
        <Input label="A" disabled />
        <Input label="B" readOnly value="x" />
      </>,
    );
    expect(screen.getByLabelText('A')).toBeDisabled();
    expect(screen.getByLabelText('B')).toHaveAttribute('readonly');
  });

  it('passes axe', async () => {
    const { container } = render(
      <div>
        <Input label="Email" hint="Work address" />
        <Input label="Code" error="That code has expired." />
        <Textarea label="Note" />
      </div>,
    );
    expect(await a11y(container)).toHaveNoViolations();
  });
});

const PEOPLE: SelectOption[] = [
  { value: 'hv', label: 'Harbour Ventures', meta: '3 projects', group: 'Customers' },
  { value: 'hw', label: 'Hardwick Family Office', group: 'Customers' },
  { value: 'kb', label: 'Kowloon Bay', meta: 'Archived', group: 'Customers', disabled: true },
  { value: 'lw', label: 'Li Wei', group: 'Staff' },
  { value: 'am', label: 'Anna Kowalski', group: 'Staff' },
];

function Controlled(props: { options?: SelectOption[] | string[]; searchable?: boolean }) {
  const [v, setV] = useState<string | undefined>(undefined);
  return (
    <Field label="Customer">
      <Select options={props.options ?? PEOPLE} value={v} onChange={setV} searchable={props.searchable} />
    </Field>
  );
}

describe('Select', () => {
  it('is a labelled combobox that opens a listbox with options', async () => {
    render(<Controlled />);
    const trigger = screen.getByRole('combobox', { name: 'Customer' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    const list = await screen.findByRole('listbox');
    expect(within(list).getAllByRole('option')).toHaveLength(5);
    expect(within(list).getByRole('group', { name: 'Staff' })).toBeInTheDocument();
  });

  it('keyboard: arrows skip disabled rows, Home/End jump, Enter chooses', async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const trigger = screen.getByRole('combobox', { name: 'Customer' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    const list = await screen.findByRole('listbox');
    expect(list).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Harbour Ventures, 3 projects' }).id);
    await user.keyboard('{ArrowDown}{ArrowDown}');
    // Kowloon Bay (disabled) is skipped
    expect(list).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Li Wei' }).id);
    await user.keyboard('{End}');
    expect(list).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Anna Kowalski' }).id);
    await user.keyboard('{Home}{Enter}');
    expect(trigger).toHaveTextContent('Harbour Ventures');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('a letter jumps to it (closed and open)', async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const trigger = screen.getByRole('combobox', { name: 'Customer' });
    trigger.focus();
    await user.keyboard('l');
    const list = await screen.findByRole('listbox');
    expect(list).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Li Wei' }).id);
    await user.keyboard('i'); // fast typing matches a prefix: "li"
    expect(list).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Li Wei' }).id);
    const later = Date.now() + 1000; // a pause starts a new search
    const spy = vi.spyOn(Date, 'now').mockReturnValue(later);
    await user.keyboard('a');
    expect(list).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Anna Kowalski' }).id);
    spy.mockRestore();
  });

  it('Escape closes without choosing', async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const trigger = screen.getByRole('combobox', { name: 'Customer' });
    await user.click(trigger);
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveTextContent('Choose one');
  });

  it('disabled rows stay visible and cannot be chosen', async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.click(screen.getByRole('combobox', { name: 'Customer' }));
    const row = await screen.findByRole('option', { name: 'Kowloon Bay, Archived' });
    expect(row).toHaveAttribute('aria-disabled', 'true');
    await user.click(row);
    expect(screen.getByRole('combobox', { name: 'Customer' })).toHaveTextContent('Choose one');
  });

  it('turns the filter on above 8 options and filters', async () => {
    const user = userEvent.setup();
    const many = ['Passport', 'Visa', 'BRP', 'Payslip', 'P60', 'Bank statement', 'Tenancy', 'Council tax', 'Utility bill'];
    render(<Controlled options={many} />);
    await user.click(screen.getByRole('combobox', { name: 'Customer' }));
    const filter = await screen.findByRole('combobox', { name: 'Filter' });
    expect(filter).toHaveFocus();
    await user.type(filter, 'pa');
    expect(within(screen.getByRole('listbox')).getAllByRole('option').map((o) => o.textContent)).toEqual(['Passport', 'Payslip']);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(screen.getByRole('combobox', { name: 'Customer' })).toHaveTextContent('Passport');
  });

  it('shows the empty text when nothing matches', async () => {
    const user = userEvent.setup();
    render(<Controlled searchable />);
    await user.click(screen.getByRole('combobox', { name: 'Customer' }));
    await user.type(await screen.findByRole('combobox', { name: 'Filter' }), 'zzz');
    expect(screen.getByText('Nothing matches that.')).toBeInTheDocument();
  });

  it('is invalid and described inside a Field with an error', () => {
    render(
      <Field label="Customer" error="Choose who this is for.">
        <Select options={PEOPLE} />
      </Field>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Customer' });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription('Choose who this is for.');
  });

  it('passes axe (closed and open)', async () => {
    const user = userEvent.setup();
    const { container } = render(<Controlled />);
    expect(await a11y(container)).toHaveNoViolations();
    await user.click(screen.getByRole('combobox', { name: 'Customer' }));
    await screen.findByRole('listbox');
    // the open menu lives in a portal on <body>; 'region' is a page-level rule
    const open = await axe(document.body, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } });
    expect(open).toHaveNoViolations();
  });
});

describe('Checkbox', () => {
  it('the label toggles; space toggles', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Can comment" description="Recipients can leave comments" onChange={onChange} />);
    const box = screen.getByRole('checkbox', { name: 'Can comment' });
    expect(box).toHaveAccessibleDescription('Recipients can leave comments');
    await user.click(screen.getByText('Can comment'));
    expect(onChange).toHaveBeenLastCalledWith(true);
    box.focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('shows the mixed state', () => {
    render(<Checkbox label="All documents" checked="indeterminate" />);
    expect(screen.getByRole('checkbox', { name: 'All documents' })).toHaveAttribute('aria-checked', 'mixed');
  });

  it('disabled explains why and does not toggle', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Can forward" description="Turned off by the upstream share" disabled onChange={onChange} />);
    const box = screen.getByRole('checkbox', { name: 'Can forward' });
    expect(box).toBeDisabled();
    expect(box).toHaveAccessibleDescription('Turned off by the upstream share');
    await userEvent.click(screen.getByText('Can forward'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('RadioGroup', () => {
  it('arrow keys move and choose', async () => {
    const user = userEvent.setup();
    function R() {
      const [v, setV] = useState('view');
      return <RadioGroup aria-label="Access" options={[{ value: 'view', label: 'View' }, { value: 'comment', label: 'Comment' }, { value: 'edit', label: 'Edit' }]} value={v} onChange={setV} />;
    }
    render(<R />);
    const view = screen.getByRole('radio', { name: 'View' });
    expect(view).toBeChecked();
    view.focus();
    // Radix moves focus on a timer and selects while the arrow is held —
    // hold it like a real key press.
    await user.keyboard('{ArrowDown>}');
    await new Promise((r) => setTimeout(r, 0));
    await user.keyboard('{/ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Comment' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Comment' })).toHaveFocus();
  });
});

describe('Switch', () => {
  it('is a switch; space and the label flip it at once', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Require two-step verification" description="Including customers" onChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'Require two-step verification' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    expect(sw).toHaveAccessibleDescription('Including customers');
    sw.focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(true);
    await user.click(screen.getByText('Require two-step verification'));
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('checkbox, radio and switch pass axe', async () => {
    const { container } = render(
      <div>
        <Checkbox label="Can comment" description="Recipients can leave comments" checked />
        <RadioGroup aria-label="Access" options={['View', 'Comment']} value="View" />
        <Switch label="Organise new documents" checked />
      </div>,
    );
    expect(await a11y(container)).toHaveNoViolations();
  });
});
