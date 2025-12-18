// ============================================
// SEARCH ROUTES
// ============================================
// Rutas para búsqueda y filtrado de negocios
// Búsqueda por texto, ubicación, categoría, rating

import { Router } from 'express';
import * as searchController from '../controllers/searchController';

const router = Router();

// GET /api/search - Búsqueda general de negocios
// Parámetros: q (query), category, city, rating, etc.
router.get('/', searchController.searchBusinesses);

// GET /api/search/autocomplete - Autocompletado de búsqueda
router.get('/autocomplete', searchController.autocomplete);

// GET /api/search/filters - Obtener filtros disponibles
router.get('/filters', searchController.getAvailableFilters);

export default router;
