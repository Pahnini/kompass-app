import {
  AlertTriangle,
  BookHeart,
  Bot,
  Check,
  Compass,
  Mic2,
  Pencil,
  Sparkles,
  Waves,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { QuestTracker } from '../components/shared/QuestTracker';
import SortableQuickList from '../components/shared/SortableQuickList';
import { APP_NAME, APP_VERSION_LABEL } from '../config/brand';
import { getNavigationPath } from '../data/navigation';
import { useQuests } from '../hooks/useQuest';
import { useUserData } from '../hooks/useUserData';
import type { SidebarItem } from '../types/index';
import './HomePage.css';

interface HomeScreenProps {
  username: string;
  setUsername: (username: string) => void;
  quickItems: string[];
  allItems: SidebarItem[];
  setFavorites: (items: string[]) => void;
}

const primaryCards = [
  {
    to: '/gedanken',
    label: 'Kurzer Gedanke',
    description: 'Sprechen oder tippen und nur auf Wunsch speichern',
    icon: Mic2,
  },
  {
    to: '/skills',
    label: 'Skills',
    description: 'Etwas, das dir jetzt guttun kann',
    icon: Sparkles,
  },
  {
    to: '/mood',
    label: 'Stimmung',
    description: 'Kurz einordnen, wie es dir geht',
    icon: Waves,
  },
  {
    to: '/deinweg',
    label: 'Mein Weg',
    description: 'Gedanken, Ziele und kleine Schritte',
    icon: BookHeart,
  },
];

export default function HomeScreen({
  username,
  setUsername,
  quickItems,
  allItems,
  setFavorites,
}: HomeScreenProps): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addPoints, level, levelProgress } = useUserData();
  const { updateQuestProgress } = useQuests();
  const [draftName, setDraftName] = useState(username);
  const [isEditingName, setIsEditingName] = useState(!username);

  useEffect(() => {
    setDraftName(username);
    setIsEditingName(!username);
  }, [username]);

  const translatedItems = quickItems
    .map(key => allItems.find(item => item.key === key))
    .filter((item): item is SidebarItem => Boolean(item))
    .filter(item => item.key !== 'home')
    .map(item => ({ ...item, label: item.label === 'Nova' ? 'Nova' : t(item.label) }));

  const handleQuickClick = (key: string): void => {
    addPoints(1);
    updateQuestProgress('use-skills-3x');
    void navigate(getNavigationPath(key));
  };

  const saveName = (): void => {
    const cleanName = draftName.trim().slice(0, 40);
    if (!cleanName) return;
    setUsername(cleanName);
    setIsEditingName(false);
  };

  return (
    <div className="melforia-home">
      <header className="melforia-home__topbar">
        <Link to="/" className="melforia-home__brand" aria-label={`${APP_NAME} Startseite`}>
          <span aria-hidden="true">
            <Compass size={19} />
          </span>
          <strong>{APP_NAME}</strong>
          <small>{APP_VERSION_LABEL}</small>
        </Link>
        <Link to="/notfall" className="melforia-home__help">
          <AlertTriangle size={18} aria-hidden="true" />
          <span>Hilfe</span>
        </Link>
      </header>

      <section className="melforia-home__hero" aria-labelledby="home-greeting">
        <div className="melforia-home__greeting">
          <p>Dein Raum für heute</p>
          <div className="melforia-home__greeting-row">
            <h1 id="home-greeting">Willkommen zurück{username ? `, ${username}` : ''}!</h1>
            {username && !isEditingName && (
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                aria-label="Namen ändern"
              >
                <Pencil size={17} />
              </button>
            )}
          </div>

          {isEditingName && (
            <div className="melforia-home__name-form">
              <label htmlFor="melforia-name">Wie darf Melforia dich nennen?</label>
              <div>
                <input
                  id="melforia-name"
                  type="text"
                  value={draftName}
                  maxLength={40}
                  autoComplete="nickname"
                  placeholder="Dein Vorname oder Spitzname"
                  onChange={event => setDraftName(event.currentTarget.value)}
                  onKeyDown={event => {
                    if (event.key === 'Enter') saveName();
                  }}
                />
                <button type="button" onClick={saveName} disabled={!draftName.trim()}>
                  <Check size={18} aria-hidden="true" />
                  Speichern
                </button>
              </div>
              <small>Der Name wird nur für deine persönliche Begrüßung verwendet.</small>
            </div>
          )}
        </div>

        <button
          type="button"
          className="melforia-home__compass"
          onClick={() => void navigate('/mood')}
          aria-label="Stimmungs-Kompass öffnen"
        >
          <span className="melforia-home__compass-orbit" aria-hidden="true">
            <Compass size={82} strokeWidth={1.45} />
          </span>
          <strong>Wie geht es dir gerade?</strong>
          <small>Stimmungs-Kompass öffnen</small>
        </button>
      </section>

      <nav className="melforia-home__primary" aria-label="Wichtige Bereiche">
        {primaryCards.map(card => {
          const Icon = card.icon;
          return (
            <Link key={card.to} to={card.to}>
              <span aria-hidden="true">
                <Icon size={29} strokeWidth={1.7} />
              </span>
              <strong>{card.label}</strong>
              <small>{card.description}</small>
            </Link>
          );
        })}
      </nav>

      <section className="melforia-home__nova" aria-labelledby="home-nova-heading">
        <span aria-hidden="true">
          <Bot size={25} />
        </span>
        <div>
          <p>Nova · kostenloser Testmodus</p>
          <h2 id="home-nova-heading">Was wäre jetzt ein guter nächster Schritt?</h2>
          <small>
            Nova begleitet dich durch Melforia – ohne Diagnose und ohne gespeicherten Chat.
          </small>
        </div>
        <Link to="/nova">Nova öffnen</Link>
      </section>

      <section className="melforia-home__progress" aria-labelledby="home-progress-heading">
        <div>
          <p>Dein Fortschritt</p>
          <h2 id="home-progress-heading">Level {level}</h2>
        </div>
        <div className="melforia-home__progress-track">
          <span style={{ width: `${levelProgress}%` }} />
        </div>
        <strong>{Math.round(levelProgress)}%</strong>
      </section>

      {translatedItems.length > 0 && (
        <section className="melforia-home__section" aria-labelledby="quick-access-heading">
          <div className="melforia-home__section-heading">
            <div>
              <p>Von dir ausgewählt</p>
              <h2 id="quick-access-heading">{t('home.quickAccessTitle')}</h2>
            </div>
            <Link to="/quickedit">Bearbeiten</Link>
          </div>
          <SortableQuickList
            items={translatedItems.map(item => ({
              id: item.key,
              icon: item.icon as React.ReactNode,
              label: item.label,
              onClick: () => handleQuickClick(item.key),
            }))}
            setItems={newItems => setFavorites(newItems.map(item => item.id))}
          />
        </section>
      )}

      <details className="melforia-home__quests">
        <summary>Wöchentliche Aufgaben anzeigen</summary>
        <QuestTracker />
      </details>
    </div>
  );
}
