// ============================================
// CORS - CONFIGURACIÓN
// ============================================
// Configuración de CORS (Cross-Origin Resource Sharing)
// Permite peticiones desde el frontend
// Uso: import { corsOptions } from './config/cors'

import { CorsOptions } from 'cors';

const allowedOrigins = [
  'http://localhost:5173', // Frontend en desarrollo
  'http://127.0.0.1:5173', // Frontend ip
  'http://localhost:3000',
  process.env.FRONTEND_URL || '',
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
