// ============================================
// USER ROUTES
// ============================================
// Rutas para usuarios autenticados (rol USER)
// Perfil, favoritos, seguidos, reseñas

import { Router } from 'express';
import { auth } from '../middleware/auth';
import * as userController from '../controllers/userController';
// import { upload } from '../middleware/upload';

const router = Router();

// Todas las rutas requieren autenticación
router.use(auth);

// ===== PERFIL =====
// GET /api/user/profile - Ver mi perfil
router.get('/profile', userController.getProfile);

// PUT /api/user/profile - Actualizar mi perfil
router.put('/profile', userController.updateProfile);

// PUT /api/user/password - Cambiar contraseña
router.put('/password', userController.changePassword);

// DELETE /api/user/account - Eliminar cuenta
router.delete('/account', userController.deleteAccount);

// ===== AVATAR (FUNCIONALIDAD FUTURA) =====
// POST /api/user/avatar - Subir/actualizar avatar
// router.post('/avatar', upload.single('avatar'), userController.uploadAvatar);

// DELETE /api/user/avatar - Eliminar avatar
// router.delete('/avatar', userController.deleteAvatar);

// ===== FAVORITOS =====
// GET /api/user/favorites - Mis negocios favoritos
router.get('/favorites', userController.getFavorites);

// POST /api/user/favorites/:businessId - Agregar a favoritos
router.post('/favorites/:businessId', userController.addFavorite);

// DELETE /api/user/favorites/:businessId - Quitar de favoritos
router.delete('/favorites/:businessId', userController.removeFavorite);

// ===== SEGUIMIENTO =====
// GET /api/user/following - Negocios que sigo
router.get('/following', userController.getFollowing);

// POST /api/user/following/:businessId - Seguir negocio
router.post('/following/:businessId', userController.followBusiness);

// DELETE /api/user/following/:businessId - Dejar de seguir
router.delete('/following/:businessId', userController.unfollowBusiness);

// ===== RESEÑAS =====
// GET /api/user/reviews - Mis reseñas
router.get('/reviews', userController.getMyReviews);

export default router;
