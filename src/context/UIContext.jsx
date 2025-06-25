import { createContext, useEffect, useState } from "react";
import * as storageService from "../services/storageService";

// Create the context
const UIContext = createContext();

/**
 * UI state provider component
 * Manages UI-related state like modals, sidebar, etc.
 */
export function UIProvider({ children }) {
  // UI state - WelcomeScreen should only show on first visit to root path
  const [showWelcome, setShowWelcome] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDS, setShowDS] = useState(() => !storageService.getDsAccepted());
  const [onboarding, setOnboarding] = useState(
    () => !storageService.getOnboardingCompleted()
  );
  const [toast, setToast] = useState("");

  // Show toast message
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1200);
  }

  // Update localStorage when modals are closed
  useEffect(() => {
    if (!showDS) storageService.setDsAccepted();
  }, [showDS]);

  useEffect(() => {
    if (!onboarding) storageService.setOnboardingCompleted();
  }, [onboarding]);

  // Show sidebar hint on first visit
  useEffect(() => {
    if (!storageService.getSidebarHintShown()) {
      alert("Tipp: Über ☰ oben rechts erreichst du das Menü.");
      storageService.setSidebarHintShown();
    }
  }, []);

  // Context value
  const value = {
    showWelcome,
    setShowWelcome,
    isSidebarOpen,
    setIsSidebarOpen,
    showDS,
    setShowDS,
    onboarding,
    setOnboarding,
    toast,
    showToast,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export default UIContext;
