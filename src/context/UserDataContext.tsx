import React, { createContext, ReactNode, useState } from 'react'
import * as storageService from '../services/storageService'
import type { Achievement, CalendarNotes, Goal, Symptoms, WordFile } from '../types'
import pointSound from '../assets/sounds/point.wav'
import { achievementList } from '../data/achievementList'

export interface UserDataContextType {
  username: string
  setUsername: (username: string) => void
  goals: Goal[]
  setGoals: (goals: Goal[]) => void
  achievements: Achievement[]
  setAchievements: (achievements: Achievement[]) => void
  calendarNotes: CalendarNotes
  setCalendarNotes: (notes: CalendarNotes) => void
  symptoms: Symptoms
  setSymptoms: (symptoms: Symptoms) => void
  favorites: string[]
  setFavorites: (favorites: string[]) => void
  wordFiles: WordFile[]
  setWordFiles: (files: WordFile[]) => void
  hasGoalsReminder: boolean
  points: number
  addPoints: (amount: number) => void
  level: number
levelProgress: number
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined)

interface UserDataProviderProps {
  children: ReactNode
}

export function UserDataProvider({ children }: UserDataProviderProps): React.ReactElement {
  const [username, setUsernameState] = useState<string>(
    storageService.get<string>('username') ?? ''
  )
  const [goals, setGoalsState] = useState<Goal[]>(
    storageService.get<Goal[]>('goals') ?? []
  )
  const [achievements, setAchievementsState] = useState<Achievement[]>(
    storageService.get<Achievement[]>('achievements') ?? []
  )
  const [calendarNotes, setCalendarNotesState] = useState<CalendarNotes>(
    storageService.get<CalendarNotes>('calendarNotes') ?? {}
  )
  const [symptoms, setSymptomsState] = useState<Symptoms>(
    storageService.get<Symptoms>('symptoms') ?? {}
  )
  const [favorites, setFavoritesState] = useState<string[]>(
    storageService.get<string[]>('favorites') ?? ['home', 'skills', 'notfall', 'guide']
  )
  const [wordFiles, setWordFilesState] = useState<WordFile[]>(
    storageService.get<WordFile[]>('wordFiles') ?? []
  )
  const [points, setPoints] = useState<number>(
    storageService.get<number>('points') ?? 0
  )
const getLevel = (points: number): { level: number; progress: number } => {
  if (points < 10) return { level: 1, progress: (points / 10) * 100 }
  if (points < 25) return { level: 2, progress: ((points - 10) / 15) * 100 }
  if (points < 50) return { level: 3, progress: ((points - 25) / 25) * 100 }
  if (points < 100) return { level: 4, progress: ((points - 50) / 50) * 100 }
  return { level: 5, progress: 100 }
}

const { level, progress } = getLevel(points)
  const setUsername = (value: string) => {
    setUsernameState(value)
    storageService.set('username', value)
  }

  const setGoals = (value: Goal[]) => {
    setGoalsState(value)
    storageService.set('goals', value)
  }

  const setAchievements = (value: Achievement[]) => {
    setAchievementsState(value)
    storageService.set('achievements', value)
  }

  const setCalendarNotes = (value: CalendarNotes) => {
    setCalendarNotesState(value)
    storageService.set('calendarNotes', value)
  }

  const setSymptoms = (value: Symptoms) => {
    setSymptomsState(value)
    storageService.set('symptoms', value)
  }

  const setFavorites = (value: string[]) => {
    setFavoritesState(value)
    storageService.set('favorites', value)
  }

  const setWordFiles = (value: WordFile[]) => {
    setWordFilesState(value)
    storageService.set('wordFiles', value)
  }

  const addPoints = (amount: number) => {
  const newPoints = points + amount
  const audio = new Audio(pointSound)
  audio.play().catch(() => {})
  setPoints(newPoints)
  storageService.set('points', newPoints)

  // Achievement-Logik

const unlocked: Achievement[] = []

achievementList.forEach(a => {
  const alreadyUnlocked = achievements.some(existing => existing.id === a.id)
  const match = a.id.startsWith('points-')
  const targetPoints = parseInt(a.id.split('-')[1])
  if (match && newPoints >= targetPoints && !alreadyUnlocked) {
    unlocked.push({
      ...a,
      date: new Date().toISOString(),
    })
  }
})

  if (unlocked.length > 0) {
    const newAchievements = [...achievements, ...unlocked]
    setAchievements(newAchievements)
    storageService.set('achievements', newAchievements)
  }
}


  const value: UserDataContextType = {
    
    username,
    setUsername,
    goals,
    setGoals,
    achievements,
    setAchievements,
    calendarNotes,
    setCalendarNotes,
    symptoms,
    setSymptoms,
    favorites,
    setFavorites,
    wordFiles,
    setWordFiles,
    hasGoalsReminder: goals.length > 0 && !goals.some(g => g.completed),
    points,
    addPoints,
    level,
  levelProgress: progress,
  }

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
}

export function useUserData(): UserDataContextType {
  const context = React.useContext(UserDataContext)
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider')
  }
  return context
}
