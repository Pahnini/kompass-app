import { useCallback, useMemo, useSyncExternalStore } from 'react';
const CHANGED = 'melforia-local-record-changed';
export function accountStorageKey(record: string, userId: string | null): string {
  return `${record}:${userId ?? 'guest'}`;
}
export function useScopedStorage<T>(key: string, fallback: T, validate: (value: unknown) => T) {
  const subscribe = useCallback(
    (notify: () => void) => {
      const local = (event: Event) => {
        if ((event as CustomEvent<string>).detail === key) notify();
      };
      const remote = (event: StorageEvent) => {
        if (event.key === key || event.key === null) notify();
      };
      window.addEventListener(CHANGED, local);
      window.addEventListener('storage', remote);
      return () => {
        window.removeEventListener(CHANGED, local);
        window.removeEventListener('storage', remote);
      };
    },
    [key]
  );
  const snapshot = useCallback(() => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  const value = useMemo(() => {
    try {
      return raw === null ? fallback : validate(JSON.parse(raw));
    } catch {
      return fallback;
    }
  }, [raw, fallback, validate]);
  const write = (next: T | null): boolean => {
    try {
      if (next === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(CHANGED, { detail: key }));
      return true;
    } catch {
      return false;
    }
  };
  return [value, write] as const;
}
