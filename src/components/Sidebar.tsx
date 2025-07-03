import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Link, useLocation } from 'react-router-dom';
import type { SidebarItem } from '../types';
import { supabase } from '../utils/supabase';
import { useUserData } from '../hooks/useUserData';

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
        <button className="sidebar-toggle-mobile" onClick={toggleSidebar} aria-label="Menü öffnen">
          ☰
        </button>
      )}

      <aside className={`sidebar ${isOpen || isDesktop ? 'open' : ''}`}>
        <div className="sidebar-content">
          {/* Punktestand anzeigen */}
          <div className="sidebar-points">🌟 {points} Punkte</div>

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
        </div>

        <div
          className="sidebar-language-toggle"
          style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '12px 0' }}
        >
          <button
            aria-label="Deutsch"
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
            aria-label="English"
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
          <span className="label">Abmelden</span>
        </button>
      </aside>
    </>
  );
}
