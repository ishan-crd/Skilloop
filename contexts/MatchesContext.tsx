import React, { createContext, ReactNode, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  jobTitle: string;
  company: string;
  website?: string;
  socialProfiles: Record<string, string>;
  profileImages: string[];
  bio?: string;
  skills: string[];
  role: string;
}

interface MatchesContextType {
  matches: User[];
  addMatch: (user: User) => void;
  removeMatch: (userId: string) => void;
  clearMatches: () => void;
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error('useMatches must be used within a MatchesProvider');
  }
  return context;
};

interface MatchesProviderProps {
  children: ReactNode;
}

export const MatchesProvider: React.FC<MatchesProviderProps> = ({ children }) => {
  const [matches, setMatches] = useState<User[]>([]);

  const addMatch = (user: User) => {
    setMatches(prev => {
      // Check if user is already in matches
      if (prev.some(match => match.id === user.id)) {
        return prev;
      }
      return [...prev, user];
    });
  };

  const removeMatch = (userId: string) => {
    setMatches(prev => prev.filter(match => match.id !== userId));
  };

  const clearMatches = () => {
    setMatches([]);
  };

  return (
    <MatchesContext.Provider value={{ matches, addMatch, removeMatch, clearMatches }}>
      {children}
    </MatchesContext.Provider>
  );
};
