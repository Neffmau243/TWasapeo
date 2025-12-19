// ============================================
// OWNER CONTROLLER
// ============================================
// Controlador para dueños de negocios
// Maneja: mis negocios, crear, editar, estadísticas, responder reseñas

import { Request, Response } from 'express';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';
import { generatePaginationMeta } from '../utils/pagination';

export const getMyBusinesses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = '1', limit = '10', status } = req.query;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { ownerId: userId };

    if (status) {
      where.status = status as string;
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              images: true,
              events: true,
              faqs: true,
            },
          },
        },
      }),
      prisma.business.count({ where }),
    ]);

    const pagination = generatePaginationMeta({ page: pageNum, limit: limitNum }, total);

    return successResponse(res, {
      businesses,
      pagination,
    });
  } catch (error) {
    console.error('Error en getMyBusinesses:', error);
    return errorResponse(res, 'Error al obtener mis negocios', 500);
  }
};

export const getBusinessStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { businessId } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        _count: {
          select: {
            reviews: true,
            images: true,
            events: true,
            faqs: true,
            favorites: true,
            following: true,
          },
        },
      },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    if (business.ownerId !== userId && req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos', 403);
    }

    const recentReviews = await prisma.review.findMany({
      where: { businessId },
      take: 5,
      orderBy: {
        createdAt: 'desc',
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

    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { businessId },
      _count: {
        rating: true,
      },
    });

    const stats = {
      business: {
        id: business.id,
        name: business.name,
        status: business.status,
        averageRating: business.averageRating,
        viewCount: business.viewCount,
        createdAt: business.createdAt,
      },
      counts: {
        reviews: business._count.reviews,
        images: business._count.images,
        events: business._count.events,
        faqs: business._count.faqs,
        favorites: business._count.favorites,
        following: business._count.following,
      },
      recentReviews,
      ratingDistribution,
    };

    return successResponse(res, stats);
  } catch (error) {
    console.error('Error en getBusinessStats:', error);
    return errorResponse(res, 'Error al obtener estadísticas', 500);
  }
};

export const getOwnerStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Obtener todos los negocios del owner
    const businesses = await prisma.business.findMany({
      where: { ownerId: userId },
      select: {
        id: true,
        averageRating: true,
        viewCount: true,
        _count: {
          select: {
            reviews: true,
          }
        }
      }
    });

    // Calcular totales
    const totalBusinesses = businesses.length;
    const totalReviews = businesses.reduce((acc, curr) => acc + curr._count.reviews, 0);
    const totalViews = businesses.reduce((acc, curr) => acc + curr.viewCount, 0);

    // Calcular promedio general
    const totalRatingSum = businesses.reduce((acc, curr) => acc + (curr.averageRating || 0), 0);
    const averageRating = totalBusinesses > 0 ? (totalRatingSum / totalBusinesses) : 0;

    const stats = {
      totalBusinesses,
      totalReviews,
      totalViews,
      averageRating: parseFloat(averageRating.toFixed(1))
    };

    return successResponse(res, stats);
  } catch (error) {
    console.error('Error en getOwnerStats:', error);
    return errorResponse(res, 'Error al obtener estadísticas generales', 500);
  }
};

/**
 * @desc    Obtener todas las reseñas de mis negocios
 * @route   GET /api/owner/reviews
 * @access  Private (Owner)
 */
