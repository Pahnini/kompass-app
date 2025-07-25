import React from 'react';
import { achievementList } from '../data/achievementList';
import { useTranslation } from 'react-i18next'; // ✅
import { useUserData } from '../hooks/useUserData';

export default function AchievementsScreen(): React.ReactElement {
  const { t } = useTranslation();
  const { achievements } = useUserData();

  const unlockedIds = new Set(achievements.map(a => a.id));

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h2>{t('achievements.title')}</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {achievementList.map(a => {
          const unlocked = unlockedIds.has(a.id);
          const date = achievements.find(e => e.id === a.id)?.date;

          return (
            <li
              key={a.id}
              style={{
                background: unlocked ? '#e0f7fa' : '#eee',
                color: unlocked ? '#000' : '#999',
                borderRadius: '8px',
                padding: '12px 16px',
                margin: '12px 0',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: unlocked ? 1 : 0.6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{unlocked ? (a.icon as React.ReactNode) : '🔒'}</span>
                <span>{t(a.label ?? '')}</span>
              </div>
              {unlocked && date && (
                <span style={{ fontSize: '12px', color: '#555' }}>
                  {new Date(date).toLocaleDateString()}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
