// ============================================
// CATEGORY CONTROLLER
// ============================================
// Controlador de categorías
// Maneja: CRUD de categorías (principalmente admin)

import { Request, Response } from 'express';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';
import { generateSlug } from '../services/slugService';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        order: 'asc',
      },
      include: {
        _count: {
          select: {
            businesses: true,
          },
        },
      },
    });

    return successResponse(res, categories);
  } catch (error) {
    console.error('Error en getAllCategories:', error);
    return errorResponse(res, 'Error al obtener categorías', 500);
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            businesses: true,
          },
        },
      },
    });

    if (!category) {
      return errorResponse(res, 'Categoría no encontrada', 404);
    }

    return successResponse(res, category);
  } catch (error) {
    console.error('Error en getCategoryBySlug:', error);
    return errorResponse(res, 'Error al obtener categoría', 500);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, icon, color, order } = req.body;

    const slug = await generateSlug(name);

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        icon: icon || null,
        color: color || '#6B7280',
        order: order || 0,
      },
    });

    return successResponse(res, category, 'Categoría creada exitosamente', 201);
  } catch (error) {
    console.error('Error en createCategory:', error);
    return errorResponse(res, 'Error al crear categoría', 500);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return errorResponse(res, 'Categoría no encontrada', 404);
    }

    if (updateData.name && updateData.name !== category.name) {
      updateData.slug = await generateSlug(updateData.name);
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return successResponse(res, updatedCategory, 'Categoría actualizada exitosamente');
  } catch (error) {
    console.error('Error en updateCategory:', error);
    return errorResponse(res, 'Error al actualizar categoría', 500);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            businesses: true,
          },
        },
      },
    });

    if (!category) {
      return errorResponse(res, 'Categoría no encontrada', 404);
    }

    if (category._count.businesses > 0) {
      return errorResponse(
        res,
        `No se puede eliminar la categoría porque tiene ${category._count.businesses} negocios asociados`,
        400
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return successResponse(res, null, 'Categoría eliminada exitosamente');
  } catch (error) {
    console.error('Error en deleteCategory:', error);
    return errorResponse(res, 'Error al eliminar categoría', 500);
  }
};
