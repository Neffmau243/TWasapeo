// ============================================
// FAQ CONTROLLER
// ============================================
// Controlador de preguntas frecuentes
// Maneja: CRUD de FAQs, reordenamiento

import { Request, Response } from 'express';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';

export const getBusinessFAQs = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;

    const faqs = await prisma.fAQ.findMany({
      where: { businessId },
      orderBy: {
        order: 'asc',
      },
    });

    return successResponse(res, faqs);
  } catch (error) {
    console.error('Error en getBusinessFAQs:', error);
    return errorResponse(res, 'Error al obtener FAQs', 500);
  }
};

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { businessId, question, answer, order } = req.body;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    if (business.ownerId !== userId && req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos', 403);
    }

    const faq = await prisma.fAQ.create({
      data: {
        businessId,
        question,
        answer,
        order: order || 0,
      },
    });

    return successResponse(res, faq, 'FAQ creada exitosamente', 201);
  } catch (error) {
    console.error('Error en createFAQ:', error);
    return errorResponse(res, 'Error al crear FAQ', 500);
  }
};

export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const updateData = req.body;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const faq = await prisma.fAQ.findUnique({
      where: { id },
      include: {
        business: true,
      },
    });

    if (!faq) {
      return errorResponse(res, 'FAQ no encontrada', 404);
    }

    if (faq.business.ownerId !== userId && req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos', 403);
    }

    const updatedFaq = await prisma.fAQ.update({
      where: { id },
      data: updateData,
    });

    return successResponse(res, updatedFaq, 'FAQ actualizada exitosamente');
  } catch (error) {
    console.error('Error en updateFAQ:', error);
    return errorResponse(res, 'Error al actualizar FAQ', 500);
  }
};

export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const faq = await prisma.fAQ.findUnique({
      where: { id },
      include: {
        business: true,
      },
    });

    if (!faq) {
      return errorResponse(res, 'FAQ no encontrada', 404);
    }

    if (faq.business.ownerId !== userId && req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos', 403);
    }

    await prisma.fAQ.delete({
      where: { id },
    });

    return successResponse(res, null, 'FAQ eliminada exitosamente');
  } catch (error) {
    console.error('Error en deleteFAQ:', error);
    return errorResponse(res, 'Error al eliminar FAQ', 500);
  }
};

export const reorderFAQs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { businessId } = req.params;
    const { faqs } = req.body; // Array de { id, order }

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    if (business.ownerId !== userId && req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos', 403);
    }

    // Actualizar el orden de cada FAQ
    await Promise.all(
      faqs.map((faq: { id: string; order: number }) =>
        prisma.fAQ.update({
          where: { id: faq.id },
          data: { order: faq.order },
        })
      )
    );

    return successResponse(res, null, 'FAQs reordenadas exitosamente');
  } catch (error) {
    console.error('Error en reorderFAQs:', error);
    return errorResponse(res, 'Error al reordenar FAQs', 500);
  }
};
