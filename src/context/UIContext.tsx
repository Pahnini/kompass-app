import React, { createContext, ReactNode, useEffect, useState } from 'react';
import * as storageService from '../services/storageService';

// Define the context type
export interface UIContextType {
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  showDS: boolean;
  setShowDS: (show: boolean) => void;
  onboarding: boolean;
  setOnboarding: (show: boolean) => void;
  toast: string;
  showToast: (msg: string) => void;
}

// Create the context with a default undefined value
const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
  children: ReactNode;
}

/**
 * UI state provider component
 * Manages UI-related state like modals, sidebar, etc.
 */
export function UIProvider({ children }: UIProviderProps): React.ReactElement {
  // UI state - WelcomeScreen should only show on first visit to root path
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showDS, setShowDS] = useState<boolean>(() => !storageService.getDsAccepted());
  const [onboarding, setOnboarding] = useState<boolean>(
    () => !storageService.getOnboardingCompleted()
  );
  const [toast, setToast] = useState<string>('');

  // Show toast message
  function showToast(msg: string): void {
    setToast(msg);
    setTimeout(() => setToast(''), 1200);
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
      alert('Tipp: Über ☰ oben rechts erreichst du das Menü.');
      storageService.setSidebarHintShown();
    }
  }, []);

  // Context value
  const value: UIContextType = {
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
