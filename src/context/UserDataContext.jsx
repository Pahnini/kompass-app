import { createContext, useState } from "react";
import * as storageService from "../services/storageService";

// Create the context
const UserDataContext = createContext();

/**
 * User data provider component
 * Manages user-related state like goals, achievements, etc.
 */
export function UserDataProvider({ children }) {
  // User data state
  const [username, setUsernameState] = useState(() => storageService.getUsername());
  const [goals, setGoalsState] = useState(() => storageService.getGoals());
  const [achievements, setAchievementsState] = useState(() => storageService.getAchievements());
  const [calendarNotes, setCalendarNotesState] = useState(() => storageService.getCalendarNotes());
  const [symptoms, setSymptomsState] = useState(() => storageService.getSymptome());
  const [favorites, setFavoritesState] = useState(() => storageService.getFavorites());
  const [wordFiles, setWordFiles] = useState([]);

  // Wrapper functions to update both state and localStorage
  const setUsername = (newUsername) => {
    setUsernameState(newUsername);
    storageService.setUsername(newUsername);
  };

  const setGoals = (newGoals) => {
    setGoalsState(newGoals);
    storageService.setGoals(newGoals);
  };

  const setAchievements = (newAchievements) => {
    setAchievementsState(newAchievements);
    storageService.setAchievements(newAchievements);
  };

  const setCalendarNotes = (newNotes) => {
    setCalendarNotesState(newNotes);
    storageService.setCalendarNotes(newNotes);
  };

  const setSymptoms = (newSymptoms) => {
    setSymptomsState(newSymptoms);
    storageService.setSymptome(newSymptoms);
  };

  const setFavorites = (newFavorites) => {
    setFavoritesState(newFavorites);
    storageService.setFavorites(newFavorites);
  };

  // Context value
  const value = {
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
    hasGoalsReminder: goals.length > 0 && !goals.some((g) => g.done),
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export default UserDataContext;
