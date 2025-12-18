// ============================================
// UPLOAD ROUTES
// ============================================
// Rutas para subida de imágenes
// Avatar de usuario, imágenes de negocios, eventos

import { Router } from 'express';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import * as uploadController from '../controllers/uploadController';

const router = Router();

// Todas las rutas requieren autenticación
router.use(auth);

// POST /api/upload/avatar - Subir/actualizar avatar
router.post('/avatar', upload.single('avatar'), uploadController.uploadAvatar);

// DELETE /api/upload/avatar - Eliminar avatar
router.delete('/avatar', uploadController.deleteAvatar);

// POST /api/upload/business/:businessId/logo - Subir logo de negocio
router.post('/business/:businessId/logo', upload.single('logo'), uploadController.uploadBusinessLogo);

// POST /api/upload/business/:businessId/cover - Subir cover de negocio
router.post('/business/:businessId/cover', upload.single('cover'), uploadController.uploadBusinessCover);

// POST /api/upload/business/:businessId/gallery - Subir imágenes a galería
router.post('/business/:businessId/gallery', upload.array('images', 10), uploadController.uploadBusinessGallery);

// DELETE /api/upload/image/:publicId - Eliminar imagen por public_id
router.delete('/image/:publicId', uploadController.deleteImage);

export default router;
