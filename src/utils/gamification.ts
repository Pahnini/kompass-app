export type ActivityKind = 'mood' | 'skill' | 'thought' | 'goal';
export const MAX_XP = 1_000_000_000;
export const ACTION_XP = 5;
export function safeXP(value: number): number {
  return Number.isFinite(value) ? Math.min(MAX_XP, Math.max(0, Math.floor(value))) : 0;
}
export type QuestDefinition = {
  id: string;
  title: string;
  description: string;
  kind: ActivityKind;
  goal: number;
  rewardXP: number;
  period: 'daily' | 'weekly';
  to: string;
};
export const QUESTS: QuestDefinition[] = [
  {
    id: 'daily-mood',
    title: 'Kurz bei dir einchecken',
    description: 'Speichere einen Stimmungs-Check-in.',
    kind: 'mood',
    goal: 1,
    rewardXP: 15,
    period: 'daily',
    to: '/mood',
  },
  {
    id: 'daily-skill',
    title: 'Eine kleine Pause',
    description: 'Schließe eine Übung ab oder markiere einen angewendeten Skill.',
    kind: 'skill',
    goal: 1,
    rewardXP: 15,
    period: 'daily',
    to: '/skills',
  },
  {
    id: 'daily-thought',
    title: 'Ein Gedanke für dich',
    description: 'Speichere freiwillig einen kurzen Gedanken.',
    kind: 'thought',
    goal: 1,
    rewardXP: 15,
    period: 'daily',
    to: '/gedanken',
  },
  {
    id: 'daily-goal',
    title: 'Ein kleiner Schritt',
    description: 'Erledige eines deiner selbst gewählten Ziele.',
    kind: 'goal',
    goal: 1,
    rewardXP: 15,
    period: 'daily',
    to: '/deinweg',
  },
  {
    id: 'use-skills-3x',
    title: 'Drei verschiedene Skills',
    description: 'Wende diese Woche drei unterschiedliche Skills oder Übungen an.',
    kind: 'skill',
    goal: 3,
    rewardXP: 50,
    period: 'weekly',
    to: '/skills',
  },
  {
    id: 'mood-tracker-2x',
    title: 'Zwei Momente festhalten',
    description: 'Speichere an zwei Tagen dieser Woche einen Check-in.',
    kind: 'mood',
    goal: 2,
    rewardXP: 40,
    period: 'weekly',
    to: '/mood',
  },
];
export type Activity = { kind: ActivityKind; id: string; day: string };
export type GameState = {
  version: 1;
  day: string;
  week: string;
  xp: number;
  enabled: boolean;
  selected: string[];
  actions: Activity[];
  claimed: string[];
  activeDays: string[];
  badges: Record<string, string>;
};
export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function weekStart(day: string): string {
  const date = new Date(`${day}T12:00:00`);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return localDay(date);
}
export function newGame(day = localDay(), xp = 0): GameState {
  return {
    version: 1,
    day,
    week: weekStart(day),
    xp: safeXP(xp),
    enabled: true,
    selected: ['daily-mood', 'daily-skill'],
    actions: [],
    claimed: [],
    activeDays: [],
    badges: {},
  };
}
export function rollover(state: GameState, day: string): GameState {
  if (state.day >= day) return state;
  const week = weekStart(day);
  return {
    ...state,
    day,
    week,
    actions: state.actions.filter(action => action.day >= week && action.day <= day),
    claimed: state.claimed.filter(key => key.startsWith(`${week}:weekly:`)),
  };
}
export function restoreGame(raw: string | null, day: string, initialXP = 0): GameState {
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (!value || typeof value !== 'object') return newGame(day, initialXP);
    const saved = value as Partial<GameState>;
    if (
      saved.version !== 1 ||
      typeof saved.day !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(saved.day)
    )
      return newGame(day, initialXP);
    const base = newGame(saved.day, initialXP);
    const known = new Set(QUESTS.filter(q => q.period === 'daily').map(q => q.id));
    return rollover(
      {
        ...base,
        xp:
          typeof saved.xp === 'number' && Number.isFinite(saved.xp)
            ? Math.max(base.xp, safeXP(saved.xp))
            : base.xp,
        enabled: saved.enabled !== false,
        selected: Array.isArray(saved.selected)
          ? [...new Set(saved.selected.filter(id => known.has(id)))].slice(0, 3)
          : base.selected,
        actions: Array.isArray(saved.actions)
          ? saved.actions
              .filter(
                a =>
                  a &&
                  ['mood', 'skill', 'thought', 'goal'].includes(a.kind) &&
                  typeof a.id === 'string' &&
                  a.id.length <= 200 &&
                  typeof a.day === 'string' &&
                  /^\d{4}-\d{2}-\d{2}$/.test(a.day)
              )
              .slice(-100)
          : [],
        claimed: Array.isArray(saved.claimed)
          ? saved.claimed.filter(key => typeof key === 'string').slice(-30)
          : [],
        activeDays: Array.isArray(saved.activeDays)
          ? [
              ...new Set(
                saved.activeDays.filter(d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d))
              ),
            ].slice(-366)
          : [],
        badges:
          saved.badges && typeof saved.badges === 'object' && !Array.isArray(saved.badges)
            ? Object.fromEntries(
                Object.entries(saved.badges).filter(([, date]) => typeof date === 'string')
              )
            : {},
      },
      day
    );
  } catch {
    return newGame(day, initialXP);
  }
}
export function questProgress(state: GameState, quest: QuestDefinition): number {
  const actions = state.actions.filter(
    a => a.kind === quest.kind && (quest.period !== 'daily' || a.day === state.day)
  );
  const distinct = new Set(
    actions.map(a => (quest.kind === 'skill' || quest.kind === 'goal' ? a.id : a.day))
  );
  return Math.min(quest.goal, distinct.size);
}
const pointBadges = [10, 25, 50, 100, 200, 500, 1000];
export const BADGES = [
  ...pointBadges.map(points => ({
    id: `points-${points}`,
    title: `${points} XP gesammelt`,
    description: 'Deine kleinen Schritte zählen.',
  })),
  {
    id: 'first-skill',
    title: 'Eine Pause für dich',
    description: 'Deinen ersten Skill angewendet.',
  },
  {
    id: 'first-mood',
    title: 'Bei dir eingecheckt',
    description: 'Deinen ersten Check-in gespeichert.',
  },
  {
    id: 'first-thought',
    title: 'Gedankenraum',
    description: 'Deinen ersten Gedanken festgehalten.',
  },
  {
    id: 'first-goal',
    title: 'Dein nächster Schritt',
    description: 'Ein selbst gewähltes Ziel erledigt.',
  },
  {
    id: 'days-3',
    title: 'In deinem Tempo',
    description: 'An drei Tagen aktiv gewesen. Pausen sind willkommen.',
  },
  {
    id: 'days-7',
    title: 'Dein eigener Rhythmus',
    description: 'An sieben Tagen aktiv gewesen. Sie müssen nicht aufeinanderfolgen.',
  },
];
function rewardQuests(state: GameState): GameState {
  const next = { ...state, claimed: [...state.claimed], badges: { ...state.badges } };
  for (const quest of QUESTS) {
    if (quest.period === 'daily' && !next.selected.includes(quest.id)) continue;
    if (
      quest.period === 'daily' &&
      next.claimed.filter(key => key.startsWith(`${next.day}:daily:`)).length >= 3
    )
      continue;
    const claim = `${quest.period === 'daily' ? next.day : next.week}:${quest.period}:${quest.id}`;
    if (questProgress(next, quest) >= quest.goal && !next.claimed.includes(claim)) {
      next.xp = safeXP(next.xp + quest.rewardXP);
      next.claimed.push(claim);
    }
  }
  for (const points of pointBadges)
    if (next.xp >= points && !next.badges[`points-${points}`])
      next.badges[`points-${points}`] = next.day;
  for (const days of [3, 7])
    if (next.activeDays.length >= days && !next.badges[`days-${days}`])
      next.badges[`days-${days}`] = next.day;
  return next;
}
export function recordActivity(
  state: GameState,
  kind: ActivityKind,
  id: string,
  day = localDay()
): GameState {
  const current = rollover(state, day);
  if (day < current.day || !current.enabled || !id || id.length > 200) return current;
  const actionId = kind === 'mood' || kind === 'thought' ? kind : id;
  const today = current.actions.filter(a => a.day === day && a.kind === kind);
  if (
    today.some(a => a.id === actionId) ||
    today.length >= (kind === 'skill' || kind === 'goal' ? 3 : 1)
  )
    return current;
  const next = {
    ...current,
    xp: safeXP(current.xp + ACTION_XP),
    actions: [...current.actions, { kind, id: actionId, day }],
    activeDays: [...new Set([...current.activeDays, day])].slice(-366),
    badges: { ...current.badges },
  };
  if (!next.badges[`first-${kind}`]) next.badges[`first-${kind}`] = day;
  return rewardQuests(next);
}
export function selectDaily(state: GameState, ids: string[], day = localDay()): GameState {
  const current = rollover(state, day);
  const known = new Set(QUESTS.filter(q => q.period === 'daily').map(q => q.id));
  const next = { ...current, selected: [...new Set(ids.filter(id => known.has(id)))].slice(0, 3) };
  return next.enabled ? rewardQuests(next) : next;
}
export function levelFor(xp: number): { level: number; progress: number; remaining: number } {
  xp = safeXP(xp);
  const thresholds = [0, 10, 25, 50, 100];
  let level = 1;
  let start = 0;
  let end = 10;
  while (xp >= end) {
    level++;
    start = end;
    end = level < thresholds.length ? thresholds[level] : end + 100 + (level - 5) * 50;
  }
  return {
    level,
    progress: Math.min(100, Math.max(0, ((xp - start) / (end - start)) * 100)),
    remaining: end - xp,
  };
}
