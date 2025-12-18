// ============================================
// JWT - CONFIGURACIÓN
// ============================================
// Configuración de JSON Web Tokens para autenticación
// Variables de entorno: JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN
// Uso: import { jwtConfig } from './config/jwt'

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'tu-secret-super-seguro-cambiar-en-produccion',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'tu-refresh-secret-super-seguro-cambiar-en-produccion',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};
