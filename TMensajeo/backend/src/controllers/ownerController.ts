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
