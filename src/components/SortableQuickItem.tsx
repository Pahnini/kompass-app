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
      className={`quick-item flex items-center justify-between gap-2 px-2 py-1 rounded bg-white shadow ${className}`}
    >
      {/* Linker Bereich – klickbar */}
      <div className="flex items-center gap-2 cursor-pointer flex-grow" onClick={onClick}>
        <div>{icon}</div>
        <span>{label}</span>
      </div>

      {/* Rechter Bereich – nur Drag */}
      <div
        {...attributes}
        {...listeners}
        className="drag-handle p-1 cursor-grab select-none"
        onClick={e => e.stopPropagation()} // verhindert Klick-Fehlverhalten
      >
        <GripVertical className="w-4 h-4 opacity-60" />
      </div>
    </div>
  );
}
