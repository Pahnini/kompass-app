import type { Session } from '@supabase/supabase-js';
import { AuthError } from '@supabase/supabase-js';
import { StrictMode } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { supabase } from '../../utils/supabase';
import { AUTH_STARTUP_TIMEOUT_MS, useStartupSession } from '../useStartupSession';

const sample = { user: { id: 'startup-test-user' } } as Session;
type Result = Awaited<ReturnType<typeof supabase.auth.getSession>>;
const pending = () => new Promise<Result>(() => {});
let authEvent: (event: string, session: Session | null) => void;
let unsubscribe = vi.fn<() => void>();

beforeEach(() => {
  vi.useFakeTimers();
  unsubscribe = vi.fn();
  vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(callback => {
    authEvent = callback as typeof authEvent;
    return { data: { subscription: { id: 'startup-test', callback, unsubscribe } } };
  });
  vi.mocked(supabase.auth.getSession).mockImplementation(pending);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe('Bounded startup session', () => {
  it('loads a session without waiting for the deadline', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: sample },
      error: null,
    });
    const { result } = renderHook(useStartupSession);
    await flush();
    expect(result.current).toEqual({ session: sample, loading: false, connectionIssue: false });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('releases only public UI after a hung refresh without clearing stored data', async () => {
    localStorage.setItem('private-draft', 'keep');
    const { result } = renderHook(useStartupSession);
    await flush();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(AUTH_STARTUP_TIMEOUT_MS);
    });
    expect(result.current).toEqual({ session: null, loading: false, connectionIssue: true });
    expect(localStorage.getItem('private-draft')).toBe('keep');
  });

  it('handles rejected network requests', async () => {
    vi.mocked(supabase.auth.getSession).mockRejectedValue(new Error('network unavailable'));
    const { result } = renderHook(useStartupSession);
    await flush();
    expect(result.current).toEqual({ session: null, loading: false, connectionIssue: true });
  });

  it('keeps account access closed when Supabase returns an auth error', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: new AuthError('refresh failed'),
    });
    const { result } = renderHook(useStartupSession);
    await flush();
    expect(result.current.session).toBeNull();
    expect(result.current.connectionIssue).toBe(true);
  });

  it('lets INITIAL_SESSION finish startup even if getSession is still pending', async () => {
    const { result } = renderHook(useStartupSession);
    await flush();
    act(() => authEvent('INITIAL_SESSION', sample));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(AUTH_STARTUP_TIMEOUT_MS);
    });
    expect(result.current).toEqual({ session: sample, loading: false, connectionIssue: false });
  });

  it('does not let an older session overwrite a newer sign-out event', async () => {
    let resolve!: (value: Result) => void;
    vi.mocked(supabase.auth.getSession).mockImplementation(
      () =>
        new Promise<Result>(done => {
          resolve = done;
        })
    );
    const { result } = renderHook(useStartupSession);
    await flush();
    act(() => authEvent('SIGNED_OUT', null));
    await act(async () => {
      resolve({ data: { session: sample }, error: null });
    });
    expect(result.current).toEqual({ session: null, loading: false, connectionIssue: false });
  });

  it('recovers after the deadline when a valid session arrives', async () => {
    const { result } = renderHook(useStartupSession);
    await flush();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(AUTH_STARTUP_TIMEOUT_MS);
    });
    act(() => authEvent('SIGNED_IN', sample));
    expect(result.current).toEqual({ session: sample, loading: false, connectionIssue: false });
  });

  it('ignores events after unmount and removes its timer and subscription', async () => {
    const { result, unmount } = renderHook(useStartupSession);
    await flush();
    unmount();
    act(() => authEvent('SIGNED_IN', sample));
    expect(result.current.session).toBeNull();
    expect(unsubscribe).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not leave duplicate subscriptions in StrictMode', async () => {
    const subscriptions: Array<ReturnType<typeof vi.fn>> = [];
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(callback => {
      const stop = vi.fn();
      subscriptions.push(stop);
      return { data: { subscription: { id: 'strict-mode-test', callback, unsubscribe: stop } } };
    });
    const { unmount } = renderHook(useStartupSession, { wrapper: StrictMode });
    await flush();
    expect(subscriptions).toHaveLength(2);
    expect(subscriptions[0]).toHaveBeenCalledOnce();
    expect(subscriptions[1]).not.toHaveBeenCalled();
    unmount();
    expect(subscriptions[1]).toHaveBeenCalledOnce();
  });
});
