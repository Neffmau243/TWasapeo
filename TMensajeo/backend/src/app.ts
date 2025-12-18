// ============================================
// APP - CONFIGURACIÓN DE EXPRESS
// ============================================
// Configuración principal de la aplicación Express
// Middlewares, rutas, manejo de errores

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { corsOptions } from './config/cors';
import { swaggerSpec } from './config/swagger';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { generalLimiter } from './middleware/rateLimiter';
import routes from './routes';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// Seguridad HTTP headers
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger de peticiones
app.use(logger);

// Rate limiting general
app.use(generalLimiter);

// ============================================
// RUTAS
// ============================================

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Locales API Documentation',
}));

// Swagger JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Rutas de la API
app.use('/api', routes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta no encontrada
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
