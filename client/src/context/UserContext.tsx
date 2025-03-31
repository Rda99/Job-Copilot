import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '@/types';
import { INITIAL_USER_PROFILE } from '@/lib/constants';

interface UserContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the user context
const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider component
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For demo, start as authenticated
  
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // In a real app, we would make an API call to authenticate
      // For now, we'll just simulate a successful login
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };
  
  const logout = () => {
    setIsAuthenticated(false);
  };
  
  return (
    <UserContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, useUser };
