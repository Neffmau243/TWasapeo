// ============================================
// SLUG SERVICE
// ============================================
// Servicio para generar slugs únicos
// Convierte "Mi Negocio" en "mi-negocio" y asegura unicidad

import prisma from '../config/database';

/**
 * Generar slug desde un string
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-'); // Múltiples guiones a uno
};

/**
 * Generar slug único para negocio
 */
export const generateUniqueBusinessSlug = async (name: string): Promise<string> => {
  let slug = generateSlug(name);
  let counter = 1;

  // Verificar si el slug ya existe
  while (await prisma.business.findUnique({ where: { slug } })) {
    slug = `${generateSlug(name)}-${counter}`;
    counter++;
  }

  return slug;
};
