import { Compass } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserData } from '../hooks/useUserData';
import type { SidebarItem } from '../types/index';
import './HomeScreen.css';
import SortableQuickList from './SortableQuickList';
import { useQuests } from '../hooks/useQuest';
import { QuestTracker } from "../components/QuestTracker";
import PanicButton from '../components/PanicButton';


interface HomeScreenProps {
  username: string;
  setUsername: (username: string) => void;
  quickItems: string[];
  allItems: SidebarItem[];
  setFavorites: (items: string[]) => void;
}

export default function HomeScreen({
  username,
  setUsername,
  quickItems,
  allItems,
  setFavorites,
}: HomeScreenProps): React.ReactElement {
  const navigate = useNavigate();
  const { addPoints, level, levelProgress } = useUserData();
  const [animatingKey, setAnimatingKey] = useState<string | undefined>(undefined);

  const { t } = useTranslation();

  const getPath = (key: string): string => (key === 'home' ? '/' : `/${key}`);

  const translatedItems = quickItems
    .map(key => allItems.find(item => item.key === key))
    .filter((item): item is SidebarItem => !!item)
    .map(item => ({
      ...item,
      label: t(item.label),
    }));

  const filteredItems = translatedItems.filter(item => item.key !== 'home');

  const { updateQuestProgress } = useQuests();

  const handleQuickClick = (key: string) => {
    setAnimatingKey(key);
    addPoints(1);
    updateQuestProgress("use-skills-3x");
    setTimeout(() => setAnimatingKey(undefined), 300);
    navigate(getPath(key));
  };

  return (
    <div className="card">
      {/* Begrüßung */}
      <div className="welcome-section">
        <div
          style={{
            fontSize: '48px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <PanicButton />
          <Compass size={64} color="#5dade2" />
        </div>

        <h1>{t('home.welcome')}</h1>
        <p>{t('home.appDescription')}</p>
        <p>{t('home.featuresDescription')}</p>


        {!username && (
          <div className="form-row" style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder={t('home.username.placeholder')}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                const input = e.currentTarget;
                if (e.key === 'Enter' && input.value.trim()) {
                  setUsername(input.value.trim());
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>('input');
                if (input?.value.trim()) {
                  setUsername(input.value.trim());
                }
              }}
            >
              ✓
            </button>
          </div>
        )}
      </div>

      {/* XP-Level */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '14px', marginBottom: '4px' }}>
          Level {level} – {Math.round(levelProgress)}%
        </div>
        <div style={{ background: '#ddd', height: '10px', borderRadius: '5px' }}>
          <div
            style={{
              width: `${levelProgress}%`,
              height: '100%',
              background: '#0b9444',
              borderRadius: '5px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Quest-Bereich */}
      <div style={{ marginTop: '24px' }}>
        <QuestTracker />
      </div>


      {/* Schnellzugriffe */}
      <div className="section">
        <h3>{t('home.quickAccessTitle')}</h3>
        <SortableQuickList
          items={filteredItems.map(item => ({
            id: item.key,
            icon: item.icon as React.ReactNode,
            label: item.label,
            onClick: () => handleQuickClick(item.key),
          }))}
          setItems={(newItems) => {
            const newKeys = newItems.map(item => item.id);
            setFavorites(newKeys);
          }}
        />

      </div>
    </div>
  );
}
