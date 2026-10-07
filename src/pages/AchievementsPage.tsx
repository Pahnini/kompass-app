import React from 'react';
import { GameBadges } from '../components/shared/GameBadges';
import { useGamification } from '../context/GamificationContext';
import BackButton from '../components/ui/BackButton';
import { Link } from 'react-router-dom';

export default function AchievementsScreen(): React.ReactElement {
  const { state } = useGamification();

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <BackButton />
      <h1>Deine Erfolge</h1>
      <p className="game-caption">
        {state.xp} XP · An {state.activeDays.length} Tagen aktiv. Pausen kosten dich keine Punkte.
      </p>
      <GameBadges />
      <Link to="/arcade" className="home-test-link">
        Deine Arcade-Belohnungen öffnen →
      </Link>
    </div>
  );
}
