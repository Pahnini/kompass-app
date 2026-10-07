// src/hooks/useQuests.ts
import { useGamification } from '../context/GamificationContext';
import { QUESTS, questProgress } from '../utils/gamification';
export function useQuests() {
  const { state } = useGamification();
  return {
    quests: QUESTS.filter(q => q.period === 'weekly' || state.selected.includes(q.id)).map(q => ({
      ...q,
      progress: questProgress(state, q),
      completed: questProgress(state, q) >= q.goal,
    })),
  };
}
