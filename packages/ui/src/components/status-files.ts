// Shared by Dropzone, WindowDrop and UploadCheck: what was dropped, and
// whether each item may upload.

/** A file with its path inside a dropped folder ("Q3/Financials/a.pdf"). */
export type DroppedFile = { file: File; path: string };

export type RejectReason = 'type' | 'size' | 'depth';
export type Rejected = DroppedFile & { reason: RejectReason };

export type FileRules = {
  /** e.g. ".pdf,.docx,image/*" — empty accepts everything. */
  accept?: string | undefined;
  /** Per-file limit in bytes. @default 2 GB */
  maxSize?: number | undefined;
  /** Deepest folder level accepted (a/b/c = 3). @default 6 */
  maxDepth?: number | undefined;
};

export const DEFAULT_MAX_SIZE = 2 * 1000 ** 3; // "2 GB"
export const DEFAULT_MAX_DEPTH = 6;

/** A drag carries files (not text, links or cards dragged on the page). */
export function hasFiles(dt: DataTransfer | null | undefined): boolean {
  if (!dt) return false;
  return Array.from(dt.types ?? []).includes('Files');
}

/** Decimal units, as the spec writes sizes (318 MB, 1.2 of 3.4 MB) and as macOS shows them. */
export function formatBytes(n: number): string {
  if (n < 1000) return `${n} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let v = n / 1000;
  let i = 0;
  while (v >= 1000 && i < units.length - 1) {
    v /= 1000;
    i++;
  }
  return `${v >= 10 || Number.isInteger(v) ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}

function matchesAccept(file: File, accept: string | undefined): boolean {
  if (!accept?.trim()) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || '').toLowerCase();
  return accept
    .split(',')
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .some((a) => (a.startsWith('.') ? name.endsWith(a) : a.endsWith('/*') ? type.startsWith(a.slice(0, -1)) : type === a));
}

/** Folder depth of a path: "a.pdf" → 0, "Q3/a.pdf" → 1. */
export function depthOf(path: string): number {
  return Math.max(0, path.split('/').length - 1);
}

/** Hidden items (a segment starting with "."), unticked by default. */
export function isHidden(path: string): boolean {
  return path.split('/').some((s) => s.startsWith('.'));
}

export function checkFiles(items: DroppedFile[], rules: FileRules = {}): { accepted: DroppedFile[]; rejected: Rejected[] } {
  const maxSize = rules.maxSize ?? DEFAULT_MAX_SIZE;
  const maxDepth = rules.maxDepth ?? DEFAULT_MAX_DEPTH;
  const accepted: DroppedFile[] = [];
  const rejected: Rejected[] = [];
  for (const it of items) {
    if (depthOf(it.path) > maxDepth) rejected.push({ ...it, reason: 'depth' });
    else if (!matchesAccept(it.file, rules.accept)) rejected.push({ ...it, reason: 'type' });
    else if (it.file.size > maxSize) rejected.push({ ...it, reason: 'size' });
    else accepted.push(it);
  }
  return { accepted, rejected };
}

// Minimal shapes of the (non-standard, universally shipped) entry API.
type Entry = { isFile: boolean; isDirectory: boolean; name: string; fullPath?: string };
type FileEntry = Entry & { file: (ok: (f: File) => void, fail: (e: unknown) => void) => void };
type DirEntry = Entry & { createReader: () => { readEntries: (ok: (e: Entry[]) => void, fail: (e: unknown) => void) => void } };

async function walk(entry: Entry, prefix: string, out: DroppedFile[]): Promise<void> {
  const path = prefix ? `${prefix}/${entry.name}` : entry.name;
  if (entry.isFile) {
    const file = await new Promise<File>((ok, fail) => (entry as FileEntry).file(ok, fail));
    out.push({ file, path });
    return;
  }
  if (!entry.isDirectory) return;
  const reader = (entry as DirEntry).createReader();
  // readEntries returns batches (≤100 in Chrome) until an empty one.
  for (;;) {
    const batch = await new Promise<Entry[]>((ok, fail) => reader.readEntries(ok, fail));
    if (!batch.length) break;
    for (const child of batch) await walk(child, path, out);
  }
}

/** Everything in a drop, folders read recursively into files with paths. */
export async function readDataTransfer(dt: DataTransfer): Promise<DroppedFile[]> {
  const items = Array.from(dt.items ?? []);
  const entries = items
    .filter((i) => i.kind === 'file')
    .map((i) => (i as DataTransferItem & { webkitGetAsEntry?: () => Entry | null }).webkitGetAsEntry?.() ?? null);
  if (entries.length && entries.every(Boolean)) {
    const out: DroppedFile[] = [];
    for (const e of entries) await walk(e!, '', out);
    return out;
  }
  return Array.from(dt.files ?? []).map((file) => ({ file, path: file.name }));
}

/** Files from an <input type="file"> (webkitdirectory gives relative paths). */
export function fromInput(files: FileList | null): DroppedFile[] {
  return Array.from(files ?? []).map((file) => ({
    file,
    path: (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name,
  }));
}

/** "3 files · 1 folder" for what is being dragged or dropped. */
export function describeDrop(items: DroppedFile[]): { files: number; folders: number } {
  const folders = new Set(items.map((i) => i.path.split('/')).filter((p) => p.length > 1).map((p) => p[0]));
  return { files: items.filter((i) => depthOf(i.path) === 0).length, folders: folders.size };
}
