// ============================================
// PUBLIC ROUTES
// ============================================
// Rutas públicas accesibles sin autenticación
// Homepage, categorías, negocios destacados, populares, recientes

import { Router } from 'express';
import * as publicController from '../controllers/publicController';

const router = Router();

// GET /api/public/homepage - Datos completos para homepage
router.get('/homepage', publicController.getHomepageData);

// GET /api/public/categories - Todas las categorías
router.get('/categories', publicController.getFeaturedCategories);

// GET /api/public/top-rated - Negocios mejor calificados
router.get('/top-rated', publicController.getTopRatedBusinesses);

// GET /api/public/recent - Negocios recientes
router.get('/recent', publicController.getRecentBusinesses);

// GET /api/public/popular - Negocios más vistos
router.get('/popular', publicController.getPopularBusinesses);

export default router;
