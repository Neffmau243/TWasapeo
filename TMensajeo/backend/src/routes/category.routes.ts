// ============================================
// CATEGORY ROUTES
// ============================================
// Rutas para categorías de negocios
// Listado, creación, edición (admin)

import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';

const router = Router();

// Rutas públicas
router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);

// Rutas de administrador
router.post('/', authenticateToken, authorizeRoles('ADMIN'), createCategory);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), updateCategory);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), deleteCategory);

export default router;
