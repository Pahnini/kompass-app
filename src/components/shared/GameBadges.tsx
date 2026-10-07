import { Award, LockKeyhole } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { BADGES } from '../../utils/gamification';
import '../../styles/Gamification.css';
export function GameBadges() {
  const { state } = useGamification();
  return (
    <ul className="game-badges">
      {BADGES.map(badge => {
        const unlocked =
          Boolean(state.badges[badge.id]) ||
          (badge.id.startsWith('points-') && state.xp >= Number(badge.id.slice(7)));
        return (
          <li key={badge.id} className={unlocked ? 'is-unlocked' : ''}>
            {unlocked ? <Award aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
            <h3>{badge.title}</h3>
            <p>{badge.description}</p>
            <small>
              {unlocked
                ? `Freigeschaltet${state.badges[badge.id] ? ` · ${state.badges[badge.id]}` : ''}`
                : 'Noch offen'}
            </small>
          </li>
        );
      })}
    </ul>
  );
}
