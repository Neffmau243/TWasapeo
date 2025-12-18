// ============================================
// UPLOAD CONTROLLER
// ============================================
// Controlador para subida de imágenes
// Maneja: avatares, logos, covers, galerías

import { Request, Response } from 'express';
import prisma from '../config/database';
import { uploadImage, deleteImage as deleteCloudinaryImage } from '../services/imageService';
import { successResponse, errorResponse } from '../utils/response';

/**
 * @desc    Subir/actualizar avatar del usuario
 * @route   POST /api/upload/avatar
 * @access  Private
 */
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const file = req.file;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    if (!file) {
      return errorResponse(res, 'No se ha proporcionado ninguna imagen', 400);
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // Si ya tiene avatar, extraer el public_id y eliminarlo
    if (user.avatar) {
      try {
        // Extraer public_id de la URL de Cloudinary
        const urlParts = user.avatar.split('/');
        const publicIdWithExt = urlParts.slice(-2).join('/'); // locales/profiles/xxx.jpg
        const publicId = publicIdWithExt.split('.')[0]; // locales/profiles/xxx
        await deleteCloudinaryImage(publicId);
      } catch (error) {
        console.error('Error al eliminar avatar anterior:', error);
        // Continuar aunque falle la eliminación
      }
    }

    // Subir nuevo avatar
    const result = await uploadImage(file.path, 'profiles');

    // Actualizar en BD
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: result.url },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
      },
    });

    return successResponse(res, updatedUser, 'Avatar actualizado exitosamente');
  } catch (error) {
    console.error('Error en uploadAvatar:', error);
    return errorResponse(res, 'Error al subir avatar', 500);
  }
};

/**
 * @desc    Eliminar avatar del usuario
 * @route   DELETE /api/upload/avatar
 * @access  Private
 */
export const deleteAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    if (!user.avatar) {
      return errorResponse(res, 'No tienes avatar para eliminar', 400);
    }

    // Extraer public_id y eliminar de Cloudinary
    try {
      const urlParts = user.avatar.split('/');
      const publicIdWithExt = urlParts.slice(-2).join('/');
      const publicId = publicIdWithExt.split('.')[0];
      await deleteCloudinaryImage(publicId);
    } catch (error) {
      console.error('Error al eliminar de Cloudinary:', error);
    }

    // Actualizar BD
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: null },
    });

    return successResponse(res, null, 'Avatar eliminado exitosamente');
  } catch (error) {
    console.error('Error en deleteAvatar:', error);
    return errorResponse(res, 'Error al eliminar avatar', 500);
  }
};

/**
 * @desc    Subir logo de negocio
 * @route   POST /api/upload/business/:businessId/logo
 * @access  Private (Owner/Admin)
 */
export const uploadBusinessLogo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { businessId } = req.params;
    const file = req.file;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    if (!file) {
      return errorResponse(res, 'No se ha proporcionado ninguna imagen', 400);
    }

    // Verificar permisos
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true, logo: true },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    if (business.ownerId !== userId && userRole !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos', 403);
    }

    // Eliminar logo anterior si existe
    if (business.logo) {
      try {
        const urlParts = business.logo.split('/');
        const publicIdWithExt = urlParts.slice(-2).join('/');
        const publicId = publicIdWithExt.split('.')[0];
        await deleteCloudinaryImage(publicId);
      } catch (error) {
        console.error('Error al eliminar logo anterior:', error);
      }
    }

    // Subir nuevo logo
    const result = await uploadImage(file.path, 'businesses/logos');

    // Actualizar en BD
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: { logo: result.url },
      select: {
        id: true,
        name: true,
        logo: true,
        coverImage: true,
      },
    });

    return successResponse(res, updatedBusiness, 'Logo actualizado exitosamente');
  } catch (error) {
    console.error('Error en uploadBusinessLogo:', error);
    return errorResponse(res, 'Error al subir logo', 500);
  }
};

/**
 * @desc    Subir cover de negocio
 * @route   POST /api/upload/business/:businessId/cover
 * @access  Private (Owner/Admin)
 */
