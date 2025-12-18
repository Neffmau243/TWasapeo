// ============================================
// ADMIN ROUTES
// ============================================
// Rutas para administradores (rol ADMIN)
// Aprobaciones, moderación, estadísticas globales

import { Router } from 'express';
import { auth, authorizeRoles } from '../middleware/auth';
import { Role } from '@prisma/client';
import * as adminController from '../controllers/adminController';

const router = Router();

// Todas las rutas requieren autenticación y rol ADMIN
router.use(auth);
router.use(authorizeRoles(Role.ADMIN));

// GET /api/admin/pending - Negocios pendientes de aprobación
router.get('/pending', adminController.getPendingBusinesses);

// PUT /api/admin/approve/:id - Aprobar negocio
router.put('/approve/:id', adminController.approveBusiness);

// PUT /api/admin/reject/:id - Rechazar negocio
router.put('/reject/:id', adminController.rejectBusiness);

// GET /api/admin/stats - Estadísticas globales
router.get('/stats', adminController.getGlobalStats);

// GET /api/admin/users - Listar todos los usuarios
router.get('/users', adminController.getAllUsers);

// PUT /api/admin/users/:id/role - Cambiar rol de usuario
router.put('/users/:id/role', adminController.changeUserRole);

// DELETE /api/admin/users/:id - Eliminar usuario
router.delete('/users/:id', adminController.deleteUser);

// DELETE /api/admin/reviews/:id - Eliminar reseña inapropiada
router.delete('/reviews/:id', adminController.deleteReview);

export default router;
