import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import React from 'react';

interface SortableQuickItemProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

export default function SortableQuickItem({
  id,
  icon,
  label,
  onClick,
  className = '',
}: SortableQuickItemProps): React.ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-2 p-4 rounded-2xl bg-white/5 shadow-inner border border-white/10 hover:bg-white/10 transition-all duration-200 ${className}`}
    >
      {/* Inhalt klickbar */}
      <div
        className="flex items-center gap-3 text-left text-white text-sm cursor-pointer flex-grow"
        onClick={onClick}
      >
        <div>{icon}</div>
        <span className="whitespace-nowrap font-medium">{label}</span>
      </div>

      {/* Drag Handle */}
      <div
        className="text-white opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </div>
    </div>
  );
}
