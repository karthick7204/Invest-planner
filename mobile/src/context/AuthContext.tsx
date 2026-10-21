import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'expo-router';
import {
  apiCall,
  setAuthToken,
  saveUserData,
  getUserData,
  logout as apiLogout,
  addUnauthorizedListener,
} from '../services/api';

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

  // Initialize auth state from AsyncStorage on app launch
  useEffect(() => {
    let isMounted = true;

    const loadStoredAuth = async () => {
      try {
        const stored = await getUserData();
        if (stored.token && isMounted) {
          setTokenState(stored.token);
          setUser({
            userId: stored.userId,
            username: stored.username || 'User',
            email: stored.email,
          });
        }
      } catch (e) {
        console.warn('Failed to load authentication state from storage:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStoredAuth();

    // Listen for 401 unauthorized session expiry
    const unsubscribe = addUnauthorizedListener(() => {
      if (isMounted) {
        setTokenState(null);
        setUser(null);
        router.replace('/login');
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [router]);

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

      const authToken = response.token || response.data?.token;
      if (!authToken) {
        throw new Error(
          response.message || 'Login failed: Server did not return a valid session token.'
        );
      }

      const userData =
        response.userdata || response.data?.userdata || response.data?.saveduser;
      const userId = userData?._id || response.userId || response.data?.userId || null;
      const confirmedName = userData?.username || username.trim();
      const confirmedEmail = userData?.email || email.trim();

      // Persist to secure storage
      await saveUserData({
        token: authToken,
        userId: userId || undefined,
        username: confirmedName,
        email: confirmedEmail,
      });

      setTokenState(authToken);
      setUser({
        userId,
        username: confirmedName,
        email: confirmedEmail,
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

      const authToken = response.token || response.data?.token;
      if (!authToken) {
        throw new Error(
          response.message ||
            'Registration failed: Server did not return a valid session token.'
        );
      }

      const userData =
        response.userdata || response.data?.userdata || response.data?.saveduser;
      const userId = userData?._id || response.userId || response.data?.userId || null;
      const confirmedName = userData?.username || username.trim();
      const confirmedEmail = userData?.email || email.trim();

      // Persist to secure storage
      await saveUserData({
        token: authToken,
        userId: userId || undefined,
        username: confirmedName,
        email: confirmedEmail,
      });

      setTokenState(authToken);
      setUser({
        userId,
        username: confirmedName,
        email: confirmedEmail,
      });

      router.replace('/(tabs)');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      setTokenState(null);
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
