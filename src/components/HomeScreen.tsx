import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Compass } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';
import * as storageService from '../services/storageService';
import type { SidebarItem } from '../types/index';
import './HomeScreen.css';
import SortableQuickItem from './SortableQuickItem';
import { Link } from "react-router-dom";

interface HomeScreenProps {
  username: string;
  setUsername: (username: string) => void;
  quickItems: string[];
  allItems: SidebarItem[];
  setFavorites: (items: string[]) => void;
}

export default function HomeScreen({
  username,
  setUsername,
  quickItems,
  allItems,
  setFavorites,
}: HomeScreenProps): React.ReactElement {
  const navigate = useNavigate();
  const sensors = useSensors(useSensor(PointerSensor));
  const { addPoints } = useUserData();
  const [animatingKey, setAnimatingKey] = useState<string | null>(null);
  const { level, levelProgress } = useUserData();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = quickItems.indexOf(active.id as string);
      const newIndex = quickItems.indexOf(over.id as string);
      const newOrder = arrayMove(quickItems, oldIndex, newIndex);

      setFavorites(newOrder);
      storageService.set('favorites', newOrder);
    }
  };

  const getPath = (key: string): string => (key === 'home' ? '/' : `/${key}`);

  const handleQuickClick = (key: string) => {
    setAnimatingKey(key);
    addPoints(1);
    setTimeout(() => setAnimatingKey(null), 300);
    navigate(getPath(key));
  };

  return (
    <div className="card">
      <div className="welcome-section">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          <Compass size={64} color="#5dade2" />
        </div>
        <h1>Willkommen beim Kompass{username ? `, ${username}` : ''}!</h1>
        <p>Deine App für den Alltag nach der Klinik.</p>
        <p>Skills, Pläne, Chatbot & Hilfe bei Krisen – immer für dich da.</p>

        {!username && (
          <div className="form-row" style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Wie soll ich dich nennen?"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                const input = e.currentTarget;
                if (e.key === 'Enter' && input.value.trim()) {
                  setUsername(input.value.trim());
                }
              }}
            />
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                const button = e.currentTarget;
                const input = button.previousElementSibling as HTMLInputElement;
                if (input.value.trim()) {
                  setUsername(input.value.trim());
                }
              }}
            >
              ✓
            </button>
          </div>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
  <Link to="/mood">
    <button
      style={{
        background: "#2f4f4f",
        color: "white",
        padding: "0.6rem 1.2rem",
        fontSize: "1rem",
        borderRadius: "0.75rem",
        border: "none",
        cursor: "pointer",
        transition: "background 0.3s ease",
      }}
    >
      🧭 Stimmung erfassen
    </button>
  </Link>
</div>

      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '14px', marginBottom: '4px' }}>
          Level {level} - {Math.round(levelProgress)}%
        </div>
        <div style={{ background: '#ddd', height: '10px', borderRadius: '5px' }}>
          <div
            style={{
              width: `${levelProgress}%`,
              height: '100%',
              background: '#0b9444',
              borderRadius: '5px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <div className="section">
        <h3>Deine Schnellzugriffe</h3>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={quickItems} strategy={verticalListSortingStrategy}>
            <div className="quick-items-grid">
              {quickItems.map(key => {
                const item = allItems.find(i => i.key === key);
                return (
                  item && (
                    <SortableQuickItem
                      key={item.key}
                      id={item.key}
                      icon={item.icon as React.ReactNode}
                      label={item.label}
                      onClick={() => handleQuickClick(item.key)}
                      className={animatingKey === item.key ? 'bounce' : ''}
                    />
                  )
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
