// ============================================
// TEST SETUP
// ============================================
// Configuración inicial para tests con Jest

import { beforeAll, afterAll } from '@jest/globals';
import prisma from '../config/database';

// Mock de nodemailer para evitar envíos reales
jest.mock('nodemailer', () => {
  return {
    __esModule: true,
    default: {
      createTransport: () => ({
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
      }),
    },
    createTransport: () => ({
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
    }),
  };
});

// Configurar antes de todos los tests
beforeAll(async () => {
  // TODO: Configurar base de datos de prueba
});

// Limpiar después de todos los tests
afterAll(async () => {
  await prisma.$disconnect();
});
