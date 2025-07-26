// SidebarItem.tsx – modern, klickbar
import { JSX } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';

interface SidebarItemProps {
  to: string;
  label: string;
  icon: JSX.Element;
  active?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  label,
  icon,
  active = false,
  onClick,
}: SidebarItemProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition 
        ${active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}