// import { Achievement, CalendarNotes, Goal, Symptoms, WordFile } from '../types';
const STORAGE_KEY = 'kompassAppData';

export interface AppData {
  username?: string;
  goals?: any[];
  achievements?: any[];
  calendarNotes?: any;
  symptoms?: any;
  favorites?: string[];
  buttonOrder?: string[];
  dsAccepted?: boolean;
  onboardingCompleted?: boolean;
  sidebarHintShown?: boolean;
  // wordFiles etc. folgen später
}

// Daten laden
export const loadData = (): AppData => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : {};
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
    return {};
  }
};

// Daten speichern
export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
  }
};

// Reset-Funktion
export const resetData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Utility zum gezielten Updaten einzelner Felder
const updateField = <K extends keyof AppData>(key: K, value: AppData[K]) => {
  const data = loadData();
  saveData({ ...data, [key]: value });
};

// ===============================
// USER-DATEN (UserDataContext.tsx)
// ===============================

export const getUsername = (): string => loadData().username || '';
export const setUsername = (value: string): void => updateField('username', value);

export const getGoals = (): any[] => loadData().goals || [];
export const setGoals = (goals: any[]): void => updateField('goals', goals);

export const getAchievements = (): any[] => loadData().achievements || [];
export const setAchievements = (val: any[]): void => updateField('achievements', val);

export const getCalendarNotes = (): any => loadData().calendarNotes || {};
export const setCalendarNotes = (val: any): void => updateField('calendarNotes', val);

export const getSymptome = (): any => loadData().symptoms || {};
export const setSymptome = (val: any): void => updateField('symptoms', val);

export const getFavorites = (): string[] => loadData().favorites || [];
export const setFavorites = (val: string[]): void => updateField('favorites', val);

// ===============================
// UI-DATEN (UIContext.tsx)
// ===============================

export const getDsAccepted = (): boolean => !!loadData().dsAccepted;
export const setDsAccepted = (): void => updateField('dsAccepted', true);

export const getOnboardingCompleted = (): boolean => !!loadData().onboardingCompleted;
export const setOnboardingCompleted = (): void => updateField('onboardingCompleted', true);

export const getSidebarHintShown = (): boolean => !!loadData().sidebarHintShown;
export const setSidebarHintShown = (): void => updateField('sidebarHintShown', true);

// ===============================
// Weitere Felder bei Bedarf ergänzen
// ===============================
