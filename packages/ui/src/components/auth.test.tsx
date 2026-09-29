import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { a11y } from '../../test/a11y';
import { AuthIconTile, AuthLayout, AuthPanel, AuthStepHead } from './AuthLayout';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { ThemeSwitch } from './ThemeSwitch';
import { WorkspaceMark, WorkspaceRow } from './WorkspaceRow';

describe('ThemeSwitch', () => {
  it('shows the current choice and steps to the next on a quick click', async () => {
    const onChange = vi.fn();
    render(<ThemeSwitch value="system" onChange={onChange} />);
    expect(screen.getByRole('radio', { name: 'Theme: match system' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('radio', { name: 'Theme: match system' }));
    expect(onChange).toHaveBeenCalledWith('light');
  });

  it('picks an option once it has been open a moment', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onChange = vi.fn();
    render(<ThemeSwitch value="light" onChange={onChange} />);
    const group = screen.getByRole('radiogroup', { name: 'Theme' });
    await userEvent.hover(group);
    act(() => vi.advanceTimersByTime(900));
    await userEvent.click(screen.getByRole('radio', { name: 'Theme: dark' }));
    expect(onChange).toHaveBeenLastCalledWith('ink');
    vi.useRealTimers();
  });

  it('follows the ThemeProvider when uncontrolled, with its own labels', async () => {
    function Shown() {
      return <span data-testid="mode">{useTheme().mode}</span>;
    }
    render(
      <ThemeProvider storageKey={null} defaultMode="ink">
        <ThemeSwitch labels={{ group: '主题', ink: '主题：深色', system: '主题：跟随系统', light: '主题：浅色' }} />
        <Shown />
      </ThemeProvider>,
    );
    expect(screen.getByRole('radio', { name: '主题：深色' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('radio', { name: '主题：深色' }));
    expect(screen.getByTestId('mode')).toHaveTextContent('system');
  });

  it('is accessible', async () => {
    const { container } = render(<ThemeSwitch value="system" onChange={() => {}} />);
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe('AuthLayout', () => {
  it('lays out the step with brand, help, footer and the yellow panel', async () => {
    const { container } = render(
      <AuthLayout
        brand="COSX"
        headerEnd={<ThemeSwitch value="system" onChange={() => {}} />}
        help="Having trouble? Ask your workspace admin."
        footer={<span>Privacy · Status</span>}
        panel={<AuthPanel eyebrow="Your workspaces" lead="Every workspace you belong to, " mark="under one sign-in." sub="Each with its own access." />}
      >
        <AuthStepHead icon={<AuthIconTile tone="error">×</AuthIconTile>} title="Sign-in didn’t finish">
          Nothing was changed.
        </AuthStepHead>
      </AuthLayout>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Sign-in didn’t finish' })).toBeInTheDocument();
    expect(screen.getByText('under one sign-in.')).toBeInTheDocument();
    expect(screen.getByText('Having trouble? Ask your workspace admin.')).toBeInTheDocument();
    expect(await a11y(container)).toHaveNoViolations();
  });

  it('has no panel when none is given', () => {
    const { container } = render(<AuthLayout brand="COSX">step</AuthLayout>);
    expect(container.querySelector('aside')).toBeNull();
  });
});

describe('WorkspaceRow', () => {
  it('is one button naming the workspace; busy shows it opening', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<WorkspaceRow name="Halden Capital" detail="halden" onClick={onClick} />);
    const row = screen.getByRole('button', { name: /Halden Capital/ });
    await userEvent.click(row);
    expect(onClick).toHaveBeenCalledOnce();
    rerender(<WorkspaceRow name="Halden Capital" detail="halden" busy disabled />);
    expect(screen.getByRole('button', { name: /Halden Capital/ })).toHaveAttribute('aria-busy', 'true');
  });

  it('falls back to the initial when there is no logo', () => {
    const { container } = render(<WorkspaceMark name=" vela" />);
    expect(container).toHaveTextContent('V');
  });
});
