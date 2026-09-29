import { SidePanelProvider, SidePanelSlot, useSidePanel } from '@cosxai/ui';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { a11y } from '../test/a11y';
import {
  AgentDrawer,
  AgentMessage,
  AgentSteps,
  Composer,
  ConfirmationCard,
  Conversation,
  DocumentResult,
  DraftResult,
  HandOver,
  PeopleResult,
  StaffMessage,
  TaskResult,
  UserMessage,
  type AgentStep,
  type ComposerAttachment,
  type ConfirmationState,
} from './conversation';

const STEPS: AgentStep[] = [
  { id: '1', label: 'Searched contacts in Harbour Series A', detail: '24 found' },
  { id: '2', label: 'Checked NDA status', detail: '4 not signed' },
  { id: '3', label: 'Searched documents for “family trust”', detail: '3 matches' },
  { id: '4', label: 'Read Shareholder agreement v3', detail: 'pages 14–15' },
];

describe('AgentSteps', () => {
  it('starts collapsed to time and steps, expands with aria-expanded', async () => {
    const user = userEvent.setup();
    render(<AgentSteps steps={STEPS} seconds={14} />);
    const toggle = screen.getByRole('button', { name: 'Worked for 14 s · 4 steps' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Checked NDA status')).toBeNull();
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByText('24 found')).toBeInTheDocument();
    // Keyboard: Enter on the focused toggle collapses it again.
    toggle.focus();
    await user.keyboard('{Enter}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the running step and keeps failed steps open while collapsed', () => {
    const steps: AgentStep[] = [
      { id: '1', label: 'Searched contacts', detail: '24 found' },
      { id: '2', label: 'Read Cap table.xlsx', state: 'failed', error: 'The file is password protected.' },
      { id: '3', label: 'Checking NDA status', state: 'running' },
    ];
    render(<AgentSteps steps={steps} seconds={6} />);
    expect(screen.getByRole('button', { name: 'Working for 6 s · 3 steps' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Read Cap table.xlsx')).toBeInTheDocument();
    expect(screen.getByText('The file is password protected.')).toBeInTheDocument();
    expect(screen.getByText('Checking NDA status')).toBeInTheDocument();
    expect(screen.queryByText('Searched contacts')).toBeNull();
  });
});

describe('AgentMessage', () => {
  it('thinking shows the activity and is busy', () => {
    render(<AgentMessage state="thinking" activity="Reading 3 documents…" activityDetail="Searching “family trust” in Harbour Series A" />);
    expect(screen.getByRole('article', { name: 'Agent' })).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Reading 3 documents…')).toBeInTheDocument();
  });

  it('writing: Esc anywhere stops it, and so does "Esc to stop"', async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    render(
      <AgentMessage state="writing" onStop={onStop}>
        Clause 7.2(c) allows transfers
      </AgentMessage>,
    );
    await user.keyboard('{Escape}');
    expect(onStop).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Esc to stop' }));
    expect(onStop).toHaveBeenCalledTimes(2);
  });

  it('Esc does nothing once it is no longer writing', async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    render(<AgentMessage state="done" onStop={onStop}>Done</AgentMessage>);
    await user.keyboard('{Escape}');
    expect(onStop).not.toHaveBeenCalled();
  });

  it('stopped offers Continue', async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(<AgentMessage state="stopped" onContinue={onContinue}>Clause 7.2(c)…</AgentMessage>);
    expect(screen.getByText('Stopped by you')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onContinue).toHaveBeenCalled();
  });

  it('failed says why and offers Retry / Continue without it', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onSkip = vi.fn();
    render(<AgentMessage state="failed" error="Couldn't read Cap table.xlsx: the file is password protected." onRetry={onRetry} onSkip={onSkip} />);
    expect(screen.getByRole('alert')).toHaveTextContent('password protected');
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    await user.click(screen.getByRole('button', { name: 'Continue without it' }));
    expect(onRetry).toHaveBeenCalled();
    expect(onSkip).toHaveBeenCalled();
  });

  it('out of scope offers Ask the team', async () => {
    const user = userEvent.setup();
    const onAskTeam = vi.fn();
    render(<AgentMessage state="out-of-scope" onAskTeam={onAskTeam}>I can only see documents shared with you in Harbour Series A.</AgentMessage>);
    await user.click(screen.getByRole('button', { name: 'Ask the team instead' }));
    expect(onAskTeam).toHaveBeenCalled();
  });
});

describe('Composer', () => {
  it('sends with Enter, Shift+Enter breaks the line, clears after', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer scope="Harbour Series A" onSend={onSend} />);
    const box = screen.getByRole('textbox', { name: 'Message' });
    expect(box).toHaveAttribute('placeholder', 'Ask a question or hand over a task…');
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    await user.type(box, 'Hello{Shift>}{Enter}{/Shift}there');
    expect(box).toHaveValue('Hello\nthere');
    await user.click(screen.getByRole('button', { name: 'As a task' }));
    expect(screen.getByRole('button', { name: 'As a task' })).toHaveAttribute('aria-pressed', 'true');
    box.focus();
    await user.keyboard('{Enter}');
    expect(onSend).toHaveBeenCalledWith({ text: 'Hello\nthere', asTask: true, attachments: [] });
    expect(box).toHaveValue('');
  });

  it('mod-enter mode: Enter breaks the line, ⌘/Ctrl+Enter sends', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Composer sendKey="mod-enter" onSend={onSend} />);
    const box = screen.getByRole('textbox');
    await user.type(box, 'a{Enter}b');
    expect(onSend).not.toHaveBeenCalled();
    await user.keyboard('{Control>}{Enter}{/Control}');
    expect(onSend).toHaveBeenCalledWith(expect.objectContaining({ text: 'a\nb' }));
  });

  it('Send becomes Stop while writing; typing stays allowed but Enter does not send', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    const onStop = vi.fn();
    const { rerender } = render(<Composer writing onSend={onSend} onStop={onStop} />);
    expect(screen.queryByRole('button', { name: 'Send' })).toBeNull();
    const box = screen.getByRole('textbox');
    expect(box).toHaveAttribute('placeholder', 'Agent is answering · you can type the next message');
    await user.type(box, 'next{Enter}');
    expect(box).toHaveValue('next');
    expect(onSend).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Stop' }));
    expect(onStop).toHaveBeenCalled();
    rerender(<Composer writing={false} onSend={onSend} onStop={onStop} />);
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSend).toHaveBeenCalledWith(expect.objectContaining({ text: 'next' }));
  });

  it('"/" opens the commands; arrows move, Enter picks, Esc closes without stopping the Agent', async () => {
    const user = userEvent.setup();
    const onCommand = vi.fn();
    const onStop = vi.fn();
    const commands = [
      { cmd: '/task', description: 'Hand over as a task' },
      { cmd: '/summarise', description: 'Summarise a document' },
      { cmd: '/find', description: 'Find documents' },
    ];
    render(
      <>
        <AgentMessage state="writing" onStop={onStop}>…</AgentMessage>
        <Composer commands={commands} onCommand={onCommand} />
      </>,
    );
    const box = screen.getByRole('textbox');
    await user.type(box, '/');
    const list = screen.getByRole('listbox', { name: 'Commands' });
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByRole('option', { name: /\/task/ })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: /\/summarise/ })).toHaveAttribute('aria-selected', 'true');
    expect(box.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: /\/summarise/ }).id);
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByRole('option', { name: /\/find/ })).toHaveAttribute('aria-selected', 'true');
    // Esc closes the menu only.
    await user.keyboard('{Escape}');
    expect(list).not.toBeInTheDocument();
    expect(onStop).not.toHaveBeenCalled();
    // Typing reopens and filters.
    await user.type(box, 's');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    await user.keyboard('{Enter}');
    expect(onCommand).toHaveBeenCalledWith('/summarise');
    expect(box).toHaveValue('/summarise ');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('adds files from the button and a paste, removes them, waits for uploads', async () => {
    const user = userEvent.setup();
    const added: File[] = [];
    function Host() {
      const [files, setFiles] = useState<ComposerAttachment[]>([{ id: 'u', name: 'Board minutes.docx', progress: 0.6 }]);
      return (
        <Composer
          attachments={files}
          onAddFiles={(fs) => {
            added.push(...fs);
            setFiles((cur) => [...cur, ...fs.map((f) => ({ id: f.name, name: f.name, size: f.size }))]);
          }}
          onRemoveAttachment={(id) => setFiles((cur) => cur.filter((f) => f.id !== id))}
        />
      );
    }
    const { container } = render(<Host />);
    expect(screen.getByRole('progressbar', { name: 'Board minutes.docx' })).toHaveAttribute('aria-valuenow', '60');
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
    await user.click(screen.getByRole('button', { name: 'Attach files' }));
    await user.upload(input, new File(['x'.repeat(2400)], 'Q3 report 2026.pdf', { type: 'application/pdf' }));
    expect(screen.getByText('Q3 report 2026.pdf')).toBeInTheDocument();
    expect(screen.getByText('2.4 KB')).toBeInTheDocument();
    // A paste with files attaches them.
    const pasted = new File(['y'], 'photo.png', { type: 'image/png' });
    fireEvent.paste(screen.getByRole('textbox'), { clipboardData: { files: [pasted], types: ['Files'] } });
    expect(screen.getByText('photo.png')).toBeInTheDocument();
    // A drop too.
    const dropped = new File(['z'], 'scan.pdf', { type: 'application/pdf' });
    fireEvent.drop(screen.getByRole('textbox'), { dataTransfer: { files: [dropped], types: ['Files'] } });
    expect(screen.getByText('scan.pdf')).toBeInTheDocument();
    expect(added.map((f) => f.name)).toEqual(['Q3 report 2026.pdf', 'photo.png', 'scan.pdf']);
    // Still uploading: Send waits.
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Remove Board minutes.docx' }));
    expect(screen.queryByText('Board minutes.docx')).toBeNull();
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
  });

  it('disabled and read-only lock typing and sending', () => {
    const { rerender } = render(<Composer disabled defaultValue="hi" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    rerender(<Composer readOnly defaultValue="hi" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'As a task' })).toBeDisabled();
  });
});

