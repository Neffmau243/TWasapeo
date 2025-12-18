// ============================================
// DATABASE - CLIENTE PRISMA
// ============================================
// Cliente Prisma singleton para conexión a PostgreSQL
// Evita múltiples instancias en desarrollo con hot reload
// Uso: import prisma from './config/database'

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
