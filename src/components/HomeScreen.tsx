import { Compass } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';
import type { SidebarItem } from '../types/index';
import './HomeScreen.css';
import SortableQuickList from './SortableQuickList';

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

  const getPath = (key: string): string => (key === 'home' ? '/' : `/${key}`);

  const handleQuickClick = (key: string) => {
    setAnimatingKey(key);
    addPoints(1);
    setTimeout(() => setAnimatingKey(undefined), 300);
    navigate(getPath(key));
  };

  return (
    <div className="card">
      {/* Begrüßung */}
      <div className="welcome-section">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          <Compass size={64} color="#5dade2" />
        </div>
        <h1>{useTranslation().t('home.welcome')}</h1>
        <p>Deine App für den Alltag nach der Klinik.</p>
        <p>Skills, Pläne, Chatbot & Hilfe bei Krisen – immer für dich da.</p>

        {!username && (
          <div className="form-row" style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder={useTranslation().t('home.username.placeholder') || "Wie kann ich dich nennen?"}
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

      {/* Mood & Journal */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}></div>

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

      {/* Schnellzugriffe */}
      <div className="section">
        <h3>Deine Schnellzugriffe</h3>
        <SortableQuickList
          items={allItems}
          quickItemKeys={quickItems}
          onOrderChange={setFavorites}
          onItemClick={handleQuickClick}
          animatingKey={animatingKey}
        />
      </div>
    </div>
  );
}
