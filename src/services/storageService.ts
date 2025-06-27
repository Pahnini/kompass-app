/**import { Goal, Achievement, CalendarNotes, Symptoms } from "../types/userdata";
 * import type {
  Goal,
  Achievement,
  CalendarNotes,
  Symptoms,
  WordFile,
  UserData
} from "../types";

 * Storage service for handling localStorage operations
 * Centralizes all storage-related code for better maintainability
 */

// Keys used for localStorage
export enum StorageKey {
  FAVORITES = "kompass_favorites",
  USERNAME = "kompass_username",
  GOALS = "kompass_goals",
  ACHIEVEMENTS = "kompass_achievements",
  CALENDAR_NOTES = "kompass_calendar_notes",
  SYMPTOME = "kompass_symptome",
  DS_ACCEPTED = "kompass_ds_accepted",
  ONBOARDING = "kompass_onboarding",
  SIDEBAR_HINT = "kompass_sidebar_hint",
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  date?: string;
}

export interface Achievement {
  id: string;
  text: string;
  date: string;
}

export interface CalendarNote {
  text: string;
  date: string;
}

export interface Symptom {
  name: string;
  intensity: number;
  date: string;
}

export type CalendarNotes = Record<string, CalendarNote>;
export type Symptoms = Record<string, Symptom[]>;

/**
 * Get an item from localStorage with optional default value
 * @param key - The storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns The stored value or default value
 */
export const getItem = <T>(
  key: string,
  defaultValue: T = null as unknown as T
): T => {
  const item = localStorage.getItem(key);

  // Return default value if item doesn't exist
  if (item === null) return defaultValue;

  // Try to parse as JSON, return as is if parsing fails
  try {
    return JSON.parse(item) as T;
  } catch {
    return item as unknown as T;
  }
};

/**
 * Set an item in localStorage
 * @param key - The storage key
 * @param value - The value to store
 */
export const setItem = <T>(key: string, value: T): void => {
  // Convert objects and arrays to JSON strings
  const valueToStore =
    typeof value === "object" ? JSON.stringify(value) : value;
  localStorage.setItem(key, valueToStore as string);
};

/**
 * Remove an item from localStorage
 * @param key - The storage key
 */
export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};

// Specific getter and setter functions for app data

export const getFavorites = (): string[] =>
  getItem<string[]>(StorageKey.FAVORITES, [
    "skills",
    "deinweg",
    "notfall",
    "guide",
  ]);

export const setFavorites = (favorites: string[]): void =>
  setItem(StorageKey.FAVORITES, favorites);

export const getUsername = (): string =>
  getItem<string>(StorageKey.USERNAME, "");

export const setUsername = (username: string): void =>
  setItem(StorageKey.USERNAME, username);

export const getGoals = (): Goal[] => getItem<Goal[]>(StorageKey.GOALS, []);

export const setGoals = (goals: Goal[]): void =>
  setItem(StorageKey.GOALS, goals);

export const getAchievements = (): Achievement[] =>
  getItem<Achievement[]>(StorageKey.ACHIEVEMENTS, []);

export const setAchievements = (achievements: Achievement[]): void =>
  setItem(StorageKey.ACHIEVEMENTS, achievements);

export const getCalendarNotes = (): CalendarNotes =>
  getItem<CalendarNotes>(StorageKey.CALENDAR_NOTES, {});

export const setCalendarNotes = (notes: CalendarNotes): void =>
  setItem(StorageKey.CALENDAR_NOTES, notes);

export const getSymptome = (): Symptoms =>
  getItem<Symptoms>(StorageKey.SYMPTOME, {});

export const setSymptome = (symptome: Symptoms): void =>
  setItem(StorageKey.SYMPTOME, symptome);

export const getDsAccepted = (): boolean =>
  Boolean(getItem<string>(StorageKey.DS_ACCEPTED));

export const setDsAccepted = (): void => setItem(StorageKey.DS_ACCEPTED, "1");

export const getOnboardingCompleted = (): boolean =>
  Boolean(getItem<string>(StorageKey.ONBOARDING));

export const setOnboardingCompleted = (): void =>
  setItem(StorageKey.ONBOARDING, "1");

export const getSidebarHintShown = (): boolean =>
  Boolean(getItem<string>(StorageKey.SIDEBAR_HINT));

export const setSidebarHintShown = (): void =>
  setItem(StorageKey.SIDEBAR_HINT, "1");

export default {
  getItem,
  setItem,
  removeItem,
  StorageKey,
  getFavorites,
  setFavorites,
  getUsername,
  setUsername,
  getGoals,
  setGoals,
  getAchievements,
  setAchievements,
  getCalendarNotes,
  setCalendarNotes,
  getSymptome,
  setSymptome,
  getDsAccepted,
  setDsAccepted,
  getOnboardingCompleted,
  setOnboardingCompleted,
  getSidebarHintShown,
  setSidebarHintShown,
};
