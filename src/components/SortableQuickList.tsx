// 📁 components/DragAndDrop/SortableQuickList.tsx
import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SortableQuickItem from './SortableQuickItem';
import { sensors } from './dndConfig';
import * as storageService from './../services/storageService';
import type { SidebarItem } from './../types';

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
    .map((key) => items.find((item) => item.key === key))
    .filter(Boolean) as SidebarItem[];

  return (
    <DndContext
      sensors={sensors()}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="quick-items-grid">
          {sortedItems.map((item) => (
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