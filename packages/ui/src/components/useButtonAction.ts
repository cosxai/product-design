import { useCallback, useEffect, useRef, useState } from 'react';

import type { ButtonState } from './Button';

export type ButtonAction<A extends unknown[]> = {
  /** Pass to <Button state>. */
  state: ButtonState;
  /** The last failure, to explain beside the button (with a Retry). Cleared on the next run. */
  error: unknown;
  /** Run the action: busy → done for `doneFor` ms → idle; on failure → idle with `error` set. */
  run: (...args: A) => Promise<void>;
};

/**
 * useButtonAction — the async button of the spec: busy while the action
 * runs, the result confirmed in place for 1.6s, a failure kept for the
 * caller to explain in place. Repeat runs while busy are ignored.
 */
export function useButtonAction<A extends unknown[]>(action: (...args: A) => Promise<unknown>, { doneFor = 1600 }: { doneFor?: number } = {}): ButtonAction<A> {
  const [state, setState] = useState<ButtonState>('idle');
  const [error, setError] = useState<unknown>(null);
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);

  useEffect(
    () => () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const run = useCallback(
    async (...args: A) => {
      if (busy.current) return;
      busy.current = true;
      setError(null);
      setState('busy');
      try {
        await action(...args);
        if (!alive.current) return;
        setState('done');
        timer.current = setTimeout(() => alive.current && setState('idle'), doneFor);
      } catch (e) {
        if (!alive.current) return;
        setError(e);
        setState('idle');
      } finally {
        busy.current = false;
      }
    },
    [action, doneFor],
  );

  return { state, error, run };
}
