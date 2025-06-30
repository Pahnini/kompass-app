import { useContext } from 'react';
import UserDataContext, { UserDataContextType } from '../context/UserDataContext';

/**
 * Custom hook to use the user data context
 * @returns User data context value
 */
export function useUserData(): UserDataContextType {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}

export default useUserData;
