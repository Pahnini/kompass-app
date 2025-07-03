// Navigation items for the sidebar
import {
  AlertCircle,
  Compass,
  Home,
  Info,
  MessageCircle,
  Paintbrush,
  Settings,
  Sparkles,
} from 'lucide-react';

import type { SidebarItem } from '../types';

export const sidebarItems: SidebarItem[] = [
  { key: 'home', label: 'navigation.home', icon: <Home size={18} /> },
  { key: 'deinweg', label: 'navigation.deinweg', icon: <Compass size={18} /> },
  {
    key: 'skills',
    label: 'navigation.skills',
    icon: <Sparkles size={18} />,
  },
  { key: 'designs', label: 'navigation.designs', icon: <Paintbrush size={18} /> },
  { key: 'notfall', label: 'navigation.notfall', icon: <AlertCircle size={18} /> },
  { key: 'guide', label: 'navigation.guide', icon: <Info size={18} /> },
  { key: 'chat', label: 'navigation.chat', icon: <MessageCircle size={18} /> },
  {
    key: 'quickedit',
    label: 'navigation.quickedit',
    icon: <Settings size={18} />,
  },
];

export default sidebarItems;
