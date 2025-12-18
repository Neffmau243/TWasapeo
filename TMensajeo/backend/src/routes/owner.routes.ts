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
} from '../controllers/ownerController';

const router = Router();

// Todas las rutas requieren autenticación y rol OWNER
router.use(authenticateToken);
router.use(authorizeRoles('OWNER', 'ADMIN'));

router.get('/businesses', getMyBusinesses);
router.get('/businesses/:businessId/stats', getBusinessStats);

export default router;
