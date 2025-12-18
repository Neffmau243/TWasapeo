// ============================================
// BUSINESS VALIDATOR
// ============================================
// Schemas de validación con Zod para negocios

import { z } from 'zod';

export const createBusinessSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    description: z.string().min(100, 'La descripción debe tener al menos 100 caracteres'),
    categoryId: z.string().uuid('ID de categoría inválido'),
    address: z.string().min(5, 'La dirección es requerida'),
    city: z.string().min(2, 'La ciudad es requerida'),
    state: z.string().min(2, 'El estado es requerido'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    phone: z.string().min(10, 'Teléfono inválido'),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
  }),
});
