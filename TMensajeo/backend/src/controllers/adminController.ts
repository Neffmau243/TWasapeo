// ============================================
// ADMIN CONTROLLER
// ============================================
// Controlador para administradores
// Maneja: aprobaciones, moderación, estadísticas globales, gestión de usuarios

import { Request, Response } from 'express';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';
import { generatePaginationMeta } from '../utils/pagination';
import { sendEmail } from '../services/emailService';

export const getPendingBusinesses = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where: { status: 'PENDING' },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              images: true,
              events: true,
              faqs: true,
            },
          },
        },
      }),
      prisma.business.count({ where: { status: 'PENDING' } }),
    ]);

    const pagination = generatePaginationMeta({ page: pageNum, limit: limitNum }, total);

    return successResponse(res, {
      businesses,
      pagination,
    });
  } catch (error) {
    console.error('Error en getPendingBusinesses:', error);
    return errorResponse(res, 'Error al obtener negocios pendientes', 500);
  }
};

export const approveBusiness = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    if (business.status !== 'PENDING') {
      return errorResponse(res, 'El negocio no está pendiente de aprobación', 400);
    }

    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    // Enviar email de aprobación
    try {
      await sendEmail(
        business.owner.email,
        'business-approved' as any,
        {
          businessName: business.name,
          ownerName: business.owner.name,
        }
      );
    } catch (emailError) {
      console.error('Error al enviar email de aprobación:', emailError);
      // No falla la operación si el email falla
    }

    return successResponse(res, updatedBusiness, 'Negocio aprobado exitosamente');
  } catch (error) {
    console.error('Error en approveBusiness:', error);
    return errorResponse(res, 'Error al aprobar negocio', 500);
  }
};

export const rejectBusiness = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    if (business.status !== 'PENDING') {
      return errorResponse(res, 'El negocio no está pendiente de aprobación', 400);
    }

    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    // Enviar email de rechazo
    try {
      await sendEmail(
        business.owner.email,
        'business-rejected' as any,
        {
          businessName: business.name,
          ownerName: business.owner.name,
          reason: reason || 'No cumple con los requisitos de la plataforma',
        }
      );
    } catch (emailError) {
      console.error('Error al enviar email de rechazo:', emailError);
    }

    return successResponse(res, updatedBusiness, 'Negocio rechazado');
  } catch (error) {
    console.error('Error en rejectBusiness:', error);
    return errorResponse(res, 'Error al rechazar negocio', 500);
  }
};

export const getGlobalStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalBusinesses, totalReviews, totalCategories, businessesByStatus, recentActivity] = await Promise.all([
      prisma.user.count(),
      prisma.business.count(),
      prisma.review.count(),
      prisma.category.count(),
      prisma.business.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.business.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    const topRatedBusinesses = await prisma.business.findMany({
      take: 5,
      where: {
        status: 'APPROVED',
        reviewCount: { gt: 0 },
      },
      orderBy: {
        averageRating: 'desc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        averageRating: true,
        reviewCount: true,
      },
    });

    const stats = {
      overview: {
        totalUsers,
        totalBusinesses,
        totalReviews,
        totalCategories,
      },
      businessesByStatus: businessesByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      }, {} as Record<string, number>),
      topRatedBusinesses,
      recentActivity,
    };

    return successResponse(res, stats);
  } catch (error) {
    console.error('Error en getGlobalStats:', error);
    return errorResponse(res, 'Error al obtener estadísticas', 500);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', role } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (role) {
      where.role = role as string;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isVerified: true,
          createdAt: true,
          _count: {
            select: {
              businesses: true,
              reviews: true,
              favorites: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const pagination = generatePaginationMeta({ page: pageNum, limit: limitNum }, total);

    return successResponse(res, {
      users,
      pagination,
    });
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    return errorResponse(res, 'Error al obtener usuarios', 500);
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'OWNER', 'ADMIN'].includes(role)) {
      return errorResponse(res, 'Rol inválido', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return successResponse(res, updatedUser, 'Rol actualizado exitosamente');
  } catch (error) {
    console.error('Error en changeUserRole:', error);
    return errorResponse(res, 'Error al cambiar rol', 500);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = req.user?.id;

    if (id === adminId) {
      return errorResponse(res, 'No puedes eliminar tu propia cuenta', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    return successResponse(res, null, 'Usuario eliminado exitosamente');
  } catch (error) {
    console.error('Error en deleteUser:', error);
    return errorResponse(res, 'Error al eliminar usuario', 500);
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        business: true,
      },
    });

    if (!review) {
      return errorResponse(res, 'Reseña no encontrada', 404);
    }

    await prisma.review.delete({
      where: { id },
    });

    // Recalcular rating promedio del negocio
    const reviews = await prisma.review.findMany({
      where: { businessId: review.businessId },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await prisma.business.update({
      where: { id: review.businessId },
      data: {
        averageRating,
        reviewCount: reviews.length,
      },
    });

    return successResponse(res, null, 'Reseña eliminada exitosamente');
  } catch (error) {
    console.error('Error en deleteReview (admin):', error);
    return errorResponse(res, 'Error al eliminar reseña', 500);
  }
};

/**
 * @desc    Obtener todas las reseñas (para moderación)
 * @route   GET /api/admin/reviews
 * @access  Private (Admin)
 */
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', businessId, userId, minRating, maxRating } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (businessId) {
      where.businessId = businessId as string;
    }
    if (userId) {
      where.userId = userId as string;
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
    console.error('Error en getAllReviews:', error);
    return errorResponse(res, 'Error al obtener reseñas', 500);
  }
};