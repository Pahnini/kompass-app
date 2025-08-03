import { Compass } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserData } from '../hooks/useUserData';
import type { SidebarItem } from '../types/index';
import SortableQuickList from '../components/shared/SortableQuickList';
import { useQuests } from '../hooks/useQuest';
import { QuestTracker } from '../components/shared/QuestTracker';
import PanicButton from '../components/shared/PanicButton';

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
  const [, setAnimatingKey] = useState<string | undefined>(undefined);
  const { t } = useTranslation();
  const { updateQuestProgress } = useQuests();

  const getPath = (key: string): string => (key === 'home' ? '/' : `/${key}`);

  const translatedItems = quickItems
    .map((key) => allItems.find((item) => item.key === key))
    .filter((item): item is SidebarItem => !!item)
    .map((item) => ({ ...item, label: t(item.label) }));

  const filteredItems = translatedItems.filter((item) => item.key !== 'home');

  const handleQuickClick = (key: string) => {
    setAnimatingKey(key);
    addPoints(1);
    updateQuestProgress('use-skills-3x');
    setTimeout(() => setAnimatingKey(undefined), 300);
    void navigate(getPath(key));
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      {/* Begrüßung & Kompass */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="flex items-center justify-center gap-4">
          <PanicButton />
          <Compass size={64} className="text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">{t('home.welcome')}</h1>
        <p className="text-white/80">{t('home.appDescription')}</p>
        <p className="text-white/80">{t('home.featuresDescription')}</p>

        {!username && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder={t('home.username.placeholder') || ''}
              className="flex-1 px-4 py-2 rounded bg-white/10 text-white placeholder-white/60"
              onKeyDown={(e) => {
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
              className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90"
            >
              ✓
            </button>
          </div>
        )}
      </div>

      {/* XP Fortschritt */}
      <div className="mb-6">
        <div className="text-sm text-white/70 mb-1">
          Level {level} – {Math.round(levelProgress)}%
        </div>
        <div className="w-full h-3 bg-white/10 rounded">
          <div
            className="h-full bg-accent rounded transition-all duration-300"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>

      {/* Quests */}
      <div className="mb-6">
        <QuestTracker />
      </div>

      {/* Schnellzugriffe */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">{t('home.quickAccessTitle')}</h3>
        <SortableQuickList
          items={filteredItems.map((item) => ({
            id: item.key,
            icon: item.icon as React.ReactNode,
            label: item.label,
            onClick: () => handleQuickClick(item.key),
          }))}
          setItems={(newItems) => {
            const newKeys = newItems.map((item) => item.id);
            setFavorites(newKeys);
          }}
        />
      </div>
    </div>
  );
}
