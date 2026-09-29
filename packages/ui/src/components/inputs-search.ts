import { useCallback, useEffect, useRef, useState } from 'react';

export type SearchStatus = 'idle' | 'searching' | 'done' | 'error';

/**
 * Debounced, cancellable search. Each new query aborts the previous
 * request (its AbortSignal fires) and a late answer to an old query is
 * dropped, so results never flicker back. While a request is pending the
 * status is "searching" — callers show a spinner, never "No results".
 */
export function useDebouncedSearch<T>(
  query: string,
  search: ((query: string, signal: AbortSignal) => Promise<T>) | undefined,
  { delay = 250, minLength = 1 }: { delay?: number; minLength?: number } = {},
) {
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [result, setResult] = useState<T | undefined>(undefined);
  const [error, setError] = useState<unknown>(null);
  const [attempt, setAttempt] = useState(0);
  const seq = useRef(0);
  const ctrl = useRef<AbortController | null>(null);

  useEffect(() => {
    const q = query.trim();
    ctrl.current?.abort();
    ctrl.current = null;
    if (!search || q.length < minLength) {
      seq.current++;
      setStatus('idle');
      setResult(undefined);
      setError(null);
      return;
    }
    setStatus('searching');
    const mine = ++seq.current;
    const timer = setTimeout(() => {
      const c = new AbortController();
      ctrl.current = c;
      search(q, c.signal).then(
        (r) => {
          if (mine !== seq.current || c.signal.aborted) return;
          setResult(r);
          setError(null);
          setStatus('done');
        },
        (e: unknown) => {
          if (mine !== seq.current || c.signal.aborted) return;
          setError(e);
          setStatus('error');
        },
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [query, search, delay, minLength, attempt]);

  useEffect(() => () => ctrl.current?.abort(), []);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { status, result, error, retry };
}
