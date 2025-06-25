/**
 * Storage service for handling localStorage operations
 * Centralizes all storage-related code for better maintainability
 */

// Keys used for localStorage
const STORAGE_KEYS = {
  FAVORITES: "kompass_favorites",
  USERNAME: "kompass_username",
  GOALS: "kompass_goals",
  ACHIEVEMENTS: "kompass_achievements",
  CALENDAR_NOTES: "kompass_calendar_notes",
  SYMPTOME: "kompass_symptome",
  DS_ACCEPTED: "kompass_ds_accepted",
  ONBOARDING: "kompass_onboarding",
  SIDEBAR_HINT: "kompass_sidebar_hint",
};

/**
 * Get an item from localStorage with optional default value
 * @param {string} key - The storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} The stored value or default value
 */
export const getItem = (key, defaultValue = null) => {
  const item = localStorage.getItem(key);
  
  // Return default value if item doesn't exist
  if (item === null) return defaultValue;
  
  // Try to parse as JSON, return as is if parsing fails
  try {
    return JSON.parse(item);
  } catch {
    return item;
  }
};

/**
 * Set an item in localStorage
 * @param {string} key - The storage key
 * @param {any} value - The value to store
 */
export const setItem = (key, value) => {
  // Convert objects and arrays to JSON strings
  const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
  localStorage.setItem(key, valueToStore);
};

/**
 * Remove an item from localStorage
 * @param {string} key - The storage key
 */
export const removeItem = (key) => {
  localStorage.removeItem(key);
};

// Specific getter and setter functions for app data

export const getFavorites = () => getItem(STORAGE_KEYS.FAVORITES, ["skills", "deinweg", "notfall", "guide"]);
export const setFavorites = (favorites) => setItem(STORAGE_KEYS.FAVORITES, favorites);

export const getUsername = () => getItem(STORAGE_KEYS.USERNAME, "");
export const setUsername = (username) => setItem(STORAGE_KEYS.USERNAME, username);

export const getGoals = () => getItem(STORAGE_KEYS.GOALS, []);
export const setGoals = (goals) => setItem(STORAGE_KEYS.GOALS, goals);

export const getAchievements = () => getItem(STORAGE_KEYS.ACHIEVEMENTS, []);
export const setAchievements = (achievements) => setItem(STORAGE_KEYS.ACHIEVEMENTS, achievements);

export const getCalendarNotes = () => getItem(STORAGE_KEYS.CALENDAR_NOTES, {});
export const setCalendarNotes = (notes) => setItem(STORAGE_KEYS.CALENDAR_NOTES, notes);

export const getSymptome = () => getItem(STORAGE_KEYS.SYMPTOME, {});
export const setSymptome = (symptome) => setItem(STORAGE_KEYS.SYMPTOME, symptome);

export const getDsAccepted = () => Boolean(getItem(STORAGE_KEYS.DS_ACCEPTED));
export const setDsAccepted = () => setItem(STORAGE_KEYS.DS_ACCEPTED, "1");

export const getOnboardingCompleted = () => Boolean(getItem(STORAGE_KEYS.ONBOARDING));
export const setOnboardingCompleted = () => setItem(STORAGE_KEYS.ONBOARDING, "1");

export const getSidebarHintShown = () => Boolean(getItem(STORAGE_KEYS.SIDEBAR_HINT));
export const setSidebarHintShown = () => setItem(STORAGE_KEYS.SIDEBAR_HINT, "1");

export default {
  getItem,
  setItem,
  removeItem,
  STORAGE_KEYS,
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
