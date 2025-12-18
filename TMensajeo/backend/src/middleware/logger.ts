// ============================================
// LOGGER MIDDLEWARE
// ============================================
// Registra todas las peticiones HTTP
// Formato: [TIMESTAMP] METHOD URL - STATUS - RESPONSE_TIME ms
// Útil para debugging y monitoreo

import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Ejecutar cuando termine la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};
