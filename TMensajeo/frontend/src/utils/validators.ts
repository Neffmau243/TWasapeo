import { MIN_PASSWORD_LENGTH, MIN_REVIEW_LENGTH, MAX_REVIEW_LENGTH } from './constants';

/**
 * Valida un email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida una contraseña
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= MIN_PASSWORD_LENGTH;
};

/**
 * Valida un número de teléfono (formato mexicano)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+52)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Valida una URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida el rating (debe ser entre 1 y 5)
 */
export const isValidRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
};

/**
 * Valida la longitud de un review
 */
export const isValidReviewLength = (content: string): boolean => {
  const length = content.trim().length;
  return length >= MIN_REVIEW_LENGTH && length <= MAX_REVIEW_LENGTH;
};

/**
 * Valida coordenadas geográficas
 */
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return (
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

/**
 * Valida un slug
 */
export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Valida que un string no esté vacío
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Valida la longitud mínima de un string
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

/**
 * Valida la longitud máxima de un string
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

/**
 * Valida un archivo de imagen
 */
export const isValidImageFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato no válido. Solo se permiten JPG, PNG y WebP.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'El archivo es demasiado grande. Máximo 5MB.',
    };
  }

  return { valid: true };
};

/**
 * Valida formato de horario (HH:mm)
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
};
