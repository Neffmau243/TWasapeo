// ============================================
// EVENT CONTROLLER
// ============================================
// Controlador de eventos de negocios
// Maneja: CRUD de eventos, promociones, anuncios

import { Request, Response } from 'express';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';

export const getBusinessEvents = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const { upcoming = 'true' } = req.query;

    const where: any = { businessId };

    if (upcoming === 'true') {
      where.startDate = {
        gte: new Date(),
      };
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: {
        startDate: 'asc',
      },
    });

    return successResponse(res, events);
  } catch (error) {
    console.error('Error en getBusinessEvents:', error);
    return errorResponse(res, 'Error al obtener eventos', 500);
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { businessId, title, description, startDate, endDate, imageUrl } = req.body;

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

    const event = await prisma.event.create({
      data: {
        businessId,
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        imageUrl: imageUrl || null,
      },
    });

    return successResponse(res, event, 'Evento creado exitosamente', 201);
  } catch (error) {
    console.error('Error en createEvent:', error);
    return errorResponse(res, 'Error al crear evento', 500);
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const updateData: any = { ...req.body };

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        business: true,
      },
    });

    if (!event) {
      return errorResponse(res, 'Evento no encontrado', 404);
    }

    if (event.business.ownerId !== userId && req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos', 403);
    }

    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }

    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    return successResponse(res, updatedEvent, 'Evento actualizado exitosamente');
  } catch (error) {
    console.error('Error en updateEvent:', error);
    return errorResponse(res, 'Error al actualizar evento', 500);
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        business: true,
      },
    });

    if (!event) {
      return errorResponse(res, 'Evento no encontrado', 404);
    }

    if (event.business.ownerId !== userId && req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos', 403);
    }

    await prisma.event.delete({
      where: { id },
    });

    return successResponse(res, null, 'Evento eliminado exitosamente');
  } catch (error) {
    console.error('Error en deleteEvent:', error);
    return errorResponse(res, 'Error al eliminar evento', 500);
  }
};
