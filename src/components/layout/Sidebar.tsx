import { LogOut, Sparkles, X } from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { APP_NAME, APP_VERSION_LABEL } from '../../config/brand';
import { getNavigationPath } from '../../data/navigation';
import { useUserData } from '../../hooks/useUserData';
import type { SidebarItem } from '../../types/index';
import { supabase } from '../../utils/supabase';

interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  favorites?: string[];
}

const navigationGroups = [
  { label: 'Mein Alltag', keys: ['home', 'skills', 'mood', 'deinweg', 'nova'] },
  { label: 'Entdecken', keys: ['designs', 'achievements', 'school'] },
  {
    label: 'Hilfe & Einstellungen',
    keys: ['notfall', 'guide', 'barrierefreiheit', 'testen', 'quickedit'],
  },
];

export default function Sidebar({ items, isOpen, setIsOpen }: SidebarProps): React.ReactElement {
  const location = useLocation();
  const { points } = useUserData();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, setIsOpen]);

  const itemMap = new Map(items.map(item => [item.key, item]));

  const handleLogout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error.message);
    localStorage.removeItem('lastAchievementShown');
  };

  return (
    <>
      <button
        type="button"
        className={`melforia-sidebar-overlay ${isOpen ? 'is-visible' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-label="Menü schließen"
        tabIndex={isOpen ? 0 : -1}
      />

      <aside
        id="melforia-sidebar"
        className={`sidebar melforia-sidebar ${isOpen ? 'open' : ''}`}
        aria-label="Melforia Seitenmenü"
      >
        <div className="melforia-sidebar__top">
          <Link to="/" className="sidebar-brand" aria-label={`${APP_NAME} Startseite`}>
            <span className="sidebar-brand__icon" aria-hidden="true">
              <Sparkles size={19} />
            </span>
            <span className="sidebar-brand__copy">
              <span>{APP_NAME}</span>
              <small>{APP_VERSION_LABEL}</small>
            </span>
          </Link>
          <button
            type="button"
            className="melforia-sidebar__close"
            onClick={() => setIsOpen(false)}
            aria-label="Menü schließen"
          >
            <X size={21} />
          </button>
        </div>

        <div className="melforia-sidebar__points" aria-label={`${points} Punkte`}>
          <span aria-hidden="true">✦</span>
          <span>{t('sidebar.points', { points })}</span>
        </div>

        <nav className="sidebar-content melforia-sidebar__nav" aria-label="Hauptnavigation">
          {navigationGroups.map(group => (
            <div className="melforia-sidebar__group" key={group.label}>
              <p>{group.label}</p>
              {group.keys.map(key => {
                const item = itemMap.get(key);
                if (!item) return null;
                const path = getNavigationPath(item.key);
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={item.key}
                    to={path}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="icon">{item.icon as React.ReactNode}</span>
                    <span className="label">{item.label === 'Nova' ? 'Nova' : t(item.label)}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="melforia-sidebar__footer">
          <div className="sidebar-language-toggle" aria-label="Sprache auswählen">
            {[
              { code: 'de', label: 'DE' },
              { code: 'en', label: 'EN' },
              { code: 'tr', label: 'TR' },
            ].map(({ code, label }) => (
              <button
                type="button"
                key={code}
                aria-label={t(`sidebar.languages.${code}`, label)}
                aria-pressed={i18n.language === code}
                onClick={() => void i18n.changeLanguage(code)}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="sidebar-item logout-button"
            onClick={() => void handleLogout()}
          >
            <span className="icon">
              <LogOut size={18} />
            </span>
            <span className="label">{t('sidebar.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
