// ============================================
// PUBLIC CONTROLLER
// ============================================
// Controlador público (sin autenticación)
// Maneja: datos homepage, categorías destacadas, negocios top

import { Request, Response } from 'express';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';

export const getHomepageData = async (req: Request, res: Response) => {
  try {
    const [featuredCategories, topRatedBusinesses, recentBusinesses, stats] = await Promise.all([
      // Categorías destacadas (primeras 8)
      prisma.category.findMany({
        take: 8,
        orderBy: { order: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          description: true,
          _count: {
            select: {
              businesses: {
                where: { status: 'APPROVED' },
              },
            },
          },
        },
      }),

      // Top 6 negocios mejor calificados
      prisma.business.findMany({
        take: 6,
        where: {
          status: 'APPROVED',
          reviewCount: { gt: 0 },
        },
        orderBy: [
          { averageRating: 'desc' },
          { reviewCount: 'desc' },
        ],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          city: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          averageRating: true,
          reviewCount: true,
          viewCount: true,
          category: {
            select: {
              name: true,
              icon: true,
            },
          },
        },
      }),

      // 6 negocios recientes
      prisma.business.findMany({
        take: 6,
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          city: true,
          averageRating: true,
          reviewCount: true,
          category: {
            select: {
              name: true,
              icon: true,
            },
          },
        },
      }),

      // Estadísticas globales
      prisma.business.aggregate({
        where: { status: 'APPROVED' },
        _count: { id: true },
      }),
    ]);

    const totalReviews = await prisma.review.count();
    const totalCategories = await prisma.category.count();

    const data = {
      featuredCategories,
      topRatedBusinesses,
      recentBusinesses,
      stats: {
        totalBusinesses: stats._count.id,
        totalReviews,
        totalCategories,
      },
    };

    return successResponse(res, data);
  } catch (error) {
    console.error('Error en getHomepageData:', error);
    return errorResponse(res, 'Error al obtener datos de la página principal', 500);
  }
};

export const getFeaturedCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        description: true,
        _count: {
          select: {
            businesses: {
              where: { status: 'APPROVED' },
            },
          },
        },
      },
    });

    return successResponse(res, { categories });
  } catch (error) {
    console.error('Error en getFeaturedCategories:', error);
    return errorResponse(res, 'Error al obtener categorías', 500);
  }
};

export const getTopRatedBusinesses = async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;
    const limitNum = parseInt(limit as string);

    const businesses = await prisma.business.findMany({
      take: limitNum,
      where: {
        status: 'APPROVED',
        reviewCount: { gt: 0 },
      },
      orderBy: [
        { averageRating: 'desc' },
        { reviewCount: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        city: true,
        address: true,
        averageRating: true,
        reviewCount: true,
        viewCount: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
    });

    return successResponse(res, { businesses });
  } catch (error) {
    console.error('Error en getTopRatedBusinesses:', error);
    return errorResponse(res, 'Error al obtener negocios top', 500);
  }
};

export const getRecentBusinesses = async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;
    const limitNum = parseInt(limit as string);

    const businesses = await prisma.business.findMany({
      take: limitNum,
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        city: true,
        address: true,
        averageRating: true,
        reviewCount: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
    });

    return successResponse(res, { businesses });
  } catch (error) {
    console.error('Error en getRecentBusinesses:', error);
    return errorResponse(res, 'Error al obtener negocios recientes', 500);
  }
};

export const getPopularBusinesses = async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;
    const limitNum = parseInt(limit as string);

    const businesses = await prisma.business.findMany({
      take: limitNum,
      where: { status: 'APPROVED' },
      orderBy: { viewCount: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        city: true,
        averageRating: true,
        reviewCount: true,
        viewCount: true,
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });

    return successResponse(res, { businesses });
  } catch (error) {
    console.error('Error en getPopularBusinesses:', error);
    return errorResponse(res, 'Error al obtener negocios populares', 500);
  }
};
