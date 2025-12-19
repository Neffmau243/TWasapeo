// ============================================
// BUSINESS CONTROLLER
// ============================================
// Controlador de negocios
// Maneja: CRUD de negocios, listado, detalle, filtros

import { Request, Response } from 'express';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';
import { generatePaginationMeta } from '../utils/pagination';
import { generateSlug } from '../services/slugService';
// import { uploadToCloudinary, deleteFromCloudinary } from '../services/imageService';

/**
 * @desc    Obtener todos los negocios (con filtros y paginación)
 * @route   GET /api/businesses
 * @access  Public
 */
export const getAllBusinesses = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      categoryId,
      city,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Construir filtros
    const where: any = {};
    
    // Solo filtrar por status si se proporciona (para admin puede ver todos)
    if (status) {
      where.status = status as string;
    }

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (city) {
      where.city = {
        contains: city as string,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Obtener negocios
    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          [sortBy as string]: sortOrder as string,
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
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              images: true,
              favorites: true,
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
    console.error('Error en getAllBusinesses:', error);
    return errorResponse(res, 'Error al obtener negocios', 500);
  }
};

/**
 * @desc    Obtener negocio por ID
 * @route   GET /api/businesses/:id
 * @access  Public
 */
export const getBusinessById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        events: {
          where: {
            startDate: {
              gte: new Date(),
            },
          },
          orderBy: {
            startDate: 'asc',
          },
        },
        faqs: {
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
            following: true,
          },
        },
      },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    return successResponse(res, business);
  } catch (error) {
    console.error('Error en getBusinessById:', error);
    return errorResponse(res, 'Error al obtener negocio', 500);
  }
};

/**
 * @desc    Obtener negocio por slug
 * @route   GET /api/businesses/slug/:slug
 * @access  Public
 */
export const getBusinessBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const business = await prisma.business.findUnique({
      where: { slug },
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        events: {
          where: {
            startDate: {
              gte: new Date(),
            },
          },
          orderBy: {
            startDate: 'asc',
          },
        },
        faqs: {
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
            following: true,
          },
        },
      },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    return successResponse(res, business);
  } catch (error) {
    console.error('Error en getBusinessBySlug:', error);
    return errorResponse(res, 'Error al obtener negocio', 500);
  }
};

/**
 * @desc    Obtener negocios públicos aprobados
 * @route   GET /api/public/businesses
 * @access  Public
 */
export const getPublicBusinesses = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '12',
      categoryId,
      city,
      search,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      status: 'APPROVED',
    };

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (city) {
      where.city = {
        contains: city as string,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          averageRating: 'desc',
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          logo: true,
          coverImage: true,
          address: true,
          city: true,
          phone: true,
          averageRating: true,
          reviewCount: true,
          isPremium: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
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
    console.error('Error en getPublicBusinesses:', error);
    return errorResponse(res, 'Error al obtener negocios', 500);
  }
};

/**
 * @desc    Obtener negocios destacados
 * @route   GET /api/public/featured
 * @access  Public
 */
export const getFeaturedBusinesses = async (req: Request, res: Response) => {
  try {
    const { limit = '6' } = req.query;
    const limitNum = parseInt(limit as string);

    const businesses = await prisma.business.findMany({
      where: {
        status: 'APPROVED',
        isPremium: true,
      },
      take: limitNum,
      orderBy: [
        { averageRating: 'desc' },
        { reviewCount: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logo: true,
        coverImage: true,
        address: true,
        city: true,
        averageRating: true,
        reviewCount: true,
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });

    return successResponse(res, businesses);
  } catch (error) {
    console.error('Error en getFeaturedBusinesses:', error);
    return errorResponse(res, 'Error al obtener negocios destacados', 500);
  }
};

/**
 * @desc    Crear nuevo negocio
 * @route   POST /api/businesses
 * @access  Private (OWNER/ADMIN)
 */
export const createBusiness = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      name,
      description,
      categoryId,
      address,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      phone,
      email,
      website,
      whatsapp,
      facebook,
      instagram,
      schedule,
    } = req.body;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Verificar que la categoría existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return errorResponse(res, 'Categoría no encontrada', 404);
    }

    // Generar slug único
    const slug = await generateSlug(name);

    // Crear negocio
    const business = await prisma.business.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        address,
        city,
        state,
        zipCode: zipCode || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        phone,
        email: email || null,
        website: website || null,
        whatsapp: whatsapp || null,
        facebook: facebook || null,
        instagram: instagram || null,
        schedule: schedule || {},
        ownerId: userId,
        status: 'PENDING',
      },
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return successResponse(
      res,
      business,
      'Negocio creado exitosamente. Será revisado por un administrador.',
      201
    );
  } catch (error) {
    console.error('Error en createBusiness:', error);
    return errorResponse(res, 'Error al crear negocio', 500);
  }
};

