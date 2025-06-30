import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Compass } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { SidebarItem } from '../types'
import SortableQuickItem from './SortableQuickItem'
import * as storageService from '../services/storageService'

interface HomeScreenProps {
  username: string
  setUsername: (username: string) => void
  quickItems: string[]
  allItems: SidebarItem[]
  setFavorites: (items: string[]) => void
}

export default function HomeScreen({
  username,
  setUsername,
  quickItems,
  allItems,
  setFavorites,
}: HomeScreenProps): React.ReactElement {
  const navigate = useNavigate()

  const sensors = useSensors(useSensor(PointerSensor))


const handleDragEnd = (event: any) => {
  const { active, over } = event
  if (active.id !== over?.id) {
    const oldIndex = quickItems.indexOf(active.id)
    const newIndex = quickItems.indexOf(over.id)
    const newOrder = arrayMove(quickItems, oldIndex, newIndex)

    setFavorites(newOrder)                    // ✅ Zustand aktualisieren
    storageService.set('favorites', newOrder) // ✅ dauerhaft speichern
  }
}
  const getPath = (key: string): string => (key === 'home' ? '/' : `/${key}`)

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
                const input = e.currentTarget
                if (e.key === 'Enter' && input.value.trim()) {
                  setUsername(input.value.trim())
                }
              }}
            />
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                const button = e.currentTarget
                const input = button.previousElementSibling as HTMLInputElement
                if (input.value.trim()) {
                  setUsername(input.value.trim())
                }
              }}
            >
              ✓
            </button>
          </div>
        )}
      </div>

      <div className="section">
        <h3>Deine Schnellzugriffe</h3>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={quickItems} strategy={verticalListSortingStrategy}>
            <div className="quick-items-grid">
              {quickItems.map(key => {
                const item = allItems.find(i => i.key === key)
                return (
                  item && (
                    <SortableQuickItem
                      key={item.key}
                      id={item.key}
                      icon={item.icon as React.ReactNode}
                      label={item.label}
                      onClick={() => navigate(getPath(item.key))}
                    />
                  )
                )
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
