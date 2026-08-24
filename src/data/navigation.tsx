// Navigation items for the sidebar
import {
  Accessibility,
  AlertCircle,
  Award,
  BookHeart,
  Bot,
  ClipboardCheck,
  GraduationCap,
  Home,
  Info,
  Mic2,
  Paintbrush,
  Settings,
  Sparkles,
  Waves,
} from 'lucide-react';

import type { SidebarItem } from '../types/index';

export const sidebarItems: SidebarItem[] = [
  { key: 'home', label: 'navigation.home', icon: <Home size={18} /> },
  {
    key: 'skills',
    label: 'navigation.skills',
    icon: <Sparkles size={18} />,
  },
  { key: 'mood', label: 'navigation.mood', icon: <Waves size={18} /> },
  { key: 'gedanken', label: 'navigation.thoughts', icon: <Mic2 size={18} /> },
  { key: 'deinweg', label: 'navigation.deinweg', icon: <BookHeart size={18} /> },
  {
    key: 'nova',
    label: 'Nova',
    icon: <Bot size={18} />,
  },
  { key: 'designs', label: 'navigation.designs', icon: <Paintbrush size={18} /> },
  { key: 'achievements', label: 'navigation.achievements', icon: <Award size={18} /> },
  { key: 'school', label: 'navigation.schoolSupport', icon: <GraduationCap size={18} /> },
  { key: 'notfall', label: 'navigation.notfall', icon: <AlertCircle size={18} /> },
  { key: 'guide', label: 'navigation.guide', icon: <Info size={18} /> },
  {
    key: 'barrierefreiheit',
    label: 'navigation.accessibility',
    icon: <Accessibility size={18} />,
  },
  { key: 'testen', label: 'navigation.testing', icon: <ClipboardCheck size={18} /> },
  {
    key: 'quickedit',
    label: 'navigation.quickedit',
    icon: <Settings size={18} />,
  },
];

export const primaryNavigationKeys = [
  'home',
  'skills',
  'mood',
  'gedanken',
  'deinweg',
  'nova',
] as const;

export function getNavigationPath(key: string): string {
  return key === 'home' ? '/' : `/${key}`;
}

export default sidebarItems;
