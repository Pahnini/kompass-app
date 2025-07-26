import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  HeartPulse,
  Wrench,
  Eye,
  AlertTriangle,
  BookOpen,
  Award,
  GraduationCap,
  Paintbrush,
  LogOut,
} from 'lucide-react';
import Flag from 'react-world-flags';
import { useTranslation } from 'react-i18next';
import SidebarItem from './SidebarItem';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Sidebar(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const supabase = useSupabaseClient();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#1f2f2f] text-white p-4 flex flex-col justify-between z-50">
      <div className="space-y-2">
        <SidebarItem
          label="Home"
          icon={<Home size={18} />}
          onClick={() => handleClick('/')}
          active={location.pathname === '/'} to={''} />
        <SidebarItem
          label="Mein Kompass"
          icon={<HeartPulse size={18} />}
          onClick={() => handleClick('/deinweg')}
          active={location.pathname === '/deinweg'} to={''} />
        <SidebarItem
          label="Skills"
          icon={<Wrench size={18} />}
          onClick={() => handleClick('/skills')}
          active={location.pathname === '/skills'} to={''} />
        <SidebarItem
          label="Achtsamkeit"
          icon={<Eye size={18} />}
          onClick={() => handleClick('/achtsamkeit')}
          active={location.pathname === '/achtsamkeit'} to={''} />
        <SidebarItem
          label="Notfall"
          icon={<AlertTriangle size={18} />}
          onClick={() => handleClick('/notfall')}
          active={location.pathname === '/notfall'} to={''} />
        <SidebarItem
          label="Ratgeber"
          icon={<BookOpen size={18} />}
          onClick={() => handleClick('/guide')}
          active={location.pathname === '/guide'} to={''} />
        <SidebarItem
          label="Quests & Badges"
          icon={<Award size={18} />}
          onClick={() => handleClick('/achievements')}
          active={location.pathname === '/achievements'} to={''} />
        <SidebarItem
          label="Klinikschule"
          icon={<GraduationCap size={18} />}
          onClick={() => handleClick('/school')}
          active={location.pathname === '/school'} to={''} />
        <SidebarItem
          label="Design ändern"
          icon={<Paintbrush size={18} />}
          onClick={() => handleClick('/designs')}
          active={location.pathname === '/designs'} to={''} />
      </div>

      <div className="mt-6 space-y-1">
        <SidebarItem
          label="Deutsch"
          icon={<Flag code="DE" className="w-5 h-5 rounded-sm" />}
          onClick={() => i18n.changeLanguage('de')}
          active={i18n.language === 'de'} to={''} />
        <SidebarItem
          label="English"
          icon={<Flag code="GB" className="w-5 h-5 rounded-sm" />}
          onClick={() => i18n.changeLanguage('en')}
          active={i18n.language === 'en'} to={''} />
        <SidebarItem
          label="Türkçe"
          icon={<Flag code="TR" className="w-5 h-5 rounded-sm" />}
          onClick={() => i18n.changeLanguage('tr')}
          active={i18n.language === 'tr'} to={''} />
        <SidebarItem
          label="Abmelden"
          icon={<LogOut size={18} />}
          onClick={handleLogout}
          active={false} to={''} />
      </div>
    </aside>
  );
}
