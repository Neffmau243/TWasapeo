// ============================================
// ROLE CHECK MIDDLEWARE
// ============================================
// Verifica que el usuario tenga el rol requerido
// Debe usarse después del middleware auth
// Uso: router.get('/admin', auth, roleCheck(['ADMIN']), controller)

import { Request, Response, NextFunction } from 'express';

export const roleCheck = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'No tienes permisos para acceder a este recurso' 
      });
    }

    next();
  };
};
