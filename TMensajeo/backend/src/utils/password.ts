// ============================================
// PASSWORD UTILS
// ============================================
// Utilidades para hashear y comparar contraseñas con bcrypt

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hashear contraseña
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Comparar contraseña con hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
