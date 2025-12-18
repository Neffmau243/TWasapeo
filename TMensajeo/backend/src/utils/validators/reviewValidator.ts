// ============================================
// REVIEW VALIDATOR
// ============================================
// Schemas de validación con Zod para reseñas

import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    businessId: z.string().uuid('ID de negocio inválido'),
    rating: z.number().min(1).max(5, 'El rating debe ser entre 1 y 5'),
    comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres'),
  }),
});
