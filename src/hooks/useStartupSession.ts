import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export const AUTH_STARTUP_TIMEOUT_MS = 5_000;

export function useStartupSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionIssue, setConnectionIssue] = useState(false);

  useEffect(() => {
    let active = true;
    let authRevision = 0;
    const timer = window.setTimeout(() => {
      if (!active) return;
      // Only release the public UI. Never grant account access from a failed refresh.
      setConnectionIssue(true);
      setLoading(false);
    }, AUTH_STARTUP_TIMEOUT_MS);

    // Subscribe before reading the session so newer sign-in/sign-out events win.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      authRevision++;
      window.clearTimeout(timer);
      setSession(next);
      setConnectionIssue(false);
      setLoading(false);
    });

    void Promise.resolve()
      .then(() => supabase.auth.getSession())
      .then(({ data, error }) => {
        if (!active || authRevision !== 0) return;
        window.clearTimeout(timer);
        setSession(error ? null : data.session);
        setConnectionIssue(Boolean(error));
        setLoading(false);
      })
      .catch(() => {
        if (!active || authRevision !== 0) return;
        window.clearTimeout(timer);
        setSession(null);
        setConnectionIssue(true);
        setLoading(false);
      });

    return () => {
      active = false;
      window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading, connectionIssue };
}
