import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3002';
const TOKEN_STORAGE_KEY = 'investplanner_auth_token';
const USER_ID_STORAGE_KEY = 'investplanner_user_id';
const USERNAME_STORAGE_KEY = 'investplanner_username';

let cachedToken: string | null = null;

export const setAuthToken = async (token: string | null) => {
  cachedToken = token;
  if (token) {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  if (cachedToken) return cachedToken;
  try {
    cachedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to read auth token from storage:', e);
  }
  return cachedToken;
};

export const saveUserData = async (data: {
  token?: string;
  userId?: string;
  username?: string;
}) => {
  if (data.token) {
    await setAuthToken(data.token);
  }
  if (data.userId) {
    await AsyncStorage.setItem(USER_ID_STORAGE_KEY, data.userId);
  }
  if (data.username) {
    await AsyncStorage.setItem(USERNAME_STORAGE_KEY, data.username);
  }
};

export const getUserData = async () => {
  const [token, userId, username] = await Promise.all([
    getAuthToken(),
    AsyncStorage.getItem(USER_ID_STORAGE_KEY),
    AsyncStorage.getItem(USERNAME_STORAGE_KEY),
  ]);
  return { token, userId, username };
};

export const logout = async () => {
  cachedToken = null;
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_STORAGE_KEY),
    AsyncStorage.removeItem(USER_ID_STORAGE_KEY),
    AsyncStorage.removeItem(USERNAME_STORAGE_KEY),
  ]);
};

export const apiCall = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = await getAuthToken();
  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      data?.error ||
      `API error: ${response.status} ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data as T;
};

export { API_BASE_URL };
