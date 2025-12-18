// ============================================
// AUTH MIDDLEWARE
// ============================================
// Verifica el token JWT en las peticiones
// Extrae el usuario del token y lo attachea a req.user
// Uso: router.get('/protected', auth, controller)

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { Role } from '@prisma/client';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener token del header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No autorizado - Token no proporcionado' });
    }

    // Verificar token
    const decoded = jwt.verify(token, jwtConfig.secret) as any;

    // Attachear usuario a la request
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: 'No autorizado - Token inválido' });
  }
};

// Alias para mantener compatibilidad
export const authenticateToken = auth;

// Middleware para verificar roles
export const authorizeRoles = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    if (!roles.includes(req.user.role as Role)) {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    next();
  };
};
