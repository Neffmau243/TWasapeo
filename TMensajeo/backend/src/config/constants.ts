// ============================================
// CONSTANTS - CONSTANTES GLOBALES
// ============================================
// Constantes usadas en toda la aplicación
// Roles, estados, límites, etc.

// Roles de usuario
export const ROLES = {
  USER: 'USER',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
} as const;

// Estados de negocio
export const BUSINESS_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  INACTIVE: 'INACTIVE',
} as const;

// Límites de archivos
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
};

// Paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Rating
export const RATING = {
  MIN: 1,
  MAX: 5,
};

// Horarios
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

// Límites de búsqueda
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  MAX_DISTANCE_KM: 50, // Radio máximo de búsqueda
};
