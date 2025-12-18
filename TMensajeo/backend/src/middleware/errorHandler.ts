// ============================================
// ERROR HANDLER MIDDLEWARE
// ============================================
// Manejo centralizado de errores
// Captura todos los errores y retorna respuestas consistentes
// Debe ser el último middleware registrado

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Error de Prisma
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      message: 'Error de base de datos',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Error de validación',
      errors: err.errors,
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }

  // Error por defecto
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : undefined,
  });
};
