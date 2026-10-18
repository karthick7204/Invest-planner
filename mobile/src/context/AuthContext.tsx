import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { apiCall, setAuthToken } from '../services/api';

const TOKEN_KEY = 'investplanner_auth_token';
const USER_ID_KEY = 'investplanner_user_id';
const USERNAME_KEY = 'investplanner_username';

interface UserData {
  userId: string | null;
  username: string | null;
  email?: string | null;
}

interface AuthContextType {
  token: string | null;
  user: UserData | null;
  isLoading: boolean;
  login: (username: string, email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from storage on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [storedToken, storedUserId, storedUsername] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_ID_KEY),
          AsyncStorage.getItem(USERNAME_KEY),
        ]);

        if (storedToken) {
          setTokenState(storedToken);
          setAuthToken(storedToken);
          setUser({
            userId: storedUserId,
            username: storedUsername || 'InvestPlanner User',
          });
        }
      } catch (e) {
        console.warn('Failed to load authentication state from storage:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiCall('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const authToken = response.token || response.data?.token || 'session_token_' + Date.now();
      const userData =
        response.userdata || response.data?.userdata || response.data?.saveduser;
      const userId = userData?._id || response.userId || response.data?.userId || 'user_' + Date.now();
      const confirmedName = username.trim() || userData?.username || 'InvestPlanner User';

      // Persist to storage
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, authToken),
        AsyncStorage.setItem(USER_ID_KEY, userId),
        AsyncStorage.setItem(USERNAME_KEY, confirmedName),
      ]);

      setTokenState(authToken);
      setAuthToken(authToken);
      setUser({
        userId,
        username: confirmedName,
        email: email.trim(),
      });

      router.replace('/(tabs)');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiCall('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const authToken = response.token || response.data?.token || 'session_token_' + Date.now();
      const userData =
        response.userdata || response.data?.userdata || response.data?.saveduser;
      const userId = userData?._id || response.userId || response.data?.userId || 'user_' + Date.now();
      const confirmedName = username.trim() || userData?.username || 'InvestPlanner User';

      // Persist to storage
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, authToken),
        AsyncStorage.setItem(USER_ID_KEY, userId),
        AsyncStorage.setItem(USERNAME_KEY, confirmedName),
      ]);

      setTokenState(authToken);
      setAuthToken(authToken);
      setUser({
        userId,
        username: confirmedName,
        email: email.trim(),
      });

      router.replace('/(tabs)');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_ID_KEY),
        AsyncStorage.removeItem(USERNAME_KEY),
      ]);

      setTokenState(null);
      setAuthToken(null);
      setUser(null);

      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
