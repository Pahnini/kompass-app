import React, { createContext, ReactNode, useState } from 'react'
import * as storageService from '../services/storageService'
import type { Achievement, CalendarNotes, Goal, Symptoms, WordFile } from '../types'

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
  const [wordFiles, setWordFiles] = useState<WordFile[]>(
    storageService.get<WordFile[]>('wordFiles') ?? []
  )

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
