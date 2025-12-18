// ============================================
// BUSINESS ROUTES
// ============================================
// Rutas relacionadas con negocios
// CRUD, galería, horarios

import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import {
  getAllBusinesses,
  getBusinessById,
  getBusinessBySlug,
  getPublicBusinesses,
  getFeaturedBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  incrementViews,
} from '../controllers/businessController';

const router = Router();

// Rutas públicas
router.get('/', getAllBusinesses);
router.get('/public', getPublicBusinesses);
router.get('/featured', getFeaturedBusinesses);
router.get('/id/:id', getBusinessById);
router.get('/slug/:slug', getBusinessBySlug);
router.post('/:id/views', incrementViews);

// Rutas protegidas (Owner/Admin)
router.post('/', authenticateToken, authorizeRoles('OWNER', 'ADMIN'), createBusiness);
router.put('/:id', authenticateToken, authorizeRoles('OWNER', 'ADMIN'), updateBusiness);
router.delete('/:id', authenticateToken, authorizeRoles('OWNER', 'ADMIN'), deleteBusiness);

export default router;
