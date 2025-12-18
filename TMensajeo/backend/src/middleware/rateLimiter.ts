// ============================================
// RATE LIMITER MIDDLEWARE
// ============================================
// Limita el número de peticiones por IP
// Previene spam y ataques de fuerza bruta
// Uso: router.post('/login', rateLimiter, controller)

import rateLimit from 'express-rate-limit';

// Rate limiter general (100 requests por 15 minutos)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para autenticación (5 intentos por 15 minutos)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de login, intenta de nuevo más tarde',
  skipSuccessfulRequests: true, // No contar requests exitosos
});

// Rate limiter para creación de contenido (10 por hora)
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  message: 'Has creado demasiado contenido, intenta de nuevo más tarde',
});
