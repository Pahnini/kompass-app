import { useContext } from "react";
import { ThemeContextType, ThemeContext } from "../context/ThemeContext";

/**
 * Custom hook to use the theme context
 * @returns Theme context value
 */
export function useTheme(): ThemeContextType {
  const context = useContext<ThemeContextType | undefined>(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default useTheme;
