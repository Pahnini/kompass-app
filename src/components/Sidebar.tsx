import { Award, GraduationCap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Link, useLocation } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';
import type { SidebarItem } from '../types/index';
import { supabase } from '../utils/supabase';

interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  favorites?: string[];
}

export default function Sidebar({
  items,
  isOpen,
  setIsOpen,
  favorites = [],
}: SidebarProps): React.ReactElement {
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > 700);
  const location = useLocation();
  const { points } = useUserData();

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    if (!isDesktop) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredItems = items.filter(
    item => favorites.includes(item.key) || item.key === 'home' || item.key === 'quickedit'
  );

  const toggleSidebar = (): void => setIsOpen(!isOpen);
  const handleClick = (): void => {
    if (!isDesktop) {
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  const getPath = (key: string): string => (key === 'home' ? '/' : `/${key}`);

  const { currentLanguage, setLanguage } = useTranslation();

  return (
    <>
      {!isDesktop && (
        <button
          className="sidebar-toggle-mobile"
          onClick={toggleSidebar}
          aria-label={useTranslation().t('sidebar.openMenu')}
        >
          ☰
        </button>
      )}

      <aside className={`sidebar ${isOpen || isDesktop ? 'open' : ''}`}>
        <div className="sidebar-content">
          {/* Punktestand anzeigen */}
          <div className="sidebar-points">
            {useTranslation()
              .t('sidebar.points', '🌟 {points} Points')
              .replace('{points}', points.toString())}
          </div>

          {filteredItems.map(item => (
            <Link
              key={item.key}
              to={getPath(item.key)}
              className={`sidebar-item ${location.pathname === getPath(item.key) ? 'active' : ''}`}
              onClick={handleClick}
            >
              <span className="icon">{item.icon as React.ReactNode}</span>
              <span className="label">{useTranslation().t(item.label)}</span>
            </Link>
          ))}

          {/* Klinikschule */}
          <Link
            to="/school"
            className={`sidebar-item ${location.pathname === '/school' ? 'active' : ''}`}
            onClick={handleClick}
          >
            <span className="icon">
              <GraduationCap size={18} />
            </span>
            <span className="label">{useTranslation().t('navigation.schoolSupport')}</span>
          </Link>

          {/* Erfolge */}
          <Link
            to="/achievements"
            className={`sidebar-item ${location.pathname === '/achievements' ? 'active' : ''}`}
            onClick={handleClick}
          >
            <span className="icon">
              <Award size={18} />
            </span>
            <span className="label">{useTranslation().t('navigation.achievements')}</span>
          </Link>
        </div>

        <div
          className="sidebar-language-toggle"
          style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '12px 0' }}
        >
          <button
            aria-label={useTranslation().t('sidebar.languages.de')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              opacity: currentLanguage === 'de' ? 1 : 0.5,
              cursor: 'pointer',
            }}
            onClick={() => setLanguage('de')}
          >
            🇩🇪
          </button>
          <button
            aria-label={useTranslation().t('sidebar.languages.en')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              opacity: currentLanguage === 'en' ? 1 : 0.5,
              cursor: 'pointer',
            }}
            onClick={() => setLanguage('en')}
          >
            🇬🇧
          </button>
        </div>

        <button className="sidebar-item logout-button" onClick={handleLogout}>
          <span className="icon">🚪</span>
          <span className="label">{useTranslation().t('sidebar.logout')}</span>
        </button>
      </aside>
    </>
  );
}
