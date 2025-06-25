import { useContext } from "react";
import UserDataContext from "../context/UserDataContext";

/**
 * Custom hook to use the user data context
 * @returns {Object} User data context value
 */
export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}

export default useUserData;
