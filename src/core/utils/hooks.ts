import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';

export function useThrottleCallback<T extends (...args: any[]) => any>(fn: T, ms: number) {
  const activeThrottling = useRef<number>(0);

  useEffect(() => () => {
    if (activeThrottling.current) {
      window.clearTimeout(activeThrottling.current);
    }
  }, []);

  const resultFn = useCallback((...args: Parameters<T>) => {
    if (activeThrottling.current) {
      return;
    }
    activeThrottling.current = window.setTimeout(() => {
      activeThrottling.current = 0;
    }, ms);

    return fn(...args);
  }, [fn, ms]);

  return resultFn;
}

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useSyncRef<T>(data: T) {
  const ref = useRef(data);

  useIsomorphicLayoutEffect(() => {
    ref.current = data;
  }, [data]);

  return ref;
}
