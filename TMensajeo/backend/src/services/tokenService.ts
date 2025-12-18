// ============================================
// TOKEN SERVICE
// ============================================
// Servicio para generar y verificar JWT tokens

import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';

export interface TokenPayload {
  userId: string;
  role: string;
}

/**
 * Generar access token
 */
export const generateAccessToken = (userId: string, role: string): string => {
  const payload: TokenPayload = { userId, role };
  return jwt.sign(payload, jwtConfig.secret as string, {
    expiresIn: jwtConfig.expiresIn,
  } as SignOptions);
};

/**
 * Generar refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  const payload = { userId };
  return jwt.sign(payload, jwtConfig.refreshSecret as string, {
    expiresIn: jwtConfig.refreshExpiresIn,
  } as SignOptions);
};

/**
 * Verificar token
 */
export const verifyToken = (token: string, isRefresh: boolean = false): TokenPayload | null => {
  try {
    const secret = isRefresh ? jwtConfig.refreshSecret : jwtConfig.secret;
    return jwt.verify(token, secret as string) as TokenPayload;
  } catch (error) {
    return null;
  }
};
