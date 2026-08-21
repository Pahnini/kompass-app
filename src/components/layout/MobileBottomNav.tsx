import { Bot, Home, Menu, Sparkles, Waves } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

const primaryItems = [
  { to: '/', labelKey: 'navigation.home', shortLabel: 'Start', icon: Home },
  { to: '/skills', labelKey: 'navigation.skills', shortLabel: 'Skills', icon: Sparkles },
  { to: '/mood', labelKey: 'navigation.mood', shortLabel: 'Stimmung', icon: Waves },
  { to: '/nova', labelKey: 'Nova', shortLabel: 'Nova', icon: Bot },
];
const primaryPaths = new Set(primaryItems.map(item => item.to));

export default function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps): React.ReactElement {
  const location = useLocation();
  const { t } = useTranslation();
  const moreIsActive = !primaryPaths.has(location.pathname);

  return (
    <nav className="melforia-bottom-nav" aria-label="Schnellnavigation">
      {primaryItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={isActive ? 'is-active' : ''}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.labelKey === 'Nova' ? 'Nova' : t(item.labelKey)}
          >
            <Icon size={22} aria-hidden="true" />
            <span>{item.shortLabel}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={onOpenMenu}
        className={moreIsActive ? 'is-active' : ''}
        aria-label="Alle Bereiche öffnen"
        aria-controls="melforia-sidebar"
      >
        <Menu size={22} aria-hidden="true" />
        <span>Mehr</span>
      </button>
    </nav>
  );
}
