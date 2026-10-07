import type { ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { levelFor } from '../utils/gamification';
import { skillsList as defaultSkills } from '../data/skills';
import { dataService } from '../services/dataService';
import type { Achievement, CalendarNotes, Goal, Skill, Symptoms, WordFile } from '../types/index';
import { supabase } from '../utils/supabase';
import { normalizeUsername } from '../utils/username';

/* eslint-disable react-refresh/only-export-components */
export const UserDataContext = React.createContext<UserDataContextType | undefined>(undefined);

export interface UserDataContextType {
  username: string;
  setUsername: (username: string) => void;
  goals: Goal[];
  setGoals: (goals: Goal[]) => Promise<boolean>;
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  calendarNotes: CalendarNotes;
  setCalendarNotes: (notes: CalendarNotes) => Promise<boolean>;
  symptoms: Symptoms;
  setSymptoms: (symptoms: Symptoms) => void;
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
  wordFiles: WordFile[];
  setWordFiles: (files: WordFile[]) => void;
  skillsList: Skill[];
  setSkillsList: (skills: Skill[]) => void;
  skillsCompleted: Record<string, boolean>;
  setSkillsCompleted: (completed: Record<string, boolean>) => Promise<boolean>;
  hasGoalsReminder: boolean;
  points: number;
  level: number;
  levelProgress: number;
  isLoading: boolean;
  userId: string | null;
}

interface UserDataProviderProps {
  children: ReactNode;
}

// Calculate level and progress based on points
const getLevel = (points: number): { level: number; progress: number } => {
  return levelFor(points);
};

export function UserDataProvider({ children }: UserDataProviderProps): React.ReactElement {
  // State for authenticated user
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state with default values (will be loaded from database when authenticated)
  const [username, setUsernameState] = useState<string>('');
  const [goals, setGoalsState] = useState<Goal[]>([]);
  const [achievements, setAchievementsState] = useState<Achievement[]>([]);
  const [calendarNotes, setCalendarNotesState] = useState<CalendarNotes>({});
  const [symptoms, setSymptomsState] = useState<Symptoms>({});
  const [favorites, setFavoritesState] = useState<string[]>(['home', 'skills', 'notfall', 'guide']);
  const [wordFiles, setWordFilesState] = useState<WordFile[]>([]);
  const [skillsList, setSkillsListState] = useState<Skill[]>(defaultSkills);
  const [skillsCompleted, setSkillsCompletedState] = useState<Record<string, boolean>>({});
  const [points, setPoints] = useState<number>(0);
  const activeUser = useRef<string | null>(null);

  // Load user data when authentication changes
  useEffect(() => {
    let active = true;
    let generation = 0;
    let deferred: number | undefined;
    const loadUserData = async () => {
      if (!active) return;
      const request = ++generation;
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!active || request !== generation) return;

        if (session?.user?.id) {
          activeUser.current = session.user.id;
          setIsLoading(true);
          setUserId(session.user.id);
          // Load all user data from the healthcare-compliant database with safe fallbacks
          const [
            userData_username,
            userData_goals,
            userData_achievements,
            userData_calendarNotes,
            userData_symptoms,
            userData_favorites,
            userData_wordFiles,
            userData_skillsList,
            userData_skillsCompleted,
            userData_points,
          ] = await Promise.all([
            dataService.getDataSafe<unknown>('username', session.user.id, ''),
            dataService.getDataSafe<Goal[]>('goals', session.user.id, []),
            dataService.getDataSafe<Achievement[]>('achievements', session.user.id, []),
            dataService.getDataSafe<CalendarNotes>('calendarNotes', session.user.id, {}),
            dataService.getDataSafe<Symptoms>('symptoms', session.user.id, {}),
            dataService.getDataSafe<string[]>('favorites', session.user.id, [
              'home',
              'skills',
              'notfall',
              'guide',
            ]),
            dataService.getDataSafe<WordFile[]>('wordFiles', session.user.id, []),
            dataService.getDataSafe<Skill[]>('skillsList', session.user.id, defaultSkills),
            dataService.getDataSafe<Record<string, boolean>>(
              'skillsCompleted',
              session.user.id,
              {}
            ),
            dataService.getDataSafe<number>('points', session.user.id, 0),
          ]);
          if (!active || request !== generation || activeUser.current !== session.user.id) return;

          // Update state with safely loaded data
          setUsernameState(normalizeUsername(userData_username));
          setGoalsState(userData_goals);
          setAchievementsState(userData_achievements);
          setCalendarNotesState(userData_calendarNotes);
          setSymptomsState(userData_symptoms);
          setFavoritesState(userData_favorites);
          setWordFilesState(userData_wordFiles);
          // Merge skillsList with any skills from skillsCompleted that aren't in the list
          const allSkills = [...userData_skillsList];
          const completedSkillKeys = Object.keys(userData_skillsCompleted);

          // Add any completed skills that aren't already in the skillsList
          completedSkillKeys.forEach(skill => {
            if (!allSkills.includes(skill)) {
              allSkills.push(skill);
            }
          });

          setSkillsListState(allSkills);
          setSkillsCompletedState(userData_skillsCompleted);
          setPoints(userData_points);
        } else {
          activeUser.current = null;
          // No user logged in, reset to defaults
          setUserId(null);
          setUsernameState('');
          setGoalsState([]);
          setAchievementsState([]);
          setCalendarNotesState({});
          setSymptomsState({});
          setFavoritesState(['home', 'skills', 'notfall', 'guide']);
          setWordFilesState([]);
          setSkillsListState(defaultSkills);
          setSkillsCompletedState({});
          setPoints(0);
        }
      } catch (error) {
        console.error('❌ Failed to load user data:', error);
      } finally {
        if (active && request === generation) setIsLoading(false);
      }
    };

    loadUserData();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      activeUser.current = session?.user.id ?? null;
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        generation++;
        setIsLoading(true);
        window.clearTimeout(deferred);
        deferred = window.setTimeout(() => void loadUserData(), 0);
      } else if (event === 'SIGNED_OUT') {
        generation++;
        window.clearTimeout(deferred);
        setUserId(null);
        setIsLoading(false);
        // Reset to defaults on logout
        setUsernameState('');
        setGoalsState([]);
        setAchievementsState([]);
        setCalendarNotesState({});
        setSymptomsState({});
        setFavoritesState(['home', 'skills', 'notfall', 'guide']);
        setWordFilesState([]);
        setSkillsListState(defaultSkills);
        setSkillsCompletedState({});
        setPoints(0);
      }
    });

    return () => {
      active = false;
      generation++;
      window.clearTimeout(deferred);
      subscription.unsubscribe();
    };
  }, []);

  // Calculate level and progress
  const { level, progress } = getLevel(points);

  const setUsername = React.useCallback(
    async (value: string) => {
      const normalizedValue = normalizeUsername(value);
      setUsernameState(normalizedValue);
      if (userId && normalizedValue) {
        try {
          await dataService.setData('username', normalizedValue, userId);
        } catch (error) {
          console.error('❌ Failed to save username:', error);
        }
      }
    },
    [userId]
  );

  const setGoals = React.useCallback(
    async (value: Goal[]) => {
      if (!userId) return false;
      try {
        await dataService.setData('goals', value, userId);
        if (activeUser.current !== userId) return false;
        setGoalsState(value);
        return true;
      } catch (error) {
        console.error('❌ Failed to save goals:', error);
        return false;
      }
    },
    [userId]
  );

  const setAchievements = React.useCallback(
    async (value: Achievement[]) => {
      setAchievementsState(value);
      if (userId) {
        try {
          await dataService.setData('achievements', value, userId);
        } catch (error) {
          console.error('❌ Failed to save achievements:', error);
        }
      }
    },
    [userId]
  );

  const setCalendarNotes = React.useCallback(
    async (value: CalendarNotes) => {
      if (!userId) return false;
      try {
        await dataService.setData('calendarNotes', value, userId);
        if (activeUser.current !== userId) return false;
        setCalendarNotesState(value);
        return true;
      } catch (error) {
        console.error('❌ Failed to save calendar notes:', error);
        return false;
      }
    },
    [userId]
  );

  const setSymptoms = React.useCallback(
    async (value: Symptoms) => {
      setSymptomsState(value);
      if (userId) {
        try {
          await dataService.setData('symptoms', value, userId);
        } catch (error) {
          console.error('❌ Failed to save symptoms:', error);
        }
      }
    },
    [userId]
  );

  const setFavorites = React.useCallback(
    async (value: string[]) => {
      setFavoritesState(value);
      if (userId) {
        try {
          await dataService.setData('favorites', value, userId);
        } catch (error) {
          console.error('❌ Failed to save favorites:', error);
        }
      }
    },
    [userId]
  );

  const setWordFiles = React.useCallback(
    async (value: WordFile[]) => {
      setWordFilesState(value);
      if (userId) {
        try {
          await dataService.setData('wordFiles', value, userId);
        } catch (error) {
          console.error('❌ Failed to save word files:', error);
        }
      }
    },
    [userId]
  );

  const setSkillsList = React.useCallback(
    async (value: Skill[]) => {
      setSkillsListState(value);
      if (userId) {
        try {
          await dataService.setData('skillsList', value, userId);
        } catch (error) {
          console.error('❌ Failed to save skills list:', error);
        }
      }
    },
    [userId]
  );

  const setSkillsCompleted = React.useCallback(
    async (value: Record<string, boolean>) => {
      if (!userId) return false;
      try {
        await dataService.setData('skillsCompleted', value, userId);
        if (activeUser.current !== userId) return false;
        setSkillsCompletedState(value);
        return true;
      } catch (error) {
        console.error('❌ Failed to save skills completion status:', error);
        return false;
      }
    },
    [userId]
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
      skillsCompleted,
      setSkillsCompleted,
      hasGoalsReminder,
      points,
      level,
      levelProgress: progress,
      isLoading,
      userId,
    }),
    [
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
      skillsCompleted,
      setSkillsCompleted,
      hasGoalsReminder,
      points,
      level,
      progress,
      isLoading,
      userId,
    ]
  );

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export function useUserData(): UserDataContextType {
  const context = React.useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
