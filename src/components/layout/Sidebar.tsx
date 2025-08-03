import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Award } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useUserData } from '../../hooks/useUserData';
import { motion } from 'framer-motion';
import type { SidebarItem } from '../../types/index';

interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  favorites?: string[];
}

export default function Sidebar({ items, isOpen, setIsOpen, favorites = [] }: SidebarProps) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 700);
  const location = useLocation();
  const { points } = useUserData();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredItems = items.filter(
    (item) => favorites.includes(item.key) || ['home', 'quickedit', 'nova'].includes(item.key)
  );

  const getPath = (key: string) => (key === 'home' ? '/' : `/${key}`);

  const handleClick = () => {
    if (!isDesktop) setTimeout(() => setIsOpen(false), 300);
  };

  const sidebarClasses = `fixed top-0 left-0 h-full z-40 bg-primary text-white w-64 transform transition-transform duration-300 ease-in-out
    ${isOpen || isDesktop ? 'translate-x-0' : '-translate-x-full'}`;

  return (
    <>
      {!isDesktop && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md shadow-md"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={t('sidebar.openMenu')}
        >
          ☰
        </button>
      )}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen || isDesktop ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className={sidebarClasses}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="p-4 space-y-2 overflow-y-auto">
            <div className="text-center text-sm mb-4">
              {t('sidebar.points', { points })}
            </div>

            {filteredItems.map((item) => (
              <Link
                key={item.key}
                to={getPath(item.key)}
                onClick={handleClick}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition text-sm font-medium
                  ${location.pathname === getPath(item.key) ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{t(item.label)}</span>
              </Link>
            ))}

            <Link
              to="/school"
              onClick={handleClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition text-sm font-medium
                ${location.pathname === '/school' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              <GraduationCap size={18} />
              <span>{t('navigation.schoolSupport')}</span>
            </Link>

            <Link
              to="/achievements"
              onClick={handleClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition text-sm font-medium
                ${location.pathname === '/achievements' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              <Award size={18} />
              <span>{t('navigation.achievements')}</span>
            </Link>
          </div>

          <div className="p-4 flex flex-col items-center gap-3 border-t border-white/10">
            <div className="flex gap-4">
              {[
                { code: 'de', emoji: '🇩🇪' },
                { code: 'en', emoji: '🇬🇧' },
                { code: 'tr', emoji: '🇹🇷' },
              ].map(({ code, emoji }) => (
                <button
                  key={code}
                  onClick={() => i18n.changeLanguage(code)}
                  aria-label={t(`sidebar.languages.${code}`, code.toUpperCase())}
                  className={`text-2xl transition-opacity ${i18n.language === code ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <button
              onClick={() => void supabase.auth.signOut()}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white hover:bg-white/5 px-4 py-2 rounded-md"
            >
              <span>🚪</span>
              <span>{t('sidebar.logout')}</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