export const getMyReviews = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = '1', limit = '20', businessId, minRating, maxRating } = req.query;

    if (!userId) {
      console.log('⚠️ getMyReviews: Usuario no autenticado');
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    console.log(`📊 getMyReviews - User: ${userId}, Page: ${page}, BusinessId: ${businessId || 'All'}`);

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Obtener IDs de negocios del owner
    const ownerBusinesses = await prisma.business.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    const businessIds = ownerBusinesses.map((b) => b.id);
    console.log(`🏢 Negocios del usuario: ${businessIds.length} encontrados`);

    if (businessIds.length === 0) {
      console.log('⚠️ El usuario no tiene negocios, retornando array vacío de reseñas');
      return successResponse(res, {
        reviews: [],
        pagination: generatePaginationMeta({ page: pageNum, limit: limitNum }, 0),
      });
    }

    const where: any = {
      businessId: { in: businessIds },
    };

    if (businessId) {
      where.businessId = businessId as string;
    }

    if (minRating) {
      where.rating = { ...where.rating, gte: parseInt(minRating as string) };
    }

    if (maxRating) {
      where.rating = { ...where.rating, lte: parseInt(maxRating as string) };
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          business: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
          _count: {
            select: {
              reactions: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    const pagination = generatePaginationMeta({ page: pageNum, limit: limitNum }, total);

    return successResponse(res, {
      reviews,
      pagination,
    });
  } catch (error) {
    console.error('Error en getMyReviews:', error);
    return errorResponse(res, 'Error al obtener reseñas', 500);
  }
};

/**
 * @desc    Responder a una reseña
 * @route   POST /api/owner/reviews/:reviewId/respond
 * @access  Private (Owner)
 */
export const respondToReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { reviewId } = req.params;
    const { response } = req.body;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    if (!response || response.trim().length === 0) {
      return errorResponse(res, 'La respuesta no puede estar vacía', 400);
    }

    // Buscar la reseña
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        business: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    });

    if (!review) {
      return errorResponse(res, 'Reseña no encontrada', 404);
    }

    // Verificar que el negocio pertenece al owner
    if (review.business.ownerId !== userId) {
      return errorResponse(res, 'No tienes permisos para responder a esta reseña', 403);
    }

    // Actualizar la reseña con la respuesta
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ownerReply: response.trim(),
        ownerReplyDate: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(res, updatedReview, 'Respuesta agregada exitosamente');
  } catch (error) {
    console.error('Error en respondToReview:', error);
    return errorResponse(res, 'Error al responder a la reseña', 500);
  }
};

/**
 * @desc    Actualizar respuesta a una reseña
 * @route   PUT /api/owner/reviews/:reviewId/respond
 * @access  Private (Owner)
 */
export const updateReviewResponse = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { reviewId } = req.params;
    const { response } = req.body;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    if (!response || response.trim().length === 0) {
      return errorResponse(res, 'La respuesta no puede estar vacía', 400);
    }

    // Buscar la reseña
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        business: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    });

    if (!review) {
      return errorResponse(res, 'Reseña no encontrada', 404);
    }

    // Verificar que el negocio pertenece al owner
    if (review.business.ownerId !== userId) {
      return errorResponse(res, 'No tienes permisos para responder a esta reseña', 403);
    }

    // Actualizar la respuesta
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ownerReply: response.trim(),
        ownerReplyDate: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(res, updatedReview, 'Respuesta actualizada exitosamente');
  } catch (error) {
    console.error('Error en updateReviewResponse:', error);
    return errorResponse(res, 'Error al actualizar la respuesta', 500);
  }
};

/**
 * @desc    Eliminar respuesta a una reseña
 * @route   DELETE /api/owner/reviews/:reviewId/respond
 * @access  Private (Owner)
 */
export const deleteReviewResponse = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { reviewId } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Buscar la reseña
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        business: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    });

    if (!review) {
      return errorResponse(res, 'Reseña no encontrada', 404);
    }

    // Verificar que el negocio pertenece al owner
    if (review.business.ownerId !== userId) {
      return errorResponse(res, 'No tienes permisos para eliminar esta respuesta', 403);
    }

    // Eliminar la respuesta
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ownerReply: null,
        ownerReplyDate: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(res, updatedReview, 'Respuesta eliminada exitosamente');
  } catch (error) {
    console.error('Error en deleteReviewResponse:', error);
    return errorResponse(res, 'Error al eliminar la respuesta', 500);
  }
};