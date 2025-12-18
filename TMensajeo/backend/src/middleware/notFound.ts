// ============================================
// NOT FOUND MIDDLEWARE
// ============================================
// Maneja rutas no encontradas (404)
// Debe registrarse antes del errorHandler
// Uso: app.use(notFound)

import { Request, Response } from 'express';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    message: `Ruta no encontrada - ${req.originalUrl}`,
  });
};
