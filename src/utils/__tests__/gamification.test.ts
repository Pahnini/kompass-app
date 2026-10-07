import { describe, expect, it } from 'vitest';
import {
  levelFor,
  newGame,
  QUESTS,
  questProgress,
  recordActivity,
  restoreGame,
  rollover,
  selectDaily,
} from '../gamification';
const monday = '2026-10-05';
const quest = (id: string) => QUESTS.find(q => q.id === id)!;
describe('Gamification rewards and calendar', () => {
  it('limits daily bonuses to three even after switching all four tasks', () => {
    let game = selectDaily(newGame(monday), ['daily-mood', 'daily-skill', 'daily-thought'], monday);
    game = recordActivity(game, 'mood', 'm', monday);
    game = recordActivity(game, 'skill', 'walk', monday);
    game = recordActivity(game, 'thought', 't', monday);
    game = selectDaily(game, ['daily-goal'], monday);
    game = recordActivity(game, 'goal', 'g', monday);
    expect(game.xp).toBe(65); // four actions, only three daily bonuses
    expect(game.claimed.filter(key => key.includes(':daily:'))).toHaveLength(3);
  });
  it('does not reset rewards when the device calendar moves backwards', () => {
    const game = recordActivity(newGame(monday), 'mood', 'm', monday);
    expect(recordActivity(game, 'mood', 'm', '2026-10-04').xp).toBe(20);
    expect(rollover(game, '2026-10-04')).toBe(game);
  });
  it('handles hostile or corrupt XP values without freezing level calculation', () => {
    expect(levelFor(Infinity)).toMatchObject({ level: 1, progress: 0 });
    expect(levelFor(-100)).toMatchObject({ level: 1, progress: 0 });
    expect(levelFor(Number.MAX_VALUE).level).toBeLessThan(10_000);
  });
  it('counts a saved mood once and rewards its daily quest once', () => {
    const one = recordActivity(newGame(monday), 'mood', 'entry-1', monday);
    expect(one.xp).toBe(20);
    expect(recordActivity(one, 'mood', 'entry-2', monday).xp).toBe(20);
    expect(one.badges['first-mood']).toBe(monday);
  });
  it('uses distinct skills and pays the weekly bonus once', () => {
    let game = newGame(monday);
    for (const id of ['walk', 'walk', 'music', 'water', 'other'])
      game = recordActivity(game, 'skill', id, monday);
    expect(questProgress(game, quest('use-skills-3x'))).toBe(3);
    expect(game.xp).toBe(80); // 3 x 5 + 15 daily + 50 weekly
    expect(recordActivity(game, 'skill', 'water', monday).xp).toBe(80);
  });
  it('resets daily progress, retains XP and unlocks weekly mood on distinct days', () => {
    const first = recordActivity(newGame(monday), 'mood', '1', monday);
    const next = rollover(first, '2026-10-06');
    expect(next.xp).toBe(20);
    expect(questProgress(next, quest('daily-mood'))).toBe(0);
    expect(questProgress(next, quest('mood-tracker-2x'))).toBe(1);
    expect(recordActivity(next, 'mood', '2', '2026-10-06').xp).toBe(80);
  });
  it('resets weeks on Monday including month and year boundaries', () => {
    const first = recordActivity(newGame('2026-12-31'), 'skill', 'walk', '2026-12-31');
    expect(rollover(first, '2027-01-01').week).toBe('2026-12-28');
    const next = rollover(first, '2027-01-04');
    expect(next.week).toBe('2027-01-04');
    expect(next.actions).toHaveLength(0);
    expect(next.xp).toBe(first.xp);
    expect(next.badges).toEqual(first.badges);
  });
  it('does not reward quest switching repeatedly', () => {
    let game = recordActivity(newGame(monday), 'mood', 'entry', monday);
    game = selectDaily(game, ['daily-skill'], monday);
    game = selectDaily(game, ['daily-mood'], monday);
    expect(game.xp).toBe(20);
  });
  it('caps selection and ignores unknown quests', () => {
    const game = selectDaily(
      newGame(monday),
      ['bad', 'daily-mood', 'daily-skill', 'daily-skill', 'daily-thought', 'daily-goal'],
      monday
    );
    expect(game.selected).toEqual(['daily-mood', 'daily-skill', 'daily-thought']);
  });
  it('pauses without earning XP or discarding existing progress', () => {
    const first = recordActivity(newGame(monday), 'skill', 'walk', monday);
    const paused = { ...first, enabled: false };
    expect(recordActivity(paused, 'mood', 'entry', monday)).toEqual(paused);
    const afterBreak = rollover(paused, '2026-10-19');
    expect(afterBreak.xp).toBe(first.xp);
    expect(afterBreak.badges).toEqual(first.badges);
  });
  it('keeps levels progressing beyond five and handles exact thresholds', () => {
    expect(levelFor(10)).toMatchObject({ level: 2, progress: 0 });
    expect(levelFor(100)).toMatchObject({ level: 5, progress: 0 });
    expect(levelFor(200)).toMatchObject({ level: 6, progress: 0 });
    expect(levelFor(1000).level).toBeGreaterThan(6);
  });
  it('restores saved rewards without replaying them and tolerates corruption', () => {
    const game = recordActivity(newGame(monday), 'mood', 'entry', monday);
    const restored = restoreGame(JSON.stringify(game), monday);
    expect(recordActivity(restored, 'mood', 'entry', monday).xp).toBe(game.xp);
    expect(restoreGame('{broken', monday, 100).xp).toBe(100);
    expect(
      restoreGame(
        JSON.stringify({ ...game, xp: 'wrong', actions: [null], selected: ['bad'] }),
        monday
      ).actions
    ).toEqual([]);
  });
  it('does not count repeated goal toggles or store mood/thought text', () => {
    const one = recordActivity(newGame(monday), 'goal', 'goal-1', monday);
    expect(recordActivity(one, 'goal', 'goal-1', monday).xp).toBe(one.xp);
    expect(recordActivity(one, 'thought', 'some-private-id', monday).actions.at(-1)?.id).toBe(
      'thought'
    );
  });
});
