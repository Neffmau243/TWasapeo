import { STORAGE_KEYS } from './constants';

/**
 * Obtiene un item del localStorage
 */
export const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
};

/**
 * Guarda un item en el localStorage
 */
export const setItem = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Elimina un item del localStorage
 */
export const removeItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Limpia todo el localStorage
 */
export const clearStorage = (): boolean => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Verifica si una key existe en localStorage
 */
export const hasItem = (key: string): boolean => {
  return localStorage.getItem(key) !== null;
};

// Helpers específicos para tokens y usuario

/**
 * Guarda el access token
 */
export const setAccessToken = (token: string): boolean => {
  return setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

/**
 * Obtiene el access token
 */
export const getAccessToken = (): string | null => {
  return getItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Elimina el access token
 */
export const removeAccessToken = (): boolean => {
  return removeItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Guarda el refresh token
 */
export const setRefreshToken = (token: string): boolean => {
  return setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

/**
 * Obtiene el refresh token
 */
export const getRefreshToken = (): string | null => {
  return getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Elimina el refresh token
 */
export const removeRefreshToken = (): boolean => {
  return removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Guarda los tokens de autenticación
 */
export const setTokens = (accessToken: string, refreshToken: string): boolean => {
  const success1 = setAccessToken(accessToken);
  const success2 = setRefreshToken(refreshToken);
  return success1 && success2;
};

/**
 * Elimina todos los tokens
 */
export const removeTokens = (): boolean => {
  const success1 = removeAccessToken();
  const success2 = removeRefreshToken();
  return success1 && success2;
};

/**
 * Guarda los datos del usuario
 */
export const setUser = (user: any): boolean => {
  return setItem(STORAGE_KEYS.USER, user);
};

/**
 * Obtiene los datos del usuario
 */
export const getUser = <T>(): T | null => {
  return getItem<T>(STORAGE_KEYS.USER);
};

/**
 * Elimina los datos del usuario
 */
export const removeUser = (): boolean => {
  return removeItem(STORAGE_KEYS.USER);
};

/**
 * Limpia toda la sesión (tokens y usuario)
 */
export const clearSession = (): boolean => {
  const success1 = removeTokens();
  const success2 = removeUser();
  return success1 && success2;
};

/**
 * Guarda una búsqueda reciente
 */
export const addRecentSearch = (search: string): boolean => {
  const searches = getItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES) || [];
  const updated = [search, ...searches.filter(s => s !== search)].slice(0, 10);
  return setItem(STORAGE_KEYS.RECENT_SEARCHES, updated);
};

/**
 * Obtiene las búsquedas recientes
 */
export const getRecentSearches = (): string[] => {
  return getItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES) || [];
};

/**
 * Limpia las búsquedas recientes
 */
export const clearRecentSearches = (): boolean => {
  return removeItem(STORAGE_KEYS.RECENT_SEARCHES);
};

/**
 * Guarda el tema preferido
 */
export const setTheme = (theme: 'light' | 'dark'): boolean => {
  return setItem(STORAGE_KEYS.THEME, theme);
};

/**
 * Obtiene el tema preferido
 */
export const getTheme = (): 'light' | 'dark' | null => {
  return getItem<'light' | 'dark'>(STORAGE_KEYS.THEME);
};