describe('ConfirmationCard and HandOver', () => {
  it('goes pending → confirming (busy) → done', async () => {
    const user = userEvent.setup();
    function Host() {
      const [state, setState] = useState<ConfirmationState>('pending');
      return (
        <ConfirmationCard
          title="Send NDA reminders to 4 investors?"
          state={state}
          confirmLabel="Send 4 reminders"
          onConfirm={() => setState('confirming')}
          secondaryLabel="Review drafts"
          onSecondary={() => {}}
          doneText="4 reminders sent"
        >
          A short note from Halden Capital with the NDA link.
        </ConfirmationCard>
      );
    }
    const { rerender } = render(<Host />);
    const card = screen.getByRole('region', { name: 'Send NDA reminders to 4 investors?' });
    expect(screen.getByText('Needs your confirmation')).toBeInTheDocument();
    expect(screen.getByText('Nothing is sent until you confirm.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Send 4 reminders' }));
    expect(card).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'Review drafts' })).toBeDisabled();
    rerender(
      <ConfirmationCard title="Send NDA reminders to 4 investors?" state="done" confirmLabel="Send 4 reminders" onConfirm={() => {}} doneText="4 reminders sent" />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('4 reminders sent');
    expect(screen.queryByRole('button', { name: 'Send 4 reminders' })).toBeNull();
  });

  it('dismissed leaves a line', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { rerender } = render(<ConfirmationCard title="Share with Anna" confirmLabel="Share" onConfirm={() => {}} onDismiss={onDismiss} />);
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalled();
    rerender(<ConfirmationCard title="Share with Anna" state="dismissed" confirmLabel="Share" onConfirm={() => {}} />);
    expect(screen.getByText(/Not sent/)).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('hand over calls back, then records the task', async () => {
    const user = userEvent.setup();
    const onHandOver = vi.fn();
    const { rerender } = render(<HandOver onHandOver={onHandOver} />);
    await user.click(screen.getByRole('button', { name: 'Hand to the team' }));
    expect(onHandOver).toHaveBeenCalled();
    rerender(<HandOver state="done" taskId="T-128" assignee="Sam Ortiz" onHandOver={onHandOver} />);
    expect(screen.getByRole('note')).toHaveTextContent('Task T-128 created · handed to Sam Ortiz');
  });
});

