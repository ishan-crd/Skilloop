import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase, User } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<{ error: any }>;
  setUserData: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const checkStoredUser = async () => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const storedUser = await AsyncStorage.getItem('currentUser');
        console.log('Stored user data:', storedUser);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('Parsed user data:', userData);
          setUser(userData);
        } else {
          console.log('No stored user found');
        }
      } catch (error) {
        console.log('Error loading stored user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStoredUser();
  }, []);

  // Add a function to manually set user (for after profile creation)
  const setUserData = (userData: User) => {
    setUser(userData);
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      setUser(data);
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    // This is not used in the simplified flow
    return { error: { message: 'Sign in not implemented' } };
  };

  const signUp = async (email: string, password: string) => {
    // This is not used in the simplified flow
    return { error: { message: 'Sign up not implemented' } };
  };

  const signOut = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('currentUser');
      setUser(null);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return { error: { message: 'No user logged in' } };

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return { error };
    }

    setUser(data);
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateUser,
      setUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
