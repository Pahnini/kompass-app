// 📁 components/DragAndDrop/SortableQuickList.tsx
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useState } from 'react';
import { useDndSensors } from '../hooks/useDndSensors';
import * as storageService from './../services/storageService';
import SortableQuickItem from './SortableQuickItem';
// Make sure SidebarItem is exported from './../types', or import the correct type name
// For example, if the type is named 'ISidebarItem' in './../types', use:
import type { SidebarItem } from './../types/index';
// Or, if you need to export it, add this to './../types.ts':
// export type SidebarItem = { key: string; icon: React.ReactNode; label: string; ... };

interface SortableQuickListProps {
  items: SidebarItem[];
  quickItemKeys: string[];
  onOrderChange: (newOrder: string[]) => void;
  onItemClick: (key: string) => void;
  animatingKey?: string;
}

export default function SortableQuickList({
  items,
  quickItemKeys,
  onOrderChange,
  onItemClick,
  animatingKey,
}: SortableQuickListProps) {
  const [order, setOrder] = useState<string[]>(quickItemKeys);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(active.id as string);
    const newIndex = order.indexOf(over.id as string);
    const newOrder = arrayMove(order, oldIndex, newIndex);

    setOrder(newOrder);
    storageService.set('favorites', newOrder);
    onOrderChange(newOrder);
  };

  const sortedItems = order
    .filter(key => key !== 'home')
    .map(key => items.find(item => item.key === key))
    .filter(Boolean) as SidebarItem[];

  return (
    <DndContext
      sensors={useDndSensors()}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={order.filter(key => key !== 'home')}
        strategy={verticalListSortingStrategy}
      >
        <div className="quick-items-grid">
          {sortedItems.map(item => (
            <SortableQuickItem
              key={item.key}
              id={item.key}
              icon={item.icon as React.ReactNode}
              label={item.label}
              onClick={() => onItemClick(item.key)}
              className={animatingKey === item.key ? 'bounce' : ''}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
