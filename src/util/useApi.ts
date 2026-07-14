import { useCallback, useEffect, useState } from 'react';

type State<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

/**
 * Runs an async API call on mount (and whenever `deps` change), exposing
 * loading/error/data plus a `reload` fn. Keeps screens declarative.
 */
export function useApi<T>(
  fn: () => Promise<T>,
  deps: unknown[] = [],
): State<T> & { reload: () => void } {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const run = useCallback(() => {
    let alive = true;
    setState(s => ({ ...s, loading: true, error: null }));
    fn()
      .then(data => {
        if (alive) setState({ data, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (alive)
          setState({
            data: null,
            loading: false,
            error: e instanceof Error ? e.message : 'Something went wrong',
          });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(run, [run]);

  return { ...state, reload: run };
}
