import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { accountStorageKey, useScopedStorage } from '../useScopedStorage';
const empty: string[] = [];
const validate = (raw: unknown): string[] =>
  Array.isArray(raw) ? raw.filter(v => typeof v === 'string') : [];
describe('Account-local records', () => {
  it('updates subscribers immediately and keeps account data separate', () => {
    const a = accountStorageKey('test', 'alice');
    const b = accountStorageKey('test', 'bob');
    const one = renderHook(({ key }) => useScopedStorage(key, empty, validate), {
      initialProps: { key: a },
    });
    const mirror = renderHook(() => useScopedStorage(a, empty, validate));
    act(() => {
      one.result.current[1](['done']);
    });
    expect(mirror.result.current[0]).toEqual(['done']);
    one.rerender({ key: b });
    expect(one.result.current[0]).toEqual([]);
    one.rerender({ key: a });
    expect(one.result.current[0]).toEqual(['done']);
  });
  it('handles malformed data and separates demo/guest/account keys', () => {
    localStorage.setItem(accountStorageKey('record', 'alice'), '{bad');
    const hook = renderHook(() =>
      useScopedStorage(accountStorageKey('record', 'alice'), empty, validate)
    );
    expect(hook.result.current[0]).toEqual([]);
    expect(accountStorageKey('record', null)).not.toBe(accountStorageKey('record', 'alice'));
  });
});
