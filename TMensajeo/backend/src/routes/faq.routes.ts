// ============================================
// FAQ ROUTES
// ============================================
// Rutas para preguntas frecuentes de negocios
// Información útil que los owners quieren compartir

import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import {
  getBusinessFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  reorderFAQs,
} from '../controllers/faqController';

const router = Router();

// Rutas públicas
router.get('/business/:businessId', getBusinessFAQs);

// Rutas protegidas (Owner/Admin)
router.post('/', authenticateToken, authorizeRoles('OWNER', 'ADMIN'), createFAQ);
router.put('/:id', authenticateToken, authorizeRoles('OWNER', 'ADMIN'), updateFAQ);
router.delete('/:id', authenticateToken, authorizeRoles('OWNER', 'ADMIN'), deleteFAQ);
router.put('/business/:businessId/reorder', authenticateToken, authorizeRoles('OWNER', 'ADMIN'), reorderFAQs);

export default router;
