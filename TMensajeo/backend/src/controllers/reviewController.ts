// ============================================
// REVIEW CONTROLLER
// ============================================
// Controlador de reseñas
// Maneja: CRUD de reseñas, reacciones (útil/no útil)

import { Request, Response } from 'express';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';
import { generatePaginationMeta } from '../utils/pagination';

/**
 * @desc    Obtener reseñas de un negocio
 * @route   GET /api/reviews/business/:businessId
 * @access  Public
 */
export const getBusinessReviews = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const { page = '1', limit = '10', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { businessId },
        skip,
        take: limitNum,
        orderBy: {
          [sortBy as string]: sortOrder as string,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              reactions: true,
            },
          },
        },
      }),
      prisma.review.count({ where: { businessId } }),
    ]);

    const pagination = generatePaginationMeta({ page: pageNum, limit: limitNum }, total);

    return successResponse(res, {
      reviews,
      pagination,
    });
  } catch (error) {
    console.error('Error en getBusinessReviews:', error);
    return errorResponse(res, 'Error al obtener reseñas', 500);
  }
};

/**
 * @desc    Crear nueva reseña
 * @route   POST /api/reviews
 * @access  Private (User)
 */
export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { businessId, rating, comment } = req.body;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Verificar que el negocio existe
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    // Verificar que el usuario no haya dejado ya una reseña
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });

    if (existingReview) {
      return errorResponse(res, 'Ya has dejado una reseña para este negocio', 400);
    }

    // Crear reseña
    const review = await prisma.review.create({
      data: {
        userId,
        businessId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Actualizar contador y promedio de rating del negocio
    const reviews = await prisma.review.findMany({
      where: { businessId },
      select: { rating: true },
    });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    await prisma.business.update({
      where: { id: businessId },
      data: {
        reviewCount: reviews.length,
        averageRating: parseFloat(averageRating.toFixed(2)),
      },
    });

    return successResponse(res, review, 'Reseña creada exitosamente', 201);
  } catch (error) {
    console.error('Error en createReview:', error);
    return errorResponse(res, 'Error al crear reseña', 500);
  }
};

/**
 * @desc    Actualizar mi reseña
 * @route   PUT /api/reviews/:id
 * @access  Private (User - propietario)
 */
export const updateReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Buscar reseña
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return errorResponse(res, 'Reseña no encontrada', 404);
    }

    // Verificar permisos (solo el autor puede editar)
    if (review.userId !== userId) {
      return errorResponse(res, 'No tienes permisos para editar esta reseña', 403);
    }

    // Actualizar reseña
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: rating || review.rating,
        comment: comment || review.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Recalcular promedio de rating del negocio si cambió el rating
    if (rating && rating !== review.rating) {
      const reviews = await prisma.review.findMany({
        where: { businessId: review.businessId },
        select: { rating: true },
      });

      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / reviews.length;

      await prisma.business.update({
        where: { id: review.businessId },
        data: {
          averageRating: parseFloat(averageRating.toFixed(2)),
        },
      });
    }

    return successResponse(res, updatedReview, 'Reseña actualizada exitosamente');
  } catch (error) {
    console.error('Error en updateReview:', error);
    return errorResponse(res, 'Error al actualizar reseña', 500);
  }
};

/**
 * @desc    Eliminar mi reseña
 * @route   DELETE /api/reviews/:id
 * @access  Private (User - propietario)
 */
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { id } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Buscar reseña
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return errorResponse(res, 'Reseña no encontrada', 404);
    }

    // Verificar permisos (autor o admin)
    if (review.userId !== userId && userRole !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos para eliminar esta reseña', 403);
    }

    // Eliminar reseña
    await prisma.review.delete({
      where: { id },
    });

    // Recalcular promedio de rating del negocio
    const reviews = await prisma.review.findMany({
      where: { businessId: review.businessId },
      select: { rating: true },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await prisma.business.update({
      where: { id: review.businessId },
      data: {
        reviewCount: reviews.length,
        averageRating: parseFloat(averageRating.toFixed(2)),
      },
    });

    return successResponse(res, null, 'Reseña eliminada exitosamente');
  } catch (error) {
    console.error('Error en deleteReview:', error);
    return errorResponse(res, 'Error al eliminar reseña', 500);
  }
};

/**
 * @desc    Agregar reacción a reseña (útil/no útil)
 * @route   POST /api/reviews/:reviewId/reactions
 * @access  Private (User)
 */
export const addReaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { reviewId: id } = req.params;
    const { isHelpful } = req.body; // true para útil, false para no útil

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Verificar que la reseña existe
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return errorResponse(res, 'Reseña no encontrada', 404);
    }

    // Verificar si ya reaccionó
    const existingReaction = await prisma.reviewReaction.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId: id,
        },
      },
    });

    if (existingReaction) {
      // Si es la misma reacción, eliminarla (toggle)
      if (existingReaction.isHelpful === isHelpful) {
        await prisma.reviewReaction.delete({
          where: {
            userId_reviewId: {
              userId,
              reviewId: id,
            },
          },
        });
        return successResponse(res, null, 'Reacción eliminada');
      }

      // Si es diferente, actualizarla
      const reaction = await prisma.reviewReaction.update({
        where: {
          userId_reviewId: {
            userId,
            reviewId: id,
          },
        },
        data: { isHelpful },
      });
      return successResponse(res, reaction, 'Reacción actualizada');
    }

    // Crear nueva reacción
    const reaction = await prisma.reviewReaction.create({
      data: {
        userId,
        reviewId: id,
        isHelpful,
      },
    });

    return successResponse(res, reaction, 'Reacción agregada', 201);
  } catch (error) {
    console.error('Error en addReaction:', error);
    return errorResponse(res, 'Error al agregar reacción', 500);
  }
};

/**
 * @desc    Eliminar reacción de reseña
 * @route   DELETE /api/reviews/:id/reaction
 * @access  Private (User)
 */
export const removeReaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { reviewId: id } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Verificar que la reacción existe
    const reaction = await prisma.reviewReaction.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId: id,
        },
      },
    });

    if (!reaction) {
      return errorResponse(res, 'No has reaccionado a esta reseña', 404);
    }

    // Eliminar reacción
    await prisma.reviewReaction.delete({
      where: {
        userId_reviewId: {
          userId,
          reviewId: id,
        },
      },
    });

    return successResponse(res, null, 'Reacción eliminada');
  } catch (error) {
    console.error('Error en removeReaction:', error);
    return errorResponse(res, 'Error al eliminar reacción', 500);
  }
};