export const uploadBusinessCover = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { businessId } = req.params;
    const file = req.file;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    if (!file) {
      return errorResponse(res, 'No se ha proporcionado ninguna imagen', 400);
    }

    // Verificar permisos
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true, coverImage: true },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    if (business.ownerId !== userId && userRole !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos', 403);
    }

    // Eliminar cover anterior si existe
    if (business.coverImage) {
      try {
        const urlParts = business.coverImage.split('/');
        const publicIdWithExt = urlParts.slice(-2).join('/');
        const publicId = publicIdWithExt.split('.')[0];
        await deleteCloudinaryImage(publicId);
      } catch (error) {
        console.error('Error al eliminar cover anterior:', error);
      }
    }

    // Subir nuevo cover
    const result = await uploadImage(file.path, 'businesses/covers');

    // Actualizar en BD
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: { coverImage: result.url },
      select: {
        id: true,
        name: true,
        logo: true,
        coverImage: true,
      },
    });

    return successResponse(res, updatedBusiness, 'Cover actualizado exitosamente');
  } catch (error) {
    console.error('Error en uploadBusinessCover:', error);
    return errorResponse(res, 'Error al subir cover', 500);
  }
};

/**
 * @desc    Subir imágenes a galería de negocio
 * @route   POST /api/upload/business/:businessId/gallery
 * @access  Private (Owner/Admin)
 */
export const uploadBusinessGallery = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { businessId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    if (!files || files.length === 0) {
      return errorResponse(res, 'No se han proporcionado imágenes', 400);
    }

    // Verificar permisos
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true },
    });

    if (!business) {
      return errorResponse(res, 'Negocio no encontrado', 404);
    }

    if (business.ownerId !== userId && userRole !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos', 403);
    }

    // Obtener el orden máximo actual
    const maxOrder = await prisma.image.findFirst({
      where: { businessId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    let currentOrder = maxOrder ? maxOrder.order + 1 : 0;

    // Subir todas las imágenes
    const uploadPromises = files.map(async (file) => {
      const result = await uploadImage(file.path, 'businesses/gallery');
      return {
        url: result.url,
        publicId: result.publicId,
        order: currentOrder++,
        businessId,
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Crear registros en BD
    const images = await prisma.image.createMany({
      data: uploadedImages,
    });

    // Obtener las imágenes creadas
    const createdImages = await prisma.image.findMany({
      where: { businessId },
      orderBy: { order: 'asc' },
    });

    return successResponse(
      res,
      { count: images.count, images: createdImages },
      `${images.count} imágenes subidas exitosamente`,
      201
    );
  } catch (error) {
    console.error('Error en uploadBusinessGallery:', error);
    return errorResponse(res, 'Error al subir imágenes', 500);
  }
};

/**
 * @desc    Eliminar imagen por public_id
 * @route   DELETE /api/upload/image/:publicId
 * @access  Private
 */
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { publicId } = req.params;

    if (!userId) {
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    // Decodificar el publicId (viene como locales-businesses-gallery-xxx)
    const decodedPublicId = publicId.replace(/-/g, '/');

    // Buscar la imagen en BD
    const image = await prisma.image.findFirst({
      where: {
        publicId: {
          contains: decodedPublicId,
        },
      },
      include: {
        business: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!image) {
      return errorResponse(res, 'Imagen no encontrada', 404);
    }

    // Verificar permisos
    if (image.business.ownerId !== userId && userRole !== 'ADMIN') {
      return errorResponse(res, 'No tienes permisos', 403);
    }

    // Eliminar de Cloudinary
    await deleteCloudinaryImage(image.publicId);

    // Eliminar de BD
    await prisma.image.delete({
      where: { id: image.id },
    });

    return successResponse(res, null, 'Imagen eliminada exitosamente');
  } catch (error) {
    console.error('Error en deleteImage:', error);
    return errorResponse(res, 'Error al eliminar imagen', 500);
  }
};
