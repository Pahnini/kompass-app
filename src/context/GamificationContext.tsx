import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useUserData } from '../hooks/useUserData';
import { dataService } from '../services/dataService';
import {
  localDay,
  newGame,
  recordActivity,
  restoreGame,
  rollover,
  selectDaily,
  type ActivityKind,
  type GameState,
} from '../utils/gamification';
import SmartLoading from '../components/ui/SmartLoading';
type GameContext = {
  state: GameState;
  demo: boolean;
  status: string;
  retrySync: () => void;
  syncPending: boolean;
  rewardNotice: string;
  record: (kind: ActivityKind, id: string) => void;
  select: (ids: string[]) => void;
  setEnabled: (enabled: boolean) => void;
  resetDemo: () => void;
  nextDemoDay: () => void;
};
const Context = createContext<GameContext | null>(null);
export function GamificationProvider({
  children,
  demo = false,
}: {
  children: ReactNode;
  demo?: boolean;
}) {
  const { userId, isLoading, points } = useUserData();
  const owner = demo ? 'demo' : userId;
  const key = `melforia_game_v1:${owner ?? 'pending'}`;
  const [state, setState] = useState<GameState>(() => newGame());
  const [loadedKey, setLoadedKey] = useState('');
  const [localStatus, setLocalStatus] = useState('');
  const [syncStatus, setSyncStatus] = useState('');
  const [syncPending, setSyncPending] = useState(false);
  const [rewardNotice, setRewardNotice] = useState('');
  const current = useRef(state);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const clock = useRef<string | null>(null);
  const pendingXP = useRef<number | null>(null);
  const today = useCallback(() => (demo && clock.current ? clock.current : localDay()), [demo]);
  const saveXP = useCallback(
    (xp: number) => {
      if (demo || !owner) return;
      pendingXP.current = xp;
      if (!navigator.onLine) {
        setSyncPending(false);
        setSyncStatus(
          'Offline: Die Kontospeicherung ist pausiert. Sobald die Verbindung wieder da ist, versuchen wir es erneut.'
        );
        return;
      }
      setSyncPending(true);
      setSyncStatus('XP werden deinem Konto zugeordnet …');
      saveQueue.current = saveQueue.current
        .catch(() => {})
        .then(async () => {
          try {
            await dataService.setData('points', xp, owner);
            if (pendingXP.current === xp) {
              pendingXP.current = null;
              setSyncPending(false);
              setSyncStatus('');
            }
          } catch {
            if (pendingXP.current === xp) {
              setSyncPending(false);
              setSyncStatus(
                'Die Kontospeicherung ist fehlgeschlagen. Deine XP sind weiterhin sichtbar. Du kannst es erneut versuchen.'
              );
            }
          }
        });
    },
    [demo, owner]
  );
  const commit = useCallback(
    (next: GameState, persistXP = false) => {
      const previous = current.current;
      if (next === previous) return;
      current.current = next;
      setState(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
        setLocalStatus('');
      } catch {
        setLocalStatus(
          'Der Browser konnte den Fortschritt nicht speichern. Er bleibt für diese Sitzung sichtbar.'
        );
      }
      if (persistXP && next.xp !== previous.xp && !demo && owner) {
        saveXP(next.xp);
      }
      if (persistXP && next.xp > previous.xp)
        setRewardNotice(`+${next.xp - previous.xp} XP für deine kleinen Schritte.`);
    },
    [demo, key, owner, saveXP]
  );
  useEffect(() => {
    const retry = () => {
      if (pendingXP.current !== null) saveXP(current.current.xp);
    };
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, [saveXP]);
  useEffect(() => {
    if (!demo && (isLoading || !owner)) return;
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      /* In-memory mode remains usable. */
    }
    if (demo && raw) {
      // Keep the simulated calendar stable across reloads; never affects account data.
      try {
        const saved: unknown = JSON.parse(raw);
        if (
          saved &&
          typeof saved === 'object' &&
          'day' in saved &&
          typeof saved.day === 'string' &&
          /^\d{4}-\d{2}-\d{2}$/.test(saved.day) &&
          Number.isFinite(new Date(`${saved.day}T12:00:00`).getTime())
        )
          clock.current = saved.day;
      } catch {
        /* Corrupt data is handled by restoreGame below. */
      }
    }
    const restored = restoreGame(raw, today(), demo ? 0 : points);
    current.current = restored;
    setState(restored);
    setLoadedKey(key);
  }, [demo, isLoading, key, owner, points, today]);
  useEffect(() => {
    if (loadedKey !== key) return;
    const refresh = () => commit(rollover(current.current, today()));
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      const restored = restoreGame(event.newValue, today());
      restored.xp = Math.max(restored.xp, current.current.xp);
      current.current = restored;
      setState(restored);
    };
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, [commit, key, loadedKey, today]);
  const value: GameContext = {
    state,
    demo,
    status: [localStatus, syncStatus].filter(Boolean).join(' '),
    syncPending,
    rewardNotice,
    retrySync: () => saveXP(current.current.xp),
    record: (kind, id) => commit(recordActivity(current.current, kind, id, today()), true),
    select: ids => commit(selectDaily(current.current, ids, today()), true),
    setEnabled: enabled => commit({ ...rollover(current.current, today()), enabled }),
    resetDemo: () => {
      if (demo) {
        clock.current = null;
        commit(newGame());
        setRewardNotice('');
      }
    },
    nextDemoDay: () => {
      if (!demo) return;
      const date = new Date(`${today()}T12:00:00`);
      date.setDate(date.getDate() + 1);
      clock.current = localDay(date);
      commit(rollover(current.current, clock.current));
    },
  };
  if (loadedKey !== key) return <SmartLoading message="Dein Fortschritt wird geladen …" />;
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useGamification(): GameContext {
  const value = useContext(Context);
  if (!value) throw new Error('GamificationProvider fehlt.');
  return value;
}
