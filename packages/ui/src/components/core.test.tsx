import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Share2, Star } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { a11y } from '../../test/a11y';
import { Badge } from './Badge';
import { Button, formatCount } from './Button';
import { Card } from './Card';
import { Figure } from './Figure';
import { IconButton } from './IconButton';
import { Logo } from './Logo';
import { Marker } from './Marker';
import { MetaLabel } from './MetaLabel';
import { Tag } from './Tag';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { useButtonAction } from './useButtonAction';

describe('Button', () => {
  it('is a type=button that clicks', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Publish register</Button>);
    const b = screen.getByRole('button', { name: 'Publish register' });
    expect(b).toHaveAttribute('type', 'button');
    await userEvent.click(b);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disabled with a reason stays focusable, explains itself, ignores clicks', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled disabledReason="Downloads are off for this share" onClick={onClick}>
        Share
      </Button>,
    );
    const b = screen.getByRole('button', { name: 'Share' });
    expect(b).not.toBeDisabled();
    expect(b).toHaveAttribute('aria-disabled', 'true');
    expect(b).toHaveAttribute('title', 'Downloads are off for this share');
    await userEvent.click(b);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('busy: aria-busy, keeps its name, ignores clicks', async () => {
    const onClick = vi.fn();
    render(
      <Button state="busy" onClick={onClick}>
        Publish
      </Button>,
    );
    const b = screen.getByRole('button', { name: 'Publish' });
    expect(b).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(b);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('done shows the confirmation in place', () => {
    render(
      <Button state="done" doneLabel="Published">
        Publish
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveTextContent('Published');
  });

  it('count: hidden at zero, 99+ above 99', () => {
    expect(formatCount(0)).toBeNull();
    expect(formatCount(12)).toBe('12');
    expect(formatCount(140)).toBe('99+');
  });

  it('primary flips to the yellow on an ink ground', () => {
    render(<Button ground="ink">See what we do</Button>);
    expect(screen.getByRole('button').className).toMatch(/bg-yellow-accent/);
  });

  it('asChild renders the link with the button look', () => {
    render(
      <Button asChild variant="secondary">
        <a href="/x">Open</a>
      </Button>,
    );
    expect(screen.getByRole('link', { name: 'Open' }).className).toMatch(/rounded-md/);
  });

  it('passes axe', async () => {
    const { container } = render(
      <div>
        <Button>Publish</Button>
        <Button variant="secondary" count={12}>
          Comments
        </Button>
        <Button disabled disabledReason="Still converting to PDF">
          Download
        </Button>
      </div>,
    );
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe('useButtonAction', () => {
  it('busy → done → idle', async () => {
    vi.useFakeTimers();
    let resolve!: () => void;
    const { result } = renderHook(() => useButtonAction(() => new Promise<void>((r) => (resolve = r))));
    let p!: Promise<void>;
    act(() => {
      p = result.current.run();
    });
    expect(result.current.state).toBe('busy');
    await act(async () => {
      resolve();
      await p;
    });
    expect(result.current.state).toBe('done');
    act(() => vi.advanceTimersByTime(1600));
    expect(result.current.state).toBe('idle');
    vi.useRealTimers();
  });

  it('a failure returns to idle with the error, and runs are not doubled while busy', async () => {
    const action = vi.fn().mockRejectedValue(new Error("Couldn't reach the mail server."));
    const { result } = renderHook(() => useButtonAction(action));
    await act(async () => {
      await Promise.all([result.current.run(), result.current.run()]);
    });
    expect(action).toHaveBeenCalledOnce();
    expect(result.current.state).toBe('idle');
    expect(String(result.current.error)).toMatch(/mail server/);
  });
});

describe('IconButton', () => {
  it('has a label, and the count joins it', () => {
    render(<IconButton icon={Star} label="Comments" count={120} />);
    expect(screen.getByRole('button', { name: 'Comments (99+)' })).toBeInTheDocument();
  });
  it('passes axe', async () => {
    const { container } = render(<IconButton icon={Share2} label="Share" variant="outline" />);
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe('Badge', () => {
  it('defaults the appearance by status', () => {
    const { container } = render(
      <>
        <Badge status="attention">Awaiting you</Badge>
        <Badge status="progress">In progress</Badge>
        <Badge status="complete">Delivered</Badge>
      </>,
    );
    const [a, p, c] = container.querySelectorAll('[data-status]');
    expect(a!.className).toMatch(/bg-brand-mark/);
    expect(p!.className).toMatch(/border-fg/);
    expect(c!.querySelector('[aria-hidden]')!.className).toMatch(/bg-fg\b/);
  });
  it('unknown status falls back to neutral', () => {
    const { container } = render(<Badge status="quarantined-ish">Draft</Badge>);
    expect(container.querySelector('[data-status]')).toHaveAttribute('data-status', 'neutral');
  });
  it('compact keeps the wording for screen readers and on hover', () => {
    render(
      <Badge status="error" compact>
        Overdue
      </Badge>,
    );
    const text = screen.getByText('Overdue');
    expect(text).toHaveClass('sr-only');
    expect(text.parentElement).toHaveAttribute('title', 'Overdue');
  });
});

describe('Tag', () => {
  it('removes', async () => {
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} removeLabel="Remove PDF">
        PDF
      </Tag>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove PDF' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});

describe('Logo, Card, Figure, Marker, MetaLabel', () => {
  it('logo has an accessible name and never paints itself yellow', () => {
    render(<Logo />);
    const svg = screen.getByRole('img', { name: 'COSX' });
    expect(svg).toHaveAttribute('fill', 'currentColor');
  });
  it('card outline defaults by ground', () => {
    const { container } = render(
      <>
        <Card>a</Card>
        <Card ground="sunk">b</Card>
      </>,
    );
    const [page, sunk] = container.querySelectorAll('div');
    expect(page!.className).toMatch(/border-rule/);
    expect(sunk!.className).not.toMatch(/border-rule/);
  });
  it('figure, marker and label render', async () => {
    const { container } = render(
      <div>
        <Figure value="117" label="Organisations" source="Verified September 2026" />
        <h2>
          Of 47 organisations, <Marker>20 name no regulator</Marker>
        </h2>
        <MetaLabel rule="yellow">03 / Who we serve</MetaLabel>
      </div>,
    );
    expect(container.querySelector('.marker')).toHaveTextContent('20 name no regulator');
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe('ThemeProvider', () => {
  it('sets data-mode="ink" when ink is chosen and clears it for light', () => {
    function Switch() {
      const { setMode, resolved } = useTheme();
      return (
        <>
          <span>{resolved}</span>
          <button onClick={() => setMode('ink')}>ink</button>
          <button onClick={() => setMode('light')}>light</button>
        </>
      );
    }
    render(
      <ThemeProvider storageKey={null}>
        <Switch />
      </ThemeProvider>,
    );
    act(() => screen.getByText('ink', { selector: 'button' }).click());
    expect(document.documentElement).toHaveAttribute('data-mode', 'ink');
    act(() => screen.getByText('light', { selector: 'button' }).click());
    expect(document.documentElement).not.toHaveAttribute('data-mode');
  });
});
