import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { a11y } from '../../test/a11y';
import { Button } from './Button';
import { Dropzone } from './Dropzone';
import { PageNotice, PageState } from './PageState';
import { Progress, progressStep } from './Progress';
import { PulseDot } from './PulseDot';
import { SkeletonList, SkeletonViewer } from './Skeleton';
import { StageProgress } from './StageProgress';
import { checkFiles, describeDrop, hasFiles, readDataTransfer, type DroppedFile } from './status-files';
import { SyncStatus } from './SyncStatus';
import { groupByFolder, UploadCheck } from './UploadCheck';
import { UploadFolderRow, UploadList, UploadRow, useBeforeUnloadWhile } from './UploadList';
import { WindowDrop } from './WindowDrop';

const file = (name: string, size = 10, type = '') => new File([new Uint8Array(size)], name, { type });
const dt = (types: string[], extra: Partial<DataTransfer> = {}) => ({ types, dropEffect: 'none', ...extra }) as unknown as DataTransfer;

afterEach(() => vi.useRealTimers());

describe('Progress', () => {
  it('determinate: aria values and the text always shown', () => {
    render(<Progress label="Uploading Cap table.xlsx" value={35} text="1.2 of 3.4 MB" />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading Cap table.xlsx' });
    expect(bar).toHaveAttribute('aria-valuenow', '35');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('1.2 of 3.4 MB')).toBeVisible();
  });

  it('announces 25% steps, not every tick, and the ending', () => {
    expect(progressStep(24, 100)).toBe(0);
    expect(progressStep(26, 100)).toBe(25);
    const { rerender, container } = render(<Progress label="A" value={3} />);
    const live = container.querySelector('[aria-live]')!;
    rerender(<Progress label="A" value={12} />);
    expect(live).toHaveTextContent('');
    rerender(<Progress label="A" value={27} />);
    expect(live).toHaveTextContent('A: 25%');
    rerender(<Progress label="A" value={40} />);
    expect(live).toHaveTextContent('A: 25%');
    rerender(<Progress label="A" value={100} status="done" />);
    expect(live).toHaveTextContent('A: done');
  });

  it('indeterminate has no value; segmented shows each segment state', () => {
    render(<Progress label="Preparing download" text="Preparing download" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    const { container } = render(<Progress label="Batches" segments={['done', 'done', 'current', 'failed', 'todo']} text="Batch 3 of 5" />);
    const segs = [...container.querySelectorAll('[data-segment]')].map((s) => s.getAttribute('data-segment'));
    expect(segs).toEqual(['done', 'done', 'current', 'failed', 'todo']);
    expect(container.querySelector('[data-segment="done"]')!.className).toMatch(/bg-fg/);
    expect(container.querySelector('[data-segment="current"]')!.className).toMatch(/bg-brand-mark/);
    expect(container.querySelector('[data-segment="failed"]')!.className).toMatch(/bg-error/);
  });
});

describe('StageProgress, SyncStatus, PulseDot', () => {
  it('marks the current stage', () => {
    render(
      <StageProgress
        label="Analysis"
        stages={[
          { label: 'Documents', state: 'done', detail: 'Done' },
          { label: 'Facts', state: 'current', detail: 'Batch 2 of 4' },
          { label: 'Report', state: 'todo' },
        ]}
      />,
    );
    expect(screen.getByText('Facts').closest('li')).toHaveAttribute('aria-current', 'step');
  });

  it('sync status keeps its wording when compact', () => {
    render(
      <SyncStatus state="error" compact>
        Sync error
      </SyncStatus>,
    );
    expect(screen.getByText('Sync error')).toHaveClass('sr-only');
    expect(screen.getByRole('status')).toHaveAttribute('title', 'Sync error');
  });

  it('does not animate under reduced motion', () => {
    const animate = vi.fn(() => ({ cancel() {} }));
    const orig = window.matchMedia;
    window.matchMedia = ((q: string) => ({ matches: q.includes('reduce'), addEventListener() {}, removeEventListener() {} })) as never;
    (HTMLElement.prototype as unknown as { animate: unknown }).animate = animate;
    render(<PulseDot label="Agent running" />);
    expect(animate).not.toHaveBeenCalled();
    window.matchMedia = ((q: string) => ({ matches: !q.includes('reduce') && false, addEventListener() {}, removeEventListener() {} })) as never;
    render(<PulseDot label="Agent running 2" />);
    expect(animate).toHaveBeenCalled();
    window.matchMedia = orig;
    delete (HTMLElement.prototype as unknown as { animate?: unknown }).animate;
  });
});

describe('files', () => {
  it('only a drag carrying files counts', () => {
    expect(hasFiles(dt(['Files']))).toBe(true);
    expect(hasFiles(dt(['text/plain']))).toBe(false);
    expect(hasFiles(null)).toBe(false);
  });

  it('reads folders recursively into paths', async () => {
    const f = (name: string) => ({ isFile: true, isDirectory: false, name, file: (ok: (f: File) => void) => ok(file(name)) });
    const dir = (name: string, children: unknown[]) => {
      let served = false;
      return {
        isFile: false,
        isDirectory: true,
        name,
        createReader: () => ({
          readEntries: (ok: (e: unknown[]) => void) => {
            ok(served ? [] : children);
            served = true;
          },
        }),
      };
    };
    const root = dir('Q3', [f('a.pdf'), dir('Financials', [f('b.xlsx'), dir('.cache', [f('c.tmp')])])]);
    const transfer = { items: [{ kind: 'file', webkitGetAsEntry: () => root }], files: [] } as unknown as DataTransfer;
    const out = await readDataTransfer(transfer);
    expect(out.map((o) => o.path).sort()).toEqual(['Q3/Financials/.cache/c.tmp', 'Q3/Financials/b.xlsx', 'Q3/a.pdf']);
    expect(describeDrop(out)).toEqual({ files: 0, folders: 1 });
  });

  it('checks type, size and depth with reasons', () => {
    const items: DroppedFile[] = [
      { file: file('ok.pdf', 10, 'application/pdf'), path: 'F/ok.pdf' },
      { file: file('setup.exe'), path: 'F/setup.exe' },
      { file: file('big.pdf', 50), path: 'F/big.pdf' },
      { file: file('deep.pdf'), path: 'F/a/b/c/d/e/f/g/deep.pdf' },
    ];
    const { accepted, rejected } = checkFiles(items, { accept: '.pdf', maxSize: 20 });
    expect(accepted.map((a) => a.path)).toEqual(['F/ok.pdf']);
    expect(rejected.map((r) => [r.file.name, r.reason])).toEqual([
      ['setup.exe', 'type'],
      ['big.pdf', 'size'],
      ['deep.pdf', 'depth'],
    ]);
  });
});

describe('WindowDrop and Dropzone', () => {
  it('the window layer opens only for files and leaves on Esc', () => {
    render(
      <WindowDrop target="Due diligence" onDrop={() => {}}>
        <p>page</p>
      </WindowDrop>,
    );
    fireEvent(window, Object.assign(new Event('dragenter'), { dataTransfer: dt(['text/plain']) }));
    expect(document.querySelector('[data-window-drop]')).toBeNull();
    fireEvent(window, Object.assign(new Event('dragenter'), { dataTransfer: dt(['Files']) }));
    expect(screen.getByText('Release to upload to Due diligence')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.querySelector('[data-window-drop]')).toBeNull();
  });

  it('never opens while a dialog is open; read-only says so instead', () => {
    const { unmount } = render(
      <>
        <div role="dialog" aria-label="x" />
        <WindowDrop target="Due diligence" onDrop={() => {}}>
          <p>page</p>
        </WindowDrop>
      </>,
    );
    fireEvent(window, Object.assign(new Event('dragenter'), { dataTransfer: dt(['Files']) }));
    expect(document.querySelector('[data-window-drop]')).toBeNull();
    unmount();
    render(
      <WindowDrop target="x" onDrop={() => {}} readOnly open>
        <p>page</p>
      </WindowDrop>,
    );
    expect(screen.getByText('You can only view here')).toBeInTheDocument();
  });

  it('a zone names its folder on hover and says why a drop was refused', async () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    render(<Dropzone target="Due diligence" accept=".pdf" onFiles={onFiles} onReject={onReject} />);
    const zone = screen.getByText('Drop files').closest('[data-state]')!;
    fireEvent.dragEnter(zone, { dataTransfer: dt(['Files']) });
    expect(zone).toHaveAttribute('data-state', 'over');
    expect(screen.getByText('Release to upload to Due diligence')).toBeInTheDocument();
    fireEvent.drop(zone, { dataTransfer: dt(['Files'], { items: [] as never, files: [file('setup.exe')] as never }) });
    await waitFor(() => expect(zone).toHaveAttribute('data-state', 'refused'));
    expect(screen.getByText('.exe files aren’t supported')).toBeInTheDocument();
    expect(onFiles).not.toHaveBeenCalled();
    expect(onReject).toHaveBeenCalledOnce();
  });

  it('choose files is a real button; passes axe', async () => {
    const { container } = render(<Dropzone directory onFiles={() => {}} />);
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose a folder' })).toBeInTheDocument();
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe('UploadCheck', () => {
  const items: DroppedFile[] = [
    { file: file('a.pdf'), path: 'Q3/Financials/a.pdf' },
    { file: file('b.pdf'), path: 'Q3/Financials/b.pdf' },
    { file: file('c.tmp'), path: 'Q3/.cache/c.tmp' },
    { file: file('installer.exe'), path: 'Q3/installer.exe' },
    { file: file('notes.pdf'), path: 'Q3/notes.pdf' },
  ];

  it('groups by sub-folder, hidden ones unticked', () => {
    const groups = groupByFolder(items.filter((i) => !i.path.endsWith('.exe')));
    expect(groups.map((g) => [g.key, g.files.length, g.hidden])).toEqual([
      ['', 1, false],
      ['Financials', 2, false],
      ['.cache', 1, true],
    ]);
  });

  it('uploads what is ticked, lists what won’t upload and why', async () => {
    const onConfirm = vi.fn();
    render(<UploadCheck folder="Q3" items={items} accept=".pdf,.tmp" onConfirm={onConfirm} />);
    expect(screen.getByText('Unsupported type')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '.cache' })).not.toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Upload 3 files' }));
    expect(onConfirm.mock.calls[0]![0].map((f: DroppedFile) => f.path).sort()).toEqual(['Q3/Financials/a.pdf', 'Q3/Financials/b.pdf', 'Q3/notes.pdf']);
  });
});

describe('UploadRow', () => {
  it('counts the retry down', () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    render(
      <UploadList>
        <UploadRow item={{ id: '1', name: 'Cap table.xlsx', state: 'retrying', retryAt: 5000 }} />
      </UploadList>,
    );
    expect(screen.getByText('Retrying in 5 s')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText('Retrying in 3 s')).toBeInTheDocument();
  });

  it('a failure explains itself and offers Retry and Dismiss', () => {
    const onRetry = vi.fn();
    render(
      <UploadList>
        <UploadRow item={{ id: '7', name: 'Board minutes.docx', state: 'failed', error: 'The connection dropped.' }} onRetry={onRetry} onDismiss={() => {}} />
      </UploadList>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Upload failed. The connection dropped.');
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledWith('7');
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('folder aggregate reads "28 / 41 · 1 failed"', async () => {
    const { container } = render(
      <UploadList>
        <UploadFolderRow name="2026 Q3 due diligence" done={28} total={41} failed={1} />
        <UploadRow item={{ id: '2', name: 'Shareholder agreement v3.pdf', state: 'uploading', progress: 62 }} onCancel={() => {}} />
      </UploadList>,
    );
    expect(screen.getByText('28 / 41 · 1 failed')).toBeInTheDocument();
    expect(await a11y(container)).toHaveNoViolations();
  });

  it('asks before leaving only while active', () => {
    function Probe({ active }: { active: boolean }) {
      useBeforeUnloadWhile(active);
      return null;
    }
    const add = vi.spyOn(window, 'addEventListener');
    const { rerender } = render(<Probe active={false} />);
    expect(add.mock.calls.some(([t]) => t === 'beforeunload')).toBe(false);
    rerender(<Probe active />);
    expect(add.mock.calls.some(([t]) => t === 'beforeunload')).toBe(true);
    add.mockRestore();
  });
});

describe('Skeletons and page states', () => {
  it('viewer copy changes on long waits', () => {
    vi.useFakeTimers();
    render(<SkeletonViewer />);
    expect(screen.getByText('Opening…')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText('Rendering page 1…')).toBeInTheDocument();
  });

  it('one sentence and one action per state; passes axe', async () => {
    const { container } = render(
      <div>
        <PageState kind="empty" title="No documents yet" action={<Button>Upload files</Button>} />
        <PageState kind="error" title="Couldn’t load; your work is saved" action={<Button variant="secondary">Try again</Button>} />
        <PageNotice tone="update" action={<Button size="sm">Refresh</Button>}>
          MetaRoom has been updated. Refresh to load this page.
        </PageNotice>
        <SkeletonList rows={2} />
      </div>,
    );
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe('small print', () => {
  it('sizes in decimal units; a started retry says so', async () => {
    const { formatBytes } = await import('./status-files');
    expect(formatBytes(3_400_000)).toBe('3.4 MB');
    expect(formatBytes(318_000_000)).toBe('318 MB');
    vi.useFakeTimers();
    vi.setSystemTime(10_000);
    render(<UploadRow item={{ id: '1', name: 'x.pdf', state: 'retrying', retryAt: 9_000 }} />);
    expect(screen.getByText('Retrying…')).toBeInTheDocument();
  });
});
