import { useContext } from "react";
import ThemeContext, { ThemeContextType } from "../context/ThemeContext";

/**
 * Custom hook to use the theme context
 * @returns Theme context value
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default useTheme;
