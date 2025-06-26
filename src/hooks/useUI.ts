import { useContext } from "react";
import UIContext, { UIContextType } from "../context/UIContext";

/**
 * Custom hook to use the UI context
 * @returns UI context value
 */
export function useUI(): UIContextType {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}

export default useUI;
