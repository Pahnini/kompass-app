import React, { createContext, ReactNode, useState } from 'react';
import * as storageService from '../services/storageService';
import type { Achievement, CalendarNotes, Goal, Symptoms, WordFile } from '../types';

// Define the context type
export interface UserDataContextType {
  username: string;
  setUsername: (username: string) => void;
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  calendarNotes: CalendarNotes;
  setCalendarNotes: (notes: CalendarNotes) => void;
  symptoms: Symptoms;
  setSymptoms: (symptoms: Symptoms) => void;
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
  wordFiles: WordFile[]; // TODO: Define proper type when implementing word file functionality
  setWordFiles: (files: WordFile[]) => void;
  hasGoalsReminder: boolean;
}

// Create the context with a default undefined value
const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

interface UserDataProviderProps {
  children: ReactNode;
}

/**
 * User data provider component
 * Manages user-related state like goals, achievements, etc.
 */
export function UserDataProvider({ children }: UserDataProviderProps): React.ReactElement {
  // User data state
  const [username, setUsernameState] = useState<string>(() => storageService.getUsername());
  const [goals, setGoalsState] = useState<Goal[]>(() => storageService.getGoals());
  const [achievements, setAchievementsState] = useState<Achievement[]>(() =>
    storageService.getAchievements()
  );
  const [calendarNotes, setCalendarNotesState] = useState<CalendarNotes>(() =>
    storageService.getCalendarNotes()
  );
  const [symptoms, setSymptomsState] = useState<Symptoms>(() => storageService.getSymptome());
  const [favorites, setFavoritesState] = useState<string[]>(() => storageService.getFavorites());
  const [wordFiles, setWordFiles] = useState<any[]>([]);

  // Wrapper functions to update both state and localStorage
  const setUsername = (newUsername: string): void => {
    setUsernameState(newUsername);
    storageService.setUsername(newUsername);
  };

  const setGoals = (newGoals: Goal[]): void => {
    setGoalsState(newGoals);
    storageService.setGoals(newGoals);
  };

  const setAchievements = (newAchievements: Achievement[]): void => {
    setAchievementsState(newAchievements);
    storageService.setAchievements(newAchievements);
  };

  const setCalendarNotes = (newNotes: CalendarNotes): void => {
    setCalendarNotesState(newNotes);
    storageService.setCalendarNotes(newNotes);
  };

  const setSymptoms = (newSymptoms: Symptoms): void => {
    setSymptomsState(newSymptoms);
    storageService.setSymptome(newSymptoms);
  };

  const setFavorites = (newFavorites: string[]): void => {
    setFavoritesState(newFavorites);
    storageService.setFavorites(newFavorites);
  };

  // Context value
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
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export default UserDataContext;
export function useUserData(): UserDataContextType {
  const context = React.useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
