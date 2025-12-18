// ============================================
// REVIEW ROUTES
// ============================================
// Rutas para reseñas
// Crear, editar, eliminar, reaccionar

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getBusinessReviews,
  createReview,
  updateReview,
  deleteReview,
  addReaction,
  removeReaction,
} from '../controllers/reviewController';

const router = Router();

// Rutas públicas
router.get('/business/:businessId', getBusinessReviews);

// Rutas protegidas
router.post('/', authenticateToken, createReview);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

// Reacciones
router.post('/:reviewId/reactions', authenticateToken, addReaction);
router.delete('/:reviewId/reactions', authenticateToken, removeReaction);

export default router;