describe('Result cards', () => {
  it('each opens its page', async () => {
    const user = userEvent.setup();
    const open = vi.fn();
    render(
      <>
        <TaskResult taskId="T-128" title="Chase NDA signatures · 4 investors" assignee="Sam Ortiz" onOpen={() => open('task')} />
        <DocumentResult name="Q3 report 2026.pdf" pages={18} project="Kowloon Bay Fund II" href="#doc" onOpen={() => open('doc')} />
        <PeopleResult eyebrow="Invited · NDA not signed" total={4} people={[{ id: 'a', name: 'Anna Kowalski', meta: '9 days' }]} onShowAll={() => open('people')} />
        <DraftResult eyebrow="Draft email · to 4 investors" onEdit={() => open('edit')} onCopy={() => open('copy')}>
          Dear Anna, a reminder…
        </DraftResult>
      </>,
    );
    expect(screen.getByText('Task created · T-128')).toBeInTheDocument();
    expect(screen.getByText('With us · Sam Ortiz')).toBeInTheDocument();
    expect(screen.getByText('18 pages')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open' })).toHaveAttribute('href', '#doc');
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Show all 4' }));
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(open.mock.calls.map((c) => c[0])).toEqual(['task', 'people', 'edit', 'copy']);
  });
});

describe('AgentDrawer', () => {
  function Page({ onClose }: { onClose?: () => void }) {
    return (
      <SidePanelProvider>
        <Opener />
        <div className="flex">
          <main>page</main>
          <SidePanelSlot />
        </div>
        <AgentDrawer context="Wang family · Global Talent" composer={<Composer scope="This project" />} onClose={onClose}>
          <Conversation>
            <UserMessage>Which facts are still in conflict?</UserMessage>
            <AgentMessage steps={<AgentSteps steps={STEPS.slice(0, 2)} seconds={6} />}>One: a date of birth.</AgentMessage>
          </Conversation>
        </AgentDrawer>
      </SidePanelProvider>
    );
  }

  it('opens in the slot with the context and a scoped composer; Esc while writing does not close it', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Page onClose={onClose} />);
    const panel = await screen.findByRole('complementary', { name: /Agent/ });
    expect(panel).toHaveTextContent('Wang family · Global Talent');
    expect(panel).toHaveTextContent('This project');
    expect(screen.getByRole('log')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('Esc stops a writing answer before it closes the drawer', async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    const onClose = vi.fn();
    render(
      <SidePanelProvider>
        <Opener />
        <SidePanelSlot />
        <AgentDrawer onClose={onClose}>
          <AgentMessage state="writing" onStop={onStop}>…</AgentMessage>
        </AgentDrawer>
      </SidePanelProvider>,
    );
    await screen.findByRole('complementary');
    await user.keyboard('{Escape}');
    expect(onStop).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });
});

function Opener() {
  const { open } = useSidePanel();
  useEffect(() => open('agent'), [open]);
  return null;
}

describe('a11y', () => {
  it('a full conversation passes axe', async () => {
    const { container } = render(
      <Conversation aria-label="Conversation">
        <UserMessage attachments={[{ name: 'Q3 report 2026.pdf', size: 2_400_000 }]}>Which investors haven't signed the NDA?</UserMessage>
        <AgentMessage steps={<AgentSteps steps={STEPS} seconds={14} defaultOpen />} footer={<HandOver onHandOver={() => {}} />}>
          4 of the 24 invited investors haven't signed the NDA.
          <ConfirmationCard title="Send NDA reminders to 4 investors?" confirmLabel="Send 4 reminders" onConfirm={() => {}} secondaryLabel="Review drafts" onDismiss={() => {}} />
        </AgentMessage>
        <AgentMessage state="thinking" activity="Reading 3 documents…" />
        <AgentMessage state="writing" onStop={() => {}}>Clause 7.2(c)</AgentMessage>
        <AgentMessage state="stopped" onContinue={() => {}}>Clause 7.2(c)</AgentMessage>
        <AgentMessage state="failed" error="Couldn't read Cap table.xlsx." onRetry={() => {}} onSkip={() => {}} />
        <AgentMessage state="out-of-scope" onAskTeam={() => {}}>I can only see Harbour Series A.</AgentMessage>
        <TaskResult taskId="T-128" title="Chase NDA signatures" assignee="Sam Ortiz" onOpen={() => {}} />
        <DocumentResult name="Q3 report 2026.pdf" pages={18} project="Kowloon Bay Fund II" onOpen={() => {}} />
        <PeopleResult eyebrow="Invited · NDA not signed" total={4} people={[{ id: 'a', name: 'Anna Kowalski', meta: '9 days' }]} onShowAll={() => {}} />
        <DraftResult eyebrow="Draft email" onEdit={() => {}} onCopy={() => {}}>Dear Anna…</DraftResult>
        <HandOver state="done" taskId="T-128" assignee="Sam Ortiz" onHandOver={() => {}} />
        <StaffMessage name="Sam Ortiz" org="COSX" time="10:12">I'll send three today.</StaffMessage>
      </Conversation>,
    );
    expect(await a11y(container)).toHaveNoViolations();
  });

  it('the composer passes axe, with attachments and the slash menu open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Composer
        scope="Harbour Series A"
        scopes={[{ id: 'h', label: 'Harbour Series A' }]}
        onScopeChange={() => {}}
        attachments={[
          { id: 'a', name: 'Q3 report 2026.pdf', size: 2_400_000 },
          { id: 'b', name: 'Board minutes.docx', progress: 0.5 },
        ]}
        onAddFiles={() => {}}
        onRemoveAttachment={() => {}}
        commands={[{ cmd: '/task', description: 'Hand over as a task' }]}
      />,
    );
    await user.type(screen.getByRole('textbox'), '/');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(await a11y(container)).toHaveNoViolations();
  });

  it('the drawer passes axe', async () => {
    render(
      <SidePanelProvider>
        <Opener />
        <SidePanelSlot />
        <AgentDrawer context="Wang family · Global Talent" composer={<Composer scope="This project" />}>
          <Conversation>
            <UserMessage>Which facts are still in conflict?</UserMessage>
          </Conversation>
        </AgentDrawer>
      </SidePanelProvider>,
    );
    const panel = await screen.findByRole('complementary');
    await act(async () => {});
    expect(await a11y(panel)).toHaveNoViolations();
  });
});
