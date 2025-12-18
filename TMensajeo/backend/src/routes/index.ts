// ============================================
// ROUTES INDEX - ROUTER PRINCIPAL
// ============================================
// Agrupa todas las rutas de la aplicación
// Uso en app.ts: app.use('/api', routes)

import { Router } from 'express';
import authRoutes from './auth.routes';
import publicRoutes from './public.routes';
import userRoutes from './user.routes';
import ownerRoutes from './owner.routes';
import adminRoutes from './admin.routes';
import businessRoutes from './business.routes';
import reviewRoutes from './review.routes';
import eventRoutes from './event.routes';
import faqRoutes from './faq.routes';
import categoryRoutes from './category.routes';
import searchRoutes from './search.routes';
import uploadRoutes from './upload.routes';

const router = Router();

// Rutas públicas (sin autenticación)
router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/search', searchRoutes);
router.use('/categories', categoryRoutes);

// Rutas protegidas (requieren autenticación)
router.use('/user', userRoutes);
router.use('/businesses', businessRoutes);
router.use('/reviews', reviewRoutes);
router.use('/events', eventRoutes);
router.use('/faqs', faqRoutes);
router.use('/upload', uploadRoutes);

// Rutas por rol
router.use('/owner', ownerRoutes);
router.use('/admin', adminRoutes);

export default router;