/**
 * @desc    Actualizar negocio
 * @route   PUT /api/businesses/:id
 * @access  Private (Owner del negocio o Admin)
 */
export const updateBusiness = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { id } = req.params;
    const updateData = req.body;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Buscar negocio
    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    // Verificar permisos (solo el owner o admin puede editar)
    if (business.ownerId !== userId && userRole !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos para editar este negocio', 403);
    }

    // Si se cambia el nombre, regenerar slug
    if (updateData.name && updateData.name !== business.name) {
      updateData.slug = await generateSlug(updateData.name);
    }

    // Actualizar negocio
    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return successResponse(res, updatedBusiness, 'Negocio actualizado exitosamente');
  } catch (error) {
    console.error('Error en updateBusiness:', error);
    return errorResponse(res, 'Error al actualizar negocio', 500);
  }
};

/**
 * @desc    Eliminar negocio
 * @route   DELETE /api/businesses/:id
 * @access  Private (Owner del negocio o Admin)
 */
export const deleteBusiness = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { id } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Buscar negocio
    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    // Verificar permisos
    if (business.ownerId !== userId && userRole !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos para eliminar este negocio', 403);
    }

    // Eliminar negocio (las relaciones se eliminan en cascada si está configurado)
    await prisma.business.delete({
      where: { id },
    });

    return successResponse(res, null, 'Negocio eliminado exitosamente');
  } catch (error) {
    console.error('Error en deleteBusiness:', error);
    return errorResponse(res, 'Error al eliminar negocio', 500);
  }
};

/**
 * @desc    Incrementar contador de vistas
 * @route   POST /api/businesses/:id/view
 * @access  Public
 */
export const incrementViews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.business.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return successResponse(res, null, 'Vista registrada');
  } catch (error) {
    console.error('Error en incrementViews:', error);
    return errorResponse(res, 'Error al registrar vista', 500);
  }
};

/**
 * @desc    Actualizar galería de imágenes
 * @route   PUT /api/businesses/:id/gallery
 * @access  Private (Owner/Admin)
 * @note    Funcionalidad futura - requiere Cloudinary
 */
export const updateGallery = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { id } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Buscar negocio
    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    // Verificar permisos
    if (business.ownerId !== userId && userRole !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos', 403);
    }

    // TODO: Implementar subida de imágenes con Cloudinary
    // const files = req.files as Express.Multer.File[];
    // if (!files || files.length === 0) {
    //   return errorResponse(res, 'No se han proporcionado imágenes', 400);
    // }

    // // Subir imágenes a Cloudinary
    // const uploadPromises = files.map((file, index) =>
    //   uploadToCloudinary(file.buffer, 'businesses')
    // );
    // const imageUrls = await Promise.all(uploadPromises);

    // // Crear registros de imágenes
    // const imageData = imageUrls.map((url, index) => ({
    //   businessId: id,
    //   url,
    //   order: index,
    // }));

    // const images = await prisma.image.createMany({
    //   data: imageData,
    // });

    // return successResponse(res, images, 'Imágenes subidas exitosamente');

    return errorResponse(res, 'Funcionalidad de galería pendiente de implementar', 501);
  } catch (error) {
    console.error('Error en updateGallery:', error);
    return errorResponse(res, 'Error al actualizar galería', 500);
  }
};
