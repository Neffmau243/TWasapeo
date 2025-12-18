// ============================================
// EVENT ROUTES
// ============================================
// Rutas para eventos y actualizaciones de negocios
// Promociones, anuncios, nuevos productos

import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import {
  getBusinessEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';

const router = Router();

// Rutas públicas
router.get('/business/:businessId', getBusinessEvents);

// Rutas protegidas (Owner/Admin)
router.post('/', authenticateToken, authorizeRoles('OWNER', 'ADMIN'), createEvent);
router.put('/:id', authenticateToken, authorizeRoles('OWNER', 'ADMIN'), updateEvent);
router.delete('/:id', authenticateToken, authorizeRoles('OWNER', 'ADMIN'), deleteEvent);

export default router;
