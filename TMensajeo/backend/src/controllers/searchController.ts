// ============================================
// SEARCH CONTROLLER
// ============================================
// Controlador de búsqueda
// Maneja: búsqueda full-text, autocompletado, filtros

import { Request, Response } from 'express';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';
import { generatePaginationMeta } from '../utils/pagination';

export const searchBusinesses = async (req: Request, res: Response) => {
  try {
    const { q, categoryId, city, minRating, maxDistance, sortBy = 'relevance', page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    if (!q || typeof q !== 'string') {
      return errorResponse(res, 'Parámetro de búsqueda "q" es requerido', 400);
    }

    const where: any = {
      status: 'APPROVED',
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
      ],
    };

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }

    if (minRating) {
      where.averageRating = { gte: parseFloat(minRating as string) };
    }

    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { averageRating: 'desc' };
        break;
      case 'reviews':
        orderBy = { reviewCount: 'desc' };
        break;
      case 'views':
        orderBy = { viewCount: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
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
            },
          },
        },
      }),
      prisma.business.count({ where }),
    ]);

    const pagination = generatePaginationMeta({ page: pageNum, limit: limitNum }, total);

    return successResponse(res, {
      query: q,
      businesses,
      pagination,
    });
  } catch (error) {
    console.error('Error en searchBusinesses:', error);
    return errorResponse(res, 'Error al buscar negocios', 500);
  }
};

export const autocomplete = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.length < 2) {
      return successResponse(res, { suggestions: [] });
    }

    const businesses = await prisma.business.findMany({
      where: {
        status: 'APPROVED',
        name: {
          contains: q,
          mode: 'insensitive',
        },
      },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        category: {
          select: {
            name: true,
            icon: true,
          },
        },
      },
      orderBy: {
        viewCount: 'desc',
      },
    });

    const suggestions = businesses.map((business) => ({
      id: business.id,
      name: business.name,
      slug: business.slug,
      city: business.city,
      category: business.category.name,
      icon: business.category.icon,
    }));

    return successResponse(res, { suggestions });
  } catch (error) {
    console.error('Error en autocomplete:', error);
    return errorResponse(res, 'Error en autocompletado', 500);
  }
};

export const getAvailableFilters = async (req: Request, res: Response) => {
  try {
    const [categories, cities] = await Promise.all([
      prisma.category.findMany({
        where: {
          businesses: {
            some: {
              status: 'APPROVED',
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          _count: {
            select: {
              businesses: {
                where: { status: 'APPROVED' },
              },
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      }),
      prisma.business.findMany({
        where: { status: 'APPROVED' },
        distinct: ['city'],
        select: { city: true },
        orderBy: { city: 'asc' },
      }),
    ]);

    const filters = {
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        count: cat._count.businesses,
      })),
      cities: cities.map((b) => b.city).filter((city) => city !== null),
      ratings: [1, 2, 3, 4, 5],
      sortOptions: [
        { value: 'relevance', label: 'Relevancia' },
        { value: 'rating', label: 'Mejor calificados' },
        { value: 'reviews', label: 'Más reseñas' },
        { value: 'views', label: 'Más vistos' },
        { value: 'name', label: 'Nombre (A-Z)' },
      ],
    };

    return successResponse(res, filters);
  } catch (error) {
    console.error('Error en getAvailableFilters:', error);
    return errorResponse(res, 'Error al obtener filtros', 500);
  }
};
