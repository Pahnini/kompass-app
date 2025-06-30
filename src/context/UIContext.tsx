import React, { createContext, ReactNode, useEffect, useState } from 'react'
import * as storageService from '../services/storageService'

export interface UIContextType {
  showWelcome: boolean
  setShowWelcome: (show: boolean) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  showDS: boolean
  setShowDS: (show: boolean) => void
  onboarding: boolean
  setOnboarding: (show: boolean) => void
  toast: string
  showToast: (msg: string) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

interface UIProviderProps {
  children: ReactNode
}

export function UIProvider({ children }: UIProviderProps): React.ReactElement {
  const [showWelcome, setShowWelcome] = useState<boolean>(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  const [showDS, setShowDS] = useState<boolean>(() => {
    const accepted = storageService.get<boolean>('dsAccepted')
    return accepted === null ? true : !accepted
  })

  const [onboarding, setOnboarding] = useState<boolean>(() => {
    const completed = storageService.get<boolean>('onboardingCompleted')
    return completed === null ? true : !completed
  })

  const [toast, setToast] = useState<string>('')

  function showToast(msg: string): void {
    setToast(msg)
    setTimeout(() => setToast(''), 1200)
  }

  // Speicherung bei Änderung
  useEffect(() => {
    if (!showDS) storageService.set('dsAccepted', true)
  }, [showDS])

  useEffect(() => {
    if (!onboarding) storageService.set('onboardingCompleted', true)
  }, [onboarding])

  useEffect(() => {
    const hintShown = storageService.get<boolean>('sidebarHintShown')
    if (!hintShown) {
      alert('Tipp: Über ☰ oben rechts erreichst du das Menü.')
      storageService.set('sidebarHintShown', true)
    }
  }, [])

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
  }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export default UIContext
