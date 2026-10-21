import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  TOKEN: 'investplanner_auth_token',
  USER_ID: 'investplanner_user_id',
  USERNAME: 'investplanner_username',
  EMAIL: 'investplanner_email',
  CUSTOM_API_URL: 'investplanner_custom_api_url',
};

const DEFAULT_PORT = '3002';
const DEFAULT_FALLBACK_URL = `http://localhost:${DEFAULT_PORT}`;

// In-memory cache for fast synchronous access
let cachedToken: string | null = null;
let cachedBaseUrl: string | null = null;

// Unauthorized callbacks for 401 handling / session expiry
type UnauthorizedCallback = () => void;
const unauthorizedListeners = new Set<UnauthorizedCallback>();

export const addUnauthorizedListener = (callback: UnauthorizedCallback) => {
  unauthorizedListeners.add(callback);
  return () => {
    unauthorizedListeners.delete(callback);
  };
};

const notifyUnauthorized = () => {
  unauthorizedListeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.warn('Error executing unauthorized listener:', e);
    }
  });
};

/**
 * Determine the reachable backend URL for mobile and web environments.
 * - On Web: localhost:3002
 * - On Physical Devices with Expo Go: automatically uses dev machine's LAN IP from hostUri
 * - On Android Emulator: maps localhost to 10.0.2.2
 * - In Production: uses configured EXPO_PUBLIC_API_URL
 */
export const resolveApiBaseUrl = async (): Promise<string> => {
  if (cachedBaseUrl) return cachedBaseUrl;

  // 1. Check for custom user/developer override in storage
  try {
    const customUrl = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_API_URL);
    if (customUrl && customUrl.trim()) {
      cachedBaseUrl = customUrl.trim().replace(/\/+$/, '');
      return cachedBaseUrl;
    }
  } catch (e) {
    // Ignore storage errors
  }

  // 2. Read from Expo public environment variable
  const envUrl = process.env.EXPO_PUBLIC_API_URL || DEFAULT_FALLBACK_URL;
  let targetUrl = envUrl.trim().replace(/\/+$/, '');

  // 3. Mobile networking adjustments for localhost/127.0.0.1
  const isLocalhost =
    targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1');

  if (isLocalhost) {
    if (Platform.OS === 'web') {
      // Browser running on developer machine can reach localhost directly
      cachedBaseUrl = targetUrl;
      return cachedBaseUrl;
    }

    // Attempt to extract LAN IP from Expo dev server hostUri (e.g., "192.168.1.5:8081")
    const expoHostUri =
      Constants.expoConfig?.hostUri ||
      (Constants as any)?.manifest2?.extra?.expoClient?.hostUri ||
      (Constants as any)?.manifest?.debuggerHost;

    const hostIp = expoHostUri ? expoHostUri.split(':')[0] : null;

    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      // Physical mobile device connected to Expo dev server via Wi-Fi/LAN
      const portMatch = targetUrl.match(/:(\d+)$/);
      const port = portMatch ? portMatch[1] : DEFAULT_PORT;
      targetUrl = `http://${hostIp}:${port}`;
    } else if (Platform.OS === 'android') {
      // Default Android emulator loopback alias to host machine
      const portMatch = targetUrl.match(/:(\d+)$/);
      const port = portMatch ? portMatch[1] : DEFAULT_PORT;
      targetUrl = `http://10.0.2.2:${port}`;
    }
  }

  cachedBaseUrl = targetUrl;
  console.log(`📡 Resolved Backend API Base URL: ${cachedBaseUrl}`);
  return cachedBaseUrl;
};

export const setCustomApiUrl = async (url: string | null) => {
  cachedBaseUrl = null;
  if (url && url.trim()) {
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_API_URL, url.trim());
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.CUSTOM_API_URL);
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  if (cachedToken) return cachedToken;
  try {
    cachedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (e) {
    console.warn('Failed to read auth token from storage:', e);
  }
  return cachedToken;
};

export const setAuthToken = async (token: string | null) => {
  cachedToken = token;
  if (token) {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

export const saveUserData = async (data: {
  token?: string;
  userId?: string;
  username?: string;
  email?: string;
}) => {
  if (data.token) {
    await setAuthToken(data.token);
  }
  if (data.userId) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, data.userId);
  }
  if (data.username) {
    await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, data.username);
  }
  if (data.email) {
    await AsyncStorage.setItem(STORAGE_KEYS.EMAIL, data.email);
  }
};

export const getUserData = async () => {
  const [token, userId, username, email] = await Promise.all([
    getAuthToken(),
    AsyncStorage.getItem(STORAGE_KEYS.USER_ID),
    AsyncStorage.getItem(STORAGE_KEYS.USERNAME),
    AsyncStorage.getItem(STORAGE_KEYS.EMAIL),
  ]);
  return { token, userId, username, email };
};

export const logout = async () => {
  cachedToken = null;
  await Promise.all([
    AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
    AsyncStorage.removeItem(STORAGE_KEYS.USER_ID),
    AsyncStorage.removeItem(STORAGE_KEYS.USERNAME),
    AsyncStorage.removeItem(STORAGE_KEYS.EMAIL),
  ]);
  notifyUnauthorized();
};

/**
 * Centralized, reusable API client with automatic token injection,
 * session expiry handling, and timeout safety.
 */
export const apiCall = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const baseUrl = await resolveApiBaseUrl();
  const token = await getAuthToken();
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Setup 25-second network timeout for mobile reliability
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse JSON payload or fallback
    const data = await response.json().catch(() => null);

    // Handle 401 Unauthorized / Token Expiry
    if (response.status === 401) {
      console.warn(`🔒 401 Unauthorized encountered for ${url}:`, data?.message);
      // Only clear and notify if this is not a failed login attempt
      if (!endpoint.includes('/login') && !endpoint.includes('/register')) {
        await logout();
      }
      const errorMsg = data?.message || 'Session expired. Please log in again.';
      throw new Error(errorMsg);
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.error ||
        `Server error: ${response.status} ${response.statusText}`;
      throw new Error(errorMsg);
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error(
        `Request timeout: Backend at ${baseUrl} did not respond within 25 seconds.`
      );
    }

    // Enhance mobile networking error message if network request failed
    if (
      error.message?.includes('Network request failed') ||
      error.message?.includes('Failed to fetch')
    ) {
      throw new Error(
        `Cannot connect to backend server at ${baseUrl}. ` +
          `If using a physical phone with Expo Go, ensure both phone and computer are on the same Wi-Fi ` +
          `and configure EXPO_PUBLIC_API_URL in .env with your computer's IP (e.g. http://192.168.1.15:3002).`
      );
    }

    throw error;
  }
};
