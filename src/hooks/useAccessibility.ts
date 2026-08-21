import { useContext } from 'react';
import type { AccessibilityContextType } from '../context/AccessibilityContext';
import { AccessibilityContext } from '../context/AccessibilityContext';

export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
