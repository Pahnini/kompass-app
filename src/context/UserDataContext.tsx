import React, { ReactNode, useState } from 'react';
import pointSound from '../assets/sounds/point.wav';
import { skillsList as defaultSkills } from '../data/skills';
import * as storageService from '../services/storageService';
import type { Achievement, CalendarNotes, Goal, Skill, Symptoms, WordFile } from '../types';

export const UserDataContext = React.createContext<UserDataContextType | undefined>(undefined);

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
  wordFiles: WordFile[];
  setWordFiles: (files: WordFile[]) => void;
  skillsList: Skill[];
  setSkillsList: (skills: Skill[]) => void;
  hasGoalsReminder: boolean;
  points: number;
  addPoints: (amount: number) => void;
}

interface UserDataProviderProps {
  children: ReactNode;
}

export function UserDataProvider({ children }: UserDataProviderProps): React.ReactElement {
  // Use lazy initialization for all state to avoid unnecessary localStorage access on re-renders
  const [username, setUsernameState] = useState<string>(
    () => storageService.get<string>('username') ?? ''
  );
  const [goals, setGoalsState] = useState<Goal[]>(() => storageService.get<Goal[]>('goals') ?? []);
  const [achievements, setAchievementsState] = useState<Achievement[]>(
    () => storageService.get<Achievement[]>('achievements') ?? []
  );
  const [calendarNotes, setCalendarNotesState] = useState<CalendarNotes>(
    () => storageService.get<CalendarNotes>('calendarNotes') ?? {}
  );
  const [symptoms, setSymptomsState] = useState<Symptoms>(
    () => storageService.get<Symptoms>('symptoms') ?? {}
  );
  const [favorites, setFavoritesState] = useState<string[]>(
    () => storageService.get<string[]>('favorites') ?? ['home', 'skills', 'notfall', 'guide']
  );
  const [wordFiles, setWordFilesState] = useState<WordFile[]>(
    () => storageService.get<WordFile[]>('wordFiles') ?? []
  );
  const [skillsList, setSkillsListState] = useState<Skill[]>(
    () => storageService.get<Skill[]>('skillsList') ?? defaultSkills
  );
  const [points, setPoints] = useState<number>(() => storageService.get<number>('points') ?? 0);

  const setUsername = React.useCallback((value: string) => {
    setUsernameState(value);
    storageService.set('username', value);
  }, []);

  const setGoals = React.useCallback((value: Goal[]) => {
    setGoalsState(value);
    storageService.set('goals', value);
  }, []);

  const setAchievements = React.useCallback((value: Achievement[]) => {
    setAchievementsState(value);
    storageService.set('achievements', value);
  }, []);

  const setCalendarNotes = React.useCallback((value: CalendarNotes) => {
    setCalendarNotesState(value);
    storageService.set('calendarNotes', value);
  }, []);

  const setSymptoms = React.useCallback((value: Symptoms) => {
    setSymptomsState(value);
    storageService.set('symptoms', value);
  }, []);

  const setFavorites = React.useCallback((value: string[]) => {
    setFavoritesState(value);
    storageService.set('favorites', value);
  }, []);

  const setWordFiles = React.useCallback((value: WordFile[]) => {
    setWordFilesState(value);
    storageService.set('wordFiles', value);
  }, []);

  const setSkillsList = React.useCallback((value: Skill[]) => {
    setSkillsListState(value);
    storageService.set('skillsList', value);
  }, []);

  const addPoints = React.useCallback(
    (amount: number) => {
      setPoints(currentPoints => {
        const newPoints = currentPoints + amount;
        const audio = new Audio(pointSound);
        audio.play().catch(() => {}); // Falls Browser blockiert, kein Fehler
        storageService.set('points', newPoints);
        return newPoints;
      });
    },
    [] // No dependencies needed with functional updates
  );

  // Compute derived state separately to keep the dependency array smaller
  const hasGoalsReminder = React.useMemo(
    () => goals.length > 0 && !goals.some(g => g.completed),
    [goals]
  );

  // Only include state values in the dependency array, not the setter functions
  // since the setter functions are stable references (from useCallback)
  const value = React.useMemo<UserDataContextType>(
    () => ({
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
      skillsList,
      setSkillsList,
      hasGoalsReminder,
      points,
      addPoints,
    }),
    [
      username,
      goals,
      achievements,
      calendarNotes,
      symptoms,
      favorites,
      wordFiles,
      skillsList,
      hasGoalsReminder,
      points,
      // Setter functions are stable and don't need to be in the dependency array
      setUsername,
      setGoals,
      setAchievements,
      setCalendarNotes,
      setSymptoms,
      setFavorites,
      setWordFiles,
      setSkillsList,
      addPoints,
    ]
  );

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}
