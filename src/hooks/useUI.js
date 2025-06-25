import { useContext } from "react";
import UIContext from "../context/UIContext";

/**
 * Custom hook to use the UI context
 * @returns {Object} UI context value
 */
export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}

export default useUI;
