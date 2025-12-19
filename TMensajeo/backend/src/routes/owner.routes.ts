// ============================================
// OWNER ROUTES
// ============================================
// Rutas para dueños de negocios (rol OWNER)
// Gestión de sus propios negocios

import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import {
  getMyBusinesses,
  getBusinessStats,
  getOwnerStats,
  getMyReviews,
  respondToReview,
  updateReviewResponse,
  deleteReviewResponse,
} from '../controllers/ownerController';

const router = Router();

// Todas las rutas requieren autenticación y rol OWNER
router.use(authenticateToken);
router.use(authorizeRoles('OWNER', 'ADMIN'));

router.get('/stats', getOwnerStats);
router.get('/businesses', getMyBusinesses);
router.get('/businesses/:businessId/stats', getBusinessStats);

// Reseñas
router.get('/reviews', getMyReviews);
router.post('/reviews/:reviewId/respond', respondToReview);
router.put('/reviews/:reviewId/respond', updateReviewResponse);
router.delete('/reviews/:reviewId/respond', deleteReviewResponse);

export default router;
