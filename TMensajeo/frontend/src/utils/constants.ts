// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// User Roles
export const ROLES = {
  GUEST: 'GUEST',
  USER: 'USER',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
} as const;

// Business Status
export const BUSINESS_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

// Rating Values
export const RATING_VALUES = [1, 2, 3, 4, 5] as const;

// Pagination Defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// Map Configuration
export const DEFAULT_CENTER = {
  lat: 19.4326,
  lng: -99.1332, // Ciudad de México
};

export const DEFAULT_ZOOM = 13;
export const SEARCH_RADIUS_KM = 10;

// Image Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGES_PER_BUSINESS = 10;
export const MAX_IMAGES_PER_REVIEW = 5;

// Validation
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 100;
export const MIN_REVIEW_LENGTH = 10;
export const MAX_REVIEW_LENGTH = 1000;
export const MIN_BUSINESS_NAME_LENGTH = 3;
export const MAX_BUSINESS_NAME_LENGTH = 100;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recentSearches',
} as const;

// Date Formats
export const DATE_FORMAT = 'DD/MM/YYYY';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

// Social Media Patterns
export const SOCIAL_PATTERNS = {
  FACEBOOK: /^https?:\/\/(www\.)?facebook\.com\/.+/,
  INSTAGRAM: /^https?:\/\/(www\.)?instagram\.com\/.+/,
  WEBSITE: /^https?:\/\/.+/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, intenta de nuevo.',
  UNAUTHORIZED: 'No autorizado. Por favor, inicia sesión.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'Recurso no encontrado.',
  SERVER_ERROR: 'Error del servidor. Por favor, intenta más tarde.',
  VALIDATION_ERROR: 'Error de validación. Verifica los datos.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Inicio de sesión exitoso.',
  REGISTER: '¡Registro exitoso! Bienvenido.',
  LOGOUT: 'Sesión cerrada correctamente.',
  UPDATE: 'Actualización exitosa.',
  CREATE: 'Creación exitosa.',
  DELETE: 'Eliminación exitosa.',
} as const;
